const Attendance = require('../models/Attendance');
const User = require('../models/User');
const { createObjectCsvStringifier } = require('csv-writer');

// Helper to normalize date to start of day (local)
function startOfDay(d=new Date()) {
  const dt = new Date(d);
  dt.setHours(0,0,0,0);
  return dt;
}

exports.checkIn = async (req, res) => {
  try {
    const today = startOfDay(new Date());
    const existing = await Attendance.findOne({ user: req.user.id, date: today });
    if (existing && existing.checkInTime) {
      return res.status(400).json({ message: 'Already checked in today' });
    }
    const now = new Date();
    const status = now.getHours() >= 10 ? 'late' : 'present'; // simple late rule: after 10:00 AM
    const attendance = await Attendance.findOneAndUpdate(
      { user: req.user.id, date: today },
      { $setOnInsert: { user: req.user.id, date: today }, $set: { checkInTime: now, status } },
      { upsert: true, new: true }
    );
    res.json({ message: 'Checked in', attendance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.checkOut = async (req, res) => {
  try {
    const today = startOfDay(new Date());
    const attendance = await Attendance.findOne({ user: req.user.id, date: today });
    if (!attendance || !attendance.checkInTime) return res.status(400).json({ message: 'Please check in first' });
    if (attendance.checkOutTime) return res.status(400).json({ message: 'Already checked out today' });

    const now = new Date();
    const hours = (now - attendance.checkInTime) / (1000 * 60 * 60);
    attendance.checkOutTime = now;
    attendance.totalHours = Math.round(hours * 100) / 100;
    attendance.status = attendance.totalHours < 4 ? 'half-day' : attendance.status;
    await attendance.save();

    res.json({ message: 'Checked out', attendance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.myHistory = async (req, res) => {
  try {
    const { page = 1, limit = 20, month, year } = req.query;
    const filter = { user: req.user.id };
    if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0, 23, 59, 59, 999);
      filter.date = { $gte: start, $lte: end };
    }
    const data = await Attendance.find(filter).sort({ date: -1 }).skip((page-1)*limit).limit(parseInt(limit));
    const count = await Attendance.countDocuments(filter);
    res.json({ data, page: Number(page), pages: Math.ceil(count / limit), total: count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.mySummary = async (req, res) => {
  try {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23,59,59,999);
    const docs = await Attendance.find({ user: req.user.id, date: { $gte: start, $lte: end } });
    const summary = { present: 0, absent: 0, late: 0, 'half-day': 0, totalHours: 0 };
    docs.forEach(d => {
      summary[d.status] = (summary[d.status] || 0) + 1;
      summary.totalHours += d.totalHours || 0;
    });
    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.todayStatus = async (req, res) => {
  try {
    const today = startOfDay(new Date());
    const doc = await Attendance.findOne({ user: req.user.id, date: today });
    res.json({ checkedIn: !!(doc && doc.checkInTime), checkedOut: !!(doc && doc.checkOutTime), attendance: doc });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Manager routes
exports.allEmployees = async (req, res) => {
  try {
    const { employee, date, status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (employee) filter.user = employee;
    if (date) {
      const d = new Date(date);
      const s = new Date(d); s.setHours(0,0,0,0);
      const e = new Date(d); e.setHours(23,59,59,999);
      filter.date = { $gte: s, $lte: e };
    }
    if (status) filter.status = status;
    const data = await Attendance.find(filter).populate('user', 'name email employeeId department role').sort({ date: -1 }).skip((page-1)*limit).limit(parseInt(limit));
    const count = await Attendance.countDocuments(filter);
    res.json({ data, page: Number(page), pages: Math.ceil(count / limit), total: count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.employeeById = async (req, res) => {
  try {
    const userId = req.params.id;
    const data = await Attendance.find({ user: userId }).sort({ date: -1 });
    res.json({ data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.teamSummary = async (req, res) => {
  try {
    const agg = await Attendance.aggregate([
      { $group: {
        _id: '$status',
        count: { $sum: 1 },
        hours: { $sum: '$totalHours' }
      }}
    ]);
    res.json(agg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.todayTeamStatus = async (req, res) => {
  try {
    const s = new Date(); s.setHours(0,0,0,0);
    const e = new Date(); e.setHours(23,59,59,999);
    const docs = await Attendance.find({ date: { $gte: s, $lte: e } }).populate('user', 'name employeeId department');
    const present = docs.filter(d => d.checkInTime).length;
    res.json({ present, absent: 0, late: docs.filter(d => d.status === 'late').length, docs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.exportCSV = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = {};
    if (startDate && endDate) {
      const s = new Date(startDate);
      const e = new Date(endDate);
      e.setHours(23,59,59,999);
      filter.date = { $gte: s, $lte: e };
    }
    const docs = await Attendance.find(filter).populate('user', 'name email employeeId department role');
    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'date', title: 'Date' },
        { id: 'employeeId', title: 'Employee ID' },
        { id: 'name', title: 'Name' },
        { id: 'department', title: 'Department' },
        { id: 'status', title: 'Status' },
        { id: 'checkIn', title: 'Check In' },
        { id: 'checkOut', title: 'Check Out' },
        { id: 'hours', title: 'Total Hours' },
      ]
    });
    const records = docs.map(d => ({
      date: d.date.toISOString().slice(0,10),
      employeeId: d.user.employeeId,
      name: d.user.name,
      department: d.user.department,
      status: d.status,
      checkIn: d.checkInTime ? d.checkInTime.toISOString() : '',
      checkOut: d.checkOutTime ? d.checkOutTime.toISOString() : '',
      hours: d.totalHours || 0
    }));
    const csv = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="attendance.csv"');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
