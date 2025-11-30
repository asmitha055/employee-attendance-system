import React, { useState } from 'react'
import api from '../lib/api'
import { useAuthStore } from '../store/auth'
import { useNavigate } from 'react-router-dom'
import { FiLock, FiMail } from 'react-icons/fi'

export default function Login() {
  const [email, setEmail] = useState('manager@example.com')
  const [password, setPassword] = useState('Password@123')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const login = useAuthStore(s => s.login)
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true); setErr('')
    try {
      const { data } = await api.post('/api/auth/login', { email, password })
      login(data)
      if (data.user.role === 'manager') nav('/manager/dashboard')
      else nav('/employee/dashboard')
    } catch (e) { setErr(e?.response?.data?.message || e.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="card p-6">
        <h2 className="title mb-4">Welcome back</h2>
        <p className="muted mb-6">Sign in to manage attendance.</p>
        <form onSubmit={submit} className="grid gap-4">
          <label className="grid gap-2">
            <span className="label">Email</span>
            <div className="relative">
              <FiMail className="absolute left-3 top-3 text-slate-400" />
              <input className="input pl-9" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} />
            </div>
          </label>
          <label className="grid gap-2">
            <span className="label">Password</span>
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-slate-400" />
              <input type="password" className="input pl-9" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} />
            </div>
          </label>
          {err && <div className="text-red-600 text-sm">{err}</div>}
          <button className="btn btn-primary" disabled={loading}>
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
