const Attendance = require('../models/Attendance');
const User = require('../models/User');

exports.employeeStats = async (req, res) => {
  try {
    const now = new Date();
    const s = new Date(now.getFullYear(), now.getMonth(), 1);
    const e = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23,59,59,999);
    const [recent, docs] = await Promise.all([
      Attendance.find({ user: req.user.id }).sort({ date: -1 }).limit(7),
      Attendance.find({ user: req.user.id, date: { $gte: s, $lte: e } })
    ]);
    const status = { present: 0, absent: 0, late: 0, 'half-day': 0 };
    let totalHours = 0;
    docs.forEach(d => { status[d.status] = (status[d.status] || 0)+1; totalHours += d.totalHours || 0; });
    const today = await Attendance.findOne({ user: req.user.id, date: new Date(new Date().setHours(0,0,0,0)) });
    res.json({ today: !!(today && today.checkInTime), status, totalHours, recent });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.managerStats = async (req, res) => {
  try {
    const totalEmployees = await User.countDocuments({ role: 'employee' });
    const s = new Date(); s.setHours(0,0,0,0);
    const e = new Date(); e.setHours(23,59,59,999);
    const todayDocs = await Attendance.find({ date: { $gte: s, $lte: e } });
    const present = todayDocs.filter(d => d.checkInTime).length;
    const late = todayDocs.filter(d => d.status === 'late').length;
    res.json({ totalEmployees, today: { present, late } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
