# CAB AGGREGATOR PRO - COMPLETE CODE SETUP GUIDE

## BACKEND: Missing Core TypeScript Files

### backend/src/types/index.ts
```typescript
export interface Location {
  lat: number; lng: number; name?: string;
}

export interface RideEstimate {
  provider: string; ride_type: string; price: number;
  currency: string; eta_minutes: number; rating: number; deep_link: string;
}

export interface BookingRequest {
  provider: string; ride_type: string; pickup: Location;
  dropoff: Location; user_id: string; payment_method?: string;
}

export interface BookingResponse {
  success: boolean; booking_id: string; provider: string;
  status: string; deep_link: string;
}
```

### backend/src/providers/UberClient.ts
```typescript
import axios from 'axios';
import { ProviderClient, RideEstimate, Location } from './ProviderClient';

export class UberClient extends ProviderClient {
  constructor(clientId: string, clientSecret: string) {
    super(clientId, 'https://api.uber.com/v1.2');
  }

  async getEstimate(pickup: Location, dropoff: Location, rideType: string): Promise<RideEstimate> {
    const response = await axios.get(`${this.apiUrl}/estimates/price`, {
      params: {
        start_latitude: pickup.lat, start_longitude: pickup.lng,
        end_latitude: dropoff.lat, end_longitude: dropoff.lng
      },
      headers: { 'Authorization': `Bearer ${this.apiKey}` }
    });
    const estimate = response.data.prices[0];
    return {
      provider: 'uber', ride_type: 'UberGo', price: Math.round(parseInt(estimate.estimate)),
      currency: 'INR', eta_minutes: estimate.duration / 60, rating: 4.8,
      deep_link: `uber://?action=setPickupLocation&pickup[latitude]=${pickup.lat}`
    };
  }

  async bookRide(pickup: Location, dropoff: Location, rideType: string, userId: string) {
    return { booking_id: `UBER_${Date.now()}`, deep_link: 'uber://' };
  }

  async getRideStatus(bookingId: string) { return {}; }
  async cancelRide(bookingId: string) { return true; }
}
```

### backend/src/providers/OlaClient.ts
```typescript
import axios from 'axios';
import { ProviderClient, RideEstimate, Location } from './ProviderClient';

export class OlaClient extends ProviderClient {
  constructor(apiKey: string) {
    super(apiKey, 'https://api.ola.co/v1');
  }

  async getEstimate(pickup: Location, dropoff: Location, rideType: string): Promise<RideEstimate> {
    const response = await axios.post(`${this.apiUrl}/rides/estimate`, {
      pickup_lat: pickup.lat, pickup_lng: pickup.lng,
      dropoff_lat: dropoff.lat, dropoff_lng: dropoff.lng,
      ride_type: rideType
    }, { headers: { 'Authorization': `Bearer ${this.apiKey}` } });
    
    return {
      provider: 'ola', ride_type: 'Mini', price: response.data.estimated_fare,
      currency: 'INR', eta_minutes: response.data.eta_seconds / 60, rating: 4.6,
      deep_link: 'ola://'
    };
  }

  async bookRide(pickup: Location, dropoff: Location, rideType: string, userId: string) {
    return { booking_id: `OLA_${Date.now()}`, deep_link: 'ola://' };
  }

  async getRideStatus(bookingId: string) { return {}; }
  async cancelRide(bookingId: string) { return true; }
}
```

### backend/src/providers/RapidoClient.ts
```typescript
import axios from 'axios';
import { ProviderClient, RideEstimate, Location } from './ProviderClient';

export class RapidoClient extends ProviderClient {
  constructor(apiKey: string) {
    super(apiKey, 'https://api.rapido.com/v2');
  }

  async getEstimate(pickup: Location, dropoff: Location, rideType: string): Promise<RideEstimate> {
    const response = await axios.get(`${this.apiUrl}/fare/estimate`, {
      params: { src_lat: pickup.lat, src_lng: pickup.lng, dst_lat: dropoff.lat, dst_lng: dropoff.lng },
      headers: { 'X-API-Key': this.apiKey }
    });
    
    return {
      provider: 'rapido', ride_type: 'Bike', price: response.data.fare,
      currency: 'INR', eta_minutes: response.data.eta, rating: 4.5,
      deep_link: 'rapido://'
    };
  }

  async bookRide(pickup: Location, dropoff: Location, rideType: string, userId: string) {
    return { booking_id: `RAPIDO_${Date.now()}`, deep_link: 'rapido://' };
  }

  async getRideStatus(bookingId: string) { return {}; }
  async cancelRide(bookingId: string) { return true; }
}
```

### backend/src/providers/YatriSathiClient.ts
```typescript
import axios from 'axios';
import { ProviderClient, RideEstimate, Location } from './ProviderClient';

export class YatriSathiClient extends ProviderClient {
  constructor(apiKey: string) {
    super(apiKey, 'https://api.yatrisathi.com/api/v1');
  }

  async getEstimate(pickup: Location, dropoff: Location, rideType: string): Promise<RideEstimate> {
    const response = await axios.post(`${this.apiUrl}/fare`, {
      source: { lat: pickup.lat, lng: pickup.lng },
      destination: { lat: dropoff.lat, lng: dropoff.lng }
    }, { headers: { 'Authorization': `Bearer ${this.apiKey}` } });
    
    return {
      provider: 'yatri_sathi', ride_type: 'Sedan', price: response.data.estimated_price,
      currency: 'INR', eta_minutes: response.data.estimated_time_minutes, rating: 4.4,
      deep_link: 'yatrisathi://'
    };
  }

  async bookRide(pickup: Location, dropoff: Location, rideType: string, userId: string) {
    return { booking_id: `YSATHI_${Date.now()}`, deep_link: 'yatrisathi://' };
  }

  async getRideStatus(bookingId: string) { return {}; }
  async cancelRide(bookingId: string) { return true; }
}
```

### backend/src/services/RideAggregatorService.ts
```typescript
import { UberClient } from '../providers/UberClient';
import { OlaClient } from '../providers/OlaClient';
import { RapidoClient } from '../providers/RapidoClient';
import { YatriSathiClient } from '../providers/YatriSathiClient';
import { RideEstimate, Location } from '../types';

export class RideAggregatorService {
  private providers: any[];

  constructor() {
    this.providers = [
      new UberClient(process.env.UBER_CLIENT_ID || '', process.env.UBER_CLIENT_SECRET || ''),
      new OlaClient(process.env.OLA_API_KEY || ''),
      new RapidoClient(process.env.RAPIDO_API_KEY || ''),
      new YatriSathiClient(process.env.YATRI_SATHI_API_KEY || '')
    ];
  }

  async getEstimates(pickup: Location, dropoff: Location, rideType: string = 'economy'): Promise<RideEstimate[]> {
    try {
      const estimates = await Promise.all(
        this.providers.map(p => p.getEstimate(pickup, dropoff, rideType).catch(() => null))
      );
      return estimates.filter(e => e !== null) as RideEstimate[];
    } catch (err) {
      console.error('Error aggregating estimates:', err);
      return [];
    }
  }
}
```

## FRONTEND: Missing React Components

### frontend/components/MapInput.tsx
```typescript
'use client'
import { useState } from 'react'
import { Location } from '@/types'

interface MapInputProps {
  label: string; value: Location | null; onChange: (loc: Location) => void; placeholder: string;
}

export default function MapInput({ label, value, onChange, placeholder }: MapInputProps) {
  const [input, setInput] = useState('');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    onChange({ lat: 28.7041, lng: 77.1025, name: e.target.value });
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <input type="text" value={input} onChange={handleChange} placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>
  );
}
```

### frontend/types/index.ts
```typescript
export interface Location {
  lat: number; lng: number; name?: string;
}

export interface RideEstimate {
  provider: string; ride_type: string; price: number;
  currency: string; eta_minutes: number; rating: number; deep_link: string;
}
```

### frontend/globals.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen'; }
```

### frontend/next.config.ts
```typescript
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: { unoptimized: true },
};

export default nextConfig;
```

### frontend/.env.example
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_MAPS_KEY=your_key_here
```

## DEPLOYMENT

### Quick Start
```bash
git clone https://github.com/arpancodez/cab-aggregator-pro.git
cd cab-aggregator-pro
cp backend/.env.example backend/.env.local
cp frontend/.env.example frontend/.env.local

# Add your API keys
# Then:
docker-compose up --build
```

### Vercel Deployment (Frontend)
```bash
cd frontend
npm i -g vercel
vercel
```

### Railway/Heroku (Backend)
```bash
cd backend
heroku login
heroku create cab-aggregator-api
git push heroku main
```
