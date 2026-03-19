<template>
  <div class="min-h-screen bg-[#FDF0D5] pb-8">
    <div class="px-4 pt-4 max-w-6xl mx-auto">
      <h1 class="text-2xl font-bold mb-4" style="font-family: 'CalSans', serif;">Notifikasi</h1>

      <div class="space-y-2">
        <div
          v-for="notif in notifications"
          :key="notif.id"
          class="flex gap-3 p-3 rounded-xl transition-colors reveal cursor-pointer"
          :class="notif.read ? 'bg-white/40' : 'bg-white/80'"
          @click="notif.read = true"
        >
          <div class="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white text-lg"
            :class="notif.type === 'order' ? 'bg-[#C1121F]' : notif.type === 'promo' ? 'bg-[#669BBC]' : 'bg-[#780000]'"
          >{{ notif.icon }}</div>
          <div class="flex-1">
            <p class="text-sm font-bold" :class="notif.read ? 'text-black/60' : 'text-black'">{{ notif.title }}</p>
            <p class="text-xs text-black/50 mt-0.5">{{ notif.message }}</p>
            <p class="text-[10px] text-black/30 mt-1">{{ notif.time }}</p>
          </div>
          <div v-if="!notif.read" class="w-2 h-2 bg-[#C1121F] rounded-full flex-shrink-0 mt-2"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useScrollReveal } from '@/composables/useScrollReveal'
useScrollReveal()

const notifications = ref([
  { id: 1, type: 'order', icon: '📦', title: 'Pesanan Dikonfirmasi', message: 'Insurgent Graphic Tee sudah dikonfirmasi penjual', time: '5 menit lalu', read: false },
  { id: 2, type: 'promo', icon: '🏷️', title: 'Flash Sale Fashion!', message: 'Diskon hingga 50% untuk koleksi fashion hari ini', time: '1 jam lalu', read: false },
  { id: 3, type: 'chat', icon: '💬', title: 'Pesan Baru', message: 'SecondSeller: Oke kak, barang sudah disiapkan', time: '2 jam lalu', read: false },
  { id: 4, type: 'promo', icon: '⚽', title: 'Sports Week', message: 'Koleksi olahraga terbaru sudah hadir!', time: '1 hari lalu', read: true },
  { id: 5, type: 'order', icon: '✅', title: 'Ulasan Berhasil', message: 'Terima kasih sudah memberikan ulasan!', time: '2 hari lalu', read: true },
])
</script>