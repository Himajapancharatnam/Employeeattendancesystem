import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../api/axios'

export const getEmployeeDashboard = createAsyncThunk(
  'dashboard/getEmployeeDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/dashboard/employee')
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch dashboard data'
      )
    }
  }
)

export const getManagerDashboard = createAsyncThunk(
  'dashboard/getManagerDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/dashboard/manager')
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch dashboard data'
      )
    }
  }
)

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    employeeData: null,
    managerData: null,
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
      .addCase(getEmployeeDashboard.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getEmployeeDashboard.fulfilled, (state, action) => {
        state.loading = false
        state.employeeData = action.payload.data
      })
      .addCase(getEmployeeDashboard.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(getManagerDashboard.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getManagerDashboard.fulfilled, (state, action) => {
        state.loading = false
        state.managerData = action.payload.data
      })
      .addCase(getManagerDashboard.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { clearError } = dashboardSlice.actions
export default dashboardSlice.reducer
