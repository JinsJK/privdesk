// frontend/src/components/ChatModal.jsx
import ChatBox from './ChatBox'

const ChatModal = ({ ticketId, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-[92vw] max-w-2xl h-[75vh] md:h-[80vh] rounded-2xl shadow-xl flex flex-col relative">
        {/* Header */}
        <div className="flex items-center justify-between px-4 md:px-5 py-3 border-b border-neutral-200">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold truncate">Chat for Ticket #{ticketId}</h2>
            <p className="text-xs text-neutral-500">Enter to send • Shift+Enter for newline</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="h-8 w-8 inline-flex items-center justify-center rounded-full hover:bg-neutral-100 text-neutral-600"
          >
            ×
          </button>
        </div>

        {/* Chat */}
        <div className="flex-1 min-h-0">
          <ChatBox ticketId={ticketId} />
        </div>
      </div>
    </div>
  )
}

export default ChatModal
