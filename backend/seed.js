require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./src/config/db');
const User = require('./src/models/User');
const Attendance = require('./src/models/Attendance');

(async () => {
  await connectDB();
  try {
    // ❌ Removed dropDatabase() — not allowed in MongoDB Atlas (no admin permission)
    console.log('⚙️ Seeding sample data without dropping database...');

    // Optional: Clear collections manually (safe alternative)
    await User.deleteMany({});
    await Attendance.deleteMany({});

    // Create manager + employees
    const manager = await User.create({
      name: 'Manager One',
      email: 'manager@example.com',
      password: 'Password@123',
      role: 'manager',
      employeeId: 'MGR001',
      department: 'HR'
    });

    const emp1 = await User.create({
      name: 'Alice Employee',
      email: 'alice@example.com',
      password: 'Password@123',
      role: 'employee',
      employeeId: 'EMP001',
      department: 'Engineering'
    });

    const emp2 = await User.create({
      name: 'Bob Employee',
      email: 'bob@example.com',
      password: 'Password@123',
      role: 'employee',
      employeeId: 'EMP002',
      department: 'Sales'
    });

    // Sample attendance last 7 days for emp1/emp2
    const today = new Date(); 
    today.setHours(0,0,0,0);
    const docs = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(today); 
      d.setDate(today.getDate() - i);
      const inTime = new Date(d); 
      inTime.setHours(9 + (i % 3), 5, 0, 0); // sometimes late
      const outTime = new Date(d); 
      outTime.setHours(17, 0, 0, 0);
      const hours = (outTime - inTime) / (1000 * 60 * 60);
      const status = inTime.getHours() >= 10 ? 'late' : 'present';
      docs.push({ user: emp1._id, date: d, checkInTime: inTime, checkOutTime: outTime, totalHours: hours, status });
      docs.push({ user: emp2._id, date: d, checkInTime: inTime, checkOutTime: outTime, totalHours: hours, status });
    }
    await Attendance.insertMany(docs);

    console.log('✅ Seeded users and attendance successfully.');

    console.log('\nLogin creds:');
    console.log('Manager -> manager@example.com / Password@123');
    console.log('Employee -> alice@example.com / Password@123');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
})();
