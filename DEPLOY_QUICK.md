# Quick Deployment Guide

## 🚀 Deploy in 3 Steps

### 1. Deploy Backend to Render

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

1. Click the button above or go to [render.com](https://render.com)
2. Connect your GitHub repo: `AdityaSawant12/CENTRALIGN-AI`
3. Add environment variables:
   - `MONGODB_URI` - Your MongoDB Atlas connection string
   - `JWT_SECRET` - Random secret key (generate one)
   - `GEMINI_API_KEY` - Your Gemini API key
   - `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
   - `CLOUDINARY_API_KEY` - Your Cloudinary API key
   - `CLOUDINARY_API_SECRET` - Your Cloudinary API secret

4. Click "Create Web Service"
5. **Copy your backend URL** (e.g., `https://centralign-backend.onrender.com`)

### 2. Deploy Frontend to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/AdityaSawant12/CENTRALIGN-AI&project-name=centralign-ai&root-directory=client)

1. Click the button above or go to [vercel.com](https://vercel.com)
2. Import your GitHub repo
3. Set **Root Directory** to `client`
4. Add environment variable:
   - `NEXT_PUBLIC_API_URL` - Your Render backend URL from step 1
5. Click "Deploy"

### 3. Update CORS

After deployment, update `server/src/index.ts`:

```typescript
app.use(
    cors({
        origin: [
            'http://localhost:3000',
            'https://your-vercel-url.vercel.app', // Add your Vercel URL here
        ],
        credentials: true,
    })
);
```

Commit and push - Render will auto-redeploy.

## ✅ Done!

Your app is now live! Visit your Vercel URL to start using CentrAlign.

---

For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)
