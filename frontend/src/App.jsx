import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import EmpDashboard from './pages/employee/Dashboard'
import EmpHistory from './pages/employee/History'
import ManagerDashboard from './pages/manager/Dashboard'
import ManagerAttendance from './pages/manager/Attendance'
import Reports from './pages/manager/Reports'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <div>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/employee/dashboard" element={
            <ProtectedRoute role="employee"><EmpDashboard /></ProtectedRoute>
          }/>
          <Route path="/employee/history" element={
            <ProtectedRoute role="employee"><EmpHistory /></ProtectedRoute>
          }/>

          <Route path="/manager/dashboard" element={
            <ProtectedRoute role="manager"><ManagerDashboard /></ProtectedRoute>
          }/>
          <Route path="/manager/attendance" element={
            <ProtectedRoute role="manager"><ManagerAttendance /></ProtectedRoute>
          }/>
          <Route path="/manager/reports" element={
            <ProtectedRoute role="manager"><Reports /></ProtectedRoute>
          }/>
        </Routes>
      </main>
    </div>
  )
}
