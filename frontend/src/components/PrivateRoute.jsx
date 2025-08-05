// frontend/src/components/PrivateRoute.jsx
import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { showRequireLoginToast } from '../utils/toastUtils'

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  useEffect(() => {
    if (!isAuthenticated) {
      showRequireLoginToast()
    }
  }, [isAuthenticated, location.pathname])

  return isAuthenticated ? children : <Navigate to="/login" replace />
}

export default PrivateRoute
