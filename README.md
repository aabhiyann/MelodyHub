# MelodyHub

A modern music streaming platform built with React, Node.js, and MongoDB. MelodyHub provides a comprehensive music listening experience with real-time chat, user management, and admin controls.

![MelodyHub Screenshot](https://github.com/user-attachments/assets/86a7d631-8d30-42cf-a827-23556282c12d)

## Live Demo

**[View Live Application](https://udaymelodyhhub.vercel.app/)**

## Features

### Core Functionality
- **Music Streaming**: High-quality audio playback with full player controls
- **Album Management**: Browse and organize music by albums
- **Playlist Support**: Create and manage custom playlists
- **Search & Discovery**: Advanced search functionality with filtering options
- **User Authentication**: Secure login/signup with Clerk integration

### Interactive Features
- **Real-time Chat**: Live messaging system with Socket.io
- **User Profiles**: Customizable user profiles and settings
- **Admin Dashboard**: Comprehensive admin panel for content management
- **Analytics**: User activity tracking and statistics
- **Responsive Design**: Optimized for desktop and mobile devices

### Technical Features
- **Dark Mode**: Theme switching capability
- **Keyboard Shortcuts**: Enhanced user experience with hotkeys
- **Loading States**: Smooth loading animations and skeletons
- **Error Handling**: Comprehensive error management
- **Form Validation**: Client and server-side validation

## Technology Stack

### Frontend
- **React 19** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS v4** - Utility-first CSS framework
- **Zustand** - Lightweight state management
- **Socket.io Client** - Real-time communication

### Backend
- **Node.js (TypeScript)** - Modern server-side runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Socket.io** - Real-time bidirectional communication
- **Cloudinary** - Cloud-based media management
- **Jest** - Testing framework

### Deployment & Tools
- **Docker** - Containerization
- **Vercel** - Frontend deployment
- **MongoDB Atlas** - Cloud database hosting
- **Cloudinary** - Image and audio storage
- **Clerk** - Authentication service
- **GitHub Actions** - CI/CD pipeline

## Project Structure

```
MelodyHub/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Application pages
│   │   ├── stores/           # State management
│   │   ├── providers/        # Context providers
│   │   └── types/            # TypeScript type definitions
│   └── public/               # Static assets
├── backend/                  # Node.js backend API
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── models/           # Database models
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic
│   │   └── middleware/       # Custom middleware
│   └── dist/                 # Compiled TypeScript output
└── docs/                     # Project documentation
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- Cloudinary account
- Clerk account
- Docker (optional)

### Docker Installation (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/aabhiyann/MelodyHub.git
   cd MelodyHub
   ```

2. **Environment Setup**
   ```bash
   # Create environment file in backend directory
   cd backend
   cp .env.example .env
   # Fill in your credentials
   ```

3. **Run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

### Manual Installation

1. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

2. **Run the application**
   ```bash
   # Start backend server
   cd backend
   npm run dev
   
   # Start frontend development server
   cd frontend
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Music Management
- `GET /api/songs` - Get all songs
- `POST /api/songs` - Upload new song
- `GET /api/albums` - Get all albums
- `POST /api/albums` - Create new album

### User Management
- `GET /api/users` - Get all users (admin)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin)

## Development

### Code Style
- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety

### Testing
- Backend tests are written with Jest.
- Run tests:
  ```bash
  cd backend
  npm test
  ```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

- **Developer**: [Abhiyan Sainju](https://github.com/aabhiyann)
- **Project Link**: [https://github.com/aabhiyann/MelodyHub](https://github.com/aabhiyann/MelodyHub)
- **Live Demo**: [https://udaymelodyhhub.vercel.app/](https://udaymelodyhhub.vercel.app/)

---

**Note**: This project was developed as a comprehensive music streaming platform showcasing modern web development practices and full-stack integration.
