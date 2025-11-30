# Setup Required Before Running

## Important: MongoDB Connection Required

The backend server needs a valid MongoDB connection string to work properly.

### Steps to Complete Setup:

1. **Create `.env` file in the `backend` directory:**
   - Copy `backend/env.example.txt` and rename it to `.env`
   - OR manually create `.env` file with the following content:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=attendance_system_secret_key_change_in_production_2024
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:3000
```

2. **Get MongoDB Connection String:**
   - Option 1: Use MongoDB Atlas (Free tier available)
     - Go to https://www.mongodb.com/cloud/atlas
     - Create an account and cluster
     - Get your connection string
     - Replace `username` and `password` in the connection string
   
   - Option 2: Use local MongoDB
     - Install MongoDB locally
     - Use connection string: `mongodb://localhost:27017/attendance_db`

3. **Update the `.env` file** with your actual MongoDB URI

4. **Restart the backend server:**
   - Stop the current backend server (Ctrl+C)
   - Run `cd backend && npm run dev` again

### Current Status:

- ✅ Backend dependencies installed
- ✅ Frontend dependencies installed
- ⚠️ Backend `.env` file needs to be created with MongoDB URI
- ⚠️ Backend server may fail to connect without valid MongoDB URI

### Once MongoDB is configured:

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Quick Test (After MongoDB Setup):

You can test if the backend is working by visiting:
- http://localhost:5000/api/health

This should return: `{"message":"Server is running","status":"OK"}`

### Seed Database (Optional):

After MongoDB is connected, you can populate with sample data:
```bash
cd backend
npm run seed
```

This creates a manager and sample employees with default passwords.
