const express = require('express');
const ctrl = require('../controllers/attendanceController');
const { protect, managerOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// Employee
router.post('/checkin', protect, ctrl.checkIn);
router.post('/checkout', protect, ctrl.checkOut);
router.get('/my-history', protect, ctrl.myHistory);
router.get('/my-summary', protect, ctrl.mySummary);
router.get('/today', protect, ctrl.todayStatus);

// Manager
router.get('/all', protect, managerOnly, ctrl.allEmployees);
router.get('/employee/:id', protect, managerOnly, ctrl.employeeById);
router.get('/summary', protect, managerOnly, ctrl.teamSummary);
router.get('/export', protect, managerOnly, ctrl.exportCSV);
router.get('/today-status', protect, managerOnly, ctrl.todayTeamStatus);

module.exports = router;
