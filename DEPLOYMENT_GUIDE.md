# Deployment Guide

## Overview
This real estate platform consists of:
- **Frontend**: React app (deploy to Vercel)
- **Backend**: Node.js API server (deploy to Railway/Render)

## Step 1: Deploy Backend (Railway - Recommended)

1. Go to [Railway.app](https://railway.app)
2. Sign up/Login with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Choose "Deploy from repo root"
6. Set these environment variables in Railway:
   - `PORT`: 5000
   - `NODE_ENV`: production
7. Railway will auto-detect Node.js and deploy your server
8. Copy your Railway app URL (e.g., `https://your-app.railway.app`)

## Step 2: Deploy Frontend (Vercel)

1. Go to [Vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. **Important Settings**:
   - Framework Preset: **React**
   - Root Directory: **client**
   - Build Command: `npm run build`
   - Output Directory: `build`
6. Add Environment Variable:
   - Name: `REACT_APP_API_URL`
   - Value: `https://your-railway-url.railway.app/api`
7. Deploy!

## Step 3: Update API URL

After deploying the backend, update the frontend environment variable:
1. In Vercel dashboard → Your project → Settings → Environment Variables
2. Update `REACT_APP_API_URL` with your actual Railway URL
3. Redeploy the frontend

## Alternative Backend Deployment (Render)

If you prefer Render over Railway:
1. Go to [Render.com](https://render.com)
2. Create new Web Service
3. Connect your GitHub repo
4. Settings:
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: `NODE_ENV=production`

## Testing Deployment

1. Visit your Vercel URL
2. Test the website functionality
3. Check admin login (admin@demo.com / admin123)
4. Verify API calls are working

## Troubleshooting

- **CORS Issues**: Make sure your backend allows your frontend domain
- **API Not Found**: Check the `REACT_APP_API_URL` environment variable
- **Build Failures**: Check build logs in Vercel/Railway dashboards