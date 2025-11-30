const Attendance = require('../models/Attendance.model');
const User = require('../models/User.model');
const xlsx = require('xlsx');

// Helper function to get start and end of day
const getDayStartEnd = (date = new Date()) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

// @desc    Check in
// @route   POST /api/attendance/checkin
// @access  Private
exports.checkIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const { location, notes } = req.body;
    const { start, end } = getDayStartEnd();

    // Check if already checked in today
    const existingAttendance = await Attendance.findOne({
      user: userId,
      date: { $gte: start, $lte: end }
    });

    if (existingAttendance) {
      if (existingAttendance.checkIn.time && !existingAttendance.checkOut.time) {
        return res.status(400).json({
          success: false,
          message: 'You have already checked in today'
        });
      }
    }

    const attendanceData = {
      user: userId,
      date: new Date(),
      checkIn: {
        time: new Date(),
        location: location || req.ip,
        ipAddress: req.ip
      },
      notes: notes || ''
    };

    if (existingAttendance) {
      existingAttendance.checkIn = attendanceData.checkIn;
      existingAttendance.checkOut = {};
      existingAttendance.totalHours = 0;
      existingAttendance.status = 'present';
      await existingAttendance.save();
      
      return res.json({
        success: true,
        message: 'Checked in successfully',
        attendance: existingAttendance
      });
    }

    const attendance = await Attendance.create(attendanceData);

    res.status(201).json({
      success: true,
      message: 'Checked in successfully',
      attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Check out
// @route   POST /api/attendance/checkout
// @access  Private
exports.checkOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const { location, notes } = req.body;
    const { start, end } = getDayStartEnd();

    const attendance = await Attendance.findOne({
      user: userId,
      date: { $gte: start, $lte: end }
    });

    if (!attendance || !attendance.checkIn.time) {
      return res.status(400).json({
        success: false,
        message: 'You have not checked in today'
      });
    }

    if (attendance.checkOut.time) {
      return res.status(400).json({
        success: false,
        message: 'You have already checked out today'
      });
    }

    attendance.checkOut = {
      time: new Date(),
      location: location || req.ip,
      ipAddress: req.ip
    };

    if (notes) {
      attendance.notes = notes;
    }

    await attendance.save();

    res.json({
      success: true,
      message: 'Checked out successfully',
      attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get my attendance history
// @route   GET /api/attendance/my-history
// @access  Private
exports.getMyHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const skip = (page - 1) * limit;

    const attendances = await Attendance.find({ user: userId })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email employeeId department');

    const total = await Attendance.countDocuments({ user: userId });

    res.json({
      success: true,
      count: attendances.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: attendances
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get my attendance summary
// @route   GET /api/attendance/my-summary
// @access  Private
exports.getMySummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;

    let query = { user: userId };
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    } else {
      // Default to current month
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      query.date = { $gte: start, $lte: end };
    }

    const attendances = await Attendance.find(query);
    
    const totalDays = attendances.length;
    const presentDays = attendances.filter(a => a.status === 'present' && a.checkOut.time).length;
    const totalHours = attendances.reduce((sum, a) => sum + (a.totalHours || 0), 0);
    const averageHours = totalDays > 0 ? parseFloat((totalHours / totalDays).toFixed(2)) : 0;

    res.json({
      success: true,
      summary: {
        totalDays,
        presentDays,
        absentDays: totalDays - presentDays,
        totalHours,
        averageHours
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get today's attendance status
// @route   GET /api/attendance/today-status
// @access  Private
exports.getTodayStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { start, end } = getDayStartEnd();

    const attendance = await Attendance.findOne({
      user: userId,
      date: { $gte: start, $lte: end }
    }).populate('user', 'name email employeeId');

    if (!attendance) {
      return res.json({
        success: true,
        checkedIn: false,
        checkedOut: false,
        attendance: null
      });
    }

    res.json({
      success: true,
      checkedIn: !!attendance.checkIn.time,
      checkedOut: !!attendance.checkOut.time,
      attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all attendance records (Manager only)
// @route   GET /api/attendance/all
// @access  Private/Manager
exports.getAllAttendance = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const skip = (page - 1) * limit;
    const { startDate, endDate, userId, status } = req.query;

    let query = {};
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    if (userId) {
      query.user = userId;
    }

    if (status) {
      query.status = status;
    }

    const attendances = await Attendance.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email employeeId department position');

    const total = await Attendance.countDocuments(query);

    res.json({
      success: true,
      count: attendances.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: attendances
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get employee attendance by ID (Manager only)
// @route   GET /api/attendance/employee/:id
// @access  Private/Manager
exports.getEmployeeAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const skip = (page - 1) * limit;
    const { startDate, endDate } = req.query;

    let query = { user: id };
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const attendances = await Attendance.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email employeeId department position');

    const total = await Attendance.countDocuments(query);

    res.json({
      success: true,
      count: attendances.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: attendances
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get attendance summary (Manager only)
// @route   GET /api/attendance/summary
// @access  Private/Manager
exports.getAttendanceSummary = async (req, res) => {
  try {
    const { startDate, endDate, userId } = req.query;

    let query = {};
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    if (userId) {
      query.user = userId;
    }

    const attendances = await Attendance.find(query).populate('user', 'name email employeeId department');

    const summary = {
      totalRecords: attendances.length,
      totalPresent: 0,
      totalAbsent: 0,
      totalLate: 0,
      totalHours: 0,
      averageHours: 0,
      byEmployee: {}
    };

    attendances.forEach(attendance => {
      if (attendance.status === 'present' && attendance.checkOut.time) {
        summary.totalPresent++;
      } else if (attendance.status === 'absent') {
        summary.totalAbsent++;
      } else if (attendance.status === 'late') {
        summary.totalLate++;
      }

      summary.totalHours += attendance.totalHours || 0;

      const empId = attendance.user._id.toString();
      if (!summary.byEmployee[empId]) {
        summary.byEmployee[empId] = {
          name: attendance.user.name,
          email: attendance.user.email,
          employeeId: attendance.user.employeeId,
          totalDays: 0,
          presentDays: 0,
          totalHours: 0
        };
      }

      summary.byEmployee[empId].totalDays++;
      if (attendance.status === 'present' && attendance.checkOut.time) {
        summary.byEmployee[empId].presentDays++;
      }
      summary.byEmployee[empId].totalHours += attendance.totalHours || 0;
    });

    summary.averageHours = summary.totalRecords > 0 
      ? parseFloat((summary.totalHours / summary.totalRecords).toFixed(2)) 
      : 0;

    // Convert byEmployee object to array
    summary.byEmployee = Object.values(summary.byEmployee).map(emp => ({
      ...emp,
      averageHours: emp.totalDays > 0 ? parseFloat((emp.totalHours / emp.totalDays).toFixed(2)) : 0
    }));

    res.json({
      success: true,
      summary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Export attendance to Excel (Manager only)
// @route   GET /api/attendance/export
// @access  Private/Manager
exports.exportAttendance = async (req, res) => {
  try {
    const { startDate, endDate, userId } = req.query;

    let query = {};
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    if (userId) {
      query.user = userId;
    }

    const attendances = await Attendance.find(query)
      .sort({ date: -1 })
      .populate('user', 'name email employeeId department position');

    const data = attendances.map(att => ({
      'Employee Name': att.user.name,
      'Employee ID': att.user.employeeId || '',
      'Email': att.user.email,
      'Department': att.user.department || '',
      'Position': att.user.position || '',
      'Date': new Date(att.date).toLocaleDateString(),
      'Check In': att.checkIn.time ? new Date(att.checkIn.time).toLocaleString() : 'N/A',
      'Check Out': att.checkOut.time ? new Date(att.checkOut.time).toLocaleString() : 'N/A',
      'Total Hours': att.totalHours || 0,
      'Status': att.status,
      'Notes': att.notes || ''
    }));

    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Attendance');

    const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=attendance_${Date.now()}.xlsx`);
    
    res.send(buffer);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get today's attendance for all employees (Manager only)
// @route   GET /api/attendance/today
// @access  Private/Manager
exports.getTodayAttendance = async (req, res) => {
  try {
    const { start, end } = getDayStartEnd();

    const attendances = await Attendance.find({
      date: { $gte: start, $lte: end }
    })
      .populate('user', 'name email employeeId department position')
      .sort({ 'checkIn.time': -1 });

    res.json({
      success: true,
      count: attendances.length,
      date: new Date().toISOString().split('T')[0],
      data: attendances
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
