// frontend/src/components/ChatModal.jsx
import ChatBox from './ChatBox'

const ChatModal = ({ ticketId, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white w-full max-w-lg rounded shadow-lg p-4 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-lg font-semibold mb-2">Chat for Ticket #{ticketId}</h2>
        <ChatBox ticketId={ticketId} />
      </div>
    </div>
  )
}

export default ChatModal
