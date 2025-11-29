# CentrAlign - AI-Powered Dynamic Form Generator

> **Built for CentrAlign AI Assessment**  
> An intelligent form generation system powered by Google Gemini AI with context-aware memory retrieval

## 🌟 Features

- **AI Form Generation**: Convert natural language prompts into fully functional forms using Google Gemini
- **Context-Aware Memory**: Intelligent retrieval system that learns from past forms using semantic embeddings
- **Dynamic Form Rendering**: Supports text, email, number, textarea, select, checkbox, radio, image, and file uploads
- **Image Upload Pipeline**: Managed cloud storage via Cloudinary
- **Shareable Public Links**: Each form gets a unique URL for easy sharing
- **Submission Tracking**: View all responses organized by form in your dashboard
- **Scalable Architecture**: Handles thousands of forms with efficient top-K retrieval

## 🏗️ Architecture

```
Frontend (Next.js 15)  →  Backend (Express)  →  MongoDB Atlas
                              ↓
                         Google Gemini API
                         (Form Generation + Embeddings)
                              ↓
                         Cloudinary
                         (Image Storage)
```

### Context-Aware Memory System

When generating a new form:
1. User prompt is converted to a vector embedding using Gemini Embedding API
2. Cosine similarity search finds the top-5 most relevant past forms
3. Relevant form patterns are injected into the AI prompt as context
4. AI generates a new form schema informed by user's history

**Scalability**: The system uses MongoDB for embedding storage (suitable for 0-10K forms). For 100K+ forms, migration to Pinecone vector database is recommended.

## 📋 Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account (free tier works)
- Google Gemini API key (free tier available)
- Cloudinary account (free tier works)

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
cd CentrAlign
```

### 2. Backend Setup

```bash
cd server

# Install dependencies
npm install

# Create .env file
copy .env.example .env
```

Edit `server/.env` with your credentials:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/centralign
JWT_SECRET=your-super-secret-jwt-key-change-in-production
GEMINI_API_KEY=your-gemini-api-key-here
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
PORT=5000
NODE_ENV=development
```

**Getting API Keys:**
- **MongoDB**: Create free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- **Gemini API**: Get free key at [ai.google.dev](https://ai.google.dev/)
- **Cloudinary**: Sign up at [cloudinary.com](https://cloudinary.com/)

### 3. Frontend Setup

```bash
cd ../client

# Install dependencies (already done)
# npm install

# Create .env.local file
echo NEXT_PUBLIC_API_URL=http://localhost:5000 > .env.local
```

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

Access the application at: **http://localhost:3000**

## 📝 Example Prompts

Try these prompts to generate forms:

### Job Application Form
```
I need a job application form with name, email, phone number, resume upload, 
cover letter, years of experience, LinkedIn profile, and portfolio link.
```

### Event Registration
```
Create an event registration form with attendee name, email, ticket type 
(VIP, General, Student), dietary preferences, and t-shirt size.
```

### Customer Feedback Survey
```
Build a customer feedback survey with rating scales (1-5) for service quality, 
product quality, and overall experience, plus a comments section.
```

### Medical Intake Form
```
Generate a patient intake form with full name, date of birth, insurance provider, 
emergency contact, current medications, and medical history.
```

## 🎯 Usage Flow

1. **Register/Login** at `/auth/register` or `/auth/login`
2. **Generate Form** at `/generate` - describe your form in natural language
3. **Share Form** - copy the unique shareable link
4. **Collect Responses** - users fill the form (no login required)
5. **View Submissions** - check responses in your dashboard

## 🧠 Context-Aware Memory in Action

**Scenario**: You've previously created 5 job application forms.

**New Prompt**: "I need an internship application form with resume upload"

**What Happens**:
1. System generates embedding for your prompt
2. Searches your 1000+ past forms
3. Retrieves only the 5 most relevant job-related forms
4. AI sees patterns: resume uploads, portfolio fields, experience questions
5. Generates optimized internship form based on your preferences

**Result**: Better, more consistent forms that match your style!

## 🔧 Tech Stack

| Component | Technology |
|-----------|-----------|
| Frontend | Next.js 15, React 19, TypeScript, TailwindCSS |
| Backend | Express.js, TypeScript |
| Database | MongoDB Atlas |
| AI | Google Gemini API (gemini-1.5-flash, text-embedding-004) |
| Image Storage | Cloudinary |
| Authentication | JWT + bcrypt |

## 📊 Database Schema

### Users Collection
```typescript
{
  _id: ObjectId,
  email: string,
  passwordHash: string,
  createdAt: Date
}
```

### Forms Collection
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  title: string,
  description: string,
  prompt: string,
  schema: { fields: [...] },
  embedding: number[],  // 768-dimensional vector
  metadata: {
    purpose: string,
    fieldTypes: string[],
    hasImageUpload: boolean
  },
  shareableId: string,
  createdAt: Date
}
```

### Submissions Collection
```typescript
{
  _id: ObjectId,
  formId: ObjectId,
  responses: { [fieldId]: value },
  submittedAt: Date
}
```

## 🎨 Design Highlights

- **Glassmorphism UI** with backdrop blur effects
- **Gradient Accents** for modern, premium feel
- **Smooth Animations** with CSS transitions
- **Dark Theme** optimized for extended use
- **Responsive Design** works on all devices

## ⚡ Performance & Scalability

### Current Implementation
- **Embedding Storage**: MongoDB with cosine similarity search
- **Context Retrieval**: Top-5 forms (configurable)
- **Suitable For**: 0-10,000 forms per user

### Scaling to 100K+ Forms
1. Migrate embeddings to **Pinecone** vector database
2. Implement **caching** for frequent searches
3. Add **pagination** for dashboard (50 forms/page)
4. Use **Redis** for session management

### Token Limit Management
- User prompt: ~100 tokens
- System instructions: ~300 tokens
- Context (5 forms): ~1,000 tokens
- **Total**: ~1,400 tokens (well within Gemini's 32K limit)

## 🚧 Limitations

- Basic email/password authentication (no OAuth)
- MongoDB vector search slower than dedicated vector DB
- No real-time collaboration features
- Limited to predefined field types
- No conditional logic in forms

## 🔮 Future Improvements

### High Priority
- [ ] Pinecone integration for vector storage
- [ ] Advanced validation rules (regex, custom validators)
- [ ] Form analytics (views, completion rates)
- [ ] Export submissions to CSV/Excel

### Medium Priority
- [ ] Conditional field logic (show/hide based on answers)
- [ ] Multi-language support (i18n)
- [ ] Form templates library
- [ ] Webhook integrations
- [ ] Custom branding options

### Low Priority
- [ ] OAuth authentication (Google, GitHub)
- [ ] Real-time collaboration
- [ ] Form versioning
- [ ] A/B testing for forms

## 📄 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Forms (Protected)
- `POST /api/forms/generate` - Generate form from prompt
- `GET /api/forms` - Get user's forms
- `GET /api/forms/:id` - Get specific form

### Public
- `GET /api/forms/public/:shareableId` - Get public form
- `POST /api/submissions/:shareableId` - Submit form response

### Submissions (Protected)
- `GET /api/submissions/form/:formId` - Get form submissions
- `GET /api/submissions/user/all` - Get all user submissions

### Upload
- `POST /api/upload` - Upload image to Cloudinary

## 🧪 Testing

### Manual Testing Checklist
- [x] User registration and login
- [x] Form generation with AI
- [x] Context retrieval with multiple forms
- [x] Public form rendering
- [x] Image upload in forms
- [x] Form submission
- [x] Submission viewing in dashboard

### Test Scenarios

**Test 1: Context-Aware Memory**
1. Create 3 job application forms
2. Create 2 survey forms
3. Generate new form: "internship application with resume"
4. Check backend logs - should retrieve job forms, not surveys

**Test 2: Image Upload Pipeline**
1. Generate form with image field
2. Open public form
3. Upload image
4. Submit form
5. Verify Cloudinary URL in submissions

## 📞 Support

For issues or questions:
- Check the implementation plan in `.gemini/antigravity/brain/*/implementation_plan.md`
- Review backend logs for debugging
- Ensure all environment variables are set correctly

## 📜 License

Built as part of CentrAlign AI Assessment. All rights reserved.

---

**Built with ❤️ using AI-powered development**
