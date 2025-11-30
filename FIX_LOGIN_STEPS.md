# Fix Login Steps - Invalid Credentials Issue

## ✅ Confirmed Working:
- Backend login API works correctly
- Credentials are correct: `manager@example.com` / `manager123`
- Proxy connection works

## Steps to Fix:

### 1. Check Your Browser Console
- Press **F12** to open Developer Tools
- Go to **Console** tab
- Try logging in again
- Look for any error messages or red text

### 2. Clear Browser Cache
- Press **Ctrl + Shift + Delete**
- Clear cache and cookies
- Or try in **Incognito/Private window**

### 3. Verify Credentials (Copy-Paste These)
- **Email:** `manager@example.com`
- **Password:** `manager123`

Make sure there are:
- No extra spaces before/after
- No typos
- Email is lowercase

### 4. Check Network Tab
- Press **F12** → **Network** tab
- Try logging in
- Find `/api/auth/login` request
- Check:
  - Status code (should be 200)
  - Request payload (check email/password)
  - Response (should have token)

### 5. Restart Frontend Server
If still not working, restart:
```powershell
# Stop frontend (Ctrl+C in that terminal)
# Then restart:
cd frontend
npm run dev
```

## Test Credentials (Verified Working):

```
Email:    manager@example.com
Password: manager123
```

## What to Look For in Console:

After login attempt, you should see:
- `Login attempt: { email: "manager@example.com" }`
- `Login success: { success: true, token: "...", user: {...} }`

If you see errors, copy them and let me know what they say.

## Quick Test:

1. Open: http://localhost:3000/login
2. Open console (F12)
3. Enter credentials exactly as shown above
4. Click Login
5. Check console messages

The login should work - if it doesn't, the console will show exactly what's wrong!
