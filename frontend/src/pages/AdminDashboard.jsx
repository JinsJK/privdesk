// frontend/src/pages/AdminDashboard.jsx
import { useEffect, useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { showErrorToast } from '../utils/toastUtils'

const AdminDashboard = () => {
  const { isAdmin } = useAuth()
  const [stats, setStats] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats')
        setStats(res.data)
      } catch (err) {
        showErrorToast('Failed to fetch stats: ' + (err.response?.data?.detail || err.message))
      }
    }

    if (isAdmin) fetchStats()
  }, [isAdmin])

  if (!isAdmin) return <p className="text-red-600">Admins only</p>
  if (!stats) return <p>Loading stats...</p>

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 bg-white border shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p><strong>Total Users:</strong> {stats.total_users}</p>
      <p><strong>Total Admins:</strong> {stats.total_admins}</p>
      <p><strong>Total Tickets:</strong> {stats.total_tickets}</p>

      <h2 className="mt-4 font-semibold">Tickets by Status:</h2>
      <ul className="list-disc ml-6">
        {Object.entries(stats.ticket_statuses).map(([status, count]) => (
          <li key={status}>{status}: {count}</li>
        ))}
      </ul>
    </div>
  )
}

export default AdminDashboard
