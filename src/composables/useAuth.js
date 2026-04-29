import { ref, computed } from 'vue'

const user = ref(null)
const isLoggedIn = computed(() => user.value !== null)

const login = (data = {}) => {
  user.value = {
    name: data.name || 'User',
    email: data.email || '',
  }
}

const logout = () => {
  user.value = null
}

export function useAuth() {
  return { user, isLoggedIn, login, logout }
}
