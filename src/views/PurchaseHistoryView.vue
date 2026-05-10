<template>
  <div class="history-root">

    <!-- ═══════════════════════════════════════ AUTH GATE ═══════════════════════════════════════ -->
    <AuthGate
      v-if="!isLoggedIn"
      title="Login untuk Riwayat"
      message="Masuk dulu untuk lihat riwayat pembelian kamu."
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
        <h1 class="page-title">Riwayat Pembelian</h1>
      </div>
    </section>

    <!-- ═══════════════════════════════════════ FILTER CHIPS ═══════════════════════════════════════ -->
    <section class="section-gap reveal">
      <div class="chip-row scrollbar-hide">
        <button
          v-for="f in filters"
          :key="f.value"
          @click="activeFilter = f.value"
          class="filter-chip"
          :class="activeFilter === f.value ? 'chip-active' : 'chip-inactive'"
        >
          {{ f.label }}
          <span v-if="f.count > 0" class="chip-count">{{ f.count }}</span>
        </button>
      </div>
    </section>

    <!-- ═══════════════════════════════════════ EMPTY STATE ═══════════════════════════════════════ -->
    <div v-if="filteredOrders.length === 0" class="empty-state reveal">
      <div class="empty-icon">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m7.5 4.27 9 5.15"/>
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          <path d="m3.3 7 8.7 5 8.7-5"/>
          <path d="M12 22V12"/>
        </svg>
      </div>
      <p class="empty-title">Belum Ada Riwayat</p>
      <p class="empty-sub">Pesanan yang sudah selesai akan muncul di sini.</p>
    </div>

    <!-- ═══════════════════════════════════════ ORDER LIST ═══════════════════════════════════════ -->
    <div v-else class="order-list">
      <div
        v-for="(order, idx) in filteredOrders"
        :key="order.id"
        class="order-card glass-panel reveal"
        :class="`reveal-delay-${(idx % 4) + 1}`"
      >
        <!-- Top: order id + status -->
        <div class="order-head">
          <div>
            <p class="order-id">#{{ order.id }}</p>
            <p class="order-date">{{ order.date }}</p>
          </div>
          <span class="order-status" :class="statusClass(order.status)">{{ order.status }}</span>
        </div>

        <!-- Product row -->
        <div class="order-body">
          <img :src="order.img" :alt="order.name" class="order-thumb" />
          <div class="order-info">
            <p class="order-name">{{ order.name }}</p>
            <p class="order-seller">{{ order.seller }}</p>
            <p class="order-qty">{{ order.qty }} item · Size {{ order.size }}</p>
          </div>
        </div>

        <!-- Footer: total + actions -->
        <div class="order-foot">
          <div>
            <p class="foot-label">Total</p>
            <p class="foot-total">Rp {{ formatPrice(order.total) }}</p>
          </div>
          <div class="foot-actions">
            <button v-if="order.status === 'Selesai'" class="action-secondary">Beli Lagi</button>
            <button v-if="order.status === 'Dikirim'" class="action-primary">Lacak</button>
            <button v-if="order.status === 'Selesai'" class="action-primary">Ulasan</button>
          </div>
        </div>
      </div>
    </div>
    </template>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { useAuth } from '@/composables/useAuth'
import AuthGate from '@/components/AuthGate.vue'
useScrollReveal()

const router = useRouter()
const { isLoggedIn } = useAuth()

const goBack = () => {
  if (window.history.state?.back) router.back()
  else router.push('/profile')
}

const orders = ref([
  { id: 'ORD2401', date: '12 Apr 2026', status: 'Selesai',  name: 'Insurgent Graphic Tee', seller: 'SecondSeller', qty: 1, size: 'L', total: 499000, img: new URL('@/assets/ImgCard/insurgent.jpeg', import.meta.url).href },
  { id: 'ORD2389', date: '08 Apr 2026', status: 'Dikirim',  name: 'Sport Sneakers',         seller: 'ThriftKing',   qty: 1, size: 'L', total: 349000, img: new URL('@/assets/ImgCard/shoes.png',     import.meta.url).href },
  { id: 'ORD2354', date: '02 Apr 2026', status: 'Selesai',  name: 'Running Shorts',         seller: 'FashionStore', qty: 2, size: 'M', total: 318000, img: new URL('@/assets/ImgCard/shorts.avif',   import.meta.url).href },
  { id: 'ORD2301', date: '24 Mar 2026', status: 'Dibatalkan', name: 'Sport Duffel Bag',      seller: 'SecondSeller', qty: 1, size: '-', total: 219000, img: new URL('@/assets/ImgCard/bag.png',       import.meta.url).href },
])

const activeFilter = ref('all')

const filters = computed(() => [
  { label: 'Semua',      value: 'all',        count: orders.value.length },
  { label: 'Dikirim',    value: 'Dikirim',    count: orders.value.filter(o => o.status === 'Dikirim').length },
  { label: 'Selesai',    value: 'Selesai',    count: orders.value.filter(o => o.status === 'Selesai').length },
  { label: 'Dibatalkan', value: 'Dibatalkan', count: orders.value.filter(o => o.status === 'Dibatalkan').length },
])

const filteredOrders = computed(() =>
  activeFilter.value === 'all'
    ? orders.value
    : orders.value.filter(o => o.status === activeFilter.value)
)

const statusClass = (s) => {
  if (s === 'Selesai') return 'status-done'
  if (s === 'Dikirim') return 'status-shipping'
  return 'status-cancel'
}

const formatPrice = (p) => p.toLocaleString('id-ID')
</script>

<style scoped>
@reference "../assets/main.css";

/* ── Root ───────────────────────────────────────────────────────────────────── */
.history-root {
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
  letter-spacing: -0.01em;
}

/* ── Filter chips ──────────────────────────────────────────────────────────── */
.chip-row {
  @apply flex gap-2 overflow-x-auto pb-1;
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.chip-row::-webkit-scrollbar { display: none; }
.filter-chip {
  @apply flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap
         transition-all duration-150;
  border: 2px solid #111;
}
.chip-active {
  @apply text-white;
  background: linear-gradient(135deg, #C1121F, #780000);
  box-shadow: 3px 3px 0 0 #111;
}
.chip-inactive {
  @apply bg-white text-black/70;
  box-shadow: 2px 2px 0 0 #111;
}
.chip-inactive:hover {
  transform: translate(1px, 1px);
  box-shadow: 1px 1px 0 0 #111;
}
.chip-count {
  @apply text-[10px] px-1.5 py-0.5 rounded-md;
}
.chip-active .chip-count {
  @apply bg-white/20 text-white;
}
.chip-inactive .chip-count {
  @apply bg-black/10 text-black/60;
}

/* ── Empty state ────────────────────────────────────────────────────────────── */
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
  @apply text-sm text-black/50;
}

/* ── Order list ────────────────────────────────────────────────────────────── */
.order-list {
  @apply flex flex-col gap-4;
}
.order-card {
  @apply rounded-2xl p-4 sm:p-5;
  border: 2px solid #111;
  box-shadow: 4px 4px 0 0 #111;
}

/* ── Order head ────────────────────────────────────────────────────────────── */
.order-head {
  @apply flex items-start justify-between gap-3 pb-3 mb-3 border-b border-black/10;
}
.order-id {
  @apply text-sm font-bold text-gray-900;
  font-family: 'CalSans', serif;
}
.order-date {
  @apply text-[11px] text-black/50 mt-0.5;
}
.order-status {
  @apply text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md whitespace-nowrap;
  border: 1.5px solid #111;
}
.status-done {
  @apply bg-emerald-100 text-emerald-700;
}
.status-shipping {
  @apply text-white;
  background: linear-gradient(135deg, #669BBC, #003049);
}
.status-cancel {
  @apply bg-black/10 text-black/60;
}

/* ── Order body ────────────────────────────────────────────────────────────── */
.order-body {
  @apply flex gap-3 sm:gap-4 mb-3;
}
.order-thumb {
  @apply w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover flex-shrink-0;
  border: 2px solid #111;
}
.order-info {
  @apply flex-1 min-w-0;
}
.order-name {
  @apply text-sm sm:text-base font-bold text-gray-900 truncate;
}
.order-seller {
  @apply text-[11px] sm:text-xs text-[#C1121F] font-semibold mt-0.5;
}
.order-qty {
  @apply text-[11px] sm:text-xs text-black/50 mt-1;
}

/* ── Order footer ──────────────────────────────────────────────────────────── */
.order-foot {
  @apply flex items-center justify-between gap-3 pt-3 border-t border-black/10;
}
.foot-label {
  @apply text-[10px] uppercase tracking-widest font-bold text-black/40;
}
.foot-total {
  @apply text-base sm:text-lg font-bold text-[#C1121F];
  font-family: 'CalSans', serif;
}
.foot-actions {
  @apply flex gap-2;
}
.action-primary,
.action-secondary {
  @apply text-[11px] sm:text-xs font-bold px-3 py-2 rounded-lg whitespace-nowrap
         transition-all duration-150;
  border: 2px solid #111;
}
.action-primary {
  @apply text-white;
  background: linear-gradient(135deg, #C1121F, #780000);
  box-shadow: 2px 2px 0 0 #111;
}
.action-secondary {
  @apply bg-white text-black/80;
  box-shadow: 2px 2px 0 0 #111;
}
.action-primary:hover,
.action-secondary:hover {
  transform: translate(1px, 1px);
  box-shadow: 1px 1px 0 0 #111;
}
.action-primary:active,
.action-secondary:active {
  transform: translate(2px, 2px);
  box-shadow: 0 0 0 0 #111;
}

.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
