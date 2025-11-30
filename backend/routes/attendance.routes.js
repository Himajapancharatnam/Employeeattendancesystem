const express = require('express');
const router = express.Router();
const {
  checkIn,
  checkOut,
  getMyHistory,
  getMySummary,
  getTodayStatus,
  getAllAttendance,
  getEmployeeAttendance,
  getAttendanceSummary,
  exportAttendance,
  getTodayAttendance
} = require('../controllers/attendance.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// Employee routes
router.post('/checkin', protect, checkIn);
router.post('/checkout', protect, checkOut);
router.get('/my-history', protect, getMyHistory);
router.get('/my-summary', protect, getMySummary);
router.get('/today-status', protect, getTodayStatus);

// Manager routes
router.get('/all', protect, authorize('manager'), getAllAttendance);
router.get('/employee/:id', protect, authorize('manager'), getEmployeeAttendance);
router.get('/summary', protect, authorize('manager'), getAttendanceSummary);
router.get('/export', protect, authorize('manager'), exportAttendance);
router.get('/today', protect, authorize('manager'), getTodayAttendance);

module.exports = router;
