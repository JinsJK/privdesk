// frontend/src/pages/Dashboard.jsx
import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
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
      toast.error('Failed to fetch tickets: ' + (err.response?.data?.detail || err.message))
    }
  }

  const createTicket = async () => {
    if (!title.trim() || !description.trim()) {
      toast.error('Title and description are required.')
      return
    }

    setLoading(true)
    try {
      await api.post('/tickets/', { title, description })
      setTitle('')
      setDescription('')
      fetchTickets()
      toast.success('Ticket created successfully!')
    } catch (err) {
      toast.error('Ticket creation failed: ' + (err.response?.data?.detail || err.message))
    } finally {
      setLoading(false)
    }
  }

  const deleteTicket = async (id) => {
    try {
      await api.delete(`/tickets/${id}`)
      toast.success('Ticket deleted')
      fetchTickets()
    } catch (err) {
      toast.error('Delete failed: ' + (err.response?.data?.detail || err.message))
    }
  }

  const updateStatus = async (id, newStatus) => {
    try {
      await api.patch(`/tickets/${id}?status=${newStatus}`)
      toast.success('Status updated')
      fetchTickets()
    } catch (err) {
      toast.error('Update failed: ' + (err.response?.data?.detail || err.message))
    }
  }

  // Close modal on ESC key
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
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">My Tickets</h1>

      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full p-2 border mb-2"
      />
      <textarea
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Description"
        className="w-full p-2 border mb-2"
      />
      <button
        onClick={createTicket}
        disabled={loading}
        className={`bg-purple-600 text-white px-4 py-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? 'Creating...' : 'Create Ticket'}
      </button>

      <div className="mt-8">
        {tickets.length > 0 ? (
          <ul className="space-y-2">
            {tickets.map(ticket => (
              <li
                key={ticket.id}
                className="bg-white rounded-xl shadow p-4 hover:shadow-md transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-800">{ticket.title}</h2>
                    <p className="text-gray-700 mt-1">{ticket.description}</p>

                    <span
                      className={`inline-block mt-2 px-2 py-0.5 text-xs font-semibold rounded uppercase tracking-wide 
                        ${ticket.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-800'}`}
                    >
                      {ticket.status}
                    </span>

                    {isAdmin && ticket.user?.email && (
                      <p className="text-sm text-blue-600 mt-2">
                        Created by: {ticket.user.email}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col md:items-end gap-2">
                    {isAdmin && (
                      <div className="flex gap-2 items-center mt-2 md:mt-0">
                        <select
                          value={ticket.status}
                          onChange={e => updateStatus(ticket.id, e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="open">Open</option>
                          <option value="closed">Closed</option>
                        </select>

                        <button
                          onClick={() => deleteTicket(ticket.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm rounded shadow-sm"
                        >
                          Delete
                        </button>
                      </div>
                    )}

                    {ticket.status === 'open' && (
                      <button
                        onClick={() => setActiveTicketId(ticket.id)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1 rounded text-sm shadow transition duration-200"
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
