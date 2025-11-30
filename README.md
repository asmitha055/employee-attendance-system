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
<img width="1544" height="786" alt="Screenshot 2025-11-30 150820" src="https://github.com/user-attachments/assets/88536db5-567c-4199-a325-fae782cfb672" />

<img width="1679" height="818" alt="Screenshot 2025-11-30 153956" src="https://github.com/user-attachments/assets/726d80fe-9347-4263-833f-8a3553338966" />

<img width="1585" height="875" alt="Screenshot 2025-11-30 154017" src="https://github.com/user-attachments/assets/eeda0c81-cec3-495d-83a6-7b8da246079d" />

<img width="1523" height="281" alt="Screenshot 2025-11-30 154045" src="https://github.com/user-attachments/assets/b2623979-9a7e-433c-846c-d58f54fd80ed" />



