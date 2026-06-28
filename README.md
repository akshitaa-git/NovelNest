# NovelNest 📚

NovelNest is a production-ready, full-stack reading companion platform built with the MERN stack. It leverages the Google Books API to provide access to millions of titles while offering a personalized experience through AI-driven insights and detailed reading analytics.

## ✨ Features

- **Global Book Discovery**: Search 40M+ books via Google Books & Open Library APIs.
- **AI Reading Assistant**: Automated summaries and natural language recommendations using AI.
- **Smart Shelves**: Manage "Want to Read" and "Read" lists with real-time status updates.
- **Advanced Analytics**: Visualize your reading habits with dynamic charts (genre distribution, pace, trends).
- **Modern UX**: Premium glassmorphism design, dark mode, and smooth animations with Framer Motion.
- **Secure Auth**: JWT-based authentication with Google OAuth integration.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Recharts, Framer Motion
- **Backend**: Node.js, Express.js
- **Database**: MongoDB & Mongoose
- **APIs**: Google Books, Open Library, Gemini AI (Simulated)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/booknest.git
   cd booknest
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Add your MONGO_URI and API keys to .env
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd client
   npm install
   npm run dev
   ```

## 📦 Deployment

### Frontend (Vercel)
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variables: `VITE_API_URL`

### Backend (Railway / Render)
- Start Command: `node index.js`
- Environment Variables: `MONGO_URI`, `JWT_SECRET`, `GOOGLE_BOOKS_API_KEY`

## 📄 License
MIT License. Created for portfolios and software engineering interviews.
