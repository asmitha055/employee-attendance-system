import React, { useState } from 'react'
import api from '../lib/api'
import { useAuthStore } from '../store/auth'
import { useNavigate } from 'react-router-dom'
import { FiUser, FiMail, FiHash } from 'react-icons/fi'

export default function Register() {
  const [form, setForm] = useState({ name:'', email:'', password:'', employeeId:'', department:'General' })
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const login = useAuthStore(s => s.login)
  const nav = useNavigate()

  const upd = (k,v)=> setForm(s=>({...s,[k]:v}))
  const submit = async (e) => {
    e.preventDefault()
    setLoading(true); setErr('')
    try {
      const { data } = await api.post('/api/auth/register', { ...form, role:'employee' })
      login(data); nav('/employee/dashboard')
    } catch (e) { setErr(e?.response?.data?.message || e.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="max-w-xl mx-auto mt-12">
      <div className="card p-6">
        <h2 className="title mb-4">Create an account</h2>
        <form onSubmit={submit} className="grid gap-4">
          <LabelInput label="Full Name" icon={<FiUser />} value={form.name} onChange={v=>upd('name', v)} />
          <LabelInput label="Email" icon={<FiMail />} value={form.email} onChange={v=>upd('email', v)} />
          <LabelInput label="Password" type="password" value={form.password} onChange={v=>upd('password', v)} />
          <LabelInput label="Employee ID" icon={<FiHash />} value={form.employeeId} onChange={v=>upd('employeeId', v)} />
          <LabelInput label="Department" value={form.department} onChange={v=>upd('department', v)} />
          {err && <div className="text-red-600 text-sm">{err}</div>}
          <button className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating…' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  )
}

function LabelInput({ label, value, onChange, icon, type='text' }) {
  return (
    <label className="grid gap-2">
      <span className="label">{label}</span>
      <div className="relative">
        {icon && <span className="absolute left-3 top-3 text-slate-400">{icon}</span>}
        <input type={type} className={`input ${icon ? 'pl-9' : ''}`} value={value} onChange={e=>onChange(e.target.value)} />
      </div>
    </label>
  )
}
