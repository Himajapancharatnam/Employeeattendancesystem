import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getMe } from './store/slices/authSlice'
import ProtectedRoute from './components/ProtectedRoute'

// Pages
import Login from './pages/Login'
import Register from './pages/Register'
import EmployeeDashboard from './pages/EmployeeDashboard'
import EmployeeHistory from './pages/EmployeeHistory'
import CheckInOut from './pages/CheckInOut'
import ManagerDashboard from './pages/ManagerDashboard'
import ManagerAttendance from './pages/ManagerAttendance'
import ManagerSummary from './pages/ManagerSummary'

function App() {
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)

  useEffect(() => {
    if (token) {
      dispatch(getMe())
    }
  }, [dispatch, token])

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route
        path="/employee/dashboard"
        element={
          <ProtectedRoute>
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/checkin"
        element={
          <ProtectedRoute>
            <CheckInOut />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/history"
        element={
          <ProtectedRoute>
            <EmployeeHistory />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/manager/dashboard"
        element={
          <ProtectedRoute requireRole="manager">
            <ManagerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/attendance"
        element={
          <ProtectedRoute requireRole="manager">
            <ManagerAttendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/summary"
        element={
          <ProtectedRoute requireRole="manager">
            <ManagerSummary />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Navigate to="/employee/dashboard" replace />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
