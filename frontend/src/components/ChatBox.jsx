// frontend/src/components/ChatBox.jsx
import { useEffect, useRef, useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

const ChatBox = ({ ticketId }) => {
    const { token, isAuthenticated } = useAuth()
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const scrollRef = useRef(null)

    useEffect(() => {
        if (isAuthenticated && ticketId) {
            fetchMessages()
            const interval = setInterval(fetchMessages, 5000)
            return () => clearInterval(interval)
        }
    }, [isAuthenticated, ticketId])

    const fetchMessages = async () => {
        try {
            const res = await api.get(`/messages/${ticketId}`)
            setMessages(res.data)
            scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
        } catch (err) {
            console.error('Failed to load messages:', err)
        }
    }

    const sendMessage = async () => {
        if (!newMessage.trim()) return
        setLoading(true)
        try {
            await api.post(`/messages/${ticketId}`, { content: newMessage })
            setNewMessage('')
            fetchMessages()
        } catch (err) {
            console.error('Send failed:', err)
        } finally {
            setLoading(false)
        }
    }

    const parseJwt = (token) => {
        try {
            return JSON.parse(atob(token.split('.')[1]))
        } catch {
            return {}
        }
    }

    const currentUserId = parseJwt(token)?.user_id

    return (
        <div className="flex flex-col h-80">
            <div className="flex flex-col h-80 space-y-1 overflow-y-auto pr-1">
                {messages.map((msg) => {
                    const isAdmin = msg.is_admin

                    return (
                        <div
                            key={msg.id}
                            className={`max-w-xs p-2 rounded-lg text-sm ${
                                isAdmin
                                    ? 'bg-gray-200 text-black self-start mr-auto text-left'
                                    : 'bg-purple-600 text-white self-end ml-auto text-right'
                            }`}
                        >
                            <p>{msg.content}</p>
                            <p className="text-xs mt-1 opacity-70">
                                {new Date(msg.created_at).toLocaleString()}
                            </p>
                            <span className="text-[10px] mt-1 block font-semibold">
                                {isAdmin ? 'Admin' : 'You'}
                            </span>
                        </div>
                    )
                })}

                <div ref={scrollRef} />
            </div>

            <div className="flex mt-2 space-x-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1 border p-2 rounded"
                    placeholder="Type a message..."
                />
                <button
                    onClick={sendMessage}
                    disabled={loading}
                    className="bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    Send
                </button>
            </div>
        </div>
    )
}

export default ChatBox
