# MelodyHub 🎵

![CI Pipeline](https://github.com/aabhiyann/MelodyHub/actions/workflows/ci.yml/badge.svg)
![License](https://img.shields.io/github/license/aabhiyann/MelodyHub)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![React](https://img.shields.io/badge/React-19-blue)
![Node.js](https://img.shields.io/badge/Node.js-20-green)
![Docker](https://img.shields.io/badge/Docker-Enabled-blue)

**MelodyHub** is a modern, full-stack music streaming platform designed to demonstrate advanced software engineering practices. It features real-time social interactions, AI-powered playlist generation, and a robust microservices-ready architecture.

![MelodyHub Screenshot](https://github.com/user-attachments/assets/86a7d631-8d30-42cf-a827-23556282c12d)
*(Note: Screenshot is a placeholder)*

## 🚀 Live Demo & Documentation

-   **Live Application**: [https://udaymelodyhhub.vercel.app/](https://udaymelodyhhub.vercel.app/)
-   **API Documentation**: [View API Docs](Docs/professional/API.md)
-   **System Design**: [View Architecture](Docs/professional/04_SYSTEM_DESIGN.md)
-   **Project Management**: [View PM Handbook](Docs/professional/ROLE_PROJECT_MANAGER.md)

## ✨ Key Features

### 🧠 AI & Smart Discovery
-   **AI Playlist Generator**: Powered by **Google Gemini 1.5 Flash**, creating custom playlists from natural language prompts (e.g., "Upbeat songs for a gym workout").
-   **Personalized Feeds**: "Made for You" and "Trending" sections.

### 🎧 Immersive Playback
-   **Modern Player**: Gapless playback, volume control, and queue management.
-   **Background Play**: Persistent audio state across navigation using Zustand.

### 💬 Real-Time Social
-   **Live Chat**: Instant messaging with friends using **Socket.io**.
-   **Activity Status**: See what your friends are listening to in real-time.
-   **Online Presence**: Live online/offline status indicators.

### 🛡️ Admin & Security
-   **Admin Dashboard**: Manage songs, albums, and users.
-   **Role-Based Access**: Secure admin routes protected by Clerk middleware.
-   **Secure Uploads**: Media streaming optimized via Cloudinary.

## 🛠️ Technology Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4, Zustand, Radix UI, Lucide Icons |
| **Backend** | Node.js, Express.js, TypeScript, Socket.io, Google Gemini AI SDK |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **Auth** | Clerk (JWT-based Authentication) |
| **Storage** | Cloudinary (Audio & Image CDN) |
| **DevOps** | Docker, Docker Compose, GitHub Actions (CI/CD) |
| **Testing** | Vitest (Unit), Playwright (E2E), Jest (Backend Integration) |

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

We ensure quality with a comprehensive test suite.

-   **Unit Tests (Frontend)**: `cd frontend && npm test`
-   **Integration Tests (Backend)**: `cd backend && npm test`
-   **E2E Tests**: `cd frontend && npx playwright test`

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Abhiyan Sainju**
-   GitHub: [@aabhiyann](https://github.com/aabhiyann)
-   LinkedIn: [Abhiyan Sainju](https://linkedin.com/in/abhiyansainju)

---
*Built with ❤️ for the Advanced Software Paradigms Class.*
