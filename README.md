# MelodyHub

<div align="center">

![React](https://img.shields.io/badge/react-19-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-5.0-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/vite-6.2-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-4.0-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)

[![CI Pipeline](https://github.com/aabhiyann/MelodyHub/actions/workflows/ci.yml/badge.svg)](https://github.com/aabhiyann/MelodyHub/actions/workflows/ci.yml)
![Test Coverage](https://img.shields.io/badge/coverage-80%25-brightgreen?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)

</div>

---

MelodyHub is a comprehensive, full-stack music streaming platform designed to demonstrate advanced web engineering capabilities. Built with React and TypeScript, the application integrates complex real-time features, AI-driven content generation via Google Gemini, and a highly responsive, modern user interface. The project emphasizes production-readiness with robust test coverage, strict type safety, and WCAG 2.1 AA compliant accessibility.

## Live Deployment & Core Documentation

- **Live Application**: [https://melodyhubmusic.vercel.app/](https://melodyhubmusic.vercel.app/)
- **Documentation index**: [Docs/README.md](Docs/README.md) — central index for design system, features, and architecture.
- **Design system**: [Docs/DESIGN_PLAN.md](Docs/DESIGN_PLAN.md) — colors, typography, component rules (chat, player, nav, cards).
- **Technology Stack**: [Docs/TECH_STACK.md](Docs/TECH_STACK.md)
- **API Reference**: [Docs/professional/API.md](Docs/professional/API.md)
- **System Architecture**: [Docs/professional/04_SYSTEM_DESIGN.md](Docs/professional/04_SYSTEM_DESIGN.md)
- **Frontend Architecture**: [Docs/FRONTEND_ARCHITECTURE.md](Docs/FRONTEND_ARCHITECTURE.md)
- **Changelog**: [CHANGELOG.md](CHANGELOG.md)
- **Contributing**: [CONTRIBUTING.md](CONTRIBUTING.md)

---

## Technical Architecture

The application implements a decoupled, modern architecture utilizing a React frontend and a Node.js/Express backend, integrated through RESTful APIs and WebSocket connections.

### Frontend Engineering
- **Framework**: React 19 enhanced by Vite 6 for optimized build performance.
- **Language**: TypeScript with strict mode enforced for comprehensive type safety.
- **State Management**: Zustand for global state alongside TanStack Query for server validation and caching.
- **Styling**: Tailwind CSS v4 paired with Radix UI and Framer Motion for accessible, performant component design and fluid animations.
- **Progressive Web App**: Service worker implementation for offline support and system-level media controls.

### Backend Engineering
- **Runtime**: Node.js with Express.js framework.
- **Database**: MongoDB utilizing Mongoose ODM for structured data modeling.
- **Caching Layer**: Redis implementation for optimizing repetitive query performance and API response times.
- **Real-time Communication**: Socket.io enabling instantaneous chat functionality and live notifications.
- **Authentication**: Secure JWT-based authentication managed via Clerk.
- **AI Integration**: Integration with Google Gemini for natural language processing to generate intelligent, context-aware playlists.

---

## Core Features and Implementation

- **Advanced Audio Playback**: Custom-engineered media player utilizing the HTML5 Audio API, supporting gapless transitions and seamless state synchronization across components.
- **Intelligent Playlist Generation**: Implementation of prompt-based playlist creation leveraging LLM (Google Gemini) integration to map natural language to structured music metadata.
- **Real-Time Collaboration and Chat**: WebSockets infrastructure powering live typing indicators, instant messaging, and concurrent playlist editing.
- **Scalable Component Architecture**: Modular, visually appealing UI components optimized for reuse and performance, featuring interactive micro-animations.
- **Security & Authorization**: Comprehensive implementation of rate limiting, input validation via Zod, secure HTTP headers via Helmet, and intricate role-based access control.
- **Data Analytics and Visualization**: Custom admin dashboard translating usage data into actionable insights using Recharts.

---

## Quality Assurance & DevOps Practices

The repository adheres to enterprise-standard development workflows:

- **Continuous Integration / Continuous Deployment (CI/CD)**: GitHub Actions orchestrate automated testing, linting, and deployment pipelines to Vercel (frontend) and Render (backend).
- **Automated Testing Strategy**: 
  - Unit Tests: Vitest (Frontend) and Jest (Backend).
  - End-to-End Testing: Playwright integration for critical user flows.
- **Code Quality**: Enforced via aggressive ESLint configurations and Prettier formatting standard.

---

## Local Development Environment

### Prerequisites
- Node.js (v20 or higher)
- Docker (Recommended for standardized database and cache provisioning)
- Third-party API Keys: MongoDB, Cloudinary, Clerk, Google Gemini

### Docker Configuration (Recommended)

To instantiate the application utilizing Docker Compose:

```bash
git clone https://github.com/aabhiyann/MelodyHub.git
cd MelodyHub
# Ensure environment variables are configured based on .env.example files
docker-compose up --build
```
Access points:
- Frontend Client: `http://localhost:5173`
- Backend Server: `http://localhost:5000`

### Manual Configuration

#### Backend Service
```bash
cd backend
npm install
npm run dev
```
Runs at `http://localhost:5000` by default.

#### Frontend Service
```bash
cd frontend
npm install
npm run dev
```
Runs at `http://localhost:5173` by default. Set `VITE_API_URL` to your backend URL (e.g. `http://localhost:5000`) for API calls.

---

## Environment Variables

Configure `.env` in each package using the corresponding `.env.example`.

### Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL (e.g. `http://localhost:5000`) |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key for authentication |
| `VITE_GEMINI_API_KEY` | Google Gemini API key for AI playlist (optional) |

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name (media uploads) |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `GEMINI_API_KEY` | Google Gemini API key (AI playlists) |
| `REDIS_URL` | Optional; Redis URL for caching |
| `PORT` | Optional; server port (default 5000) |

---

## Screenshots

Key pages on the [live app](https://melodyhubmusic.vercel.app/):

- **[Home](https://melodyhubmusic.vercel.app/home)** — Featured hero, recently played, recommended, and new releases
- **[Explore / Browse](https://melodyhubmusic.vercel.app/browse)** — Genres and featured tracks
- **[Search](https://melodyhubmusic.vercel.app/search)** — Search by song, artist, album with filters
- **[Library](https://melodyhubmusic.vercel.app/library)** — Playlists and liked songs
- **[Chat](https://melodyhubmusic.vercel.app/chat)** — Real-time messaging and friends
- **[Profile](https://melodyhubmusic.vercel.app/profile)** — User profile, stats, playlists, and activity

Sign in to access full features. Screenshots of these pages can be captured from the deployed site for documentation.

---

## Licensing
This software is distributed under the MIT License. Reference the LICENSE file for comprehensive details.

<div align="center">

Developed by Abhiyan Sainju.

[Issue Tracker](https://github.com/aabhiyann/MelodyHub/issues)
</div>
