import axios, { AxiosInstance } from 'axios';

interface RideRequest {
  pickupLocation: { lat: number; lng: number };
  dropoffLocation: { lat: number; lng: number };
  rideType: string;
}

interface FareEstimate {
  provider: string;
  fare: number;
  eta: number;
  rideType: string;
}

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
      timeout: 30000,
    });

    // Add token to requests
    this.client.interceptors.request.use((config) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async getFareEstimates(rideRequest: RideRequest): Promise<FareEstimate[]> {
    try {
      const response = await this.client.post('/api/rides/estimates', rideRequest);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching fare estimates:', error);
      throw error;
    }
  }

  async bookRide(rideRequest: RideRequest): Promise<any> {
    try {
      const response = await this.client.post('/api/rides/book', rideRequest);
      return response.data.data;
    } catch (error) {
      console.error('Error booking ride:', error);
      throw error;
    }
  }

  async getRideHistory(): Promise<any[]> {
    try {
      const response = await this.client.get('/api/rides/history');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching ride history:', error);
      throw error;
    }
  }

  async submitReview(rideId: string, rating: number, comment: string): Promise<any> {
    try {
      const response = await this.client.post(`/api/rides/${rideId}/review`, {
        rating,
        comment,
      });
      return response.data.data;
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    }
  }
}

export const apiClient = new ApiClient();
