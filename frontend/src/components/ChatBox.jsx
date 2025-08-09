// frontend/src/components/ChatBox.jsx
import { useEffect, useMemo, useRef, useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

const ChatBox = ({ ticketId }) => {
  const { token, isAuthenticated } = useAuth()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  // ---- viewer claims (role/email) from JWT ----
  const parseJwt = (t) => {
    try {
      return JSON.parse(atob(t.split('.')[1]))
    } catch {
      return {}
    }
  }
  const claims = token ? parseJwt(token) : {}
  const viewerIsAdmin = !!(claims.is_admin || claims.role === 'admin')

  // ---- lifecycle ----
  useEffect(() => {
    if (!isAuthenticated || !ticketId) return
    fetchMessages()
    const interval = setInterval(fetchMessages, 5000)
    return () => clearInterval(interval)
  }, [isAuthenticated, ticketId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages.length])

  const fetchMessages = async () => {
    try {
      const res = await api.get(`/messages/${ticketId}`)
      setMessages(res.data || [])
    } catch (err) {
      console.error('Failed to load messages:', err)
    }
  }

  const sendMessage = async () => {
    const trimmed = input.trim()
    if (!trimmed) return
    setLoading(true)
    try {
      await api.post(`/messages/${ticketId}`, { content: trimmed })
      setInput('')
      await fetchMessages()
    } catch (err) {
      console.error('Send failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!loading) sendMessage()
    }
  }

  // ---- bubble grouping (first/last) ----
  const grouped = useMemo(() => {
    return messages.map((m, i) => {
      const prev = messages[i - 1]
      const next = messages[i + 1]
      const samePrev = prev && prev.is_admin === m.is_admin
      const sameNext = next && next.is_admin === m.is_admin
      return { ...m, isFirstInGroup: !samePrev, isLastInGroup: !sameNext }
    })
  }, [messages])

  // admin viewing => admin on right; user viewing => user on right
  const alignRightFor = (msg) => (viewerIsAdmin ? msg.is_admin : !msg.is_admin)

  const roleLabel = (msg) => {
    if (msg.is_admin) return 'Admin'
    // fallback to "User"
    return msg.user_email || msg.sender_email || msg.email || 'User'
  }

  const timeText = (iso) =>
    new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="h-full flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-2">
        <span className="sr-only">Message list</span>

        {grouped.map((msg) => {
          const right = alignRightFor(msg)
          const isUserSender = !msg.is_admin // for color only

          return (
            <div
              key={msg.id}
              className={`flex w-full items-end gap-2 sm:gap-3 ${right ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={[
                  'max-w-[80%] sm:max-w-[70%] md:max-w-[60%]',
                  'px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-[0.95rem] leading-relaxed shadow-sm',
                  'rounded-2xl',
                  isUserSender ? 'bg-purple-600 text-white' : 'bg-gray-200 text-black',
                  right
                    ? `${msg.isFirstInGroup ? 'rounded-tr-md' : 'rounded-tr-2xl'} ${
                        msg.isLastInGroup ? 'rounded-br-md' : 'rounded-br-2xl'
                      } rounded-tl-2xl rounded-bl-2xl`
                    : `${msg.isFirstInGroup ? 'rounded-tl-md' : 'rounded-tl-2xl'} ${
                        msg.isLastInGroup ? 'rounded-bl-md' : 'rounded-bl-2xl'
                      } rounded-tr-2xl rounded-br-2xl`,
                ].join(' ')}
              >
                <p className="whitespace-pre-wrap break-words">{msg.content}</p>

                <div className={`mt-1 text-[10px] sm:text-xs ${isUserSender ? 'text-white/90' : 'text-black/60'}`}>
                  {timeText(msg.created_at)}
                </div>

                <span className={`block mt-0.5 text-[10px] font-semibold ${isUserSender ? 'text-white/90' : 'text-black/70'}`}>
                  {roleLabel(msg)}
                </span>
              </div>
            </div>
          )
        })}

        <div ref={bottomRef} />
      </div>

      {/* Composer */}
      <div className="border-t border-neutral-200 px-3 sm:px-4 py-3">
        <form
          className="w-full flex items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            if (!loading) sendMessage()
          }}
        >
          <label htmlFor="chat-input" className="sr-only">
            Type your message
          </label>
          <textarea
            id="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type a message..."
            className="min-h-[44px] max-h-40 w-full resize-none rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-purple-600 p-2.5"
          />
          <button
            type="submit"
            disabled={loading || input.trim().length === 0}
            className="shrink-0 h-[44px] px-4 rounded-lg bg-purple-600 text-white disabled:opacity-50"
            aria-label="Send message"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatBox
