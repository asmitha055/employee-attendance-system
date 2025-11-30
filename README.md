# Employee Attendance System — Full Stack (React + Node + MongoDB)

This repo contains **frontend** (Vite + React + Zustand) and the **backend** you already tested.

## Quick Start

### 1) Backend
```bash
cd backend
cp .env.example .env   # edit MONGODB_URI / JWT_SECRET if needed
npm install
npm run seed
npm run dev
```
Backend runs at: `http://localhost:5000`

### 2) Frontend
Open a new terminal:
```bash
cd frontend
cp .env.example .env   # optional, defaults to http://localhost:5000
npm install
npm run dev
```
Frontend runs at: `http://localhost:5173`

Login quickly with:
- Manager → `manager@example.com` / `Password@123`
- Employee → `alice@example.com` / `Password@123`

The app auto-navigates after login based on role.

## Notes
- Axios automatically sends your JWT token.
- Change API base via `VITE_API_URL` in `frontend/.env`.
- CORS is allowed by backend for development.
- CSV export downloads via `/api/attendance/export`.
