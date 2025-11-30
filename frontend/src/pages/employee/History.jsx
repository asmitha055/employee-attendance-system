import React, { useEffect, useState } from 'react'
import api from '../../lib/api'

export default function EmpHistory() {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth()+1)
  const [year, setYear] = useState(now.getFullYear())
  const [data, setData] = useState([])

  const load = async () => {
    const { data } = await api.get('/api/attendance/my-history', { params: { month, year, page:1, limit:100 } })
    setData(data.data || [])
  }
  useEffect(()=>{ load() }, [month, year])

  return (
    <div className="grid gap-4">
      <h2 className="title">My Attendance History</h2>
      <div className="flex gap-3 items-end flex-wrap">
        <label className="grid gap-2"><span className="label">Month</span><input className="input" type="number" min="1" max="12" value={month} onChange={e=>setMonth(Number(e.target.value))} /></label>
        <label className="grid gap-2"><span className="label">Year</span><input className="input" type="number" value={year} onChange={e=>setYear(Number(e.target.value))} /></label>
        <button className="btn btn-outline" onClick={load}>Reload</button>
      </div>

      <div className="card p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <Th>Date</Th><Th>Status</Th><Th>Check In</Th><Th>Check Out</Th><Th>Hours</Th>
              </tr>
            </thead>
            <tbody>
              {data.map((r,i)=>(
                <tr key={i} className="border-b last:border-0">
                  <Td>{new Date(r.date).toISOString().slice(0,10)}</Td>
                  <Td className="capitalize">{r.status}</Td>
                  <Td>{r.checkInTime ? new Date(r.checkInTime).toLocaleTimeString() : '-'}</Td>
                  <Td>{r.checkOutTime ? new Date(r.checkOutTime).toLocaleTimeString() : '-'}</Td>
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
