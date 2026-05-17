<template>
  <div class="profile-root">
    <!-- ══════════════ GUEST ══════════════ -->
    <section v-if="!isLoggedIn" class="reveal mb-6">
      <div class="hero-card">
        <div class="hero-overlay"></div>
        <div class="hero-deco-1"></div>
        <div class="hero-deco-2"></div>
        <div class="hero-avatar">
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <div class="hero-content">
          <h2 class="hero-name">Guest</h2>
          <p class="hero-loc">Belum login ke SecondSpace</p>
          <router-link to="/login" class="hero-edit-btn">Login Sekarang</router-link>
        </div>
      </div>
      <p class="guest-switch">
        Belum punya akun? <router-link to="/register" class="guest-switch-link">Daftar</router-link>
      </p>
    </section>

    <!-- ══════════════ LOGGED IN ══════════════ -->
    <section v-else class="reveal mb-6">
      <div class="hero-card">
        <div class="hero-overlay"></div>
        <div class="hero-deco-1"></div>
        <div class="hero-deco-2"></div>
        <div class="hero-avatar">{{ (user?.name || 'U')[0].toUpperCase() }}</div>
        <div class="hero-content">
          <h2 class="hero-name">{{ user?.name || 'Pengguna' }}</h2>
          <p class="hero-loc">{{ user?.city || 'Indonesia' }}</p>
          <div class="hero-stats-pill">
            <span class="hero-stat-text">⭐ {{ user?.rating || '5.0' }}</span>
            <span class="hero-stat-divider"></span>
            <span class="hero-stat-text">{{ user?.total_sold || 0 }} Terjual</span>
            <span class="hero-stat-divider"></span>
            <span class="hero-stat-text">{{ user?.total_purchased || 0 }} Dibeli</span>
          </div>
          <router-link to="/profile/edit" class="hero-edit-btn">Edit Profile</router-link>
        </div>
      </div>

      <!-- Stat cards -->
      <div class="stats-grid" style="margin-top: 10px">
        <!-- Skeleton while stats loading -->
        <template v-if="loadingStats">
          <div v-for="i in 3" :key="i" class="stat-card glass-panel">
            <div class="skeleton h-6 w-10 mx-auto mb-1 rounded-md"></div>
            <div class="skeleton h-3 w-16 mx-auto rounded-md"></div>
          </div>
        </template>
        <template v-else>
          <div v-for="stat in stats" :key="stat.label" class="stat-card glass-panel">
            <p class="stat-value" :style="{ color: stat.color }">{{ stat.value }}</p>
            <p class="stat-label">{{ stat.label }}</p>
          </div>
        </template>
      </div>
    </section>

    <!-- ══════════════ MENU ══════════════ -->
    <section v-if="isLoggedIn" class="menu-section">
      <div
        v-for="(group, gi) in menuGroups"
        :key="group.title"
        class="reveal"
        :class="`reveal-delay-${(gi % 3) + 1}`"
      >
        <div class="menu-group-header">
          <div class="section-accent fashion-accent"></div>
          <p class="menu-group-title" style="margin-top: 10px">{{ group.title }}</p>
        </div>
        <div class="menu-card glass-panel">
          <router-link
            v-for="item in group.items"
            :key="item.label"
            :to="item.path"
            class="menu-item"
          >
            <div class="menu-icon" v-html="icons[item.icon]"></div>
            <span class="menu-label">{{ item.label }}</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              class="menu-chevron"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </router-link>
        </div>
      </div>

      <button @click="handleLogout" class="logout-btn" :disabled="loggingOut">
        {{ loggingOut ? 'Keluar...' : 'Keluar' }}
      </button>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { useAuth } from '@/composables/useAuth'
import api from '@/services/api'

useScrollReveal()
const router = useRouter()
const { user, isLoggedIn, logout } = useAuth()

const loggingOut = ref(false)
const loadingStats = ref(false)
const stats = ref([
  { label: 'Pembelian', value: 0, color: '#C1121F' },
  { label: 'Penjualan', value: 0, color: '#780000' },
  { label: 'Wishlist', value: 0, color: '#669BBC' },
])

async function handleLogout() {
  loggingOut.value = true
  try {
    await logout()
  } finally {
    loggingOut.value = false
  }
  router.push('/')
}

async function fetchStats() {
  if (!isLoggedIn.value) return
  loadingStats.value = true
  try {
    const data = await api.get('/users/me/stats')
    stats.value = [
      {
        label: 'Pembelian',
        value: data.purchases ?? data.total_purchased ?? user.value?.total_purchased ?? 0,
        color: '#C1121F',
      },
      {
        label: 'Penjualan',
        value: data.sales ?? data.total_sold ?? user.value?.total_sold ?? 0,
        color: '#780000',
      },
      { label: 'Wishlist', value: data.wishlist ?? 0, color: '#669BBC' },
    ]
  } catch {
    // Fail silently — stats are decorative
  } finally {
    loadingStats.value = false
  }
}

onMounted(fetchStats)

const wrap = (paths) =>
  `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`

const icons = {
  bag: wrap(
    '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  ),
  package: wrap(
    '<path d="m7.5 4.27 9 5.15"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
  ),
  tag: wrap(
    '<path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>',
  ),
  inbox: wrap(
    '<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
  ),
  user: wrap('<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>'),
  pin: wrap(
    '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  ),
  bell: wrap(
    '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
  ),
  help: wrap(
    '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  ),
  doc: wrap(
    '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
  ),
  heart: wrap(
    '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
  ),
  store: wrap(
    '<path d="m3 7 2-4h14l2 4"/><path d="M5 7v13a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7"/><path d="M3 7h18"/><path d="M9 11v4"/><path d="M15 11v4"/>',
  ),
}

const menuGroups = [
  {
    title: 'Transaksi',
    items: [
      { icon: 'bag', label: 'Pesanan Saya', path: '/cart' },
      { icon: 'package', label: 'Riwayat Pembelian', path: '/profile/history' },
      { icon: 'heart', label: 'Wishlist Saya', path: '/profile/wishlist' },
      { icon: 'tag', label: 'Jual Barang', path: '/profile/sell' },
      { icon: 'store', label: 'Barang Saya', path: '/profile/listings' },
      { icon: 'inbox', label: 'Pesanan Masuk', path: '/profile/sales' },
    ],
  },
  {
    title: 'Akun',
    items: [
      { icon: 'user', label: 'Edit Profil', path: '/profile/edit' },
      { icon: 'pin', label: 'Alamat Saya', path: '/profile/address' },
      { icon: 'bell', label: 'Notifikasi', path: '/notifications' },
    ],
  },
  {
    title: 'Lainnya',
    items: [
      { icon: 'help', label: 'Bantuan', path: '/profile/help' },
      { icon: 'doc', label: 'Syarat & Ketentuan', path: '/profile/terms' },
    ],
  },
]
</script>

<style scoped>
@reference "../assets/main.css";

.profile-root {
  @apply pb-8;
  padding: 0.75rem;
}
@media (min-width: 640px) {
  .profile-root {
    padding: 1rem;
  }
}
.hero-card {
  @apply relative overflow-hidden rounded-3xl p-5 sm:p-8 text-white flex flex-col items-center;
  background: linear-gradient(135deg, #003049, #669bbc);
  border: 2px solid #111;
  box-shadow: 4px 4px 0 0 #111;
}
@media (min-width: 640px) {
  .hero-card {
    box-shadow: 6px 6px 0 0 #111;
  }
}
.hero-overlay {
  @apply absolute inset-0 bg-white/5 pointer-events-none;
}
.hero-deco-1 {
  @apply absolute -top-12 -right-12 w-40 h-40 rounded-full pointer-events-none;
  background: rgba(255, 255, 255, 0.08);
}
.hero-deco-2 {
  @apply absolute -bottom-16 -left-16 w-48 h-48 rounded-full pointer-events-none;
  background: rgba(255, 255, 255, 0.06);
}
.hero-avatar {
  @apply w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 z-10;
  background: white;
  color: #003049;
  border: 3px solid #111;
  box-shadow: 3px 3px 0 0 #111;
}
@media (min-width: 640px) {
  .hero-avatar {
    box-shadow: 4px 4px 0 0 #111;
  }
}
.hero-content {
  @apply z-10 flex flex-col items-center text-center;
}
.hero-name {
  @apply text-xl sm:text-2xl font-bold mb-1;
  font-family: 'CalSans', serif;
  letter-spacing: -0.01em;
}
.hero-loc {
  @apply text-xs sm:text-sm text-white/80 mb-3 tracking-wide;
}
.hero-stats-pill {
  @apply flex items-center gap-2 sm:gap-3 mb-4 px-3 sm:px-4 py-1.5 rounded-lg border border-white/10 max-w-full;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(8px);
}
.hero-stat-text {
  @apply text-[11px] sm:text-xs font-semibold whitespace-nowrap;
}
.hero-stat-divider {
  @apply w-px h-3;
  background: rgba(255, 255, 255, 0.3);
}
.hero-edit-btn {
  @apply z-10 px-6 py-2 text-xs font-bold rounded-xl bg-white text-[#003049] no-underline;
  border: 2px solid #111;
  box-shadow: 3px 3px 0 0 #111;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}
.hero-edit-btn:hover {
  transform: translate(1.5px, 1.5px);
  box-shadow: 1.5px 1.5px 0 0 #111;
}
.stats-grid {
  @apply grid grid-cols-3 gap-2 sm:gap-3 -mt-5 px-1 sm:px-2 relative z-20;
}
.stat-card {
  @apply rounded-2xl p-3 sm:p-4 text-center bg-white;
  border: 2px solid #111;
  box-shadow: 3px 3px 0 0 #111;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}
.stat-card:hover {
  transform: translate(1px, 1px);
  box-shadow: 2px 2px 0 0 #111;
}
.stat-value {
  @apply text-lg sm:text-xl font-bold mb-1;
  font-family: 'CalSans', serif;
}
.stat-label {
  @apply text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-black/60;
}
.menu-section {
  @apply space-y-5;
}
.menu-group-header {
  @apply flex items-center gap-2 mb-2 pl-1;
}
.section-accent {
  @apply w-1 h-4 rounded-full flex-shrink-0;
}
.fashion-accent {
  background: linear-gradient(135deg, #c1121f, #780000);
}
.menu-group-title {
  @apply text-[11px] font-bold uppercase tracking-widest text-black/50;
}
.menu-card {
  @apply rounded-2xl overflow-hidden divide-y divide-black;
  border: 2px solid #111;
  box-shadow: 3px 3px 0 0 #111;
}
@media (min-width: 640px) {
  .menu-card {
    box-shadow: 4px 4px 0 0 #111;
  }
}
.menu-item {
  @apply flex items-center gap-3 px-3.5 sm:px-5 py-3 sm:py-4 no-underline transition-all duration-200 hover:bg-white/60 active:scale-[0.99];
}
.menu-icon {
  @apply w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0;
  background: rgba(193, 18, 31, 0.1);
  color: #c1121f;
  border: 2px solid #111;
}
.menu-item:hover .menu-icon {
  background: rgba(193, 18, 31, 0.14);
}
.menu-label {
  @apply text-sm font-bold flex-1 text-black/80;
}
.menu-chevron {
  @apply text-black/20 flex-shrink-0;
}
.guest-switch {
  @apply text-center text-sm text-black/60 mt-5;
}
.guest-switch-link {
  @apply font-bold text-[#C1121F] no-underline hover:underline;
}
.logout-btn {
  @apply w-full py-3 sm:py-3.5 mt-2 text-sm font-bold rounded-xl text-[#C1121F] bg-white;
  border: 2px solid #111;
  box-shadow: 3px 3px 0 0 #c1121f;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease,
    background-color 0.15s ease,
    color 0.15s ease;
}
@media (min-width: 640px) {
  .logout-btn {
    box-shadow: 4px 4px 0 0 #c1121f;
  }
}
.logout-btn:hover:not(:disabled) {
  background: #c1121f;
  color: white;
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 0 #c1121f;
}
.logout-btn:disabled {
  @apply opacity-60 cursor-not-allowed;
}
.skeleton {
  @apply animate-pulse bg-black/10;
}
</style>
