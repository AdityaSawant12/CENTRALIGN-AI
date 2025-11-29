# CentrAlign - Deployment Guide

This guide will help you deploy the CentrAlign AI Form Generator to production.

## 🏗️ Architecture

- **Frontend (Client)**: Next.js → Deploy to **Vercel**
- **Backend (Server)**: Node.js/Express → Deploy to **Render** or **Railway**
- **Database**: MongoDB Atlas (already cloud-hosted)
- **File Storage**: Cloudinary (already cloud-hosted)

## 📋 Prerequisites

Before deploying, ensure you have:

- ✅ GitHub repository with your code
- ✅ MongoDB Atlas account with connection string
- ✅ Cloudinary account with API credentials
- ✅ Google Gemini API key
- ✅ Vercel account (free tier available)
- ✅ Render account (free tier available)

---

## 🚀 Part 1: Deploy Backend to Render

### Step 1: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Authorize Render to access your repositories

### Step 2: Create New Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `AdityaSawant12/CENTRALIGN-AI`
3. Configure the service:

   **Basic Settings:**
   - **Name**: `centralign-backend` (or any name you prefer)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### Step 3: Add Environment Variables

In the Render dashboard, add these environment variables:

```
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
GEMINI_API_KEY=AIzaSyCxg9Fb00-4-sPTKRXUpW8A6obd3gNHiZE
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
PORT=5000
NODE_ENV=production
```

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Wait for the build to complete (5-10 minutes)
3. Once deployed, you'll get a URL like: `https://centralign-backend.onrender.com`
4. **Save this URL** - you'll need it for the frontend!

### Step 5: Test Backend

Visit: `https://your-backend-url.onrender.com/api/health`

You should see: `{"status":"ok"}`

---

## 🎨 Part 2: Deploy Frontend to Vercel

### Step 1: Update API URL

Before deploying, update the frontend to use your production backend URL:

1. Open `client/.env.local`
2. Update:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
   ```

3. Commit and push:
   ```bash
   git add client/.env.local
   git commit -m "Update API URL for production"
   git push origin main
   ```

### Step 2: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Authorize Vercel to access your repositories

### Step 3: Import Project

1. Click **"Add New..."** → **"Project"**
2. Select your repository: `AdityaSawant12/CENTRALIGN-AI`
3. Configure project:

   **Framework Preset**: Next.js (auto-detected)
   
   **Root Directory**: `client`
   
   **Build Settings**:
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

### Step 4: Add Environment Variables

Add this environment variable in Vercel:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
```

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait for the build to complete (3-5 minutes)
3. You'll get a URL like: `https://centralign-ai.vercel.app`

---

## 🔧 Part 3: Configure CORS

Your backend needs to allow requests from your Vercel frontend.

### Update server/src/index.ts

Add your Vercel URL to the CORS configuration:

```typescript
app.use(
    cors({
        origin: [
            'http://localhost:3000',
            'https://centralign-ai.vercel.app', // Add your Vercel URL
            'https://your-custom-domain.com'    // If you have a custom domain
        ],
        credentials: true,
    })
);
```

Commit and push this change - Render will auto-deploy.

---

## ✅ Part 4: Verify Deployment

### Test the Full Flow

1. Visit your Vercel URL: `https://centralign-ai.vercel.app`
2. Sign up for a new account
3. Try generating a form
4. Check if form submissions work
5. Test file uploads

### Check Logs

**Backend Logs (Render):**
- Go to Render dashboard → Your service → Logs

**Frontend Logs (Vercel):**
- Go to Vercel dashboard → Your project → Deployments → View Function Logs

---

## 🌐 Optional: Custom Domain

### For Vercel (Frontend)

1. Go to Vercel dashboard → Your project → Settings → Domains
2. Add your custom domain (e.g., `centralign.com`)
3. Follow DNS configuration instructions

### For Render (Backend)

1. Go to Render dashboard → Your service → Settings → Custom Domain
2. Add your API subdomain (e.g., `api.centralign.com`)
3. Follow DNS configuration instructions

---

## 🔒 Security Checklist

Before going live, ensure:

- [ ] All API keys are in environment variables (not hardcoded)
- [ ] `.env` files are in `.gitignore`
- [ ] CORS is configured with specific origins (not `*`)
- [ ] MongoDB Atlas has IP whitelist configured (or allow all for cloud deployments)
- [ ] JWT_SECRET is a strong, random string
- [ ] HTTPS is enabled (automatic on Vercel and Render)

---

## 📊 Monitoring

### Free Tier Limitations

**Render Free Tier:**
- Service spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- 750 hours/month free

**Vercel Free Tier:**
- 100GB bandwidth/month
- Unlimited deployments
- Automatic HTTPS

### Upgrade Recommendations

For production use with real users:
- **Render**: Upgrade to Starter ($7/month) for always-on service
- **Vercel**: Pro plan ($20/month) for better performance and analytics

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: "Application failed to respond"
- Check Render logs for errors
- Verify all environment variables are set
- Ensure MongoDB Atlas allows connections from anywhere (0.0.0.0/0)

**Problem**: "CORS error"
- Add your Vercel URL to CORS origins in `server/src/index.ts`
- Redeploy backend

### Frontend Issues

**Problem**: "Failed to fetch"
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check if backend is running (visit `/api/health`)
- Check browser console for CORS errors

**Problem**: "Build failed"
- Check Vercel build logs
- Ensure all dependencies are in `package.json`
- Verify Node version compatibility

---

## 📝 Post-Deployment Updates

Whenever you make code changes:

1. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```

2. **Automatic deployment**:
   - Vercel: Auto-deploys on every push to `main`
   - Render: Auto-deploys on every push to `main`

3. Monitor deployment status in respective dashboards

---

## 🎉 Success!

Your CentrAlign AI Form Generator is now live!

- **Frontend**: https://centralign-ai.vercel.app
- **Backend**: https://centralign-backend.onrender.com

Share your app with users and start collecting form submissions! 🚀
