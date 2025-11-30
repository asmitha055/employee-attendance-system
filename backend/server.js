require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./src/config/db');

const authRoutes = require('./src/routes/authRoutes');
const attendanceRoutes = require('./src/routes/attendanceRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');

// Connect DB
connectDB();

const app = express();
app.use(express.json());
app.use(morgan('dev'));

// CORS
const origins = (process.env.CORS_ORIGINS || '*').split(',').map(o => o.trim());
app.use(cors({ origin: (origin, cb) => cb(null, true), credentials: true }));

app.get('/', (req, res) => res.send('Attendance API is running'));

app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 404
app.use((req, res, next) => res.status(404).json({ message: 'Route not found' }));

// Error handler
app.use((err, req, res, next) => {
  console.error('ERROR:', err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
