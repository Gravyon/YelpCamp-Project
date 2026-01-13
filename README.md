# YelpCamp-Project
    A modern full-stack camping review platform built with TypeScript &amp; the MERN stack. Features secure HttpOnly JWT auth, interactive cluster maps (MapTiler), drag-n-drop uploads (UploadThing), optimistic state management (Zustand), and a cozy Dark/Light theme.
# ⛺ YelpCamp

A modern, full-stack application for sharing and reviewing campgrounds. Built with a focus on security, performance, and a cozy user experience.

![License](https://img.shields.io/badge/license-MIT-green)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Express](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)

## ✨ Features

*   **🔐 Robust Security:** HttpOnly Cookie Authentication with JWT (Access + Refresh tokens).
*   **🗺️ Interactive Maps:** Custom Cluster Maps and Geocoding powered by MapTiler.
*   **📸 Media Management:** Drag & drop multi-image uploads via UploadThing.
*   **🌗 Theming:** Responsive UI with persistent "Forest" Dark/Light modes.
*   **⚡ State Management:** Optimistic UI updates using Zustand.
*   **🛡️ Protection:** NoSQL Injection prevention, Rate Limiting, and Author Permissions.

## 🛠️ Tech Stack

*   **Frontend:** React (Vite), Bootstrap 5, Zustand, React Map GL.
*   **Backend:** Node.js, Express 5, Mongoose, Zod/Joi Validation.
*   **Services:** MongoDB Atlas, MapTiler, UploadThing.

## 🚀 Getting Started

This project uses **Bun** for fast package management.

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/yelpcamp.git
cd yelpcamp

# Install Backend Dependencies
cd backend
bun install

# Install Frontend Dependencies
cd ../frontend
bun install

#Create a .env file in both directories.
#backend
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret
CLOUDINARY_CLOUD_NAME=...
UPLOADTHING_TOKEN=...
MAPTILER_KEY=...
FRONTEND_URL=http://localhost:5173
NODE_ENV=development

#frontend
VITE_API_URL=http://localhost:3000/api
VITE_MAPTILER_KEY=your_maptiler_key

#Open two terminals.
#Terminal 1 (Backend)

cd backend/src
bun run dev (or bun dev)

#Terminal 2 (Frontend)

cd frontend/src
bun run dev


Visit http://localhost:5173 and start camping! 🏕️

  
