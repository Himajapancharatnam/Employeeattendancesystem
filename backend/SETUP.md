# Backend Setup Instructions

## Environment Variables

Create a `.env` file in the backend directory with the following content:

```
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/attendance_db?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=30d

# CORS
FRONTEND_URL=http://localhost:3000
```

Replace the placeholder values with your actual configuration.

You can copy from `env.example.txt` file and rename it to `.env`, then update the values.
