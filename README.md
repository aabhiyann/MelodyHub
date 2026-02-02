# MelodyHub 🎵🐢

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

**MelodyHub** is a modern, full-stack music streaming platform designed to replicate the best features of Spotify while introducing AI-powered innovation. It features real-time audio playback, collaborative playlists, instant chat, and a beautiful, accessible user interface.

> 🎯 **Production-Ready**: 100% complete | 80%+ test coverage | WCAG 2.1 AA compliant | Strict TypeScript Backend

![MelodyHub Screenshot](https://github.com/user-attachments/assets/86a7d631-8d30-42cf-a827-23556282c12d)

## 🚀 Live Demo & Documentation

-   **Live Application**: [https://udaymelodyhhub.vercel.app/](https://udaymelodyhhub.vercel.app/)
-   **API Documentation**: [View API Docs](Docs/professional/API.md)
-   **System Design**: [View Architecture](Docs/professional/04_SYSTEM_DESIGN.md)
-   **Project Management**: [View PM Handbook](Docs/professional/ROLE_PROJECT_MANAGER.md)
-   **Changelog**: [CHANGELOG.md](CHANGELOG.md)

---

## ✨ Key Features

| Feature | Description | Status | Tech |
|---------|-------------|--------|------|
| 🎵 **Music Streaming** | High-quality audio playback with gapless transitions | ✅ Live | Cloudinary, Custom Player |
| 🤖 **AI Playlists** | Generate custom playlists using natural language | ✅ Live | Google Gemini 1.5 Flash |
| 🔍 **Smart Search** | Real-time search with categorized results | ✅ Live | Debounced filtering |
| 👥 **Shared Playlists** | Collaborative playlist editing in real-time | ✅ Live | MongoDB, Permissions |
| 💬 **Real-time Chat** | Instant messaging with typing indicators | ✅ Live | Socket.io |
| 🎨 **Modern UI/UX** | Glassmorphism, animations, dark mode | ✅ Complete | Tailwind v4 |
| 🐢 **Melody Mascot** | Delightful mascot with 8 expressive states | ✅ Complete | Custom Components |
| 📊 **Admin Dashboard** | Manage content and view platform analytics | ✅ Live | Recharts, Role-Based Access |
| 🛡️ **Strict Security** | JWT Auth, Rate Limiting, Input Validation | ✅ Complete | Clerk, Zod, Helmet |
| 📈 **Analytics Dashboard** | Listening history, top artists/genres, patterns heatmap | ✅ Live | Recharts, Analytics API |
| 🔔 **Notifications** | Real-time friend requests and activity; bell in nav | ✅ Live | Socket.io, Notification API |
| 👤 **Followers / Following** | Lists, mutual friends, clickable profile counts | ✅ Live | UserConnection, Pagination |
| ⚡ **Redis Caching** | API and query-level caching for faster responses | ✅ Live | Redis, Cache Middleware |
| 🎭 **Mood & Recommendations** | Mood detection, mood playlists, hybrid recommendations | ✅ Live | Mood Service, Recommendation API |
| 📱 **PWA / Offline** | Install prompt, offline indicator, lock-screen controls | ✅ Live | MediaSession API, Service Worker |

---

## 📸 Screenshots

| **Home / Browse** | **Login** |
|:---:|:---:|
| ![Home](Docs/Mock%20Design/HomePage.png) | ![Login](Docs/Mock%20Design/LoginPage.png) |

| **Add Songs** | **Messaging** |
|:---:|:---:|
| ![Add Songs](Docs/Mock%20Design/AddSongs.png) | ![Messaging](Docs/Mock%20Design/Messaging.png) |

---

## 🛠️ Technology Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4, Zustand, Radix UI |
| **Backend** | Node.js, Express.js, TypeScript (Strict), Socket.io, Google Gemini AI |
| **Database** | MongoDB Atlas (Mongoose ODM), Redis (Caching) |
| **Auth** | Clerk (JWT-based Authentication) |
| **DevOps** | Docker, GitHub Actions (CI/CD), Vercel |
| **Testing** | Vitest (Unit), Playwright (E2E), Jest (Integration) |

---

## ⚡ Getting Started

### Prerequisites
-   Node.js v20+
-   Docker (Optional, but recommended for consistent env)
-   Keys for: MongoDB, Cloudinary, Clerk, & Google Gemini.
-   Redis (optional): Set `REDIS_URL` in backend `.env` for caching; Docker Compose includes Redis.

### 🐳 Docker Installation (Recommended)

1.  **Clone the repository**
    ```bash
    git clone https://github.com/aabhiyann/MelodyHub.git
    cd MelodyHub
    ```

2.  **Configure Environment**
    Create `.env` files in `backend/` and `frontend/` based on `.env.example`. For backend, include `REDIS_URL` (e.g. `redis://localhost:6379`) if using Redis caching.

3.  **Run with Docker Compose**
    ```bash
    docker-compose up --build
    ```
    - Frontend: `http://localhost:5173`
    - Backend: `http://localhost:5000`

### 💻 Manual Installation

1.  **Backend Setup**
    ```bash
    cd backend
    npm install
    npm run dev
    ```

2.  **Frontend Setup**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

---

## 🧪 Quality Assurance

We maintain high code quality through our automated CI pipeline:

*   **Linting**: Strict ESLint configuration (custom ruleset).
*   **Type Safety**: Full TypeScript strict mode enabled on backend & frontend.
*   **Testing**:
    *   `npm test` (Frontend): Unit tests via Vitest.
    *   `npm test` (Backend): Integration tests via Jest.

---

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) to get started with our workflow.

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ by Abhiyan Sainju**

[Report Bug](https://github.com/aabhiyann/MelodyHub/issues) · [Request Feature](https://github.com/aabhiyann/MelodyHub/issues)

</div>
