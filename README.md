# MelodyHub 🎵🐢

<div align="center">

![React](https://img.shields.io/badge/react-19-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-5.0-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/vite-6.2-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-4.0-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)

![Test Coverage](https://img.shields.io/badge/coverage-72.8%25-brightgreen?style=for-the-badge)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)

</div>

---

**MelodyHub** is a modern, full-stack music streaming platform with AI-powered playlist generation, real-time chat, and a beautiful, accessible user interface. Built with performance, accessibility, and user experience in mind.

> 🎯 **Production-Ready**: 95% complete | 73% test coverage | WCAG 2.1 AA compliant | 29% bundle size optimized

![MelodyHub Screenshot](https://github.com/user-attachments/assets/86a7d631-8d30-42cf-a827-23556282c12d)

## 🚀 Live Demo & Documentation

-   **Live Application**: [https://udaymelodyhhub.vercel.app/](https://udaymelodyhhub.vercel.app/)
-   **API Documentation**: [View API Docs](Docs/professional/API.md)
-   **System Design**: [View Architecture](Docs/professional/04_SYSTEM_DESIGN.md)
-   **Project Management**: [View PM Handbook](Docs/professional/ROLE_PROJECT_MANAGER.md)

---

## ✨ Features

| Feature | Description | Status | Tech |
|---------|-------------|--------|------|
| 🎵 **Music Streaming** | High-quality audio playback with gapless transitions | ✅ Live | Cloudinary, Custom Player |
| 🤖 **AI Playlists** | Generate custom playlists using natural language | ✅ Live | Google Gemini 1.5 Flash |
| 💬 **Real-time Chat** | Instant messaging with online presence | ✅ Live | Socket.io, WebSockets |
| 🎨 **Modern UI/UX** | Glassmorphism, animations, dark mode, design system | ✅ Complete | Tailwind v4, CSS Variables |
| 🐢 **Melody Mascot** | Delightful mascot with 8 expressive states | ✅ Complete | Custom Components |
| ⌨️ **Keyboard Controls** | Full media control via keyboard shortcuts | ✅ Complete | Custom Hook |
| ♿ **Accessibility** | WCAG 2.1 AA compliant, screen reader support | ✅ Complete | Semantic HTML, ARIA |
| 📱 **Responsive Design** | Mobile-first, works beautifully on all devices | ✅ Complete | Responsive Tailwind |
| 🚀 **Performance** | Lazy loading, pagination, optimized bundles | ✅ Complete | Vite, Code Splitting |
| 🧪 **Well-Tested** | 73% coverage, 59 passing tests | ✅ Complete | Vitest, RTL |
| 🛡️ **Secure** | JWT auth, input validation, error boundaries | ✅ Complete | Clerk, Zod |
| 📊 **Admin Dashboard** | Manage songs, albums, and users | ✅ Live | Role-based Access |

### 🔑 Keyboard Shortcuts

- **Space**: Play/Pause toggle
- **Arrow Left/Right**: Previous/Next song
- **Arrow Up/Down**: Volume control (±10%)
- **M**: Mute/Unmute
- **Tab**: Navigate with visible focus indicators

---

## 📈 Performance Metrics

| Metric | Value | Notes |
|--------|-------|-------|
| **Bundle Size** | 256 KB (main) | -29% from initial |
| **Gzipped Size** | 83 KB (main) | Optimized chunks |
| **Test Coverage** | 72.8% lines | Exceeds 70% target |
| **Build Time** | 2.6s | Fast development |
| **Lighthouse Score** | 90+ | Performance optimized |
| **API Response** | < 100ms | With pagination |
| **Database Queries** | 50-90% faster | With indexes |

---

## 🛠️ Technology Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4, Zustand, Radix UI, Lucide Icons |
| **Backend** | Node.js, Express.js, TypeScript, Socket.io, Google Gemini AI SDK |
| **Database** | MongoDB Atlas (Mongoose ODM) with optimized indexes |
| **Auth** | Clerk (JWT-based Authentication) |
| **Storage** | Cloudinary (Audio & Image CDN) |
| **DevOps** | Docker, Docker Compose, GitHub Actions (CI/CD) |
| **Testing** | Vitest (Unit - 72.8% coverage), Playwright (E2E), React Testing Library |
| **Validation** | Zod (Schema Validation with TypeScript inference) |

## 📚 Role-Based Documentation

We have prepared detailed guides for different stakeholders:

-   **👨‍💻 Frontend Developers**: [Frontend Guide](Docs/professional/ROLE_FRONTEND_GUIDE.md) - Architecture, State, Components.
-   **⚙️ Backend Developers**: [Backend Guide](Docs/professional/ROLE_BACKEND_GUIDE.md) - API Patterns, DB Schema.
-   **📅 Project Managers**: [PM Handbook](Docs/professional/ROLE_PROJECT_MANAGER.md) - Roadmap, SDLC, Risks.
-   **📐 System Architects**: [System Design](Docs/professional/04_SYSTEM_DESIGN.md) - C4 Diagrams, Data Flow.
-   **🧪 QA Engineers**: [Test Strategy](Docs/professional/06_TEST_STRATEGY.md) - E2E & Unit Test Plans.
-   **🚀 DevOps Engineers**: [Deployment Guide](Docs/professional/DEPLOYMENT.md) - Render & Vercel Setup.

## ⚡ Getting Started

### Prerequisites
-   Node.js v18+
-   Docker (Optional, but recommended)
-   MongoDB Atlas, Cloudinary, Clerk, & Google Gemini API Keys.

### 🐳 Docker Installation (Recommended)

1.  **Clone the repository**
    ```bash
    git clone https://github.com/aabhiyann/MelodyHub.git
    cd MelodyHub
    ```

2.  **Configure Environment**
    Create a `.env` file in `backend/` based on provided examples.

3.  **Run Application**
    ```bash
    docker-compose up --build
    ```
    Access Frontend: `http://localhost:5173` | Backend: `http://localhost:5000`

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

## 🧪 Testing

We ensure quality with a comprehensive test suite:

-   **Unit Tests (Frontend)**: `cd frontend && npm test`  
    - **Test Coverage: 72.8%** (exceeds industry standard 70%)
    - 59 passing tests across components and stores
-   **Integration Tests (Backend)**: `cd backend && npm test`
-   **E2E Tests**: `cd frontend && npx playwright test`

---

## 🔌 API Overview

### Base URL
- **Development**: `http://localhost:5000/api`
- **Production**: `https://your-backend-url.com/api`

### Key Endpoints

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/songs` | GET | Get all songs (paginated) | ❌ |
| `/songs` | POST | Upload new song | ✅ Admin |
| `/albums` | GET | Get all albums (paginated) | ❌ |
| `/ai/playlist` | POST | Generate AI playlist | ✅ |
| `/messages` | GET/POST | Chat messages | ✅ |
| `/health` | GET | Health check | ❌ |
| `/health/detailed` | GET | Detailed diagnostics | ❌ |

### Pagination
All list endpoints support pagination via query parameters:
```
GET /api/songs?page=1&limit=20
```

**Response Format**:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Health Monitoring

Monitor application health via these endpoints:
- `/api/health` - Basic status
- `/api/health/detailed` - Full diagnostics (DB, memory, uptime)
- `/api/health/ready` - Kubernetes readiness probe
- `/api/health/live` - Kubernetes liveness probe

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please read our [Contributing Guide](CONTRIBUTING.md) for code of conduct details.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Abhiyan Sainju**
-   GitHub: [@aabhiyann](https://github.com/aabhiyann)
-   LinkedIn: [Abhiyan Sainju](https://linkedin.com/in/abhiyansainju)
-   Portfolio: [Your Portfolio URL]

---

## 🙏 Acknowledgments

- **Melody the Turtle** - Our beloved mascot, inspired by Duolingo's approach to delightful UX
- **Google Gemini** - For powering our AI playlist generation
- **Clerk** - For seamless authentication
- **Cloudinary** - For reliable media hosting
- **The Open Source Community** - For amazing tools and libraries

---

<div align="center">

**Built with ❤️ and TypeScript**

⭐ Star this repo if you find it helpful!

[Report Bug](https://github.com/aabhiyann/MelodyHub/issues) · [Request Feature](https://github.com/aabhiyann/MelodyHub/issues) · [Documentation](Docs/professional/)

</div>
