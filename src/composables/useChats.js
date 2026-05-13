import { ref, computed } from 'vue'
import api from '@/services/api'

const chats = ref([])
const _loaded = ref(false)

const totalUnread = computed(() =>
  chats.value.reduce((s, c) => s + (c.unread || c.buyer_unread || c.seller_unread || 0), 0)
)

export function useChats() {
  async function fetchChats() {
    try {
      const data = await api.get('/chats')
      chats.value = Array.isArray(data) ? data : []
      _loaded.value = true
    } catch {
      chats.value = []
    }
  }

  async function markChatRead(chatId) {
    // Optimistic: zero out unread for this chat locally
    const idx = chats.value.findIndex(c => c.id === chatId)
    let prev = 0
    if (idx !== -1) {
      prev = chats.value[idx].unread || 0
      chats.value[idx].unread = 0
    }
    try {
      await api.patch(`/chats/${chatId}/read`)
    } catch {
      // Rollback
      if (idx !== -1) chats.value[idx].unread = prev
    }
  }

  return { chats, totalUnread, _loaded, fetchChats, markChatRead }
}
