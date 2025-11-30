import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAttendanceSummary } from '../store/slices/attendanceSlice'
import Layout from '../components/Layout'

const ManagerSummary = () => {
  const dispatch = useDispatch()
  const { summary } = useSelector((state) => state.attendance)
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: ''
  })

  useEffect(() => {
    dispatch(getAttendanceSummary(filters))
  }, [dispatch, filters])

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    })
  }

  return (
    <Layout>
      <div className="container">
        <h1>Attendance Summary</h1>
        
        <div className="card" style={{ marginBottom: '20px' }}>
          <h3>Filters</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
              />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
              />
            </div>
          </div>
        </div>

        {summary && (
          <>
            <div className="dashboard-grid">
              <div className="card">
                <h3>Overall Statistics</h3>
                <p>Total Records: {summary.totalRecords}</p>
                <p>Total Present: {summary.totalPresent}</p>
                <p>Total Absent: {summary.totalAbsent}</p>
                <p>Total Late: {summary.totalLate}</p>
                <p>Total Hours: {summary.totalHours}</p>
                <p>Average Hours: {summary.averageHours}</p>
              </div>
            </div>

            {summary.byEmployee && summary.byEmployee.length > 0 && (
              <div className="card">
                <h3>By Employee</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Employee Name</th>
                      <th>Email</th>
                      <th>Employee ID</th>
                      <th>Total Days</th>
                      <th>Present Days</th>
                      <th>Total Hours</th>
                      <th>Average Hours</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.byEmployee.map((emp, idx) => (
                      <tr key={idx}>
                        <td>{emp.name}</td>
                        <td>{emp.email}</td>
                        <td>{emp.employeeId || 'N/A'}</td>
                        <td>{emp.totalDays}</td>
                        <td>{emp.presentDays}</td>
                        <td>{emp.totalHours.toFixed(2)}</td>
                        <td>{emp.averageHours.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  )
}

export default ManagerSummary
