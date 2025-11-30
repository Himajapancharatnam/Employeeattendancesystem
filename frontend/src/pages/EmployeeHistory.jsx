import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getMyHistory } from '../store/slices/attendanceSlice'
import Layout from '../components/Layout'
import { format } from 'date-fns'

const EmployeeHistory = () => {
  const dispatch = useDispatch()
  const { history } = useSelector((state) => state.attendance)
  const [page, setPage] = useState(1)

  useEffect(() => {
    dispatch(getMyHistory({ page, limit: 30 }))
  }, [dispatch, page])

  return (
    <Layout>
      <div className="container">
        <h1>My Attendance History</h1>
        
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Total Hours</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.length > 0 ? (
                history.map((att) => (
                  <tr key={att._id}>
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
                  <td colSpan="5" style={{ textAlign: 'center' }}>No attendance records found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  )
}

export default EmployeeHistory
