import { ref, computed } from 'vue'
import api from '@/services/api'

const chats = ref([])
const _loaded = ref(false)

const totalUnread = computed(() =>
  chats.value.reduce((s, c) => s + (c.unread || 0), 0)
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
    const idx = chats.value.findIndex(c => c.id === chatId)
    let prev = null
    if (idx !== -1) {
      prev = {
        unread: chats.value[idx].unread || 0,
        buyer_unread: chats.value[idx].buyer_unread || 0,
        seller_unread: chats.value[idx].seller_unread || 0,
      }
      chats.value[idx].unread = 0
      chats.value[idx].buyer_unread = 0
      chats.value[idx].seller_unread = 0
    }
    try {
      await api.patch(`/chats/${chatId}/read`)
    } catch {
      if (idx !== -1 && prev) {
        chats.value[idx].unread = prev.unread
        chats.value[idx].buyer_unread = prev.buyer_unread
        chats.value[idx].seller_unread = prev.seller_unread
      }
    }
  }

  return { chats, totalUnread, _loaded, fetchChats, markChatRead }
}
