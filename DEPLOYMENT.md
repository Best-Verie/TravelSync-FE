
# Deployment Guide for TravelSync

This guide covers how to deploy both the frontend React application and the NestJS backend API.

## Prerequisites

- Node.js (v16+)
- npm or yarn
- PostgreSQL database
- GitHub repository connected to Render and Vercel

## Environment Setup

1. Create a `.env` file in the project root for frontend environment variables:

```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

2. Create a `.env` file in the `src/backend` directory based on the `.env.example`:

```
DATABASE_URL="postgresql://username:password@localhost:5432/ecotours"
JWT_SECRET="your-secret-key"
JWT_EXPIRATION="1d"
PORT=3000
SMTP_HOST="smtp.example.com"
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER="user@example.com"
SMTP_PASS="password"
SMTP_FROM="noreply@ecotours.com"
```

## Development Deployment

To run both frontend and backend in development mode:

1. Install dependencies:
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd src/backend
npm install
cd ../..
```

2. Start backend development server:
```bash
cd src/backend
npm run start:dev
```

3. In a separate terminal, start frontend development server:
```bash
npm run dev
```

## Production Deployment

### Backend Deployment on Render

1. Push your code to GitHub

2. Create a new Web Service on Render:
   - Connect your GitHub repository
   - Set build command: `cd src/backend && npm install && npm run build`
   - Set start command: `cd src/backend && node dist/main.js`

3. Add environment variables in Render dashboard:
   - DATABASE_URL (connect to your PostgreSQL instance)
   - JWT_SECRET
   - Other variables from `.env.example`

4. Deploy the service

### Frontend Deployment on Vercel

1. Push your code to GitHub

2. Create a new project on Vercel:
   - Connect your GitHub repository
   - Framework preset: Vite
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install`

3. Add environment variables:
   - VITE_API_URL: The URL of your backend API (e.g., `https://your-app.onrender.com/api`)

4. Deploy the project

## Database Migration

Before deployment, run database migrations:

```bash
cd src/backend
npx prisma migrate deploy
```

## Continuous Deployment

Both Render and Vercel support automatic deployments when you push to your GitHub repository. Make sure to:

1. Configure the main branch for automatic deployments
2. Set up preview deployments for pull requests if needed

## SSL Configuration

Both Render and Vercel provide SSL certificates automatically for your deployed applications.

## Monitoring and Logging

- Use Render's built-in logs for backend monitoring
- Consider implementing application monitoring with services like New Relic or Datadog
- Set up logging with solutions like ELK Stack or use a managed service

## Backup Strategy

Implement regular database backups for your PostgreSQL database. If using Render PostgreSQL:
- Automatic daily backups are included
- Manual backups can be created from the dashboard

## Common Issues

- CORS errors: Ensure your backend is properly configured to accept requests from your Vercel domain
- Database connection issues: Verify your DATABASE_URL is correctly formatted
- Email sending failures: Check SMTP configuration
- Environment variables: Make sure all required variables are set in both Render and Vercel

## Scaling

- Render offers various instance sizes for scaling your backend
- Vercel automatically scales your frontend globally
