import { ref, computed } from 'vue'
import api from '@/services/api'

// ── Singleton — shared across components ──────────────────────────────────────
const notifications = ref([])
const _loaded = ref(false)

const unreadCount = computed(() => notifications.value.filter((n) => !n.is_read).length)

// ── Composable ────────────────────────────────────────────────────────────────
export function useNotifications() {
  /** Fetch all notifications from the backend. */
  async function fetchNotifications() {
    const data = await api.get('/notifications')
    notifications.value = Array.isArray(data) ? data : []
    _loaded.value = true
  }

  /** Get a single notification by id (from the cached list). */
  const getById = (id) => notifications.value.find((n) => n.id === String(id))

  /** Mark a single notification as read. */
  async function markAsRead(id) {
    const n = getById(id)
    if (n) n.is_read = true // optimistic
    try {
      await api.patch(`/notifications/${id}/read`)
    } catch {
      if (n) n.is_read = false // rollback
    }
  }

  /** Mark all notifications as read. */
  async function markAllRead() {
    notifications.value.forEach((n) => { n.is_read = true }) // optimistic
    try {
      await api.patch('/notifications/read-all')
    } catch {
      notifications.value.forEach((n) => { n.is_read = false })
    }
  }

  return {
    notifications,
    unreadCount,
    _loaded,
    fetchNotifications,
    getById,
    markAsRead,
    markAllRead,
  }
}
