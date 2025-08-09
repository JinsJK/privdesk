// frontend/src/components/Navbar.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { isAuthenticated, isAdmin, logout } = useAuth()
  const [open, setOpen] = useState(false)

  const close = () => setOpen(false)

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center justify-between">

        {/* Left: Logo */}
        <Link
          to={isAuthenticated ? "/dashboard" : "/login"}
          className="flex items-center gap-2"
          aria-label="PrivDesk Home"
          onClick={close}
        >
          <img src="/logo.png" alt="PrivDesk Logo" className="h-8 w-8 sm:h-10 sm:w-10" />
          <span className="hidden sm:inline text-lg font-semibold text-gray-800">PrivDesk</span>
        </Link>

        {/* Right: Desktop actions */}
        <div className="hidden sm:flex items-center gap-2">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="inline-flex items-center rounded-full border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-500 px-4 py-1.5 text-sm font-semibold text-white shadow hover:opacity-95 transition"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 transition"
              >
                Dashboard
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="inline-flex items-center rounded-full border border-blue-300/70 bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700 hover:bg-blue-100 transition"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={logout}
                className="inline-flex items-center rounded-full border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Right: Mobile hamburger */}
        <button
          className="sm:hidden inline-flex items-center justify-center rounded-full border border-gray-300 p-2 hover:bg-gray-50 active:scale-[0.98] transition"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {/* hamburger icon */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Mobile panel */}
      {open && (
        <div
          className="sm:hidden absolute right-4 top-14 z-50 w-56 rounded-xl border border-gray-200 bg-white shadow-lg p-2"
          role="menu"
        >
          {!isAuthenticated ? (
            <div className="flex flex-col gap-2">
              <Link
                to="/login"
                onClick={close}
                className="w-full text-left rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                role="menuitem"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={close}
                className="w-full text-left rounded-lg bg-gradient-to-tr from-violet-600 to-fuchsia-500 px-3 py-2 text-sm font-semibold text-white"
                role="menuitem"
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                to="/dashboard"
                onClick={close}
                className="w-full text-left rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                role="menuitem"
              >
                Dashboard
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={close}
                  className="w-full text-left rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
                  role="menuitem"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={() => { close(); logout(); }}
                className="w-full text-left rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                role="menuitem"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
