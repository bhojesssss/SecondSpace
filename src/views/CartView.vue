<!-- CartView.vue -->
<template>
  <div class="cart-root">

    <AuthGate v-if="!isLoggedIn" title="Login untuk Belanja" message="Masuk dulu untuk lihat keranjang dan checkout pesanan kamu." />

    <template v-else>
      <section class="section-gap">
        <div class="section-title-wrap">
          <div class="section-accent fashion-accent"></div>
          <h1 class="page-title">Keranjang Saya <span class="page-title-count">({{ totalQty }} items)</span></h1>
        </div>
      </section>

      <!-- Loading skeleton -->
      <div v-if="loading" class="cart-items">
        <div v-for="i in 3" :key="i" class="cart-item glass-panel">
          <div class="skeleton w-24 h-24 sm:w-32 sm:h-32 rounded-xl flex-shrink-0"></div>
          <div class="flex-1 flex flex-col gap-3 py-1">
            <div class="skeleton skeleton-line w-3/4"></div>
            <div class="skeleton skeleton-line-sm w-1/2"></div>
            <div class="skeleton skeleton-line w-1/3 mt-2"></div>
          </div>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="error-banner">
        <p class="error-text">{{ error }}</p>
        <button @click="fetchCart" class="retry-btn">Coba Lagi</button>
      </div>

      <!-- Empty -->
      <div v-else-if="cartItems.length === 0" class="empty-state reveal">
        <div class="empty-icon">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
        </div>
        <p class="empty-title">Keranjang Anda Kosong</p>
        <p class="empty-sub">Mulai pilih barang preloved favorit Anda sekarang!</p>
        <router-link to="/catalog" class="empty-cta">Lanjut Belanja →</router-link>
      </div>

      <!-- Content -->
      <div v-else class="cart-layout">
        <div class="cart-items">
          <div v-for="(item, idx) in cartItems" :key="item.id" class="cart-item glass-panel reveal" :class="`reveal-delay-${(idx % 4) + 1}`">
            <button @click="removeItem(item.id)" class="remove-btn" aria-label="Remove item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
            <div class="item-thumb"><img :src="item.img" :alt="item.name" class="w-full h-full object-cover" /></div>
            <div class="item-details">
              <div>
                <h3 class="item-name">{{ item.name }}</h3>
                <div class="item-meta">
                  <span class="meta-text">Size <span class="meta-strong">{{ item.size }}</span></span>
                  <div class="meta-dot"></div>
                  <span class="condition-pill">{{ item.condition }}</span>
                </div>
              </div>
              <div class="item-bottom">
                <p class="item-price">Rp {{ formatPrice(item.price) }}</p>
                <div class="qty-control">
                  <button @click="changeQty(item, item.qty - 1)" :disabled="item.qty <= 1" class="qty-btn" aria-label="Decrease">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </button>
                  <span class="qty-num">{{ item.qty }}</span>
                  <button @click="changeQty(item, item.qty + 1)" class="qty-btn" aria-label="Increase">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside class="cart-summary-wrap reveal reveal-delay-3">
          <div class="cart-summary glass-panel">
            <div class="summary-title-wrap">
              <div class="section-accent fashion-accent"></div>
              <h2 class="summary-title">Ringkasan Pesanan</h2>
            </div>
            <div class="summary-rows">
              <div class="summary-row"><span class="summary-label">Subtotal ({{ totalQty }} items)</span><span class="summary-value">Rp {{ formatPrice(subtotal) }}</span></div>
              <div class="summary-row summary-row-divider"><span class="summary-label">Pengiriman</span><span class="summary-free">Gratis</span></div>
              <div class="summary-total"><span class="total-label">Total Pembayaran</span><span class="total-value">Rp {{ formatPrice(subtotal) }}</span></div>
            </div>
            <button @click="checkout" class="checkout-btn">
              Checkout Sekarang
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
            <div class="secure-note">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <span>Pembayaran aman &amp; terenkripsi</span>
            </div>
          </div>
        </aside>
      </div>
    </template>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { useAuth } from '@/composables/useAuth'
import { useTransaction } from '@/composables/useTransaction'
import AuthGate from '@/components/AuthGate.vue'
import api from '@/services/api'

useScrollReveal()
const router = useRouter()
const { isLoggedIn } = useAuth()
const { setItems } = useTransaction()

const cartItems = ref([])
const loading   = ref(false)
const error     = ref(null)

const subtotal = computed(() => cartItems.value.reduce((s, i) => s + i.price * i.qty, 0))
const totalQty = computed(() => cartItems.value.reduce((s, i) => s + i.qty, 0))
const formatPrice = (p) => (p || 0).toLocaleString('id-ID')

const mapItem = (i) => ({
  id:         i.id,
  product_id: i.product_id || i.products?.id,
  name:       i.products?.name || i.name || '',
  price:      i.products?.price || i.price || 0,
  size:       i.size || '-',
  condition:  i.condition || '',
  qty:        i.qty || 1,
  img:        i.products?.images?.[0] || i.img || '',
})

async function fetchCart() {
  if (!isLoggedIn.value) return
  loading.value = true
  error.value = null
  try {
    const data = await api.get('/cart')
    cartItems.value = (Array.isArray(data) ? data : []).map(mapItem)
  } catch (e) {
    error.value = e.message || 'Gagal memuat keranjang. Silakan coba lagi.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchCart)

// Debounced qty PATCH
const _qtyTimers = {}
function changeQty(item, newQty) {
  if (newQty < 1) return
  item.qty = newQty
  clearTimeout(_qtyTimers[item.id])
  _qtyTimers[item.id] = setTimeout(async () => {
    try { await api.patch(`/cart/${item.id}`, { qty: newQty }) }
    catch (e) { console.error('Gagal update qty:', e.message) }
  }, 500)
}

async function removeItem(id) {
  try {
    await api.delete(`/cart/${id}`)
    cartItems.value = cartItems.value.filter(i => i.id !== id)
  } catch (e) {
    alert('Gagal menghapus item: ' + (e.message || ''))
  }
}

function checkout() {
  if (cartItems.value.length === 0) return
  setItems(cartItems.value, 'cart')
  router.push('/transaction')
}
</script>

<style scoped>
@reference "../assets/main.css";

.cart-root { @apply pb-8; padding: 0.75rem; }
@media (min-width: 640px) { .cart-root { padding: 1rem; } }
.section-gap { @apply mb-5 sm:mb-6; }
.section-title-wrap { @apply flex items-center gap-3 mb-4 sm:mb-5; }
.section-accent { @apply w-1 h-6 sm:h-7 rounded-full flex-shrink-0; }
.fashion-accent { background: linear-gradient(135deg, #C1121F, #780000); }
.page-title { @apply text-2xl font-bold tracking-tight text-gray-900; font-family: 'CalSans', serif; letter-spacing: -0.01em; }
.page-title-count { @apply text-base font-medium text-black/40 ml-1; font-family: 'Helvetica', sans-serif; }

.empty-state { @apply flex flex-col items-center justify-center text-center py-20; }
.empty-icon { @apply w-20 h-20 rounded-full flex items-center justify-center mb-5 transition-transform duration-300 hover:scale-110; background: linear-gradient(135deg, #C1121F, #780000); border: 2px solid #111; box-shadow: 4px 4px 0 0 #111; }
.empty-title { @apply text-xl font-bold text-gray-900 mb-1; font-family: 'CalSans', serif; }
.empty-sub { @apply text-sm text-black/50 mb-6; }
.empty-cta { @apply inline-block w-fit px-6 py-3 text-sm font-bold rounded-xl text-white no-underline; background: linear-gradient(135deg, #C1121F, #780000); border: 2px solid #111; box-shadow: 4px 4px 0 0 #111; transition: transform 0.15s ease, box-shadow 0.15s ease; }
.empty-cta:hover { transform: translate(2px,2px); box-shadow: 2px 2px 0 0 #111; }

.cart-layout { @apply flex flex-col lg:flex-row gap-5 sm:gap-6 items-start; }
.cart-items { @apply flex-1 w-full flex flex-col gap-3 sm:gap-4; }
.cart-item { @apply rounded-2xl p-3 sm:p-5 flex flex-row gap-3 sm:gap-5 relative; border: 2px solid #111; box-shadow: 3px 3px 0 0 #111; transition: transform 0.15s ease, box-shadow 0.15s ease; }
@media (min-width: 640px) { .cart-item { box-shadow: 4px 4px 0 0 #111; } }
.cart-item:hover { transform: translate(1px,1px); box-shadow: 2px 2px 0 0 #111; }
.remove-btn { @apply absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 rounded-lg flex items-center justify-center text-black hover:text-white hover:bg-[#C1121F] transition-colors duration-200; border: 2px solid #111; }
.item-thumb { @apply w-20 h-20 sm:w-32 sm:h-32 flex-shrink-0 rounded-xl overflow-hidden; background: #FDF0D5; border: 2px solid #111; }
.item-details { @apply flex-1 flex flex-col justify-between min-w-0; }
.item-name { @apply text-sm sm:text-base font-bold text-gray-900 mb-1.5 sm:mb-2 pr-7 leading-snug truncate; }
.item-meta { @apply flex flex-wrap items-center gap-2; }
.meta-text { @apply text-xs text-black/50; }
.meta-strong { @apply font-semibold text-black/80 ml-0.5; }
.meta-dot { @apply w-1 h-1 rounded-full bg-black/20; }
.condition-pill { @apply px-2.5 py-1 text-[10px] font-bold tracking-wider rounded-md uppercase; background: rgba(193,18,31,0.1); color: #C1121F; }
.item-bottom { @apply flex items-end justify-between mt-3 sm:mt-4 gap-2 sm:gap-3 flex-wrap; }
.item-price { @apply text-base font-bold text-[#C1121F]; }
.qty-control { @apply inline-flex items-center gap-1 rounded-xl p-1; background: white; border: 2px solid #111; }
.qty-btn { @apply w-7 h-7 rounded-lg flex items-center justify-center text-black hover:text-white hover:bg-[#C1121F] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-black transition-colors duration-200; }
.qty-num { @apply w-6 text-center text-sm font-bold text-gray-900 select-none; }

.cart-summary-wrap { @apply w-full lg:w-[360px] lg:sticky lg:top-4; }
.cart-summary { @apply rounded-2xl p-4 sm:p-6; border: 2px solid #111; box-shadow: 3px 3px 0 0 #111; }
@media (min-width: 640px) { .cart-summary { box-shadow: 4px 4px 0 0 #111; } }
.summary-title-wrap { @apply flex items-center gap-3 mb-5; }
.summary-title { @apply text-lg font-bold tracking-tight text-gray-900; font-family: 'CalSans', serif; letter-spacing: -0.01em; }
.summary-rows { @apply flex flex-col gap-3 mb-5; }
.summary-row { @apply flex justify-between items-center; }
.summary-row-divider { @apply pb-4 border-b border-black/10; }
.summary-label { @apply text-sm text-black/60; }
.summary-value { @apply text-sm font-semibold text-gray-900; }
.summary-free { @apply text-sm font-bold text-emerald-600; }
.summary-total { @apply flex justify-between items-center pt-1; }
.total-label { @apply text-sm font-semibold text-black/70; }
.total-value { @apply text-xl font-bold text-gray-900; font-family: 'CalSans', serif; }
.checkout-btn { @apply w-full flex items-center justify-center gap-2 py-3 sm:py-3.5 mt-1 text-white text-sm font-bold rounded-xl; background: linear-gradient(135deg, #C1121F, #780000); border: 2px solid #111; box-shadow: 3px 3px 0 0 #111; transition: transform 0.15s ease, box-shadow 0.15s ease; }
@media (min-width: 640px) { .checkout-btn { box-shadow: 4px 4px 0 0 #111; } }
.checkout-btn:hover { transform: translate(2px,2px); box-shadow: 2px 2px 0 0 #111; }
.secure-note { @apply flex items-center justify-center gap-1.5 text-black/40 text-[11px] mt-3; }

/* Skeleton */
.skeleton { @apply animate-pulse bg-black/10 rounded-xl; }
.skeleton-line { height: 14px; @apply rounded-md w-3/4; }
.skeleton-line-sm { height: 12px; @apply rounded-md w-1/2; }

/* Error */
.error-banner { @apply flex flex-col items-center gap-3 py-10 text-center; }
.error-text { @apply text-sm font-semibold text-[#C1121F]; }
.retry-btn { @apply px-5 py-2 text-sm font-bold rounded-xl text-white; background: linear-gradient(135deg, #C1121F, #780000); border: 2px solid #111; box-shadow: 3px 3px 0 0 #111; }
</style>
