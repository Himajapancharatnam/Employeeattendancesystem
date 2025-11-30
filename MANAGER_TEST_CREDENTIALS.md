# Manager Test Credentials

## Manager Account

After running the seed script, use these credentials to login as a manager:

**Email:** `manager@example.com`  
**Password:** `manager123`

## Manager Features Available:

### 1. Manager Dashboard
- View today's attendance overview
- See monthly statistics
- View attendance trends (charts)
- Department-wise statistics
- Today's attendance list

### 2. All Attendance Records
- View all employees' attendance
- Filter by date range
- Filter by employee
- Filter by status
- Export to Excel

### 3. Attendance Summary
- Overall statistics
- Statistics by employee
- Filter by date range

## How to Test Manager Features:

1. **Login as Manager:**
   - Go to: http://localhost:3000/login
   - Email: manager@example.com
   - Password: manager123

2. **After Login:**
   - You'll be redirected to `/manager/dashboard`
   - Access all manager features from the navigation

3. **Available Routes:**
   - Dashboard: `/manager/dashboard`
   - All Attendance: `/manager/attendance`
   - Summary: `/manager/summary`

## If Manager Account Doesn't Exist:

Run the seed script to create the manager account:

```powershell
cd backend
npm run seed
```

This will create:
- 1 Manager account
- 4 Employee accounts
- Sample attendance records for the last 7 days

## Employee Test Accounts (for reference):

- **john@example.com** / employee123
- **jane@example.com** / employee123
- **mike@example.com** / employee123
- **sarah@example.com** / employee123
