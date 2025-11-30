# 🚀 Cab Aggregator Pro - Deployment Guide

## Local Development

```bash
# Clone repository
git clone https://github.com/arpancodez/cab-aggregator-pro.git
cd cab-aggregator-pro

# Setup backend
cd backend
cp .env.example .env.local
npm install
npm run dev  # runs on http://localhost:5000

# Setup frontend (new terminal)
cd frontend
cp .env.example .env.local
npm install
npm run dev  # runs on http://localhost:3000
```

## Docker Deployment (Local)

```bash
# Build and run all services
docker-compose up --build

# Services will be available at:
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# Swagger Docs: http://localhost:5000/api/docs
# PostgreSQL: localhost:5432
# Redis: localhost:6379
```

## Production Deployment

### Frontend (Vercel)

```bash
cd frontend

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel Dashboard:
# NEXT_PUBLIC_API_URL=https://your-api.com
# NEXT_PUBLIC_GOOGLE_MAPS_KEY=your_key
```

### Backend (Railway/Heroku)

#### Railway
```bash
# Login to Railway
railway login

# Deploy backend
cd backend
railway up

# Set environment variables in Railway Dashboard
```

#### Heroku
```bash
# Login to Heroku
heroku login

# Create app
heroku create cab-aggregator-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set DATABASE_URL=your_postgres_url
heroku config:set REDIS_URL=your_redis_url

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### Database Setup (PostgreSQL)

```bash
# Create database
psql -U postgres
CREATE DATABASE cab_aggregator;
\q

# Run migrations (when available)
cd backend
npm run migrate
```

## Environment Variables Checklist

### Backend (.env)
- ✅ NODE_ENV=production
- ✅ PORT=5000
- ✅ DATABASE_URL (PostgreSQL connection string)
- ✅ REDIS_URL (Redis connection string)
- ✅ UBER_CLIENT_ID & UBER_CLIENT_SECRET
- ✅ OLA_API_KEY & OLA_API_URL
- ✅ RAPIDO_API_KEY & RAPIDO_API_URL
- ✅ YATRI_SATHI_API_KEY & YATRI_SATHI_API_URL
- ✅ JWT_SECRET (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
- ✅ JWT_EXPIRY=7d
- ✅ CORS_ORIGIN=https://your-frontend-url.com
- ✅ LOG_LEVEL=info

### Frontend (.env)
- ✅ NEXT_PUBLIC_API_URL=https://your-api.com
- ✅ NEXT_PUBLIC_GOOGLE_MAPS_KEY
- ✅ NEXT_PUBLIC_APP_NAME=Cab Aggregator Pro

## Monitoring & Logs

```bash
# Vercel logs
vercel logs --prod

# Railway logs
railway logs

# Heroku logs
heroku logs --tail

# Docker logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

## Security Checklist

- ✅ Never commit .env files
- ✅ Use HTTPS in production
- ✅ Enable CORS properly
- ✅ Rotate JWT_SECRET regularly
- ✅ Use strong database passwords
- ✅ Enable Redis password protection
- ✅ Implement rate limiting
- ✅ Keep dependencies updated

## Health Checks

```bash
# Backend health
curl http://localhost:5000/api/v1/health

# Frontend
curl http://localhost:3000
```

## Scaling (Future)

- Use AWS Lambda for serverless backend
- Implement CDN for static assets
- Use message queues (Bull/RabbitMQ) for async tasks
- Database replication for high availability
- Implement caching layers (CloudFlare)
