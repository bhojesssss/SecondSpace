<template>
  <div class="history-root">

    <AuthGate v-if="!isLoggedIn" title="Login untuk Riwayat" message="Masuk dulu untuk lihat riwayat pembelian kamu." />

    <template v-else>
      <section class="section-gap">
        <div class="header-wrap">
          <button @click="goBack" class="back-btn" aria-label="Back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <div class="section-accent fashion-accent"></div>
          <h1 class="page-title">Riwayat Pembelian</h1>
        </div>
      </section>

      <!-- Filter tabs -->
      <section class="section-gap reveal">
        <div class="filter-track scrollbar-hide">
          <button v-for="f in filters" :key="f.value" @click="activeFilter = f.value" class="filter-btn" :class="activeFilter === f.value ? 'filter-active' : 'filter-inactive glass-panel'">{{ f.label }}</button>
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
      <div v-else-if="orders.length === 0" class="empty-state reveal">
        <div class="empty-icon">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        </div>
        <p class="empty-title">Belum Ada Pesanan</p>
        <p class="empty-sub">Pesanan dengan status "{{ activeLabelText }}" belum ada.</p>
        <router-link to="/catalog" class="empty-cta">Mulai Belanja →</router-link>
      </div>

      <!-- Orders -->
      <div v-else class="orders-list">
        <div v-for="(order, idx) in orders" :key="order.id" class="order-card glass-panel reveal" :class="`reveal-delay-${(idx % 3) + 1}`">
          <div class="order-header">
            <span class="order-id">#{{ order.id || order.order_id }}</span>
            <span class="order-status" :class="getStatusClass(order.status)">{{ getStatusLabel(order.status) }}</span>
          </div>
          <div class="order-items">
            <div class="order-item">
              <div class="item-thumb"><img :src="order.product_image || ''" :alt="order.product_name" class="w-full h-full object-cover" /></div>
              <div class="item-info">
                <p class="item-name">{{ order.product_name }}</p>
                <p class="item-meta">Size {{ order.size }} · Qty {{ order.qty || 1 }}</p>
                <p class="item-price">Rp {{ formatPrice((order.price || 0) * (order.qty || 1)) }}</p>
              </div>
            </div>
          </div>
          <div class="order-footer">
            <div>
              <p class="order-date">{{ order.created_at || order.date || '' }}</p>
              <p class="order-total">Total: <span class="order-total-value">Rp {{ formatPrice(order.total || order.total_price || 0) }}</span></p>
            </div>
            <div class="order-actions">
              <button v-if="order.status === 'Selesai'" @click="reviewOrder(order.id)" class="action-btn review-btn">Beri Ulasan</button>
              <button v-if="['Diproses'].includes(order.status)" @click="cancelOrder(order.id)" class="action-btn cancel-btn">Batalkan</button>
            </div>
          </div>
        </div>
      </div>
    </template>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { useAuth } from '@/composables/useAuth'
import AuthGate from '@/components/AuthGate.vue'
import api from '@/services/api'

useScrollReveal()
const router = useRouter()
const { isLoggedIn } = useAuth()
const goBack = () => { if (window.history.state?.back) router.back(); else router.push('/profile') }

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

const formatPrice = (p) => (p || 0).toLocaleString('id-ID')

const getStatusLabel = (s) => ({
  Diproses:'Diproses', Dikirim:'Dikirim', Selesai:'Selesai', Dibatalkan:'Dibatalkan',
  // fallback for English values the API might also return
  pending:'Menunggu', processing:'Diproses', shipped:'Dikirim', delivered:'Selesai', cancelled:'Dibatalkan',
}[s] || s)

const getStatusClass = (s) => ({
  Diproses:'status-process', Dikirim:'status-ship', Selesai:'status-done', Dibatalkan:'status-cancel',
  pending:'status-pending', processing:'status-process', shipped:'status-ship', delivered:'status-done', cancelled:'status-cancel',
}[s] || 'status-pending')

async function fetchOrders() {
  if (!isLoggedIn.value) return
  loading.value = true
  error.value = null
  try {
    const params = {}
    if (activeFilter.value !== 'all') params.status = activeFilter.value
    const data = await api.get('/orders', { params })
    orders.value = Array.isArray(data) ? data : []
  } catch (e) {
    error.value = e.message || 'Gagal memuat riwayat pesanan.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchOrders)
watch(activeFilter, fetchOrders)

const reviewOrder = (id) => router.push(`/profile/history/${id}/review`)
const cancelOrder = async (id) => {
  if (!confirm('Batalkan pesanan ini?')) return
  try {
    await api.patch(`/orders/${id}/cancel`)
    await fetchOrders()
  } catch (e) {
    alert('Gagal membatalkan pesanan: ' + (e.message || ''))
  }
}
</script>

<style scoped>
@reference "../assets/main.css";

.history-root { @apply pb-8; padding: 1rem; }
.section-gap { @apply mb-6; }
.header-wrap { @apply flex items-center gap-3; }
.back-btn { @apply w-9 h-9 rounded-lg flex items-center justify-center text-black/70 bg-white transition-all duration-200; border: 2px solid #111; box-shadow: 2px 2px 0 0 #111; }
.back-btn:hover { color: #C1121F; transform: translate(1px,1px); box-shadow: 1px 1px 0 0 #111; }
.section-accent { @apply w-1 h-7 rounded-full flex-shrink-0; }
.fashion-accent { background: linear-gradient(135deg, #C1121F, #780000); }
.page-title { @apply text-2xl font-bold tracking-tight text-gray-900; font-family: 'CalSans', serif; }

.filter-track { @apply flex gap-2.5 overflow-x-auto pb-2; }
.filter-btn { @apply flex-shrink-0 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl; border: 2px solid #111; transition: transform 0.15s ease, box-shadow 0.15s ease; }
.filter-active { @apply text-white; background: linear-gradient(135deg, #C1121F, #780000); box-shadow: 3px 3px 0 0 #111; }
.filter-active:hover { transform: translate(1.5px,1.5px); box-shadow: 1.5px 1.5px 0 0 #111; }
.filter-inactive { @apply text-black/70; }
.filter-inactive:hover { box-shadow: 2px 2px 0 0 #111; transform: translate(-1px,-1px); }

.orders-list { @apply flex flex-col gap-4; }
.order-card { @apply rounded-2xl p-4 sm:p-5; border: 2px solid #111; box-shadow: 4px 4px 0 0 #111; }
.order-header { @apply flex items-center justify-between mb-3; }
.order-id { @apply text-xs font-bold text-black/50 uppercase tracking-wider; }
.order-status { @apply text-[11px] font-bold px-3 py-1 rounded-md uppercase tracking-wider; }
.status-pending  { background: rgba(234,179,8,0.12); color: #a16207; }
.status-process  { background: rgba(59,130,246,0.12); color: #1d4ed8; }
.status-ship     { background: rgba(102,155,188,0.15); color: #003049; }
.status-done     { background: rgba(22,163,74,0.12); color: #166534; }
.status-cancel   { background: rgba(193,18,31,0.1); color: #C1121F; }
.order-items { @apply flex flex-col gap-3 mb-3; }
.order-item { @apply flex items-start gap-3; }
.item-thumb { @apply w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl overflow-hidden; background: #FDF0D5; border: 2px solid #111; }
.item-info { @apply flex-1 min-w-0; }
.item-name { @apply text-sm font-bold text-gray-900 truncate; }
.item-meta { @apply text-xs text-black/50 mt-0.5; }
.item-price { @apply text-sm font-bold text-[#C1121F] mt-1; }
.order-footer { @apply flex items-end justify-between gap-3 pt-3 border-t border-black/5 flex-wrap; }
.order-date { @apply text-[10px] text-black/40 uppercase tracking-wide font-bold mb-1; }
.order-total { @apply text-sm text-black/60; }
.order-total-value { @apply font-bold text-gray-900; }
.order-actions { @apply flex gap-2 flex-wrap; }
.action-btn { @apply px-3 py-1.5 text-[11px] font-bold rounded-lg; border: 2px solid #111; transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease, color 0.15s ease; }
.review-btn { @apply bg-white text-[#669BBC]; box-shadow: 2px 2px 0 0 #111; }
.review-btn:hover { background: #003049; color: white; transform: translate(1px,1px); box-shadow: 1px 1px 0 0 #111; }
.cancel-btn { @apply bg-white text-[#C1121F]; box-shadow: 2px 2px 0 0 #111; }
.cancel-btn:hover { background: #C1121F; color: white; transform: translate(1px,1px); box-shadow: 1px 1px 0 0 #111; }

.empty-state { @apply flex flex-col items-center justify-center text-center py-20; }
.empty-icon { @apply w-20 h-20 rounded-full flex items-center justify-center mb-5; background: linear-gradient(135deg, #C1121F, #780000); border: 2px solid #111; box-shadow: 4px 4px 0 0 #111; }
.empty-title { @apply text-xl font-bold text-gray-900 mb-1; font-family: 'CalSans', serif; }
.empty-sub { @apply text-sm text-black/50 mb-6; }
.empty-cta { @apply inline-block px-6 py-3 text-sm font-bold rounded-xl text-white no-underline; background: linear-gradient(135deg, #C1121F, #780000); border: 2px solid #111; box-shadow: 4px 4px 0 0 #111; }

.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
.skeleton { @apply animate-pulse bg-black/10 rounded-xl; }
.skeleton-line { height: 14px; @apply rounded-md; }
.skeleton-line-sm { height: 12px; @apply rounded-md; }
.error-banner { @apply flex flex-col items-center gap-3 py-10 text-center; }
.error-text { @apply text-sm font-semibold text-[#C1121F]; }
.retry-btn { @apply px-5 py-2 text-sm font-bold rounded-xl text-white; background: linear-gradient(135deg, #C1121F, #780000); border: 2px solid #111; box-shadow: 3px 3px 0 0 #111; }
</style>
