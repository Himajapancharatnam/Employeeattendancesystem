# Network Error Fix

## Problem
Getting "Network Error" when trying to register/login from the frontend.

## Root Cause
The axios instance was configured to use `http://localhost:5000` directly, which can cause CORS issues or network errors in the browser.

## Solution
1. **Use Vite Proxy**: The `vite.config.js` already has a proxy configured that routes `/api/*` to `http://localhost:5000`
2. **Fixed Axios Configuration**: Updated axios to use empty baseURL in development so it uses the Vite proxy
3. **Updated Error Handling**: Better error messages for network issues

## Changes Made

### frontend/src/api/axios.js
- Changed baseURL to use Vite proxy in development
- Added better error handling for network errors
- Increased timeout to 30 seconds

## How It Works Now

**Development:**
- Frontend makes request to: `/api/auth/register`
- Vite proxy intercepts `/api/*` and forwards to: `http://localhost:5000/api/auth/register`
- No CORS issues because proxy handles it

**Production:**
- Set `VITE_API_URL` environment variable to your production backend URL
- Axios uses that URL directly

## Testing

1. **Check if backend is running:**
   ```powershell
   curl http://localhost:5000/api/health
   ```
   Should return: `{"message":"Server is running","status":"OK"}`

2. **Check if frontend can access:**
   - Open browser console (F12)
   - Try to register
   - Check Network tab for the request

3. **Verify proxy is working:**
   - In browser, go to: http://localhost:3000/api/health
   - Should show backend health check response

## If Still Having Issues

1. **Restart both servers:**
   - Backend: `cd backend && npm run dev`
   - Frontend: `cd frontend && npm run dev`

2. **Clear browser cache:**
   - Hard refresh: Ctrl+F5
   - Or clear browser cache

3. **Check browser console:**
   - Open F12
   - Look for error messages in Console tab
   - Check Network tab for failed requests

4. **Verify ports:**
   - Backend should be on: http://localhost:5000
   - Frontend should be on: http://localhost:3000

5. **Check firewall:**
   - Make sure firewall isn't blocking localhost connections
