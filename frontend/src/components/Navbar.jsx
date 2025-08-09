// frontend/src/components/Navbar.jsx
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { isAuthenticated, isAdmin, logout } = useAuth()

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-200 px-4 sm:px-6 py-3 shadow-sm">
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        <Link
          to={isAuthenticated ? "/dashboard" : "/login"}
          className="flex items-center gap-2"
          aria-label="PrivDesk Home"
        >
          <img src="/logo.png" alt="PrivDesk Logo" className="h-8 w-8 sm:h-10 sm:w-10" />
          <span className="hidden sm:inline text-lg font-semibold text-gray-800">PrivDesk</span>
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="inline-flex items-center rounded-full border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 active:scale-[0.99] transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="inline-flex items-center rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-500 px-4 py-1.5 text-sm font-semibold text-white shadow hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-violet-400 active:scale-[0.99] transition"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                className="hidden sm:inline-flex items-center rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
                title="Dashboard"
              >
                Dashboard
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  className="inline-flex items-center rounded-full border border-blue-300/70 bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                  title="Admin Dashboard"
                >
                  Admin
                </Link>
              )}

              <button
                onClick={logout}
                className="inline-flex items-center rounded-full border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-300 transition"
                aria-label="Logout"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
