<template>
  <div class="min-h-screen bg-[#FDF0D5] pb-8">
    <div class="px-4 pt-4 max-w-6xl mx-auto">
      <h1 class="text-2xl font-bold mb-4" style="font-family: 'CalSans', serif;">Notifikasi</h1>

      <div class="space-y-3 mt-2">
        <div
          v-for="notif in notifications"
          :key="notif.id"
          class="flex gap-4 p-4 rounded-2xl transition-all duration-300 reveal cursor-pointer active:scale-[0.98] shadow-sm hover:shadow-md"
          :class="notif.read ? 'bg-white/40 border border-black/5' : 'glass-panel border-l-4 border-l-[#C1121F]'"
          @click="notif.read = true"
        >
          <div class="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xl shadow-inner"
            :class="notif.type === 'order' ? 'bg-gradient-to-br from-[#C1121F] to-[#780000]' : notif.type === 'promo' ? 'bg-gradient-to-br from-[#669BBC] to-[#003049]' : 'bg-gradient-to-br from-[#111111] to-[#333333]'"
          >{{ notif.icon }}</div>
          <div class="flex-1 mt-0.5">
            <p class="text-sm font-bold" :class="notif.read ? 'text-black/60' : 'text-black'">{{ notif.title }}</p>
            <p class="text-[13px] text-black/60 mt-1 leading-snug">{{ notif.message }}</p>
            <p class="text-[10px] text-black/40 mt-2 tracking-wide uppercase font-bold">{{ notif.time }}</p>
          </div>
          <div v-if="!notif.read" class="w-2.5 h-2.5 bg-gradient-to-br from-[#C1121F] to-[#780000] shadow-sm rounded-full flex-shrink-0 mt-2"></div>
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