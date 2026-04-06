<template>
  <div class="min-h-screen bg-[#FDF0D5] pb-8">
    <div class="max-w-6xl mx-auto">

      <!-- Profile Header -->
      <div class="px-4 pt-6 pb-6 reveal">
        <div class="bg-gradient-to-br from-[#003049] to-[#669BBC] rounded-3xl p-6 shadow-xl relative overflow-hidden text-white flex flex-col items-center">
          <div class="absolute inset-0 bg-white/5"></div>
          <div class="w-20 h-20 rounded-full bg-white text-[#003049] flex items-center justify-center text-3xl font-bold shadow-lg mb-4 z-10 border-4 border-white/20">U</div>
          <div class="text-center z-10">
            <h2 class="text-2xl font-bold mb-1" style="font-family: 'CalSans', serif;">Username</h2>
            <p class="text-sm text-white/80 opacity-90 mb-3 tracking-wide">Bandar Lampung, Lampung</p>
            <div class="flex items-center justify-center gap-4 mt-2 mb-4 bg-black/20 rounded-full py-1.5 px-4 backdrop-blur-sm w-fit mx-auto border border-white/10">
              <span class="text-xs font-medium">⭐ 4.9</span>
              <span class="text-xs text-white/30">|</span>
              <span class="text-xs font-medium">12 Terjual</span>
              <span class="text-xs text-white/30">|</span>
              <span class="text-xs font-medium">5 Ulasan</span>
            </div>
          </div>
          <button class="z-10 px-6 py-2 border border-white/30 text-xs font-bold rounded-full hover:bg-white hover:text-[#003049] active:scale-95 transition-all shadow-md">Edit Profile</button>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-3 gap-3 mt-[-20px] px-2 z-20 relative">
          <div v-for="stat in stats" :key="stat.label" class="glass-panel shadow-md hover:shadow-lg rounded-2xl p-4 text-center active:scale-[0.98] transition-all">
            <p class="text-xl font-bold mb-1" :style="{ color: stat.color }" style="font-family: 'CalSans', serif;">{{ stat.value }}</p>
            <p class="text-[11px] text-black/60 font-bold uppercase tracking-wider">{{ stat.label }}</p>
          </div>
        </div>
      </div>

      <!-- Menu List -->
      <div class="px-4 space-y-4 pb-4">
        <div v-for="group in menuGroups" :key="group.title" class="reveal">
          <p class="text-xs text-black/40 font-bold uppercase tracking-widest pl-2 mb-2">{{ group.title }}</p>
          <div class="glass-panel shadow-sm rounded-2xl overflow-hidden divide-y divide-black/5">
            <router-link
              v-for="item in group.items"
              :key="item.label"
              :to="item.path"
              class="flex items-center gap-4 px-5 py-4 hover:bg-white active:bg-white active:scale-[0.98] transition-all"
            >
              <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl bg-black/5">
                {{ item.icon }}
              </div>
              <span class="text-sm font-bold flex-1 text-black/80">{{ item.label }}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-black/20">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </router-link>
          </div>
        </div>

        <!-- Logout -->
        <button class="w-full mt-6 mb-2 py-4 border-2 border-[#C1121F] bg-transparent text-[#C1121F] font-bold rounded-xl active:bg-[#C1121F] hover:bg-[#C1121F] active:text-white hover:text-white active:scale-95 transition-all duration-300 text-sm shadow-sm group">
          <span class="group-active:-translate-y-0.5 transition-transform inline-block">Keluar</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useScrollReveal } from '@/composables/useScrollReveal'
useScrollReveal()

const stats = [
  { label: 'Pembelian', value: 8, color: '#C1121F' },
  { label: 'Penjualan', value: 12, color: '#780000' },
  { label: 'Wishlist', value: 24, color: '#669BBC' },
]

const menuGroups = [
  {
    title: 'Transaksi',
    items: [
      { icon: '🛍️', label: 'Pesanan Saya', path: '/cart' },
      { icon: '📦', label: 'Riwayat Pembelian', path: '/profile/history' },
      { icon: '🏷️', label: 'Jual Barang', path: '/profile/sell' },
    ]
  },
  {
    title: 'Akun',
    items: [
      { icon: '👤', label: 'Edit Profil', path: '/profile/edit' },
      { icon: '📍', label: 'Alamat Saya', path: '/profile/address' },
      { icon: '🔔', label: 'Notifikasi', path: '/notifications' },
    ]
  },
  {
    title: 'Lainnya',
    items: [
      { icon: '❓', label: 'Bantuan', path: '/profile/help' },
      { icon: '📋', label: 'Syarat & Ketentuan', path: '/profile/terms' },
    ]
  }
]
</script>