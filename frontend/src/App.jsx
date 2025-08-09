// frontend/src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'
import Navbar from './components/Navbar'
import PrivateRoute from './components/PrivateRoute'
import { useAuth } from './context/AuthContext'

// Toastify
import { useEffect, useState } from 'react'
import { ToastContainer, Slide } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// small helper to detect mobile
function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  )
  useEffect(() => {
    const mq = window.matchMedia?.(`(max-width: ${breakpoint}px)`)
    const onChange = e => setIsMobile(e.matches)
    mq?.addEventListener?.('change', onChange)
    return () => mq?.removeEventListener?.('change', onChange)
  }, [breakpoint])
  return isMobile
}

function App() {
  const { isAuthenticated } = useAuth()
  const isMobile = useIsMobile()

  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {/* Mobile-friendly toasts */}
      <ToastContainer
        position={isMobile ? 'bottom-center' : 'bottom-right'}
        autoClose={isMobile ? 2200 : 5000}
        hideProgressBar={isMobile}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss={false}
        pauseOnHover={false}
        draggable={false}
        limit={isMobile ? 2 : 5}
        theme="light"
        transition={Slide}
        icon={false}
        toastContainerClassName={isMobile ? '!p-2' : undefined}
        style={isMobile ? { paddingBottom: 'calc(env(safe-area-inset-bottom, 0) + 8px)' } : undefined}
        toastClassName={() =>
          'rounded-xl shadow-lg border !border-gray-200 !bg-white !text-gray-900 !text-sm sm:!text-base px-3 py-2 sm:px-4 sm:py-3'
        }
        bodyClassName={() => 'flex items-center gap-2 leading-snug'}
        progressClassName={() => '!bg-purple-500'}
        closeButton={isMobile ? false : true}
      />
    </>
  )
}

export default App
