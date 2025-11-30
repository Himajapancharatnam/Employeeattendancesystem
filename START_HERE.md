# 🚀 MERN Attendance System - Quick Start

## Current Status

✅ **Frontend is RUNNING** on http://localhost:3000
⚠️ **Backend needs MongoDB configuration** before it can start

## What You Need to Do

### Step 1: Create Backend .env File

Create a file named `.env` in the `backend` folder with this content:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=attendance_system_secret_key_change_in_production_2024
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:3000
```

### Step 2: Get MongoDB Connection String

**Option A: MongoDB Atlas (Recommended - Free)**
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free account
3. Create a free cluster
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password
7. Replace the `MONGODB_URI` in your `.env` file

**Option B: Local MongoDB**
If you have MongoDB installed locally:
```env
MONGODB_URI=mongodb://localhost:27017/attendance_db
```

### Step 3: Start Backend Server

Open a new terminal and run:
```bash
cd backend
npm run dev
```

You should see:
```
MongoDB connected successfully
Server running on port 5000 in development mode
```

### Step 4: Access the Application

- **Frontend:** http://localhost:3000 (should be running now!)
- **Backend API:** http://localhost:5000 (after MongoDB setup)

### Step 5: (Optional) Seed Sample Data

After backend is running, in a new terminal:
```bash
cd backend
npm run seed
```

This creates:
- **Manager:** manager@example.com / manager123
- **Employees:** john@example.com, jane@example.com, etc. / employee123

## Testing

Once backend is running, test the API:
- Health check: http://localhost:5000/api/health
- Should return: `{"message":"Server is running","status":"OK"}`

## Troubleshooting

**Backend won't start?**
- Check MongoDB connection string in `.env`
- Make sure MongoDB Atlas IP is whitelisted (0.0.0.0/0 for testing)
- Check terminal for error messages

**Frontend can't connect?**
- Make sure backend is running on port 5000
- Check browser console for errors

**Need help?**
- See `README.md` for detailed documentation
- See `QUICKSTART.md` for more setup details
