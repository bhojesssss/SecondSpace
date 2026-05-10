import { ref, computed } from 'vue'
import api from '@/services/api'

// ── Singleton module-level state ──────────────────────────────────────────────
const user = ref(null)
const _token = ref(localStorage.getItem('access_token') || null)
const isLoggedIn = computed(() => !!_token.value)

// Hydrate user from token on app init (runs once per page load)
if (_token.value) {
  api
    .get('/auth/me')
    .then((data) => {
      user.value = data
    })
    .catch(() => {
      localStorage.removeItem('access_token')
      _token.value = null
    })
}

// ── Composable ────────────────────────────────────────────────────────────────
export function useAuth() {
  /**
   * Fetch the current user profile from the backend.
   * Populates the shared `user` ref.
   */
  async function fetchMe() {
    const data = await api.get('/auth/me')
    user.value = data
    return data
  }

  /**
   * Log in with email + password.
   * Saves access_token to localStorage and populates user.
   */
  async function login(email, password) {
    const data = await api.post('/auth/login', { email, password })
    const token = data.access_token
    localStorage.setItem('access_token', token)
    _token.value = token
    // Fetch full user profile
    await fetchMe()
  }

  /**
   * Register a new account, then automatically log in.
   */
  async function register({ name, email, password, phone }) {
    await api.post('/auth/register', { name, email, password, phone })
    await login(email, password)
  }

  /**
   * Log out: call backend endpoint, then clear local state.
   */
  async function logout() {
    try {
      await api.post('/auth/logout')
    } catch {
      // Ignore errors — always clear local state
    }
    localStorage.removeItem('access_token')
    _token.value = null
    user.value = null
  }

  return { user, isLoggedIn, login, register, logout, fetchMe }
}
