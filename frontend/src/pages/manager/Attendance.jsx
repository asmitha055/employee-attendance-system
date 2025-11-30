import React, { useEffect, useState } from 'react'
import api from '../../lib/api'

export default function ManagerAttendance() {
  const [data, setData] = useState([])
  const [filters, setFilters] = useState({ employee:'', date:'', status:'' })

  const load = async () => {
    const { data } = await api.get('/api/attendance/all', { params: { ...filters, page:1, limit:100 } })
    setData(data.data || [])
  }
  useEffect(()=>{ load() }, [])

  return (
    <div className="grid gap-4">
      <h2 className="title">All Employees Attendance</h2>
      <div className="card p-4 grid gap-3 md:flex md:items-end md:gap-4">
        <label className="grid gap-2 w-full md:w-64">
          <span className="label">Employee MongoId (optional)</span>
          <input className="input" placeholder="64b9... (from DB)" value={filters.employee} onChange={e=>setFilters(s=>({...s, employee:e.target.value}))} />
        </label>
        <label className="grid gap-2 w-full md:w-48">
          <span className="label">Date</span>
          <input className="input" type="date" value={filters.date} onChange={e=>setFilters(s=>({...s, date:e.target.value}))} />
        </label>
        <label className="grid gap-2 w-full md:w-48">
          <span className="label">Status</span>
          <select className="input" value={filters.status} onChange={e=>setFilters(s=>({...s, status:e.target.value}))}>
            <option value="">Any Status</option>
            <option value="present">Present</option>
            <option value="late">Late</option>
            <option value="half-day">Half-day</option>
          </select>
        </label>
        <button className="btn btn-primary" onClick={load}>Apply</button>
      </div>

      <div className="card p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr><Th>Date</Th><Th>Employee</Th><Th>Department</Th><Th>Status</Th><Th>Hours</Th></tr>
            </thead>
            <tbody>
              {data.map((r,i)=>(
                <tr key={i} className="border-b last:border-0">
                  <Td>{new Date(r.date).toISOString().slice(0,10)}</Td>
                  <Td>{r.user?.name} ({r.user?.employeeId})</Td>
                  <Td>{r.user?.department}</Td>
                  <Td className="capitalize">{r.status}</Td>
                  <Td>{(r.totalHours||0).toFixed(2)}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const Th = ({children})=> <th className="text-left p-3 font-semibold text-slate-700">{children}</th>
const Td = ({children, className=""})=> <td className={`p-3 ${className}`}>{children}</td>
