import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getEmployeeDashboard } from '../store/slices/dashboardSlice'
import { getTodayStatus } from '../store/slices/attendanceSlice'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { format } from 'date-fns'
import './Dashboard.css'

const EmployeeDashboard = () => {
  const dispatch = useDispatch()
  const { employeeData, loading } = useSelector((state) => state.dashboard)
  const { todayStatus } = useSelector((state) => state.attendance)

  useEffect(() => {
    dispatch(getEmployeeDashboard())
    dispatch(getTodayStatus())
  }, [dispatch])

  if (loading) {
    return (
      <Layout>
        <div className="loading">Loading...</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container">
        <h1>Employee Dashboard</h1>
        
        <div className="dashboard-grid">
          <div className="card">
            <h3>Today's Attendance</h3>
            {todayStatus?.checkedIn ? (
              <div>
                <p>Status: {todayStatus.checkedOut ? 'Checked Out' : 'Checked In'}</p>
                <p>Check In: {todayStatus.attendance?.checkIn?.time 
                  ? format(new Date(todayStatus.attendance.checkIn.time), 'PPpp')
                  : 'N/A'}
                </p>
                {todayStatus.checkedOut && (
                  <p>Check Out: {todayStatus.attendance?.checkOut?.time 
                    ? format(new Date(todayStatus.attendance.checkOut.time), 'PPpp')
                    : 'N/A'}
                  </p>
                )}
                <p>Total Hours: {todayStatus.attendance?.totalHours || 0}</p>
              </div>
            ) : (
              <div>
                <p>Not checked in today</p>
                <Link to="/employee/checkin" className="btn btn-primary">
                  Check In Now
                </Link>
              </div>
            )}
          </div>

          {employeeData?.month && (
            <>
              <div className="card">
                <h3>This Month</h3>
                <p>Total Days: {employeeData.month.totalDays}</p>
                <p>Present Days: {employeeData.month.presentDays}</p>
                <p>Total Hours: {employeeData.month.totalHours}</p>
                <p>Average Hours/Day: {employeeData.month.averageHours}</p>
              </div>

              <div className="card">
                <h3>Quick Actions</h3>
                <Link to="/employee/checkin" className="btn btn-primary" style={{ marginBottom: '10px', display: 'block' }}>
                  Check In/Out
                </Link>
                <Link to="/employee/history" className="btn btn-secondary" style={{ display: 'block' }}>
                  View History
                </Link>
              </div>
            </>
          )}

          {employeeData?.recent && employeeData.recent.length > 0 && (
            <div className="card">
              <h3>Recent Attendance</h3>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {employeeData.recent.map((att) => (
                    <tr key={att._id}>
                      <td>{format(new Date(att.date), 'MMM dd, yyyy')}</td>
                      <td>{att.checkIn?.time ? format(new Date(att.checkIn.time), 'HH:mm') : 'N/A'}</td>
                      <td>{att.checkOut?.time ? format(new Date(att.checkOut.time), 'HH:mm') : 'N/A'}</td>
                      <td>{att.totalHours || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default EmployeeDashboard
