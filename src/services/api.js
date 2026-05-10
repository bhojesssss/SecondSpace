import axios from 'axios'
import router from '@/router'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// ── Request interceptor: attach JWT token ─────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Response interceptor: unwrap data, handle 401 ────────────────────────────
api.interceptors.response.use(
  (response) => {
    // Backend always returns { success: true, data: <result> }
    // Unwrap so callers receive the inner data directly
    return response.data?.data !== undefined ? response.data.data : response.data
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      router.push('/login')
    }
    const msg =
      error.response?.data?.error?.message ||
      error.message ||
      'Terjadi kesalahan server'
    return Promise.reject(new Error(msg))
  }
)

export default api
