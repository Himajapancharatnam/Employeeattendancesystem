import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllAttendance, exportAttendance } from '../store/slices/attendanceSlice'
import { toast } from 'react-toastify'
import Layout from '../components/Layout'
import { format } from 'date-fns'

const ManagerAttendance = () => {
  const dispatch = useDispatch()
  const { allAttendance } = useSelector((state) => state.attendance)
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: ''
  })
  const [page, setPage] = useState(1)

  useEffect(() => {
    dispatch(getAllAttendance({ ...filters, page, limit: 50 }))
  }, [dispatch, filters, page])

  const handleExport = async () => {
    try {
      const blob = await dispatch(exportAttendance(filters)).unwrap()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `attendance_${Date.now()}.xlsx`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      toast.success('Attendance exported successfully!')
    } catch (error) {
      toast.error(error)
    }
  }

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    })
    setPage(1)
  }

  return (
    <Layout>
      <div className="container">
        <h1>All Attendance Records</h1>
        
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
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={filters.status} onChange={handleFilterChange}>
                <option value="">All</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
              </select>
            </div>
            <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button onClick={handleExport} className="btn btn-success">
                Export to Excel
              </button>
            </div>
          </div>
        </div>

        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Total Hours</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {allAttendance.length > 0 ? (
                allAttendance.map((att) => (
                  <tr key={att._id}>
                    <td>{att.user?.name}</td>
                    <td>{att.user?.department || 'N/A'}</td>
                    <td>{format(new Date(att.date), 'MMM dd, yyyy')}</td>
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
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center' }}>No attendance records found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  )
}

export default ManagerAttendance
