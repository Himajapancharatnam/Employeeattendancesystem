# MERN Attendance Management System

A complete full-stack attendance management system built with MongoDB, Express.js, React, and Node.js (MERN stack). This system supports role-based access control for employees and managers, with features for tracking attendance, generating reports, and managing employee data.

## Features

### Authentication & Authorization
- JWT-based authentication
- bcrypt password hashing
- Role-based access control (Employee & Manager)
- Protected routes and API endpoints

### Employee Features
- Check-in/Check-out functionality
- View personal attendance history
- View monthly attendance summary
- Dashboard with today's status and monthly statistics

### Manager Features
- View all employees' attendance records
- Filter attendance by date, employee, and status
- Export attendance data to Excel
- View attendance summaries and statistics
- Department-wise analytics
- Visual charts and graphs
- Dashboard with real-time statistics

### Technical Features
- RESTful API architecture
- Redux Toolkit for state management
- Responsive UI design
- Real-time data updates
- Excel export functionality
- Data visualization with charts

## Project Structure

```
project-mern-attendance/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── attendance.controller.js
│   │   └── dashboard.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   └── error.middleware.js
│   ├── models/
│   │   ├── User.model.js
│   │   └── Attendance.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── attendance.routes.js
│   │   └── dashboard.routes.js
│   ├── scripts/
│   │   └── seed.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   ├── Layout.css
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── EmployeeDashboard.jsx
│   │   │   ├── EmployeeHistory.jsx
│   │   │   ├── CheckInOut.jsx
│   │   │   ├── ManagerDashboard.jsx
│   │   │   ├── ManagerAttendance.jsx
│   │   │   ├── ManagerSummary.jsx
│   │   │   ├── Auth.css
│   │   │   └── Dashboard.css
│   │   ├── store/
│   │   │   ├── slices/
│   │   │   │   ├── authSlice.js
│   │   │   │   ├── attendanceSlice.js
│   │   │   │   └── dashboardSlice.js
│   │   │   └── store.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB instance)
- Git

## Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
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

5. Replace the MongoDB URI with your actual MongoDB Atlas connection string or local MongoDB URI.

6. Start the backend server:
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory (optional):
```env
VITE_API_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Seed Database (Optional)

To populate the database with sample data:

```bash
cd backend
npm run seed
```

This will create:
- 1 Manager user (email: manager@example.com, password: manager123)
- 4 Employee users (password: employee123)
- Sample attendance records for the last 7 days

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Attendance (Employee)
- `POST /api/attendance/checkin` - Check in (Protected)
- `POST /api/attendance/checkout` - Check out (Protected)
- `GET /api/attendance/my-history` - Get my attendance history (Protected)
- `GET /api/attendance/my-summary` - Get my attendance summary (Protected)
- `GET /api/attendance/today-status` - Get today's attendance status (Protected)

### Attendance (Manager)
- `GET /api/attendance/all` - Get all attendance records (Protected, Manager only)
- `GET /api/attendance/employee/:id` - Get employee attendance by ID (Protected, Manager only)
- `GET /api/attendance/summary` - Get attendance summary (Protected, Manager only)
- `GET /api/attendance/export` - Export attendance to Excel (Protected, Manager only)
- `GET /api/attendance/today` - Get today's attendance (Protected, Manager only)

### Dashboard
- `GET /api/dashboard/employee` - Get employee dashboard data (Protected)
- `GET /api/dashboard/manager` - Get manager dashboard data (Protected, Manager only)

## Default Credentials

After running the seed script:

**Manager:**
- Email: manager@example.com
- Password: manager123

**Employees:**
- Email: john@example.com, jane@example.com, mike@example.com, sarah@example.com
- Password: employee123

## Deployment

### Backend Deployment (Heroku)

1. Install Heroku CLI and login:
```bash
heroku login
```

2. Create a Heroku app:
```bash
cd backend
heroku create your-app-name
```

3. Set environment variables:
```bash
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set NODE_ENV=production
heroku config:set FRONTEND_URL=https://your-frontend-url.com
```

4. Deploy:
```bash
git push heroku main
```

### Backend Deployment (Vercel/Netlify Functions)

For serverless deployment, you'll need to adapt the Express app to work with serverless functions. Consider using `serverless-http` package.

### Frontend Deployment (Vercel)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Navigate to frontend directory:
```bash
cd frontend
```

3. Create a `vercel.json` file:
```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

4. Deploy:
```bash
vercel
```

5. Set environment variable:
```bash
vercel env add VITE_API_URL
# Enter your backend API URL
```

### Frontend Deployment (Netlify)

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Build the frontend:
```bash
cd frontend
npm run build
```

3. Deploy:
```bash
netlify deploy --prod --dir=dist
```

4. Set environment variables in Netlify dashboard:
- `VITE_API_URL`: Your backend API URL

### MongoDB Atlas Setup

1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for all IPs - not recommended for production)
5. Get your connection string and update it in your `.env` file

### Environment Variables for Production

**Backend:**
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Strong random secret for JWT tokens
- `JWT_EXPIRE`: Token expiration time (e.g., "30d")
- `NODE_ENV`: Set to "production"
- `FRONTEND_URL`: Your frontend URL
- `PORT`: Server port (usually set automatically by hosting provider)

**Frontend:**
- `VITE_API_URL`: Your backend API URL

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- express-validator
- xlsx (for Excel export)
- cors
- dotenv

### Frontend
- React 18
- Redux Toolkit
- React Router DOM
- Axios
- Recharts (for data visualization)
- React Toastify (for notifications)
- date-fns (for date formatting)
- Vite (build tool)

## Development

### Running in Development Mode

1. Start backend server:
```bash
cd backend
npm run dev
```

2. Start frontend server (in a new terminal):
```bash
cd frontend
npm run dev
```

### Building for Production

**Backend:**
No build step required for Node.js/Express.

**Frontend:**
```bash
cd frontend
npm run build
```

The built files will be in the `frontend/dist` directory.

## Testing

You can test the API endpoints using:
- Postman
- Thunder Client (VS Code extension)
- curl commands
- The frontend application

## Security Considerations

1. **Change default JWT_SECRET** in production
2. **Use strong passwords** for database access
3. **Enable HTTPS** in production
4. **Limit CORS** to your frontend domain only
5. **Validate all inputs** on both client and server
6. **Use environment variables** for sensitive data
7. **Regular security updates** for dependencies

## Troubleshooting

### Backend Issues

**MongoDB Connection Error:**
- Verify your MongoDB URI is correct
- Check if your IP is whitelisted in MongoDB Atlas
- Ensure network connectivity

**JWT Token Errors:**
- Verify JWT_SECRET is set in .env
- Check token expiration settings

### Frontend Issues

**API Connection Errors:**
- Verify backend server is running
- Check VITE_API_URL is set correctly
- Verify CORS settings in backend

**Build Errors:**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version compatibility

## License

This project is open source and available under the MIT License.

## Contributing

Contributions, issues, and feature requests are welcome!

## Support

For support, please open an issue in the repository or contact the development team.

## Future Enhancements

- Email notifications for check-in/out
- GPS-based location tracking
- Face recognition for check-in
- Mobile app (React Native)
- Advanced reporting and analytics
- Leave management system
- Shift management
- Overtime calculation
- Integration with payroll systems
