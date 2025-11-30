# Registration Error Debugging Guide

## Common Registration Errors and Solutions

### 1. Validation Errors
- **Error**: "Name is required", "Please provide a valid email", "Password must be at least 6 characters"
- **Solution**: Fill all required fields correctly

### 2. Email Already Exists
- **Error**: "User already exists with this email"
- **Solution**: Use a different email address or login instead

### 3. Network Error
- **Error**: "Network error" or "Failed to fetch"
- **Solution**: 
  - Check if backend server is running on port 5000
  - Visit http://localhost:5000/api/health to verify backend is running
  - Check browser console (F12) for CORS errors

### 4. MongoDB Connection Error
- **Error**: Backend server crashes or shows connection error
- **Solution**:
  - Check `.env` file has correct MongoDB URI
  - Verify MongoDB Atlas IP whitelist includes your current IP
  - Check backend terminal for MongoDB connection errors

### 5. CORS Error
- **Error**: "Access-Control-Allow-Origin" error in browser console
- **Solution**:
  - Check `FRONTEND_URL` in backend `.env` matches your frontend URL
  - Backend should allow http://localhost:3000

## How to Debug

1. **Check Browser Console (F12)**
   - Look for error messages in Console tab
   - Check Network tab for failed requests

2. **Check Backend Terminal**
   - Look for error messages when registration fails
   - Check if MongoDB connection is successful

3. **Test Backend Directly**
   ```powershell
   $body = @{name='Test User';email='test@example.com';password='test123'} | ConvertTo-Json
   Invoke-WebRequest -Uri 'http://localhost:5000/api/auth/register' -Method POST -Body $body -ContentType 'application/json'
   ```

4. **Check Required Fields**
   - Name (required)
   - Email (required, must be valid email format)
   - Password (required, minimum 6 characters)
   - Confirm Password (must match password)

## Quick Fixes

1. **Clear browser cache and reload** (Ctrl+F5)
2. **Restart both servers**:
   - Backend: `cd backend && npm run dev`
   - Frontend: `cd frontend && npm run dev`
3. **Check .env file** in backend directory has correct values
4. **Verify MongoDB connection** is working

If issues persist, check the specific error message you're seeing and refer to the solutions above.
