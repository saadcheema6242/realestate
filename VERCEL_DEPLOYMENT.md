# Single Platform Deployment on Vercel

## Overview
This real estate platform is now configured for **full-stack deployment on Vercel** using:
- **Frontend**: React app (static build)
- **Backend**: Serverless functions in `/api` folder

## 🚀 One-Click Deployment Steps

### 1. Deploy to Vercel

1. Go to [Vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your GitHub repository: `saadcheema6242/realestate`
5. **Important Settings**:
   - Framework Preset: **Other**
   - Root Directory: **/** (leave empty - deploy from root)
   - Build Command: `cd client && npm run build`
   - Output Directory: `client/build`
6. **Environment Variables** (Optional):
   - `JWT_SECRET`: `your-super-secret-jwt-key-here`
7. Click **Deploy**!

### 2. That's It! 🎉

Your app will be live at: `https://your-project-name.vercel.app`

## API Endpoints

All API endpoints are available at `/api/`:

- `POST /api/auth/login` - Admin login
- `GET /api/properties` - Get all properties
- `POST /api/properties` - Create property (auth required)
- `GET /api/properties/[id]` - Get property by ID
- `PUT /api/properties/[id]` - Update property (auth required)
- `DELETE /api/properties/[id]` - Delete property (auth required)
- `GET /api/bookings` - Get bookings (auth required)
- `POST /api/bookings` - Create booking
- `GET /api/leads` - Get leads (auth required)
- `POST /api/leads` - Create lead
- `POST /api/chatbot` - Chatbot interaction
- `GET /api/dashboard/stats` - Dashboard statistics (auth required)

## Admin Credentials
- Email: `admin@demo.com`
- Password: `password123`

## Features Included
✅ React frontend with Tailwind CSS
✅ Serverless API backend
✅ File-based database (JSON files)
✅ Admin authentication
✅ Property management
✅ Lead capture system
✅ Booking system
✅ AI chatbot simulation
✅ Dashboard with statistics
✅ Responsive design

## Database
- Uses JSON files in `/database` folder
- Automatically creates sample data on first run
- Persistent across deployments (Vercel file system)

## Troubleshooting

**Build Issues:**
- Make sure all dependencies are installed
- Check build logs in Vercel dashboard

**API Issues:**
- Check function logs in Vercel dashboard
- Verify environment variables are set

**CORS Issues:**
- APIs are configured with CORS headers
- Should work from same domain automatically

## Local Development

```bash
# Install dependencies
npm run install-all

# Start development servers
npm run dev
```

Frontend: http://localhost:3000
Backend: http://localhost:5000