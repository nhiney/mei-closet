# Mei Closet 🧶

A high-end, production-ready secondhand marketplace specifically designed for clothing and handmade knitwear.

## 🚀 Features

- **RBAC Authentication**: Secure login/register with Admin and User roles.
- **Product Discovery**: Advanced search, filtering, and "Knit Studio" exclusive collection.
- **Wishlist System**: Save items you love with atomic favorites tracking.
- **Real-time Messaging**: Private buyer-seller chat powered by Socket.io with persistent history.
- **Analytics Dashboard**: Admin-only metrics tracking total views, performance, and best-sellers.
- **Cloudinary Uploads**: Secure multi-image upload with server-side abstraction and drag-and-drop UI.
- **Modern UI**: Dark-mode support, responsive layouts, and rich animations using Tailwind CSS and Next.js.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), Tailwind CSS, Lucide Icons.
- **Backend**: Node.js, Express, TypeScript, MongoDB (Mongoose).
- **Real-time**: Socket.io.
- **Storage**: Cloudinary (Image management).
- **Deployment**: Docker, Docker Compose.

## 📦 Project Structure

```text
├── backend/       # Express API (TypeScript)
├── frontend/      # Next.js Application (App Router)
├── shared/        # Shared types and constants
└── shared/        # Shared logic across workspaces
```

## ⚙️ Environment Configuration

### Backend (`backend/.env`)
```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/mei-closet
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

## 🏃 Local Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run All (Turbo Workspace)**:
   ```bash
   npm run dev:backend
   npm run dev:frontend
   ```

## 🐳 Docker Orchestration

To run the entire stack (including MongoDB) in a containerized environment:

```bash
docker compose up --build
```

---
Built with ❤️ by the Mei Closet Team.
