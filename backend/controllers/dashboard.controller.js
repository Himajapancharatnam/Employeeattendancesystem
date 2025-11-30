const Attendance = require('../models/Attendance.model');
const User = require('../models/User.model');

// Helper function to get start and end of day
const getDayStartEnd = (date = new Date()) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

// @desc    Get employee dashboard data
// @route   GET /api/dashboard/employee
// @access  Private
exports.getEmployeeDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    
    // Today's attendance
    const { start, end } = getDayStartEnd();
    const todayAttendance = await Attendance.findOne({
      user: userId,
      date: { $gte: start, $lte: end }
    });

    // Current month stats
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    
    const monthAttendances = await Attendance.find({
      user: userId,
      date: { $gte: monthStart, $lte: monthEnd }
    });

    const monthStats = {
      totalDays: monthAttendances.length,
      presentDays: monthAttendances.filter(a => a.status === 'present' && a.checkOut.time).length,
      totalHours: monthAttendances.reduce((sum, a) => sum + (a.totalHours || 0), 0),
      averageHours: 0
    };

    monthStats.averageHours = monthStats.totalDays > 0 
      ? parseFloat((monthStats.totalHours / monthStats.totalDays).toFixed(2)) 
      : 0;

    // Recent attendance (last 7 days)
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 7);
    const recentAttendances = await Attendance.find({
      user: userId,
      date: { $gte: weekStart, $lte: end }
    })
      .sort({ date: -1 })
      .limit(7);

    res.json({
      success: true,
      data: {
        today: {
          checkedIn: !!todayAttendance?.checkIn.time,
          checkedOut: !!todayAttendance?.checkOut.time,
          checkInTime: todayAttendance?.checkIn.time || null,
          checkOutTime: todayAttendance?.checkOut.time || null,
          totalHours: todayAttendance?.totalHours || 0,
          status: todayAttendance?.status || null
        },
        month: monthStats,
        recent: recentAttendances
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get manager dashboard data
// @route   GET /api/dashboard/manager
// @access  Private/Manager
exports.getManagerDashboard = async (req, res) => {
  try {
    const now = new Date();
    
    // Today's stats
    const { start, end } = getDayStartEnd();
    const todayAttendances = await Attendance.find({
      date: { $gte: start, $lte: end }
    }).populate('user', 'name email employeeId department');

    const totalEmployees = await User.countDocuments({ role: 'employee', isActive: true });
    const checkedInToday = todayAttendances.filter(a => a.checkIn.time).length;
    const checkedOutToday = todayAttendances.filter(a => a.checkOut.time).length;

    // Current month stats
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    
    const monthAttendances = await Attendance.find({
      date: { $gte: monthStart, $lte: monthEnd }
    }).populate('user', 'name email employeeId department');

    const monthStats = {
      totalRecords: monthAttendances.length,
      totalPresent: monthAttendances.filter(a => a.status === 'present' && a.checkOut.time).length,
      totalAbsent: monthAttendances.filter(a => a.status === 'absent').length,
      totalHours: monthAttendances.reduce((sum, a) => sum + (a.totalHours || 0), 0),
      averageHours: 0
    };

    monthStats.averageHours = monthStats.totalRecords > 0 
      ? parseFloat((monthStats.totalHours / monthStats.totalRecords).toFixed(2)) 
      : 0;

    // Attendance by day (last 7 days) for chart
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 7);
    weekStart.setHours(0, 0, 0, 0);
    
    const dailyStats = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);

      const dayAttendances = await Attendance.find({
        date: { $gte: dayStart, $lte: dayEnd }
      });

      dailyStats.push({
        date: date.toISOString().split('T')[0],
        present: dayAttendances.filter(a => a.status === 'present' && a.checkOut.time).length,
        absent: dayAttendances.filter(a => a.status === 'absent').length,
        total: dayAttendances.length
      });
    }

    // Department-wise stats
    const departments = await User.distinct('department', { role: 'employee', isActive: true });
    const departmentStats = await Promise.all(
      departments.map(async (dept) => {
        if (!dept) return null;
        const deptUsers = await User.find({ department: dept, role: 'employee', isActive: true });
        const deptUserIds = deptUsers.map(u => u._id);
        const deptAttendances = await Attendance.find({
          user: { $in: deptUserIds },
          date: { $gte: monthStart, $lte: monthEnd }
        });

        return {
          department: dept,
          totalEmployees: deptUsers.length,
          totalPresent: deptAttendances.filter(a => a.status === 'present' && a.checkOut.time).length,
          totalHours: deptAttendances.reduce((sum, a) => sum + (a.totalHours || 0), 0)
        };
      })
    );

    res.json({
      success: true,
      data: {
        today: {
          totalEmployees,
          checkedIn: checkedInToday,
          checkedOut: checkedOutToday,
          pending: totalEmployees - checkedInToday
        },
        month: monthStats,
        dailyStats,
        departmentStats: departmentStats.filter(d => d !== null),
        todayAttendances: todayAttendances.slice(0, 10) // Recent 10
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
