<template>
  <div class="min-h-screen bg-[#FDF0D5] pb-8">
    <div class="max-w-6xl mx-auto">

      <!-- Profile Header -->
      <div class="px-4 pt-6 pb-4 reveal">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-16 h-16 rounded-full bg-[#669BBC] flex items-center justify-center text-white text-2xl font-bold shadow-lg">U</div>
          <div>
            <h2 class="text-lg font-bold" style="font-family: 'CalSans', serif;">Username</h2>
            <p class="text-xs text-black/50">Bandar Lampung, Lampung</p>
            <div class="flex items-center gap-3 mt-1">
              <span class="text-xs text-black/50">⭐ 4.9</span>
              <span class="text-xs text-black/30">|</span>
              <span class="text-xs text-black/50">12 Terjual</span>
              <span class="text-xs text-black/30">|</span>
              <span class="text-xs text-black/50">5 Ulasan</span>
            </div>
          </div>
          <button class="ml-auto px-3 py-1.5 border border-black/20 text-xs font-bold rounded-full hover:bg-black hover:text-white transition-colors">Edit</button>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-3 gap-2">
          <div v-for="stat in stats" :key="stat.label" class="bg-white/60 rounded-xl p-3 text-center">
            <p class="text-lg font-bold" :style="{ color: stat.color }">{{ stat.value }}</p>
            <p class="text-[10px] text-black/50 mt-0.5">{{ stat.label }}</p>
          </div>
        </div>
      </div>

      <!-- Menu List -->
      <div class="px-4 space-y-2">
        <div v-for="group in menuGroups" :key="group.title" class="reveal">
          <p class="text-xs text-black/40 font-bold uppercase tracking-wider mb-2 mt-4">{{ group.title }}</p>
          <div class="bg-white/60 rounded-xl overflow-hidden divide-y divide-black/5">
            <router-link
              v-for="item in group.items"
              :key="item.label"
              :to="item.path"
              class="flex items-center gap-3 px-4 py-3 hover:bg-white transition-colors"
            >
              <span class="text-lg">{{ item.icon }}</span>
              <span class="text-sm flex-1">{{ item.label }}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-black/30">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </router-link>
          </div>
        </div>

        <!-- Logout -->
        <button class="w-full mt-4 py-3 border-2 border-red-500 text-red-500 font-bold rounded-xl hover:bg-red-500 hover:text-white transition-colors text-sm">
          Keluar
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