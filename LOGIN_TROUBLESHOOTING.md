# Login Troubleshooting

## ✅ Good News: Backend Login Works!

I tested the backend directly and the credentials work:
- Email: `manager@example.com`
- Password: `manager123`

## Possible Frontend Issues:

### 1. Check Browser Console
- Press F12 to open Developer Tools
- Go to Console tab
- Try logging in again
- Look for any error messages

### 2. Clear Browser Cache
- Press Ctrl + F5 (hard refresh)
- Or clear browser cache
- Or try in incognito/private window

### 3. Check Network Tab
- Press F12 → Network tab
- Try logging in
- Find the `/api/auth/login` request
- Check if it's successful (Status 200) or failed

### 4. Verify Both Servers Are Running
- Backend: http://localhost:5000/api/health (should show OK)
- Frontend: http://localhost:3000 (should load)

## Quick Test Steps:

1. **Open browser console** (F12)
2. **Go to:** http://localhost:3000/login
3. **Enter credentials:**
   - Email: manager@example.com
   - Password: manager123
4. **Click Login**
5. **Check console** for any errors

## Alternative: Test Direct API

You can test login directly via API:
```powershell
$body = @{email='manager@example.com';password='manager123'} | ConvertTo-Json
Invoke-WebRequest -Uri 'http://localhost:5000/api/auth/login' -Method POST -Body $body -ContentType 'application/json'
```

This should return a token if credentials are correct.

## What Error Are You Seeing?

Please share:
1. What exact error message appears?
2. What shows in browser console (F12)?
3. What happens when you click Login? (Nothing? Error popup? Redirect?)

The backend credentials are definitely correct, so we need to fix the frontend communication.
