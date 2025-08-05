import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { isAuthenticated, isAdmin, logout } = useAuth()

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-200 px-6 py-3 shadow-sm flex justify-between items-center">
      <Link
        to={isAuthenticated ? "/dashboard" : "/login"}
        className="flex items-center"
      >
        <img src="/logo.png" alt="PrivDesk Logo" className="h-20 w-20" />
      </Link>

      <div className="space-x-6 text-sm font-medium">
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className="text-gray-700 hover:text-black">
              Dashboard
            </Link>

            {isAdmin && (
              <Link to="/admin" className="text-blue-600 hover:text-blue-800">
                Admin Dashboard
              </Link>
            )}

            <button
              onClick={logout}
              className="text-red-500 hover:text-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-700 hover:text-black">
              Login
            </Link>
            <Link to="/register" className="text-purple-600 hover:text-purple-800">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
