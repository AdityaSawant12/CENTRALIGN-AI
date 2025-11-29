# Quick Setup Guide

## Step 1: Get Your API Keys

### MongoDB Atlas (Database)
1. Go to [mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Create a free account
3. Create a new cluster (free M0 tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string (looks like: `mongodb+srv://username:password@cluster...`)

### Google Gemini API (AI)
1. Go to [ai.google.dev](https://ai.google.dev/)
2. Click "Get API key in Google AI Studio"
3. Create a new API key
4. Copy the key (starts with `AIza...`)

### Cloudinary (Image Storage)
1. Go to [cloudinary.com/users/register_free](https://cloudinary.com/users/register_free)
2. Create a free account
3. Go to Dashboard
4. Copy: Cloud Name, API Key, API Secret

## Step 2: Configure Backend

1. Navigate to `server` folder
2. Copy `.env.example` to `.env`:
   ```bash
   cd server
   copy .env.example .env
   ```

3. Edit `server/.env` with your actual credentials:
   ```env
   MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/centralign
   JWT_SECRET=your-random-secret-key-min-32-characters
   GEMINI_API_KEY=AIza...your-actual-key
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   PORT=5000
   NODE_ENV=development
   ```

## Step 3: Configure Frontend

1. Navigate to `client` folder
2. Create `.env.local` file:
   ```bash
   cd client
   echo NEXT_PUBLIC_API_URL=http://localhost:5000 > .env.local
   ```

   Or manually create `client/.env.local` with:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

## Step 4: Install Dependencies

Backend dependencies are already installed. If needed:
```bash
cd server
npm install
```

Frontend dependencies are already installed. If needed:
```bash
cd client
npm install
```

## Step 5: Run the Application

Open TWO terminal windows:

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
You should see: `✅ Connected to MongoDB` and `🚀 Server running on http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
You should see: `Local: http://localhost:3000`

## Step 6: Test the Application

1. Open browser to http://localhost:3000
2. Click "Get Started Free" to register
3. Create an account
4. Click "Generate New Form"
5. Try this prompt:
   ```
   I need a contact form with name, email, phone number, subject, and message fields
   ```
6. Click "Generate Form"
7. Copy the shareable link
8. Open in new tab/incognito to test submission

## Troubleshooting

### Backend won't start
- Check MongoDB connection string is correct
- Ensure all environment variables are set
- Check port 5000 is not in use

### Frontend won't start
- Ensure backend is running first
- Check `.env.local` has correct API URL
- Try deleting `.next` folder and restart

### Form generation fails
- Verify Gemini API key is valid
- Check backend logs for errors
- Ensure MongoDB connection is active

### Image upload fails
- Verify Cloudinary credentials
- Check file size is under 5MB
- Ensure image format is supported

## Next Steps

- Generate multiple forms to test context-aware memory
- Share forms with others
- View submissions in dashboard
- Explore different field types

## Need Help?

Check the main README.md for detailed documentation, architecture notes, and advanced features.
