# How to Register and Login as Manager

## Option 1: Register a New Manager Account (Recommended)

### Steps:

1. **Go to Registration Page:**
   - Open your browser
   - Navigate to: **http://localhost:3000/register**

2. **Fill in the Registration Form:**
   - **Name**: Enter your name (e.g., "Admin Manager")
   - **Email**: Enter a unique email (e.g., "admin@company.com")
   - **Password**: Enter a password (minimum 6 characters)
   - **Confirm Password**: Re-enter the same password
   - **Role**: **Select "Manager"** from the dropdown (important!)
   - **Employee ID**: Leave blank or enter an ID (optional)
   - **Department**: Enter department name (optional)
   - **Position**: Enter position (optional)

3. **Click "Register" Button**

4. **After Registration:**
   - You'll be automatically logged in
   - You'll be redirected to the Manager Dashboard

## Option 2: Use Pre-Created Manager Account

If you ran the seed script, you can login with:

**Email:** `manager@example.com`  
**Password:** `manager123`

### Steps to Login:

1. **Go to Login Page:**
   - Navigate to: **http://localhost:3000/login**

2. **Enter Credentials:**
   - Email: `manager@example.com`
   - Password: `manager123`

3. **Click "Login"**

4. **After Login:**
   - You'll be redirected to `/manager/dashboard`
   - You'll see the Manager Dashboard with statistics and charts

## Important Notes:

✅ **Role Selection**: Make sure to select "Manager" in the role dropdown when registering

✅ **Employee ID**: You can leave it blank when registering a manager (optional field)

✅ **Duplicate Key Error**: This has been fixed! Empty employeeId will not cause errors anymore.

## Manager Features Available After Login:

1. **Manager Dashboard** (`/manager/dashboard`)
   - View today's attendance overview
   - Monthly statistics
   - Attendance trend charts
   - Department-wise statistics

2. **All Attendance Records** (`/manager/attendance`)
   - View all employees' attendance
   - Filter by date, employee, status
   - Export to Excel

3. **Attendance Summary** (`/manager/summary`)
   - Overall statistics
   - Statistics by employee
   - Filter by date range

## Troubleshooting:

**If registration fails:**
- Check browser console (F12) for error messages
- Make sure backend server is running on port 5000
- Make sure all required fields are filled correctly

**If login fails:**
- Verify email and password are correct
- Check if account exists in database
- Check browser console for errors

## Quick Test:

**Register New Manager:**
1. Go to: http://localhost:3000/register
2. Fill form with Role = "Manager"
3. Click Register

**Or Login with Existing:**
1. Go to: http://localhost:3000/login
2. Email: manager@example.com
3. Password: manager123
