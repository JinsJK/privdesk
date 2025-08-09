// frontend/src/pages/Dashboard.jsx
import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { showSuccessToast, showErrorToast } from '../utils/toastUtils'
import ChatModal from '../components/ChatModal'

const Dashboard = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeTicketId, setActiveTicketId] = useState(null)

  const navigate = useNavigate()
  const { isAuthenticated, isAdmin, token } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { requireLogin: true } })
    } else {
      fetchTickets()
    }
  }, [isAuthenticated, navigate])

  const fetchTickets = async () => {
    try {
      const res = await api.get('/tickets/')
      setTickets(res.data)
    } catch (err) {
      console.error('Fetch tickets error:', err)
      showErrorToast('Failed to fetch tickets: ' + (err.response?.data?.detail || err.message))
    }
  }

  const createTicket = async () => {
    if (!title.trim() || !description.trim()) {
      showErrorToast('Title and description are required.')
      return
    }

    setLoading(true)
    try {
      await api.post('/tickets/', { title, description })
      setTitle('')
      setDescription('')
      fetchTickets()
      showSuccessToast('Ticket created successfully!')
    } catch (err) {
      showErrorToast('Ticket creation failed: ' + (err.response?.data?.detail || err.message))
    } finally {
      setLoading(false)
    }
  }

  const deleteTicket = async (id) => {
    try {
      await api.delete(`/tickets/${id}`)
      showSuccessToast('Ticket deleted')
      fetchTickets()
    } catch (err) {
      showErrorToast('Delete failed: ' + (err.response?.data?.detail || err.message))
    }
  }

  const updateStatus = async (id, newStatus) => {
    try {
      await api.patch(`/tickets/${id}?status=${newStatus}`)
      showSuccessToast('Status updated')
      fetchTickets()
    } catch (err) {
      showErrorToast('Update failed: ' + (err.response?.data?.detail || err.message))
    }
  }

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      setActiveTicketId(null)
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 mt-6 sm:mt-10">
      <h1 className="text-xl sm:text-2xl font-bold mb-4">My Tickets</h1>

      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full p-3 rounded-lg border border-gray-300 mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      <textarea
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Description"
        className="w-full p-3 rounded-lg border border-gray-300 mb-3 min-h-[110px] resize-y focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      <button
        onClick={createTicket}
        disabled={loading}
        className={`w-full sm:w-auto rounded-full bg-purple-600 text-white px-5 py-2.5 font-medium shadow-sm hover:bg-purple-700 transition ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Creating...' : 'Create Ticket'}
      </button>

      <div className="mt-8">
        {tickets.length > 0 ? (
          <ul className="space-y-3">
            {tickets.map(ticket => (
              <li
                key={ticket.id}
                className="bg-white rounded-xl shadow p-3 sm:p-4 hover:shadow-md transition"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
                  <div className="flex-1">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-800 break-words">
                      {ticket.title}
                    </h2>
                    <p className="text-gray-700 mt-1 break-words">
                      {ticket.description}
                    </p>

                    <span
                      className={`inline-block mt-2 px-2 py-0.5 text-xs font-semibold rounded uppercase tracking-wide
                        ${ticket.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-800'}`}
                    >
                      {ticket.status}
                    </span>

                    {isAdmin && ticket.user?.email && (
                      <p className="text-sm text-blue-600 mt-2 break-all">
                        Created by: {ticket.user.email}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col md:items-end gap-2 w-full md:w-auto">
                    {isAdmin && (
                      <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center mt-2 md:mt-0">
                        <select
                          value={ticket.status}
                          onChange={e => updateStatus(ticket.id, e.target.value)}
                          className="w-full sm:w-auto border border-gray-300 rounded px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="open">Open</option>
                          <option value="closed">Closed</option>
                        </select>

                        <button
                          onClick={() => deleteTicket(ticket.id)}
                          className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white px-3 py-2 text-sm rounded shadow-sm transition"
                        >
                          Delete
                        </button>
                      </div>
                    )}

                    {ticket.status === 'open' && (
                      <button
                        onClick={() => setActiveTicketId(ticket.id)}
                        className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm shadow transition"
                      >
                        💬 Chat
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 mt-4">No tickets yet.</p>
        )}
      </div>

      {activeTicketId && (
        <ChatModal
          ticketId={activeTicketId}
          onClose={() => setActiveTicketId(null)}
        />
      )}
    </div>
  )
}

export default Dashboard
