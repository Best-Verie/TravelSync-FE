
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/bef93cb5-b1b1-470d-ac7e-0a4d5ebff4e7

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/bef93cb5-b1b1-470d-ac7e-0a4d5ebff4e7) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## Deployment Instructions

### Backend Deployment (Render)

1. Create a new Render Web Service
2. Connect your GitHub repository
3. Use the following settings:
   - Build Command: `cd src/backend && npm install && npm run build`
   - Start Command: `cd src/backend && node dist/main.js`
4. Add the required environment variables in the Render dashboard:
   - DATABASE_URL
   - JWT_SECRET
   - SMTP_HOST (if using email features)
   - and other variables from `.env.example`

### Frontend Deployment (Vercel)

1. Create a new Vercel project and connect your GitHub repository
2. Set the following:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
3. Add the environment variable in Vercel:
   - VITE_API_URL: Your Render backend URL (e.g., `https://your-api.onrender.com/api`)
4. Deploy

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- NestJS (Backend)
- PostgreSQL

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)
