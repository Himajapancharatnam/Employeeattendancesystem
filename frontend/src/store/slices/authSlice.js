import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../api/axios'

// Async thunks
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/auth/register', userData)
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token)
      }
      return response.data
    } catch (error) {
      console.error('Registration error:', error)
      
      // Handle validation errors from express-validator
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        const errorMessages = error.response.data.errors.map(err => err.msg || err.message || JSON.stringify(err)).join(', ')
        return rejectWithValue(errorMessages || 'Validation failed')
      }
      
      // Handle MongoDB errors
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message)
      }
      
      // Handle network errors
      if (error.message && error.code === 'ERR_NETWORK') {
        return rejectWithValue('Network error. Please check if the backend server is running.')
      }
      
      // Handle other errors
      return rejectWithValue(
        error.message || 'Registration failed. Please try again.'
      )
    }
  }
)

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      console.log('Login attempt:', { email: credentials.email })
      const response = await axios.post('/api/auth/login', credentials)
      console.log('Login success:', response.data)
      
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token)
      }
      
      if (!response.data || !response.data.user) {
        return rejectWithValue('Login failed: Invalid response from server')
      }
      
      return response.data
    } catch (error) {
      console.error('Login error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        code: error.code
      })
      
      // Handle validation errors
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        const errorMessages = error.response.data.errors.map(err => err.msg || err.message).join(', ')
        return rejectWithValue(errorMessages || 'Validation failed')
      }
      
      // Handle specific error messages from backend
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message)
      }
      
      // Handle network errors
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        return rejectWithValue('Network error. Please check if the backend server is running.')
      }
      
      // Handle other errors
      return rejectWithValue(
        error.message || 'Login failed. Please check your credentials and try again.'
      )
    }
  }
)

export const getMe = createAsyncThunk(
  'auth/getMe',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        return rejectWithValue('No token found')
      }
      const response = await axios.get('/api/auth/me')
      return response.data
    } catch (error) {
      localStorage.removeItem('token')
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get user info'
      )
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: false,
    loading: false,
    error: null
  },
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('token')
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Get Me
      .addCase(getMe.pending, (state) => {
        state.loading = true
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.isAuthenticated = true
      })
      .addCase(getMe.rejected, (state, action) => {
        state.loading = false
        state.isAuthenticated = false
      })
  }
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
