# cab-aggregator-pro
🚕 Premium cab price aggregator app - Compare fares from Uber, Ola, Rapido, Yatri Sathi, and more. Find the cheapest ride in seconds with real-time ETAs, deep-link bookings, and detailed analytics. Production-ready with full backend API, modern React frontend, and Google Play Store compliance.


## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose (optional)
- npm or yarn

### Option 1: Docker (Easiest - All-in-One)

```bash
# Clone repository
git clone https://github.com/arpancodez/cab-aggregator-pro.git
cd cab-aggregator-pro

# Setup environment files
cp backend/.env.example backend/.env.local
cp frontend/.env.example frontend/.env.local

# Add your API keys to backend/.env.local:
# - UBER_CLIENT_ID & UBER_CLIENT_SECRET
# - OLA_API_KEY
# - RAPIDO_API_KEY
# - YATRI_SATHI_API_KEY

# Start all services with Docker
docker-compose up --build
```

**Access points:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Swagger Docs: http://localhost:5000/api/docs
- PostgreSQL: localhost:5432
- Redis: localhost:6379

### Option 2: Local Development

#### Terminal 1 - Backend

```bash
cd backend

# Copy environment template
cp .env.example .env.local

# Install dependencies
npm install

# Start backend server (port 5000)
npm run dev
```

#### Terminal 2 - Frontend

```bash
cd frontend

# Copy environment template
cp .env.example .env.local

# Install dependencies
npm install

# Start frontend (port 3000)
npm run dev
```

**Access:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### 📝 Environment Variables

**Backend (.env.local):**
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/cab_aggregator
REDIS_URL=redis://localhost:6379

# Provider APIs
UBER_CLIENT_ID=your_client_id
UBER_CLIENT_SECRET=your_secret
OLA_API_KEY=your_ola_key
OLA_API_URL=https://api.ola.co
RAPIDO_API_KEY=your_rapido_key
YATRI_SATHI_API_KEY=your_yatri_sathi_key

# Auth
JWT_SECRET=your_jwt_secret
JWT_EXPIRY=7d

# CORS
CORS_ORIGIN=http://localhost:3000
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_MAPS_KEY=your_maps_key
NEXT_PUBLIC_APP_NAME=Cab Aggregator Pro
```

## 🎯 Get API Keys

1. **Uber**: https://developer.uber.com/
2. **Ola**: https://business.olarides.com/
3. **Rapido**: Contact business team
4. **Yatri Sathi**: https://yatrisathi.com/

## 📚 Documentation

- **[COMPLETE_CODE_SETUP.md](./COMPLETE_CODE_SETUP.md)** - Full code templates for all components
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Deploy to Vercel, Railway, Heroku
- **[LICENSE](./LICENSE)** - MIT License

## 🏗️ Project Structure

```
cab-aggregator-pro/
├── backend/              # Node.js/Express API
│   ├── src/
│   │   ├── providers/   # Uber, Ola, Rapido clients
│   │   ├── services/    # Business logic
│   │   └── app.ts       # Express server
│   ├── package.json
│   └── .env.example
├── frontend/            # Next.js React app
│   ├── app/            # Pages & layouts
│   ├── components/     # React components
│   ├── package.json
│   └── .env.example
├── docker-compose.yml   # Docker configuration
├── LICENSE             # MIT License
└── README.md           # This file
```

## ✨ Features

✅ Real-time fare comparison from multiple providers
✅ Live ETA updates
✅ Driver ratings & availability
✅ Deep-link bookings (opens provider app)
✅ Responsive UI with TailwindCSS
✅ Swagger API documentation
✅ PostgreSQL database
✅ Redis caching
✅ Docker support
✅ Production-ready code

## 🛠️ Development Commands

### Backend
```bash
cd backend
npm run dev       # Start dev server
npm run build     # Build for production
npm run test      # Run tests
npm run lint      # Check code quality
```

### Frontend
```bash
cd frontend
npm run dev       # Start dev server
npm run build     # Build for production
npm run start     # Start production server
npm run test      # Run tests
```

## 🚀 Production Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel --prod
```

### Backend (Railway/Heroku)
```bash
cd backend
# Railway
railway up

# OR Heroku
heroku create cab-aggregator-api
git push heroku main
```

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

## 📞 Support

- Issues: [GitHub Issues](https://github.com/arpancodez/cab-aggregator-pro/issues)
- Discussions: [GitHub Discussions](https://github.com/arpancodez/cab-aggregator-pro/discussions)

## 📄 License

MIT License - See [LICENSE](./LICENSE) file

---

**Made with ❤️ by Arpan** | [GitHub](https://github.com/arpancodez) | [Portfolio](https://arpancodez.com)


## Architecture

- Real-time ride aggregation
- Price comparison engine
- Dynamic pricing analysis
- Deep-link integration
- Analytics dashboard

## Database

- MongoDB for ride data
- Redis for caching
- Elasticsearch for search

## Support

For issues, contact: support@cabaggregatorpor.com
