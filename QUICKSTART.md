# 🚀 Quick Start - CentrAlign AI Form Generator

## ⚡ Fastest Way to Get Started

### Step 1: Get Your Free API Keys (5 minutes)

1. **MongoDB Atlas** → [mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
   - Create free M0 cluster
   - Click "Connect" → Copy connection string

2. **Google Gemini** → [ai.google.dev](https://ai.google.dev/)
   - Click "Get API key"
   - Copy the key (starts with `AIza...`)

3. **Cloudinary** → [cloudinary.com/users/register_free](https://cloudinary.com/users/register_free)
   - Sign up
   - Dashboard → Copy: Cloud Name, API Key, API Secret

### Step 2: Configure (2 minutes)

**Backend** - Create `server/.env`:
```bash
cd server
copy .env.example .env
```

Edit `server/.env` with your keys:
```env
MONGODB_URI=mongodb+srv://YOUR_CONNECTION_STRING
JWT_SECRET=any-random-string-min-32-chars
GEMINI_API_KEY=AIza...
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
PORT=5000
```

**Frontend** - Create `client/.env.local`:
```bash
cd client
echo NEXT_PUBLIC_API_URL=http://localhost:5000 > .env.local
```

### Step 3: Run (1 minute)

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
✅ Wait for: `✅ Connected to MongoDB` and `🚀 Server running`

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
✅ Wait for: `Local: http://localhost:3000`

### Step 4: Test (2 minutes)

1. Open http://localhost:3000
2. Click "Get Started Free"
3. Register with any email
4. Click "Generate New Form"
5. Try this prompt:
   ```
   Create a job application form with name, email, resume upload, and cover letter
   ```
6. Copy the shareable link
7. Open in new tab → Fill and submit
8. Check dashboard for submission!

---

## 🎯 What to Try

### Test Context-Aware Memory

1. Generate 3 different job application forms
2. Generate 2 survey forms
3. Now generate: "internship application with portfolio"
4. Check backend terminal - should show it retrieved job forms, not surveys!

### Test Image Uploads

1. Generate form with image field
2. Open public link
3. Upload an image
4. Submit
5. View in dashboard - image should display!

---

## 🐛 Troubleshooting

**Backend won't start?**
- Check MongoDB URI is correct
- Ensure Gemini API key is valid
- Port 5000 available?

**Frontend won't start?**
- Backend running first?
- `.env.local` created?

**Form generation fails?**
- Gemini API key valid?
- Check backend logs

---

## 📚 Full Documentation

- **[README.md](README.md)** - Complete documentation
- **[SETUP.md](SETUP.md)** - Detailed setup guide
- **[walkthrough.md](.gemini/antigravity/brain/*/walkthrough.md)** - Implementation details

---

**Ready to build amazing forms with AI! 🎉**
