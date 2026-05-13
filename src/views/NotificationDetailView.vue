<template>
  <div class="detail-root">

    <!-- ═══════════════════════════════════════ AUTH GATE ═══════════════════════════════════════ -->
    <AuthGate
      v-if="!isLoggedIn"
      title="Login untuk Notifikasi"
      message="Masuk dulu untuk lihat detail notifikasi."
    />

    <template v-else>
    <!-- ═══════════════════════════════════════ HEADER ═══════════════════════════════════════ -->
    <section class="section-gap">
      <div class="header-wrap">
        <button @click="goBack" class="back-btn" aria-label="Back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
        <div class="section-accent fashion-accent"></div>
        <h1 class="page-title">Detail Notifikasi</h1>
      </div>
    </section>

    <!-- ═══════════════════════════════════════ NOT FOUND ═══════════════════════════════════════ -->
    <div v-if="!notif" class="empty-state reveal">
      <div class="empty-icon">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <p class="empty-title">Notifikasi Tidak Ditemukan</p>
      <p class="empty-sub">Notifikasi ini mungkin sudah dihapus.</p>
      <router-link to="/notifications" class="back-link">Kembali ke Notifikasi</router-link>
    </div>

    <!-- ═══════════════════════════════════════ DETAIL CARD ═══════════════════════════════════════ -->
    <template v-else>
      <!-- Hero card -->
      <section class="reveal mb-5">
        <div class="hero-card" :class="heroBgClass(notif.type)">
          <div class="hero-overlay"></div>
          <div class="hero-deco"></div>

          <div class="hero-icon">
            <span>{{ typeIcon(notif.type) }}</span>
          </div>
          <span class="hero-tag">{{ typeLabel(notif.type) }}</span>
          <h2 class="hero-title">{{ notif.title }}</h2>
          <p class="hero-time">{{ formatDate(notif.created_at) }}</p>
        </div>
      </section>

      <!-- Detail body -->
      <section class="reveal reveal-delay-1 mb-5">
        <div class="sub-header">
          <div class="section-accent fashion-accent"></div>
          <p class="sub-title">Detail</p>
        </div>
        <div class="body-card glass-panel">
          <p class="body-message">{{ notif.message }}</p>
          <p class="body-detail">{{ notif.detail }}</p>
        </div>
      </section>

      <!-- Meta info -->
      <section class="reveal reveal-delay-2 mb-5">
        <div class="sub-header">
          <div class="section-accent fashion-accent"></div>
          <p class="sub-title">Informasi</p>
        </div>
        <div class="meta-card glass-panel">
          <div class="meta-row">
            <span class="meta-key">Tipe</span>
            <span class="meta-val">{{ typeLabel(notif.type) }}</span>
          </div>
          <div class="meta-row">
            <span class="meta-key">Waktu</span>
            <span class="meta-val">{{ formatDate(notif.created_at) }}</span>
          </div>
          <div class="meta-row">
            <span class="meta-key">Status</span>
            <span class="meta-val status-read">Sudah dibaca</span>
          </div>
          <div class="meta-row">
            <span class="meta-key">ID Notifikasi</span>
            <span class="meta-val font-mono">#{{ shortId(notif.id) }}</span>
          </div>
        </div>
      </section>

      <!-- Action -->
      <section class="reveal reveal-delay-3">
        <router-link v-if="notif.link" :to="notif.link" class="action-btn">
          <span>{{ notif.link_label || 'Lihat Detail' }}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </router-link>
        <button @click="goBack" class="back-action-btn">Kembali ke Daftar</button>
      </section>
    </template>
    </template>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { useAuth } from '@/composables/useAuth'
import AuthGate from '@/components/AuthGate.vue'
import api from '@/services/api'

useScrollReveal()
const route = useRoute()
const router = useRouter()
const { isLoggedIn } = useAuth()

const notif = ref(null)
const loading = ref(false)

async function fetchNotif() {
  loading.value = true
  try {
    const data = await api.get(`/notifications/${route.params.id}`)
    notif.value = data
  } catch (e) {
    notif.value = null
  } finally {
    loading.value = false
  }
}

onMounted(fetchNotif)

const goBack = () => {
  if (window.history.state?.back) router.back()
  else router.push('/notifications')
}

const typeLabel = (type) => {
  if (type === 'order') return 'Pesanan'
  if (type === 'chat') return 'Pesan'
  if (type === 'promo') return 'Promo'
  return 'Lainnya'
}

const heroBgClass = (type) => {
  if (type === 'promo') return 'hero-sports'
  if (type === 'chat') return 'hero-dark'
  return 'hero-fashion'
}

const typeIcon = (type) => {
  if (type === 'order') return '📦'
  if (type === 'chat') return '💬'
  if (type === 'promo') return '🏷️'
  return '🔔'
}

const formatDate = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return d.toLocaleString('id-ID', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const shortId = (id) => {
  if (!id) return ''
  return String(id).slice(0, 8).toUpperCase()
}
</script>

<style scoped>
@reference "../assets/main.css";

/* ── Root ───────────────────────────────────────────────────────────────────── */
.detail-root {
  @apply pb-8;
  padding: 1rem;
}
.section-gap {
  @apply mb-6;
}

/* ── Header ─────────────────────────────────────────────────────────────────── */
.header-wrap {
  @apply flex items-center gap-3;
}
.back-btn {
  @apply w-9 h-9 rounded-lg flex items-center justify-center
         text-black/70 bg-white
         transition-all duration-200 active:scale-90;
  border: 2px solid #111;
  box-shadow: 2px 2px 0 0 #111;
}
.back-btn:hover {
  color: #C1121F;
  transform: translate(1px, 1px);
  box-shadow: 1px 1px 0 0 #111;
}
.section-accent {
  @apply w-1 h-7 rounded-full flex-shrink-0;
}
.fashion-accent {
  background: linear-gradient(135deg, #C1121F, #780000);
}
.page-title {
  @apply text-2xl font-bold tracking-tight text-gray-900;
  font-family: 'CalSans', serif;
}

/* ── Empty / Not found ─────────────────────────────────────────────────────── */
.empty-state {
  @apply flex flex-col items-center justify-center text-center py-20;
}
.empty-icon {
  @apply w-20 h-20 rounded-full flex items-center justify-center mb-5;
  background: linear-gradient(135deg, #C1121F, #780000);
  border: 2px solid #111;
  box-shadow: 4px 4px 0 0 #111;
}
.empty-title {
  @apply text-xl font-bold text-gray-900 mb-1;
  font-family: 'CalSans', serif;
}
.empty-sub {
  @apply text-sm text-black/50 mb-5;
}
.back-link {
  @apply px-5 py-2.5 text-xs font-bold rounded-xl text-white no-underline;
  background: linear-gradient(135deg, #C1121F, #780000);
  border: 2px solid #111;
  box-shadow: 3px 3px 0 0 #111;
  transition: all 0.15s ease;
}
.back-link:hover {
  transform: translate(1.5px, 1.5px);
  box-shadow: 1.5px 1.5px 0 0 #111;
}

/* ── Hero card ─────────────────────────────────────────────────────────────── */
.hero-card {
  @apply relative overflow-hidden rounded-2xl p-6 sm:p-7 text-white;
  border: 2px solid #111;
  box-shadow: 6px 6px 0 0 #111;
}
.hero-fashion {
  background: linear-gradient(135deg, #C1121F, #780000);
}
.hero-sports {
  background: linear-gradient(135deg, #669BBC, #003049);
}
.hero-dark {
  background: linear-gradient(135deg, #111111, #333333);
}
.hero-overlay {
  @apply absolute inset-0 bg-white/5 pointer-events-none;
}
.hero-deco {
  @apply absolute -top-12 -right-12 w-40 h-40 rounded-full pointer-events-none;
  background: rgba(255, 255, 255, 0.08);
}
.hero-icon {
  @apply relative z-10 w-14 h-14 rounded-full flex items-center justify-center text-2xl bg-white/15 mb-3;
  border: 2px solid #fff;
}
.hero-tag {
  @apply relative z-10 inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md bg-white/20 mb-3;
  border: 1.5px solid rgba(255, 255, 255, 0.5);
}
.hero-title {
  @apply relative z-10 text-2xl sm:text-3xl font-bold leading-tight mb-2;
  font-family: 'CalSans', serif;
  letter-spacing: -0.01em;
}
.hero-time {
  @apply relative z-10 text-xs text-white/75 font-semibold;
}

/* ── Sub header ────────────────────────────────────────────────────────────── */
.sub-header {
  @apply flex items-center gap-2 mb-3;
}
.sub-header .section-accent {
  @apply h-4;
}
.sub-title {
  @apply text-[11px] font-bold uppercase tracking-widest text-black/50;
}

/* ── Body card ─────────────────────────────────────────────────────────────── */
.body-card {
  @apply rounded-2xl p-4 sm:p-5;
  border: 2px solid #111;
  box-shadow: 4px 4px 0 0 #111;
}
.body-message {
  @apply text-sm font-bold text-gray-900 mb-3 leading-snug;
}
.body-detail {
  @apply text-[13px] text-black/65 leading-relaxed;
}

/* ── Meta card ─────────────────────────────────────────────────────────────── */
.meta-card {
  @apply rounded-2xl p-4 sm:p-5 divide-y divide-black/10;
  border: 2px solid #111;
  box-shadow: 4px 4px 0 0 #111;
}
.meta-row {
  @apply flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0;
}
.meta-key {
  @apply text-[11px] font-bold uppercase tracking-wider text-black/50;
}
.meta-val {
  @apply text-xs font-semibold text-black/80;
}
.status-read {
  @apply text-emerald-600;
}
.font-mono {
  font-family: 'Courier New', monospace;
}

/* ── Action ────────────────────────────────────────────────────────────────── */
.action-btn {
  @apply w-full flex items-center justify-center gap-2 py-3.5 mb-3
         text-white text-sm font-bold rounded-xl no-underline
         transition-all duration-150;
  background: linear-gradient(135deg, #C1121F, #780000);
  border: 2px solid #111;
  box-shadow: 4px 4px 0 0 #111;
}
.action-btn:hover {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 0 #111;
}
.action-btn:active {
  transform: translate(4px, 4px);
  box-shadow: 0 0 0 0 #111;
}
.back-action-btn {
  @apply w-full py-3 bg-white text-black/70 text-sm font-bold rounded-xl
         transition-all duration-150;
  border: 2px solid #111;
  box-shadow: 3px 3px 0 0 #111;
}
.back-action-btn:hover {
  transform: translate(1.5px, 1.5px);
  box-shadow: 1.5px 1.5px 0 0 #111;
}
.back-action-btn:active {
  transform: translate(3px, 3px);
  box-shadow: 0 0 0 0 #111;
}
</style>
