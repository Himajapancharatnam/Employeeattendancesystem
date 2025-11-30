import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../store/slices/authSlice'
import './Layout.css'

const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand">
            Attendance System
          </Link>
          <div className="navbar-menu">
            {user?.role === 'manager' ? (
              <>
                <Link to="/manager/dashboard" className="nav-link">Dashboard</Link>
                <Link to="/manager/attendance" className="nav-link">All Attendance</Link>
                <Link to="/manager/summary" className="nav-link">Summary</Link>
              </>
            ) : (
              <>
                <Link to="/employee/dashboard" className="nav-link">Dashboard</Link>
                <Link to="/employee/checkin" className="nav-link">Check In/Out</Link>
                <Link to="/employee/history" className="nav-link">My History</Link>
              </>
            )}
            <div className="navbar-user">
              <span>{user?.name}</span>
              <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
            </div>
          </div>
        </div>
      </nav>
      <main className="main-content">{children}</main>
    </div>
  )
}

export default Layout
