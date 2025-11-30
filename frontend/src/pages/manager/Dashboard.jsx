import React, { useEffect, useState } from 'react'
import api from '../../lib/api'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

export default function ManagerDashboard() {
  const [stats, setStats] = useState(null)
  const [today, setToday] = useState(null)

  const load = async () => {
    const m = await api.get('/api/dashboard/manager'); setStats(m.data)
    const t = await api.get('/api/attendance/today-status'); setToday(t.data)
  }
  useEffect(()=>{ load() }, [])

  if (!stats || !today) return <div>Loading...</div>

  const pieData = [
    { name: 'Present', value: stats.today.present },
    { name: 'Late', value: stats.today.late },
  ]
  const COLORS = ['#2563eb', '#f59e0b']

  return (
    <div className="grid gap-6">
      <h2 className="title">Manager Dashboard</h2>

      <div className="grid md:grid-cols-3 gap-6">
        <KPI title="Total Employees" value={stats.totalEmployees} />
        <KPI title="Present Today" value={stats.today.present} />
        <KPI title="Late Today" value={stats.today.late} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-4">
          <h3 className="title mb-3">Today Overview</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" outerRadius={110} label>
                  {pieData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card p-4">
          <h3 className="title mb-3">Today's Records</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50">
                <tr><Th>Employee</Th><Th>Department</Th><Th>Status</Th><Th>Check In</Th></tr>
              </thead>
              <tbody>
                {today.docs?.map((d,i)=>(
                  <tr key={i} className="border-b last:border-0">
                    <Td>{d.user?.name} ({d.user?.employeeId})</Td>
                    <Td>{d.user?.department}</Td>
                    <Td className="capitalize">{d.status}</Td>
                    <Td>{d.checkInTime ? new Date(d.checkInTime).toLocaleTimeString() : '-'}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
