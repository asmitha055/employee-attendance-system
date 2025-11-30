# Employee Attendance System — Backend

This is a ready-to-run Node.js + Express + MongoDB backend that matches the Task-2 spec (auth, attendance, manager views, dashboards, CSV export).

## Quick Start

1. **Install deps**
   ```bash
   npm install
   ```

2. **Create `.env` from example**
   ```bash
   cp .env.example .env
   ```
   Ensure `MONGODB_URI` uses your Atlas URI **with a DB name** (e.g., `attendance_db`).  
   Example:
   ```env
   MONGODB_URI=mongodb+srv://Asmitha:Asmi2005@cluster0.mwiq0cx.mongodb.net/attendance_db?retryWrites=true&w=majority
   JWT_SECRET=supersecretlongrandomstring_change_me
   JWT_EXPIRES=7d
   PORT=5000
   ```

3. **Seed database (creates a manager + employees + sample attendance)**
   ```bash
   npm run seed
   ```

4. **Run the dev server**
   ```bash
   npm run dev
   ```
   API at: `http://localhost:5000/`

## Auth Routes
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET  /api/auth/me` (Bearer token)

## Employee Routes
- `POST /api/attendance/checkin`
- `POST /api/attendance/checkout`
- `GET  /api/attendance/my-history?month=11&year=2025&page=1&limit=20`
- `GET  /api/attendance/my-summary`
- `GET  /api/attendance/today`

## Manager Routes (requires manager token)
- `GET  /api/attendance/all?employee=<userId>&date=2025-11-30&status=late&page=1&limit=20`
- `GET  /api/attendance/employee/:id`
- `GET  /api/attendance/summary`
- `GET  /api/attendance/export?startDate=2025-11-01&endDate=2025-11-30`
- `GET  /api/attendance/today-status`
- `GET  /api/dashboard/manager`

## Dashboards
- `GET /api/dashboard/employee` (employee’s own stats)
- `GET /api/dashboard/manager` (team stats)

### Tokens
After login, use:
```
Authorization: Bearer <token>
```

## Notes
- "Late" is considered check-in at/after **10:00 AM** (simple rule, adjust in controller if needed).
- Checkout sets `totalHours` and converts to `half-day` if hours < 4.
- CSV export streams a file `attendance.csv`.

## Common Issues
- **Auth failed / bad auth**: Make sure your Atlas username/password are correct and that your URI includes a **database name** (e.g., `/attendance_db`). Also ensure your IP is allowed in Atlas Network Access.
- **next is not a function**: Do NOT call route handlers like `register(next)`. The routes here are correct.
- **Cannot connect to MongoDB**: Verify `MONGODB_URI` and retry.

## Seed Users
- Manager: `manager@example.com` / `Password@123`
- Employee: `alice@example.com` / `Password@123`

---

Made for VS Code + Postman/Thunder Client.
