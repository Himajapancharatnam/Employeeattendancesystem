# Quick Start Guide

## Prerequisites
- Node.js (v14+)
- npm or yarn
- MongoDB Atlas account (free tier works)

## Setup Steps

### 1. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file (copy from `env.example.txt` or see `SETUP.md`):
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_random_secret_key
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:3000
```

Start backend:
```bash
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Start frontend:
```bash
npm run dev
```

### 3. Seed Database (Optional)

In backend directory:
```bash
npm run seed
```

This creates:
- Manager: manager@example.com / manager123
- Employees: john@example.com, jane@example.com, etc. / employee123

### 4. Access Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## First Steps

1. Register a new user OR login with seeded credentials
2. Employee: Check in, view dashboard, view history
3. Manager: View all attendance, export data, view summaries

## Troubleshooting

- **Backend won't start**: Check MongoDB connection in .env
- **Frontend can't connect**: Verify VITE_API_URL or backend CORS settings
- **Authentication errors**: Check JWT_SECRET is set in backend .env

For detailed documentation, see README.md
