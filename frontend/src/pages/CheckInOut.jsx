import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { checkIn, checkOut, getTodayStatus } from '../store/slices/attendanceSlice'
import { toast } from 'react-toastify'
import Layout from '../components/Layout'
import { format } from 'date-fns'

const CheckInOut = () => {
  const dispatch = useDispatch()
  const { todayStatus, loading } = useSelector((state) => state.attendance)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    dispatch(getTodayStatus())
  }, [dispatch])

  const handleCheckIn = async () => {
    try {
      await dispatch(checkIn({ notes })).unwrap()
      toast.success('Checked in successfully!')
      setNotes('')
      dispatch(getTodayStatus())
    } catch (error) {
      toast.error(error)
    }
  }

  const handleCheckOut = async () => {
    try {
      await dispatch(checkOut({ notes })).unwrap()
      toast.success('Checked out successfully!')
      setNotes('')
      dispatch(getTodayStatus())
    } catch (error) {
      toast.error(error)
    }
  }

  return (
    <Layout>
      <div className="container">
        <h1>Check In / Check Out</h1>
        
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2>Today: {format(new Date(), 'PP')}</h2>
          
          {todayStatus && (
            <div style={{ marginBottom: '20px' }}>
              {todayStatus.checkedIn ? (
                <div>
                  <p style={{ color: '#28a745', fontWeight: 'bold' }}>✓ Checked In</p>
                  <p>Check In Time: {todayStatus.attendance?.checkIn?.time 
                    ? format(new Date(todayStatus.attendance.checkIn.time), 'PPpp')
                    : 'N/A'}
                  </p>
                  {todayStatus.checkedOut ? (
                    <div>
                      <p style={{ color: '#dc3545', fontWeight: 'bold' }}>✓ Checked Out</p>
                      <p>Check Out Time: {todayStatus.attendance?.checkOut?.time 
                        ? format(new Date(todayStatus.attendance.checkOut.time), 'PPpp')
                        : 'N/A'}
                      </p>
                      <p>Total Hours: {todayStatus.attendance?.totalHours || 0}</p>
                    </div>
                  ) : (
                    <div>
                      <div className="form-group">
                        <label>Notes (Optional)</label>
                        <textarea
                          rows="3"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                        />
                      </div>
                      <button 
                        onClick={handleCheckOut} 
                        className="btn btn-danger"
                        disabled={loading}
                      >
                        {loading ? 'Processing...' : 'Check Out'}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <p>Not checked in yet</p>
                  <div className="form-group">
                    <label>Notes (Optional)</label>
                    <textarea
                      rows="3"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                    />
                  </div>
                  <button 
                    onClick={handleCheckIn} 
                    className="btn btn-success"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Check In'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default CheckInOut
