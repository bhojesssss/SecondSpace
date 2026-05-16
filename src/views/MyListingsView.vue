<template>
  <div class="listings-root">

    <AuthGate
      v-if="!isLoggedIn"
      title="Login untuk Barang Saya"
      message="Masuk dulu untuk kelola barang yang kamu jual."
    />

    <template v-else>
      <!-- Header -->
      <section class="section-gap">
        <div class="header-wrap">
          <button @click="goBack" class="back-btn" aria-label="Back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <div class="section-accent fashion-accent"></div>
          <h1 class="page-title">Barang Saya</h1>
        </div>
        <p class="page-sub">Kelola, edit, dan pantau progres barang yang kamu jual.</p>
      </section>

      <!-- Filter tabs -->
      <section class="section-gap reveal">
        <div class="filter-track scrollbar-hide">
          <button
            v-for="f in filters"
            :key="f.value"
            @click="activeFilter = f.value"
            class="filter-btn"
            :class="activeFilter === f.value ? 'filter-active' : 'filter-inactive glass-panel'"
          >
            <span>{{ f.label }}</span>
            <span class="filter-count" :class="activeFilter === f.value ? 'count-on' : 'count-off'">
              {{ counts[f.value] || 0 }}
            </span>
          </button>
        </div>
      </section>

      <!-- Loading -->
      <div v-if="loading" class="listing-list">
        <div v-for="i in 3" :key="i" class="listing-card glass-panel">
          <div class="flex gap-4 items-start">
            <div class="skeleton w-24 h-24 rounded-xl flex-shrink-0"></div>
            <div class="flex-1 flex flex-col gap-2 py-1">
              <div class="skeleton skeleton-line w-3/4"></div>
              <div class="skeleton skeleton-line-sm w-1/2"></div>
              <div class="skeleton skeleton-line w-1/3 mt-2"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="error-banner">
        <p class="error-text">{{ error }}</p>
        <button @click="fetchListings" class="retry-btn">Coba Lagi</button>
      </div>

      <!-- Empty -->
      <div v-else-if="filteredListings.length === 0" class="empty-state reveal">
        <div class="empty-icon">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m3 7 2-4h14l2 4"/><path d="M5 7v13a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7"/><path d="M3 7h18"/><path d="M9 11v4"/><path d="M15 11v4"/>
          </svg>
        </div>
        <p class="empty-title">Belum Ada Barang</p>
        <p class="empty-sub">
          {{ activeFilter === 'all' ? 'Belum ada barang yang kamu jual.' : `Tidak ada barang dengan status "${activeLabelText}".` }}
        </p>
        <router-link to="/profile/sell" class="empty-cta">Pasang Barang →</router-link>
      </div>

      <!-- Listings -->
      <div v-else class="listing-list">
        <div
          v-for="(p, idx) in filteredListings"
          :key="p.id"
          class="listing-card glass-panel reveal"
          :class="`reveal-delay-${(idx % 3) + 1}`"
        >
          <!-- Top: thumb + info + status -->
          <div class="listing-top">
            <router-link :to="`/product/${p.id}`" class="thumb-link" aria-label="Lihat detail">
              <div class="thumb">
                <img v-if="p.images?.[0]" :src="p.images[0]" :alt="p.name" class="w-full h-full object-cover" />
              </div>
            </router-link>
            <div class="listing-info">
              <div class="info-head">
                <p class="item-name">{{ p.name }}</p>
                <span class="status-pill" :class="getStatusClass(p)">{{ getStatusLabel(p) }}</span>
              </div>
              <p class="item-meta">
                <span v-if="p.categories?.name">{{ p.categories.name }}</span>
                <span v-if="p.categories?.name && p.size"> · </span>
                <span v-if="p.size">Size {{ p.size }}</span>
                <span v-if="p.condition"> · {{ p.condition }}</span>
              </p>
              <p class="item-price">Rp {{ formatPrice(p.price) }}</p>
            </div>
          </div>

          <!-- Progress stats -->
          <div class="progress-row">
            <div class="progress-stat">
              <div class="stat-icon fashion-bg">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7 9 18l-5-5"/></svg>
              </div>
              <div class="stat-text">
                <p class="stat-value">{{ p.sold_count || 0 }}</p>
                <p class="stat-label">Terjual</p>
              </div>
            </div>
            <div class="progress-stat">
              <div class="stat-icon sports-bg">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <div class="stat-text">
                <p class="stat-value">{{ p.pending_orders || 0 }}</p>
                <p class="stat-label">Diproses</p>
              </div>
            </div>
            <div class="progress-stat">
              <div class="stat-icon dark-bg">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/></svg>
              </div>
              <div class="stat-text">
                <p class="stat-value">{{ formatDate(p.created_at) }}</p>
                <p class="stat-label">Dipasang</p>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="action-row">
            <button
              type="button"
              class="action-btn toggle-btn"
              :disabled="togglingId === p.id"
              @click="toggleAvailability(p)"
            >
              <svg v-if="p.is_available" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
              <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              {{ togglingId === p.id ? '...' : (p.is_available ? 'Nonaktifkan' : 'Aktifkan') }}
            </button>
            <button
              type="button"
              class="action-btn edit-btn"
              @click="editListing(p.id)"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Edit
            </button>
            <button
              type="button"
              class="action-btn delete-btn"
              :disabled="deletingId === p.id"
              @click="confirmDelete(p)"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              {{ deletingId === p.id ? '...' : 'Hapus' }}
            </button>
          </div>
        </div>
      </div>
    </template>

    <!-- Delete confirm modal -->
    <transition name="modal-fade">
      <div v-if="pendingDelete" class="modal-overlay" @click.self="cancelDelete">
        <div class="modal-card">
          <div class="modal-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </div>
          <p class="modal-title">Hapus Barang?</p>
          <p class="modal-sub">"{{ pendingDelete.name }}" akan dihapus permanen dari katalog kamu.</p>
          <div class="modal-actions">
            <button class="modal-btn modal-cancel" @click="cancelDelete" :disabled="deletingId">Batal</button>
            <button class="modal-btn modal-confirm" @click="doDelete" :disabled="deletingId">{{ deletingId ? 'Menghapus...' : 'Hapus' }}</button>
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { useAuth } from '@/composables/useAuth'
import AuthGate from '@/components/AuthGate.vue'
import api from '@/services/api'

useScrollReveal()
const router = useRouter()
const { isLoggedIn } = useAuth()

const goBack = () => {
  if (window.history.state?.back) router.back()
  else router.push('/profile')
}

const filters = [
  { label: 'Semua',     value: 'all' },
  { label: 'Aktif',     value: 'active' },
  { label: 'Terjual',   value: 'sold' },
  { label: 'Nonaktif',  value: 'inactive' },
]
const activeFilter = ref('all')
const activeLabelText = computed(() => filters.find(f => f.value === activeFilter.value)?.label || '')

const listings = ref([])
const loading  = ref(false)
const error    = ref(null)

const togglingId = ref(null)
const deletingId = ref(null)
const pendingDelete = ref(null)

const formatPrice = (p) => (p || 0).toLocaleString('id-ID')
const formatDate = (iso) => {
  if (!iso) return '-'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return '-'
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
}

const getStatusKey = (p) => {
  if (p.is_available) return 'active'
  if ((p.sold_count || 0) > 0) return 'sold'
  return 'inactive'
}
const getStatusLabel = (p) => ({ active: 'Aktif', sold: 'Terjual', inactive: 'Nonaktif' }[getStatusKey(p)])
const getStatusClass = (p) => ({ active: 'status-active', sold: 'status-sold', inactive: 'status-inactive' }[getStatusKey(p)])

const counts = computed(() => {
  const c = { all: listings.value.length, active: 0, sold: 0, inactive: 0 }
  for (const p of listings.value) c[getStatusKey(p)]++
  return c
})

const filteredListings = computed(() => {
  if (activeFilter.value === 'all') return listings.value
  return listings.value.filter(p => getStatusKey(p) === activeFilter.value)
})

async function fetchListings() {
  if (!isLoggedIn.value) return
  loading.value = true
  error.value = null
  try {
    const data = await api.get('/users/me/products')
    listings.value = Array.isArray(data) ? data : []
  } catch (e) {
    error.value = e.message || 'Gagal memuat barang.'
  } finally {
    loading.value = false
  }
}

async function toggleAvailability(p) {
  togglingId.value = p.id
  const prev = p.is_available
  // Optimistic
  p.is_available = !prev
  try {
    await api.patch(`/products/${p.id}`, { is_available: !prev })
  } catch (e) {
    p.is_available = prev
    error.value = e.message || 'Gagal mengubah status.'
  } finally {
    togglingId.value = null
  }
}

const editListing = (id) => router.push(`/profile/sell?edit=${id}`)

const confirmDelete = (p) => { pendingDelete.value = p }
const cancelDelete = () => { if (!deletingId.value) pendingDelete.value = null }

async function doDelete() {
  if (!pendingDelete.value) return
  const id = pendingDelete.value.id
  deletingId.value = id
  try {
    await api.delete(`/products/${id}`)
    listings.value = listings.value.filter(x => x.id !== id)
    pendingDelete.value = null
  } catch (e) {
    error.value = e.message || 'Gagal menghapus barang.'
  } finally {
    deletingId.value = null
  }
}

onMounted(fetchListings)
</script>

<style scoped>
@reference "../assets/main.css";

.listings-root { @apply pb-8; padding: 0.75rem; }
@media (min-width: 640px) { .listings-root { padding: 1rem; } }
.section-gap { @apply mb-5 sm:mb-6; }
.header-wrap { @apply flex items-center gap-3; }
.back-btn { @apply w-9 h-9 rounded-lg flex items-center justify-center text-black/70 bg-white transition-all duration-200; border: 2px solid #111; box-shadow: 2px 2px 0 0 #111; }
.back-btn:hover { color: #C1121F; transform: translate(1px,1px); box-shadow: 1px 1px 0 0 #111; }
.section-accent { @apply w-1 h-7 rounded-full flex-shrink-0; }
.fashion-accent { background: linear-gradient(135deg, #C1121F, #780000); }
.page-title { @apply text-2xl font-bold tracking-tight text-gray-900; font-family: 'CalSans', serif; }
.page-sub { @apply text-sm text-black/55 mt-2 ml-12; }

/* Filter tabs */
.filter-track { @apply flex gap-2.5 overflow-x-auto pb-2; }
.filter-btn { @apply flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl; border: 2px solid #111; transition: transform 0.15s ease, box-shadow 0.15s ease; }
.filter-active { @apply text-white; background: linear-gradient(135deg, #C1121F, #780000); box-shadow: 3px 3px 0 0 #111; }
.filter-active:hover { transform: translate(1.5px,1.5px); box-shadow: 1.5px 1.5px 0 0 #111; }
.filter-inactive { @apply text-black/70; }
.filter-inactive:hover { box-shadow: 2px 2px 0 0 #111; transform: translate(-1px,-1px); }
.filter-count { @apply text-[10px] font-bold px-2 py-0.5 rounded-md min-w-[20px] text-center; }
.count-on  { background: rgba(255,255,255,0.22); color: white; }
.count-off { background: rgba(0,0,0,0.08); color: rgba(0,0,0,0.6); }

/* Listing cards */
.listing-list { @apply flex flex-col gap-3 sm:gap-4; }
.listing-card { @apply rounded-2xl p-3 sm:p-5; border: 2px solid #111; box-shadow: 3px 3px 0 0 #111; }
@media (min-width: 640px) { .listing-card { box-shadow: 4px 4px 0 0 #111; } }
.listing-top { @apply flex items-start gap-3 mb-3; }
.thumb-link { @apply flex-shrink-0; }
.thumb { @apply w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden; background: #FDF0D5; border: 2px solid #111; }
.listing-info { @apply flex-1 min-w-0; }
.info-head { @apply flex items-start justify-between gap-2; }
.item-name { @apply text-sm font-bold text-gray-900 flex-1; line-height: 1.3; }
.item-meta { @apply text-xs text-black/50 mt-0.5; }
.item-price { @apply text-sm font-bold text-[#C1121F] mt-1; font-family: 'CalSans', serif; }

.status-pill { @apply text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider whitespace-nowrap flex-shrink-0; }
.status-active   { background: rgba(22,163,74,0.14); color: #166534; }
.status-sold     { background: rgba(102,155,188,0.18); color: #003049; }
.status-inactive { background: rgba(0,0,0,0.08); color: rgba(0,0,0,0.5); }

/* Progress */
.progress-row { @apply grid grid-cols-3 gap-1.5 sm:gap-2 mb-3 pt-3 border-t border-black/5; }
.progress-stat { @apply flex items-center gap-1.5 sm:gap-2 min-w-0; }
.stat-icon { @apply w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center text-white flex-shrink-0; border: 2px solid #111; }
.fashion-bg { background: linear-gradient(135deg, #C1121F, #780000); }
.sports-bg { background: linear-gradient(135deg, #669BBC, #003049); }
.dark-bg { background: linear-gradient(135deg, #111111, #333333); }
.stat-text { @apply min-w-0; }
.stat-value { @apply text-xs sm:text-sm font-bold text-gray-900 truncate; font-family: 'CalSans', serif; }
.stat-label { @apply text-[9px] font-bold uppercase tracking-wider text-black/50 truncate; }

/* Actions */
.action-row { @apply flex gap-1.5 sm:gap-2 flex-wrap; }
.action-btn { @apply inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 text-[10px] sm:text-[11px] font-bold rounded-lg; border: 2px solid #111; transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease, color 0.15s ease; }
.action-btn:disabled { @apply opacity-60 cursor-not-allowed; }
.toggle-btn { @apply bg-white text-black/75; box-shadow: 2px 2px 0 0 #111; }
.toggle-btn:hover:not(:disabled) { background: #FDF0D5; transform: translate(1px,1px); box-shadow: 1px 1px 0 0 #111; }
.edit-btn { @apply text-white; background: linear-gradient(135deg, #669BBC, #003049); box-shadow: 2px 2px 0 0 #111; }
.edit-btn:hover:not(:disabled) { transform: translate(1px,1px); box-shadow: 1px 1px 0 0 #111; }
.delete-btn { @apply text-white; background: linear-gradient(135deg, #C1121F, #780000); box-shadow: 2px 2px 0 0 #111; }
.delete-btn:hover:not(:disabled) { transform: translate(1px,1px); box-shadow: 1px 1px 0 0 #111; }

/* Empty / error / skeleton */
.empty-state { @apply flex flex-col items-center justify-center text-center py-20; }
.empty-icon { @apply w-20 h-20 rounded-full flex items-center justify-center mb-5; background: linear-gradient(135deg, #C1121F, #780000); border: 2px solid #111; box-shadow: 4px 4px 0 0 #111; }
.empty-title { @apply text-xl font-bold text-gray-900 mb-1; font-family: 'CalSans', serif; }
.empty-sub { @apply text-sm text-black/50 mb-6 max-w-xs; }
.empty-cta { @apply inline-block px-6 py-3 text-sm font-bold rounded-xl text-white no-underline; background: linear-gradient(135deg, #C1121F, #780000); border: 2px solid #111; box-shadow: 4px 4px 0 0 #111; transition: transform 0.15s ease, box-shadow 0.15s ease; }
.empty-cta:hover { transform: translate(2px,2px); box-shadow: 2px 2px 0 0 #111; }

.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
.skeleton { @apply animate-pulse bg-black/10 rounded-xl; }
.skeleton-line { height: 14px; @apply rounded-md; }
.skeleton-line-sm { height: 12px; @apply rounded-md; }
.error-banner { @apply flex flex-col items-center gap-3 py-10 text-center; }
.error-text { @apply text-sm font-semibold text-[#C1121F]; }
.retry-btn { @apply px-5 py-2 text-sm font-bold rounded-xl text-white; background: linear-gradient(135deg, #C1121F, #780000); border: 2px solid #111; box-shadow: 3px 3px 0 0 #111; }

/* Delete confirm modal */
.modal-overlay { @apply fixed inset-0 z-50 flex items-center justify-center p-5; background: rgba(0,0,0,0.45); backdrop-filter: blur(6px); }
.modal-card { @apply w-full max-w-sm rounded-2xl p-6 bg-white text-center; border: 2px solid #111; box-shadow: 6px 6px 0 0 #111; }
.modal-icon { @apply w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3; background: linear-gradient(135deg, #C1121F, #780000); border: 2px solid #111; box-shadow: 3px 3px 0 0 #111; }
.modal-title { @apply text-lg font-bold text-gray-900 mb-1; font-family: 'CalSans', serif; }
.modal-sub { @apply text-sm text-black/55 mb-5; }
.modal-actions { @apply flex gap-2; }
.modal-btn { @apply flex-1 py-2.5 text-sm font-bold rounded-xl; border: 2px solid #111; transition: transform 0.15s ease, box-shadow 0.15s ease; }
.modal-btn:disabled { @apply opacity-60 cursor-not-allowed; }
.modal-cancel { @apply bg-white text-black/75; box-shadow: 3px 3px 0 0 #111; }
.modal-cancel:hover:not(:disabled) { background: #FDF0D5; transform: translate(1.5px,1.5px); box-shadow: 1.5px 1.5px 0 0 #111; }
.modal-confirm { @apply text-white; background: linear-gradient(135deg, #C1121F, #780000); box-shadow: 3px 3px 0 0 #111; }
.modal-confirm:hover:not(:disabled) { transform: translate(1.5px,1.5px); box-shadow: 1.5px 1.5px 0 0 #111; }
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
</style>
