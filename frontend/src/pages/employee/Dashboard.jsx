import React, { useEffect, useState } from 'react'
import api from '../../lib/api'
import { FiCheckCircle, FiClock } from 'react-icons/fi'

export default function EmpDashboard() {
  const [data, setData] = useState(null)
  const [message, setMessage] = useState('')

  const load = async () => {
    const { data } = await api.get('/api/dashboard/employee')
    setData(data)
  }
  useEffect(() => { load() }, [])

  const checkIn = async () => {
    try { const { data } = await api.post('/api/attendance/checkin'); setMessage(data.message); load() }
    catch (e) { setMessage(e?.response?.data?.message || e.message) }
  }
  const checkOut = async () => {
    try { const { data } = await api.post('/api/attendance/checkout'); setMessage(data.message); load() }
    catch (e) { setMessage(e?.response?.data?.message || e.message) }
  }

  if (!data) return <div>Loading...</div>

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h2 className="title">Employee Dashboard</h2>
        <div className="flex gap-3">
          <button onClick={checkIn} className="btn btn-primary"><FiCheckCircle/> Check In</button>
          <button onClick={checkOut} className="btn btn-outline"><FiClock/> Check Out</button>
        </div>
      </div>

      {message && <div className="card p-3 text-sm bg-blue-50 border-blue-200">{message}</div>}

      <div className="grid md:grid-cols-3 gap-6">
        <KPI title="Today's Status" value={data.today ? 'Checked In' : 'Not Checked In'} />
        <KPI title="This Month Hours" value={(data.totalHours||0).toFixed(2)} />
        <KPI title="Late Days" value={data.status?.late || 0} />
      </div>

      <div className="card p-4">
        <h3 className="title mb-3">Recent Attendance</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <Th>Date</Th><Th>Status</Th><Th>Hours</Th>
              </tr>
            </thead>
            <tbody>
              {data.recent?.map((r,i)=>(
                <tr key={i} className="border-b last:border-0">
                  <Td>{new Date(r.date).toISOString().slice(0,10)}</Td>
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

function KPI({ title, value }) {
  return (
    <div className="card p-4">
      <div className="muted">{title}</div>
      <div className="text-3xl font-bold mt-1">{value}</div>
    </div>
  )
}

const Th = ({children})=> <th className="text-left p-3 font-semibold text-slate-700">{children}</th>
const Td = ({children, className=""})=> <td className={`p-3 ${className}`}>{children}</td>
