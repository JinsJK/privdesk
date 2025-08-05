// frontend/src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { showLogoutToast } from "../utils/toastUtils";

const AuthContext = createContext();

const isTokenValid = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);


  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken && isTokenValid(storedToken)) {
      const decoded = jwtDecode(storedToken);
      setToken(storedToken);
      setIsAuthenticated(true);
      setIsAdmin(decoded.is_admin === true);
    } else {
      localStorage.removeItem("token");
      setToken(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
    }

    setLoading(false);
  }, []);

  const login = (jwt) => {
    const decoded = jwtDecode(jwt);
    localStorage.setItem("token", jwt);
    setToken(jwt);
    setIsAuthenticated(true);
    setIsAdmin(decoded.is_admin === true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setIsAuthenticated(false);
    showLogoutToast(); // toast
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, isAdmin, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
