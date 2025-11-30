import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../api/axios'

// Async thunks
export const checkIn = createAsyncThunk(
  'attendance/checkIn',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/attendance/checkin', data)
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Check-in failed'
      )
    }
  }
)

export const checkOut = createAsyncThunk(
  'attendance/checkOut',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/attendance/checkout', data)
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Check-out failed'
      )
    }
  }
)

export const getMyHistory = createAsyncThunk(
  'attendance/getMyHistory',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/attendance/my-history', { params })
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch history'
      )
    }
  }
)

export const getMySummary = createAsyncThunk(
  'attendance/getMySummary',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/attendance/my-summary', { params })
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch summary'
      )
    }
  }
)

export const getTodayStatus = createAsyncThunk(
  'attendance/getTodayStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/attendance/today-status')
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch today status'
      )
    }
  }
)

export const getAllAttendance = createAsyncThunk(
  'attendance/getAllAttendance',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/attendance/all', { params })
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch attendance'
      )
    }
  }
)

export const getEmployeeAttendance = createAsyncThunk(
  'attendance/getEmployeeAttendance',
  async ({ id, params }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/attendance/employee/${id}`, { params })
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch employee attendance'
      )
    }
  }
)

export const getAttendanceSummary = createAsyncThunk(
  'attendance/getAttendanceSummary',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/attendance/summary', { params })
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch summary'
      )
    }
  }
)

export const exportAttendance = createAsyncThunk(
  'attendance/exportAttendance',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/attendance/export', {
        params,
        responseType: 'blob'
      })
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Export failed'
      )
    }
  }
)

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    todayStatus: null,
    history: [],
    summary: null,
    allAttendance: [],
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkIn.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(checkIn.fulfilled, (state, action) => {
        state.loading = false
        state.todayStatus = action.payload.attendance
      })
      .addCase(checkIn.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(checkOut.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(checkOut.fulfilled, (state, action) => {
        state.loading = false
        state.todayStatus = action.payload.attendance
      })
      .addCase(checkOut.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(getTodayStatus.fulfilled, (state, action) => {
        state.todayStatus = action.payload
      })
      .addCase(getMyHistory.fulfilled, (state, action) => {
        state.history = action.payload.data
      })
      .addCase(getMySummary.fulfilled, (state, action) => {
        state.summary = action.payload.summary
      })
      .addCase(getAllAttendance.fulfilled, (state, action) => {
        state.allAttendance = action.payload.data
      })
      .addCase(getAttendanceSummary.fulfilled, (state, action) => {
        state.summary = action.payload.summary
      })
  }
})

export const { clearError } = attendanceSlice.actions
export default attendanceSlice.reducer
