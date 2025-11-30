import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getManagerDashboard } from '../store/slices/dashboardSlice'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import Layout from '../components/Layout'
import { format } from 'date-fns'
import './Dashboard.css'

const ManagerDashboard = () => {
  const dispatch = useDispatch()
  const { managerData, loading } = useSelector((state) => state.dashboard)

  useEffect(() => {
    dispatch(getManagerDashboard())
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
        <h1>Manager Dashboard</h1>
        
        <div className="dashboard-grid">
          {managerData?.today && (
            <>
              <div className="card">
                <h3>Today's Overview</h3>
                <p>Total Employees: {managerData.today.totalEmployees}</p>
                <p>Checked In: {managerData.today.checkedIn}</p>
                <p>Checked Out: {managerData.today.checkedOut}</p>
                <p>Pending: {managerData.today.pending}</p>
              </div>

              <div className="card">
                <h3>This Month</h3>
                <p>Total Records: {managerData.month.totalRecords}</p>
                <p>Present: {managerData.month.totalPresent}</p>
                <p>Absent: {managerData.month.totalAbsent}</p>
                <p>Total Hours: {managerData.month.totalHours}</p>
                <p>Average Hours: {managerData.month.averageHours}</p>
              </div>
            </>
          )}

          {managerData?.dailyStats && managerData.dailyStats.length > 0 && (
            <div className="card" style={{ gridColumn: '1 / -1' }}>
              <h3>Attendance Trend (Last 7 Days)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={managerData.dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="present" fill="#28a745" name="Present" />
                  <Bar dataKey="absent" fill="#dc3545" name="Absent" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {managerData?.departmentStats && managerData.departmentStats.length > 0 && (
            <div className="card" style={{ gridColumn: '1 / -1' }}>
              <h3>Department Statistics</h3>
              <table>
                <thead>
                  <tr>
                    <th>Department</th>
                    <th>Total Employees</th>
                    <th>Present Days</th>
                    <th>Total Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {managerData.departmentStats.map((dept, idx) => (
                    <tr key={idx}>
                      <td>{dept.department}</td>
                      <td>{dept.totalEmployees}</td>
                      <td>{dept.totalPresent}</td>
                      <td>{dept.totalHours.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {managerData?.todayAttendances && managerData.todayAttendances.length > 0 && (
            <div className="card" style={{ gridColumn: '1 / -1' }}>
              <h3>Today's Attendance</h3>
              <table>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Hours</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {managerData.todayAttendances.map((att) => (
                    <tr key={att._id}>
                      <td>{att.user?.name}</td>
                      <td>{att.user?.department || 'N/A'}</td>
                      <td>{att.checkIn?.time ? format(new Date(att.checkIn.time), 'HH:mm') : 'N/A'}</td>
                      <td>{att.checkOut?.time ? format(new Date(att.checkOut.time), 'HH:mm') : 'N/A'}</td>
                      <td>{att.totalHours || 0}</td>
                      <td>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          backgroundColor: att.status === 'present' ? '#d4edda' : '#f8d7da',
                          color: att.status === 'present' ? '#155724' : '#721c24'
                        }}>
                          {att.status}
                        </span>
                      </td>
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

export default ManagerDashboard
