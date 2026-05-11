<template>
  <div class="chat-root">

    <AuthGate v-if="!isLoggedIn" title="Login untuk Chat" message="Masuk dulu untuk chat dengan seller dan tanya barang." />

    <!-- Chat List -->
    <div v-else-if="!activeChatId">
      <section class="section-gap">
        <div class="section-title-wrap">
          <div class="section-accent fashion-accent"></div>
          <h1 class="page-title">Chat <span v-if="totalUnread > 0" class="unread-badge">{{ totalUnread }}</span></h1>
        </div>
      </section>

      <!-- Loading skeleton -->
      <div v-if="loadingChats" class="chat-list">
        <div v-for="i in 3" :key="i" class="chat-item glass-panel">
          <div class="skeleton w-12 h-12 rounded-full flex-shrink-0"></div>
          <div class="flex-1 flex flex-col gap-2">
            <div class="skeleton skeleton-line w-1/2"></div>
            <div class="skeleton skeleton-line-sm w-3/4"></div>
          </div>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="errorChats" class="error-banner">
        <p class="error-text">{{ errorChats }}</p>
        <button @click="fetchChats" class="retry-btn">Coba Lagi</button>
      </div>

      <!-- Empty -->
      <div v-else-if="chats.length === 0" class="empty-state reveal">
        <div class="empty-icon">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </div>
        <p class="empty-title">Belum Ada Percakapan</p>
        <p class="empty-sub">Mulai chat dengan penjual untuk tanya barang.</p>
      </div>

      <!-- Chat cards -->
      <div v-else class="chat-list">
        <div v-for="(chat, idx) in chats" :key="chat.id" @click="openChat(chat)" class="chat-item glass-panel reveal" :class="`reveal-delay-${(idx % 4) + 1}`">
          <div class="chat-avatar" :class="chat.gradient || 'avatar-fashion'">{{ (chat.name || chat.other_user?.name || '?')[0].toUpperCase() }}</div>
          <div class="chat-info">
            <div class="chat-info-top">
              <p class="chat-name">{{ chat.name || chat.other_user?.name || 'Pengguna' }}</p>
              <span class="chat-time">{{ chat.time || chat.last_message_at || '' }}</span>
            </div>
            <p class="chat-preview" :class="chat.unread ? 'chat-preview-unread' : ''">{{ chat.lastMessage || chat.last_message || '' }}</p>
          </div>
          <div v-if="chat.unread" class="chat-unread-pill">{{ chat.unread }}</div>
        </div>
      </div>
    </div>

    <!-- Active Chat -->
    <div v-else class="active-chat">
      <div class="active-header">
        <button @click="activeChatId = null" class="back-btn" aria-label="Back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div class="active-avatar">{{ (activeChat?.name || activeChat?.other_user?.name || '?')[0].toUpperCase() }}</div>
        <div class="active-meta">
          <p class="active-name">{{ activeChat?.name || activeChat?.other_user?.name || 'Pengguna' }}</p>
          <div class="online-row"><span class="online-dot"></span><span class="online-text">Online</span></div>
        </div>
      </div>

      <!-- Loading messages -->
      <div v-if="loadingMessages" class="messages-area">
        <div v-for="i in 4" :key="i" class="msg-row" :class="i % 2 === 0 ? 'justify-end' : 'justify-start'">
          <div class="skeleton rounded-2xl h-10" :class="i % 2 === 0 ? 'w-40' : 'w-52'"></div>
        </div>
      </div>

      <div v-else class="messages-area scrollbar-hide" ref="messagesArea">
        <div v-for="msg in messages" :key="msg.id" class="msg-row" :class="isMyMessage(msg) ? 'justify-end' : 'justify-start'">
          <div class="msg-bubble" :class="isMyMessage(msg) ? 'msg-mine' : 'msg-theirs glass-panel'">
            {{ msg.text || msg.message || msg.content }}
          </div>
        </div>
      </div>

      <div class="input-row">
        <div class="flex-1 relative">
          <input v-model="newMessage" @keyup.enter="sendMessage" type="text" placeholder="Ketik pesan..." class="msg-input glass-panel" />
        </div>
        <button @click="sendMessage" class="send-btn" :disabled="sending" aria-label="Send">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { useAuth } from '@/composables/useAuth'
import AuthGate from '@/components/AuthGate.vue'
import api from '@/services/api'

useScrollReveal()
const { isLoggedIn, user } = useAuth()

const activeChatId = ref(null)
const activeChat   = ref(null)
const newMessage   = ref('')
const sending      = ref(false)
const messagesArea = ref(null)

// Chats list
const chats        = ref([])
const loadingChats = ref(false)
const errorChats   = ref(null)

const totalUnread = computed(() => chats.value.reduce((s, c) => s + (c.unread || 0), 0))

async function fetchChats() {
  if (!isLoggedIn.value) return
  loadingChats.value = true
  errorChats.value = null
  try {
    const data = await api.get('/chats')
    chats.value = Array.isArray(data) ? data : []
  } catch (e) {
    errorChats.value = e.message || 'Gagal memuat daftar chat.'
  } finally {
    loadingChats.value = false
  }
}

onMounted(fetchChats)

// Messages
const messages        = ref([])
const loadingMessages = ref(false)

async function fetchMessages(chatId) {
  loadingMessages.value = true
  try {
    const data = await api.get(`/chats/${chatId}/messages`)
    messages.value = Array.isArray(data) ? data : []
    await nextTick()
    if (messagesArea.value) messagesArea.value.scrollTop = messagesArea.value.scrollHeight
  } catch (e) {
    console.error('Gagal memuat pesan:', e.message)
  } finally {
    loadingMessages.value = false
  }
}

function openChat(chat) {
  activeChatId.value = chat.id
  activeChat.value = chat
}

watch(activeChatId, (id) => {
  if (id) fetchMessages(id)
  else messages.value = []
})

async function sendMessage() {
  const text = newMessage.value.trim()
  if (!text || !activeChatId.value || sending.value) return

  // Optimistic append
  const optimistic = { id: `temp-${Date.now()}`, text, mine: true, is_mine: true, sender_id: user.value?.id }
  messages.value.push(optimistic)
  newMessage.value = ''
  sending.value = true
  await nextTick()
  if (messagesArea.value) messagesArea.value.scrollTop = messagesArea.value.scrollHeight

  try {
    const data = await api.post(`/chats/${activeChatId.value}/messages`, { text })
    // Replace optimistic with real message
    const idx = messages.value.findIndex(m => m.id === optimistic.id)
    if (idx !== -1) messages.value[idx] = { ...data, mine: true, is_mine: true }
  } catch (e) {
    // Rollback
    messages.value = messages.value.filter(m => m.id !== optimistic.id)
    alert('Gagal mengirim pesan: ' + (e.message || ''))
  } finally {
    sending.value = false
  }
}

function isMyMessage(msg) {
  if (msg.mine === true || msg.is_mine === true) return true
  return msg.sender_id && user.value?.id && msg.sender_id === user.value.id
}
</script>

<style scoped>
@reference "../assets/main.css";

.chat-root { @apply pb-8; padding: 1rem; }
.section-gap { @apply mb-6; }
.section-title-wrap { @apply flex items-center gap-3; }
.section-accent { @apply w-1 h-7 rounded-full flex-shrink-0; }
.fashion-accent { background: linear-gradient(135deg, #C1121F, #780000); }
.page-title { @apply text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2; font-family: 'CalSans', serif; letter-spacing: -0.01em; }
.unread-badge { @apply text-xs font-bold text-white rounded-md px-2 py-0.5 min-w-[22px] text-center; background: linear-gradient(135deg, #C1121F, #780000); font-family: 'Helvetica', sans-serif; box-shadow: 0 2px 8px -2px rgba(193,18,31,0.5); }

.empty-state { @apply flex flex-col items-center justify-center text-center py-20; }
.empty-icon { @apply w-20 h-20 rounded-full flex items-center justify-center mb-5; background: linear-gradient(135deg, #C1121F, #780000); border: 2px solid #111; box-shadow: 4px 4px 0 0 #111; }
.empty-title { @apply text-xl font-bold text-gray-900 mb-1; font-family: 'CalSans', serif; }
.empty-sub { @apply text-sm text-black/50; }

.chat-list { @apply flex flex-col gap-3; }
.chat-item { @apply flex items-center gap-3 sm:gap-4 rounded-2xl p-3 sm:p-4 cursor-pointer; border: 2px solid #111; box-shadow: 4px 4px 0 0 #111; transition: transform 0.15s ease, box-shadow 0.15s ease; }
.chat-item:hover { transform: translate(1.5px,1.5px); box-shadow: 2.5px 2.5px 0 0 #111; }
.chat-avatar { @apply w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-lg; border: 2px solid #111; }
.avatar-fashion { background: linear-gradient(135deg, #C1121F, #780000); }
.avatar-sports  { background: linear-gradient(135deg, #669BBC, #003049); }
.avatar-dark    { background: linear-gradient(135deg, #111111, #333333); }
.chat-info { @apply flex-1 min-w-0; }
.chat-info-top { @apply flex items-center justify-between gap-2 mb-0.5; }
.chat-name { @apply font-bold text-sm text-gray-900 truncate; }
.chat-time { @apply text-[10px] text-black/40 flex-shrink-0 uppercase tracking-wide font-bold; }
.chat-preview { @apply text-xs text-black/50 truncate; }
.chat-preview-unread { @apply text-black/80 font-semibold; }
.chat-unread-pill { @apply min-w-[22px] h-[22px] px-1.5 rounded-md flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0; background: linear-gradient(135deg, #C1121F, #780000); }

.active-chat { @apply flex flex-col; height: calc(100dvh - 12rem); }
@media (min-width: 768px) { .active-chat { height: calc(100dvh - 8rem); } }
.active-header { @apply flex items-center gap-3 mb-4 pb-4 border-b border-black/5; }
.back-btn { @apply w-9 h-9 rounded-lg flex items-center justify-center text-black/70 hover:bg-black/5 hover:text-[#C1121F] transition-all duration-200 active:scale-90; }
.active-avatar { @apply w-10 h-10 rounded-full flex items-center justify-center text-white font-bold; background: linear-gradient(135deg, #669BBC, #003049); border: 2px solid #111; }
.active-meta { @apply flex flex-col; }
.active-name { @apply font-bold text-sm text-gray-900; }
.online-row { @apply flex items-center gap-1.5 mt-0.5; }
.online-dot { @apply w-1.5 h-1.5 rounded-full bg-emerald-500; box-shadow: 0 0 6px rgba(16,185,129,0.6); }
.online-text { @apply text-[11px] font-semibold text-emerald-600; }

.messages-area { @apply flex-1 overflow-y-auto flex flex-col gap-3 pb-4 pr-1; }
.msg-row { @apply flex; }
.msg-bubble { @apply max-w-[75%] px-4 py-2.5 text-sm leading-snug transition-transform duration-200; }
.msg-mine   { @apply text-white rounded-2xl rounded-br-md; background: linear-gradient(135deg, #C1121F, #780000); border: 2px solid #111; box-shadow: 3px 3px 0 0 #111; }
.msg-theirs { @apply text-gray-900 rounded-2xl rounded-bl-md; border: 2px solid #111; box-shadow: 3px 3px 0 0 #111; }

.input-row { @apply flex gap-2 pt-3 border-t border-black/5; }
.msg-input { @apply w-full h-12 pl-5 pr-4 rounded-xl text-sm focus:outline-none transition-colors duration-200; border: 2px solid #111; }
.msg-input:focus { border-color: #C1121F; }
.send-btn { @apply w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0; background: linear-gradient(135deg, #C1121F, #780000); border: 2px solid #111; box-shadow: 3px 3px 0 0 #111; transition: transform 0.15s ease, box-shadow 0.15s ease; }
.send-btn:hover:not(:disabled) { transform: translate(1.5px,1.5px); box-shadow: 1.5px 1.5px 0 0 #111; }
.send-btn:disabled { @apply opacity-60 cursor-not-allowed; }

.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

.skeleton { @apply animate-pulse bg-black/10 rounded-xl; }
.skeleton-line { height: 14px; @apply rounded-md; }
.skeleton-line-sm { height: 12px; @apply rounded-md; }
.error-banner { @apply flex flex-col items-center gap-3 py-10 text-center; }
.error-text { @apply text-sm font-semibold text-[#C1121F]; }
.retry-btn { @apply px-5 py-2 text-sm font-bold rounded-xl text-white; background: linear-gradient(135deg, #C1121F, #780000); border: 2px solid #111; box-shadow: 3px 3px 0 0 #111; }
</style>
