# Deployment Guide

**Target Platform**: Render.com (Backend) + Vercel (Frontend)  
**Strategy**: Containerized Backend, Static Frontend.

## 1. Backend Deployment (Render)

We use **Docker** to deploy the backend. This ensures it runs exactly as it does on your machine.

### Steps:

1.  **Sign Up/Login** to [Render.com](https://render.com).
2.  Click **New +** -> **Web Service**.
3.  Connect your GitHub repository (`MelodyHub`).
4.  **Settings**:
    - **Name**: `melodyhub-api`
    - **Region**: Oregon (US West) or closest to you.
    - **Runtime**: Docker
    - **Root Directory**: `backend` (Crucial step!)
    - **Instance Type**: Free
5.  **Environment Variables**:
    Copy these from your local `.env`:
    - `MONGODB_URI`
    - `CLOUDINARY_CLOUD_NAME`
    - `CLOUDINARY_API_KEY`
    - `CLOUDINARY_API_SECRET`
    - `CLERK_PUBLISHABLE_KEY`
    - `CLERK_SECRET_KEY`
    - `GEMINI_API_KEY`
    - `REDIS_URL` (optional; e.g. Redis Cloud or Render Redis – enables API and query-level caching)
    - `NODE_ENV` = `production`
    - `PORT` = `5000`
6.  Click **Create Web Service**.
7.  **Wait**: It will take ~5 minutes to build.
8.  **Copy URL**: Once live, copy the URL (e.g., `https://melodyhub-api.onrender.com`).

## 2. Frontend Deployment (Vercel)

1.  **Sign Up/Login** to [Vercel.com](https://vercel.com).
2.  Click **Add New...** -> **Project**.
3.  Import `MelodyHub`.
4.  **Settings**:
    - **Framework Preset**: Vite
    - **Root Directory**: `frontend` (Click Edit to change this!)
5.  **Environment Variables**:
    - `VITE_API_URL`: Paste your Render Backend URL (e.g., `https://melodyhub-api.onrender.com`)
    - `VITE_CLERK_PUBLISHABLE_KEY`: Your Clerk Key.
6.  Click **Deploy**.

## 3. Post-Deployment Checks

1.  Visit your Vercel URL.
2.  **Smoke Test**:
    - Log in (Clerk should redirect back to Vercel).
    - Play a song (Checks Cloudinary + Mongo).
    - Open "AI Playlist" and generate one (Checks Gemini).
