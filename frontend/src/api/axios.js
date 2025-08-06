import axios from 'axios'

const apiBaseUrl = import.meta.env.VITE_API_URL

if (!apiBaseUrl) {
  throw new Error("❌ VITE_API_URL is not defined! Please check your .env.production file.")
}

console.log("🧪 axios baseURL:", apiBaseUrl)

const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
    console.log("🔐 Auth header attached")
  } else {
    console.warn("⚠️ No token found in localStorage")
  }
  return config
}, error => {
  console.error("❌ Axios request error:", error)
  return Promise.reject(error)
})

api.interceptors.response.use(
  response => response,
  error => {
    console.error("❌ Axios response error:", error?.response || error.message)
    return Promise.reject(error)
  }
)

export default api
