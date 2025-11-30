import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth'
import { FiLogOut } from 'react-icons/fi'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const nav = useNavigate()
  const out = () => { logout(); nav('/login') }

  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-xl object-contain" />
          <span className="font-semibold text-lg text-ink">Employee Attendance</span>
        </div>
        <nav className="flex items-center gap-4 text-sm">
          {!user && <Link className="hover:text-primary" to="/login">Login</Link>}
          {!user && <Link className="hover:text-primary" to="/register">Register</Link>}
          {user?.role === 'employee' && <Link className="hover:text-primary" to="/employee/dashboard">Employee</Link>}
          {user?.role === 'employee' && <Link className="hover:text-primary" to="/employee/history">History</Link>}
          {user?.role === 'manager' && <Link className="hover:text-primary" to="/manager/dashboard">Manager</Link>}
          {user?.role === 'manager' && <Link className="hover:text-primary" to="/manager/attendance">Attendance</Link>}
          {user?.role === 'manager' && <Link className="hover:text-primary" to="/manager/reports">Reports</Link>}
          {user && (
            <button onClick={out} className="btn btn-outline">
              <FiLogOut /> Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}
