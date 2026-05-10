<template>
  <div class="sales-root">

    <AuthGate
      v-if="!isLoggedIn"
      title="Login untuk Pesanan"
      message="Masuk dulu untuk lihat pesanan masuk dari pembeli."
    />

    <template v-else>
      <!-- Header -->
      <section class="section-gap">
        <div class="header-wrap">
          <button @click="goBack" class="back-btn" aria-label="Back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <div class="section-accent fashion-accent"></div>
          <h1 class="page-title">Pesanan Masuk</h1>
        </div>
        <p class="page-sub">Kelola pesanan dari pembeli barang kamu.</p>
      </section>

      <!-- Filter tabs with count badges -->
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
      <div v-if="loading" class="orders-list">
        <div v-for="i in 3" :key="i" class="order-card glass-panel">
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
        <button @click="fetchOrders" class="retry-btn">Coba Lagi</button>
      </div>

      <!-- Empty -->
      <div v-else-if="filteredOrders.length === 0" class="empty-state reveal">
        <div class="empty-icon">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
            <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
          </svg>
        </div>
        <p class="empty-title">Belum Ada Pesanan</p>
        <p class="empty-sub">
          {{ activeFilter === 'all' ? 'Belum ada pembeli yang memesan barang kamu.' : `Tidak ada pesanan dengan status "${activeLabelText}".` }}
        </p>
        <router-link to="/profile/sell" class="empty-cta">Pasang Barang →</router-link>
      </div>

      <!-- Orders -->
      <div v-else class="orders-list">
        <div
          v-for="(order, idx) in filteredOrders"
          :key="order.id"
          class="order-card glass-panel reveal"
          :class="`reveal-delay-${(idx % 3) + 1}`"
        >
          <div class="order-header">
            <span class="order-id">#{{ order.transaction_id || order.id }}</span>
            <span class="order-status" :class="getStatusClass(order.status)">{{ order.status }}</span>
          </div>

          <!-- Item -->
          <div class="order-items">
            <div class="order-item">
              <div class="item-thumb">
                <img v-if="order.product_image" :src="order.product_image" :alt="order.product_name" class="w-full h-full object-cover" />
              </div>
              <div class="item-info">
                <p class="item-name">{{ order.product_name }}</p>
                <p class="item-meta">
                  <span v-if="order.size">Size {{ order.size }}</span>
                  <span v-if="order.size && order.qty"> · </span>
                  <span v-if="order.qty">Qty {{ order.qty }}</span>
                  <span v-if="order.condition"> · {{ order.condition }}</span>
                </p>
                <p class="item-buyer">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <span>{{ order.buyer?.name || 'Pembeli' }}</span>
                </p>
                <p class="item-price">Rp {{ formatPrice((order.price || 0) * (order.qty || 1)) }}</p>
              </div>
            </div>
          </div>

          <!-- Tracking info shown for shipped orders -->
          <div v-if="order.status === 'Dikirim' && order.tracking_number" class="tracking-pill">
            <div class="tracking-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="1" y="3" width="15" height="13"/>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                <circle cx="5.5" cy="18.5" r="2.5"/>
                <circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
            </div>
            <div class="tracking-text">
              <p class="tracking-label">No. Resi</p>
              <p class="tracking-number">{{ order.tracking_number }}</p>
            </div>
          </div>

          <!-- Footer -->
          <div class="order-footer">
            <div>
              <p class="order-date">{{ formatDate(order.created_at) }}</p>
              <p class="order-total">Total: <span class="order-total-value">Rp {{ formatPrice(order.total || (order.price || 0) * (order.qty || 1)) }}</span></p>
            </div>
            <div class="order-actions">
              <button
                v-if="order.status === 'Diproses' && shippingId !== order.id"
                @click="openShipForm(order.id)"
                class="action-btn ship-btn"
              >
                Kirim Barang
              </button>
            </div>
          </div>

          <!-- Inline ship form -->
          <transition name="ship-fade">
            <div v-if="shippingId === order.id" class="ship-form">
              <p class="ship-form-title">Input Nomor Resi</p>
              <div class="ship-form-row">
                <input
                  v-model="trackingInput"
                  type="text"
                  placeholder="cth. JNE1234567890"
                  class="ship-input"
                  :disabled="submittingShip"
                  @keyup.enter="submitShip(order.id)"
                />
                <button
                  type="button"
                  @click="submitShip(order.id)"
                  class="ship-submit-btn"
                  :disabled="submittingShip || !trackingInput.trim()"
                >
                  {{ submittingShip ? 'Mengirim...' : 'Kirim' }}
                </button>
                <button
                  type="button"
                  @click="cancelShip"
                  class="ship-cancel-btn"
                  :disabled="submittingShip"
                  aria-label="Batal"
                >
                  ×
                </button>
              </div>
              <p v-if="shipError" class="ship-error">{{ shipError }}</p>
            </div>
          </transition>
        </div>
      </div>
    </template>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
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
  { label: 'Semua',      value: 'all' },
  { label: 'Diproses',   value: 'Diproses' },
  { label: 'Dikirim',    value: 'Dikirim' },
  { label: 'Selesai',    value: 'Selesai' },
  { label: 'Dibatalkan', value: 'Dibatalkan' },
]

const activeFilter = ref('all')
const activeLabelText = computed(() => filters.find(f => f.value === activeFilter.value)?.label || '')

const orders  = ref([])
const loading = ref(false)
const error   = ref(null)

// Ship form state
const shippingId    = ref(null)
const trackingInput = ref('')
const submittingShip = ref(false)
const shipError      = ref(null)

const formatPrice = (p) => (p || 0).toLocaleString('id-ID')
const formatDate  = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

const getStatusClass = (s) => ({
  Diproses:   'status-pending',
  Dikirim:    'status-ship',
  Selesai:    'status-done',
  Dibatalkan: 'status-cancel',
}[s] || 'status-pending')

const counts = computed(() => {
  const c = { all: orders.value.length, Diproses: 0, Dikirim: 0, Selesai: 0, Dibatalkan: 0 }
  for (const o of orders.value) {
    if (c[o.status] !== undefined) c[o.status]++
  }
  return c
})

const filteredOrders = computed(() => {
  if (activeFilter.value === 'all') return orders.value
  return orders.value.filter(o => o.status === activeFilter.value)
})

async function fetchOrders() {
  if (!isLoggedIn.value) return
  loading.value = true
  error.value = null
  try {
    const params = {}
    if (activeFilter.value !== 'all') params.status = activeFilter.value
    const data = await api.get('/orders/sales', { params })
    orders.value = Array.isArray(data) ? data : []
  } catch (e) {
    error.value = e.message || 'Gagal memuat pesanan masuk.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchOrders)
watch(activeFilter, fetchOrders)

const openShipForm = (id) => {
  shippingId.value = id
  trackingInput.value = ''
  shipError.value = null
}

const cancelShip = () => {
  shippingId.value = null
  trackingInput.value = ''
  shipError.value = null
}

async function submitShip(id) {
  const tn = trackingInput.value.trim()
  if (!tn) {
    shipError.value = 'Nomor resi tidak boleh kosong.'
    return
  }
  submittingShip.value = true
  shipError.value = null
  try {
    await api.patch(`/orders/sales/${id}/ship`, { tracking_number: tn })
    cancelShip()
    await fetchOrders()
  } catch (e) {
    shipError.value = e.message || 'Gagal mengirim barang.'
  } finally {
    submittingShip.value = false
  }
}
</script>

<style scoped>
@reference "../assets/main.css";

.sales-root { @apply pb-8; padding: 1rem; }
.section-gap { @apply mb-6; }
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

/* Order cards */
.orders-list { @apply flex flex-col gap-4; }
.order-card { @apply rounded-2xl p-4 sm:p-5; border: 2px solid #111; box-shadow: 4px 4px 0 0 #111; }
.order-header { @apply flex items-center justify-between mb-3; }
.order-id { @apply text-xs font-bold text-black/50 uppercase tracking-wider; }
.order-status { @apply text-[11px] font-bold px-3 py-1 rounded-md uppercase tracking-wider; }
.status-pending  { background: rgba(234,179,8,0.15); color: #a16207; }
.status-ship     { background: rgba(102,155,188,0.18); color: #003049; }
.status-done     { background: rgba(22,163,74,0.14); color: #166534; }
.status-cancel   { background: rgba(193,18,31,0.12); color: #C1121F; }

.order-items { @apply flex flex-col gap-3 mb-3; }
.order-item { @apply flex items-start gap-3; }
.item-thumb { @apply w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl overflow-hidden; background: #FDF0D5; border: 2px solid #111; }
.item-info { @apply flex-1 min-w-0; }
.item-name { @apply text-sm font-bold text-gray-900 truncate; }
.item-meta { @apply text-xs text-black/50 mt-0.5; }
.item-buyer { @apply flex items-center gap-1 text-[11px] text-black/60 mt-1 font-semibold; }
.item-price { @apply text-sm font-bold text-[#C1121F] mt-1; }

/* Tracking pill */
.tracking-pill { @apply flex items-center gap-3 mb-3 p-3 rounded-xl; background: rgba(102,155,188,0.12); border: 2px solid #003049; }
.tracking-icon { @apply w-9 h-9 rounded-lg flex items-center justify-center text-white flex-shrink-0; background: linear-gradient(135deg, #669BBC, #003049); border: 2px solid #111; }
.tracking-text { @apply flex-1 min-w-0; }
.tracking-label { @apply text-[10px] font-bold uppercase tracking-wider text-[#003049]/70; }
.tracking-number { @apply text-sm font-bold text-[#003049] tracking-wide truncate; font-family: 'CalSans', serif; }

/* Footer / actions */
.order-footer { @apply flex items-end justify-between gap-3 pt-3 border-t border-black/5 flex-wrap; }
.order-date { @apply text-[10px] text-black/40 uppercase tracking-wide font-bold mb-1; }
.order-total { @apply text-sm text-black/60; }
.order-total-value { @apply font-bold text-gray-900; }
.order-actions { @apply flex gap-2 flex-wrap; }
.action-btn { @apply px-3 py-1.5 text-[11px] font-bold rounded-lg; border: 2px solid #111; transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease, color 0.15s ease; }
.ship-btn { @apply text-white; background: linear-gradient(135deg, #C1121F, #780000); box-shadow: 2px 2px 0 0 #111; }
.ship-btn:hover { transform: translate(1px,1px); box-shadow: 1px 1px 0 0 #111; }

/* Inline ship form */
.ship-form { @apply mt-3 pt-3 border-t-2 border-dashed border-black/15; }
.ship-form-title { @apply text-[11px] font-bold uppercase tracking-widest text-black/70 mb-2; }
.ship-form-row { @apply flex items-stretch gap-2; }
.ship-input { @apply flex-1 h-10 px-3 rounded-lg text-sm bg-white outline-none; border: 2px solid #111; transition: border-color 0.15s ease, box-shadow 0.15s ease; }
.ship-input:focus { border-color: #C1121F; box-shadow: 0 0 0 3px rgba(193,18,31,0.18); }
.ship-input:disabled { @apply opacity-60 cursor-not-allowed; }
.ship-submit-btn { @apply px-4 h-10 text-xs font-bold rounded-lg text-white whitespace-nowrap; background: linear-gradient(135deg, #C1121F, #780000); border: 2px solid #111; box-shadow: 2px 2px 0 0 #111; transition: transform 0.15s ease, box-shadow 0.15s ease; }
.ship-submit-btn:hover:not(:disabled) { transform: translate(1px,1px); box-shadow: 1px 1px 0 0 #111; }
.ship-submit-btn:disabled { @apply opacity-60 cursor-not-allowed; }
.ship-cancel-btn { @apply w-10 h-10 rounded-lg text-lg font-bold leading-none bg-white text-black/70; border: 2px solid #111; box-shadow: 2px 2px 0 0 #111; transition: transform 0.15s ease, box-shadow 0.15s ease, color 0.15s ease; }
.ship-cancel-btn:hover:not(:disabled) { color: #C1121F; transform: translate(1px,1px); box-shadow: 1px 1px 0 0 #111; }
.ship-cancel-btn:disabled { @apply opacity-60 cursor-not-allowed; }
.ship-error { @apply text-[11px] font-semibold text-[#C1121F] mt-2; }
.ship-fade-enter-active, .ship-fade-leave-active { transition: opacity 0.18s ease, transform 0.18s ease; }
.ship-fade-enter-from, .ship-fade-leave-to { opacity: 0; transform: translateY(-4px); }

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
</style>
