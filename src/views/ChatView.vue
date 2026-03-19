<template>
  <div class="min-h-screen bg-[#FDF0D5] flex flex-col">
    <div class="px-4 pt-4 max-w-6xl mx-auto w-full flex-1">
      <h1 class="text-2xl font-bold mb-4" style="font-family: 'CalSans', serif;">Chat</h1>

      <!-- Chat list -->
      <div v-if="!activeChatId" class="space-y-2">
        <div
          v-for="chat in chats"
          :key="chat.id"
          @click="activeChatId = chat.id"
          class="flex items-center gap-3 bg-white/60 rounded-xl p-3 cursor-pointer hover:bg-white transition-colors reveal"
        >
          <div class="w-12 h-12 rounded-full flex-shrink-0 overflow-hidden" :class="chat.color">
            <div class="w-full h-full flex items-center justify-center text-white font-bold text-lg">{{ chat.name[0] }}</div>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
              <p class="font-bold text-sm">{{ chat.name }}</p>
              <span class="text-[10px] text-black/40">{{ chat.time }}</span>
            </div>
            <p class="text-xs text-black/50 truncate">{{ chat.lastMessage }}</p>
          </div>
          <div v-if="chat.unread" class="w-5 h-5 bg-[#C1121F] rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">{{ chat.unread }}</div>
        </div>
      </div>

      <!-- Active chat -->
      <div v-else class="flex flex-col h-[calc(100vh-120px)]">
        <div class="flex items-center gap-3 mb-4">
          <button @click="activeChatId = null" class="p-1 hover:bg-black/5 rounded-lg transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <div class="w-9 h-9 rounded-full bg-[#669BBC] flex items-center justify-center text-white font-bold">S</div>
          <div>
            <p class="font-bold text-sm">SecondSeller</p>
            <p class="text-xs text-green-500">Online</p>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto space-y-3 pb-4">
          <div v-for="msg in messages" :key="msg.id" class="flex" :class="msg.mine ? 'justify-end' : 'justify-start'">
            <div class="max-w-[75%] px-3 py-2 rounded-2xl text-sm"
              :class="msg.mine ? 'bg-[#C1121F] text-white rounded-br-sm' : 'bg-white/80 text-black rounded-bl-sm'"
            >{{ msg.text }}</div>
          </div>
        </div>

        <div class="flex gap-2 pt-2 border-t border-black/10">
          <input v-model="newMessage" @keyup.enter="sendMessage" type="text" placeholder="Ketik pesan..." class="flex-1 h-10 px-4 rounded-full bg-white/80 border border-black/20 text-sm focus:outline-none focus:border-[#C1121F]" />
          <button @click="sendMessage" class="w-10 h-10 bg-[#C1121F] rounded-full flex items-center justify-center text-white hover:bg-[#780000] transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useScrollReveal } from '@/composables/useScrollReveal'
useScrollReveal()

const activeChatId = ref(null)
const newMessage = ref('')

const chats = ref([
  { id: 1, name: 'SecondSeller', lastMessage: 'Oke kak, barang sudah disiapkan', time: '10:30', unread: 2, color: 'bg-[#669BBC]' },
  { id: 2, name: 'FashionStore', lastMessage: 'Masih available kak!', time: '09:15', unread: 1, color: 'bg-[#C1121F]' },
  { id: 3, name: 'ThriftKing', lastMessage: 'Boleh nego kak', time: 'Kemarin', unread: 0, color: 'bg-[#780000]' },
])

const messages = ref([
  { id: 1, text: 'Halo kak, masih available?', mine: true },
  { id: 2, text: 'Masih kak! Kondisi like new', mine: false },
  { id: 3, text: 'Boleh foto lebih detail?', mine: true },
  { id: 4, text: 'Oke kak, barang sudah disiapkan', mine: false },
])

const sendMessage = () => {
  if (newMessage.value.trim()) {
    messages.value.push({ id: Date.now(), text: newMessage.value, mine: true })
    newMessage.value = ''
  }
}
</script>