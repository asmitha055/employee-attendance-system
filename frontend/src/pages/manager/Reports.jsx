import React, { useState } from 'react'
import api from '../../lib/api'

export default function Reports() {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [downloading, setDownloading] = useState(false)

  const downloadCSV = async () => {
    setDownloading(true)
    try {
      const resp = await api.get('/api/attendance/export', {
        params: { startDate, endDate },
        responseType: 'blob'
      })
      const blob = new Blob([resp.data], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = 'attendance.csv'
      document.body.appendChild(a); a.click(); a.remove()
      URL.revokeObjectURL(url)
    } finally { setDownloading(false) }
  }

  return (
    <div className="grid gap-4">
      <h2 className="title">Reports</h2>
      <div className="card p-4 flex flex-wrap gap-3 items-end">
        <label className="grid gap-2">
          <span className="label">Start</span>
          <input className="input" type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} />
        </label>
        <label className="grid gap-2">
          <span className="label">End</span>
          <input className="input" type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} />
        </label>
        <button onClick={downloadCSV} disabled={downloading} className="btn btn-primary">
          {downloading ? 'Exporting…' : 'Export CSV'}
        </button>
      </div>
      <p className="muted">CSV comes from backend <code>/api/attendance/export</code>.</p>
    </div>
  )
}
