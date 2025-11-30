const express = require('express');
const { employeeStats, managerStats } = require('../controllers/dashboardController');
const { protect, managerOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/employee', protect, employeeStats);
router.get('/manager', protect, managerOnly, managerStats);

module.exports = router;
