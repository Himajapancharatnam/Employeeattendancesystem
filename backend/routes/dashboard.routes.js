const express = require('express');
const router = express.Router();
const { getEmployeeDashboard, getManagerDashboard } = require('../controllers/dashboard.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/employee', protect, getEmployeeDashboard);
router.get('/manager', protect, authorize('manager'), getManagerDashboard);

module.exports = router;
