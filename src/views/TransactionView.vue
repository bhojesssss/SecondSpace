<template>
  <div class="tx-root">
    <AuthGate
      v-if="!isLoggedIn"
      title="Login untuk Checkout"
      message="Masuk dulu untuk melanjutkan pembayaran pesanan kamu."
    />

    <template v-else>
      <section class="section-gap">
        <div class="header-wrap">
          <button @click="goBack" class="back-btn" aria-label="Back">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <div class="section-accent fashion-accent"></div>
          <h1 class="page-title">Checkout</h1>
        </div>
      </section>

      <div v-if="!hasItems" class="empty-state reveal">
        <div class="empty-icon">
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            stroke-width="2.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <path d="M3 10h18" />
            <path d="M8 14h4" />
          </svg>
        </div>
        <p class="empty-title">Belum Ada Pesanan</p>
        <p class="empty-sub">Pilih barang dulu sebelum melanjutkan ke checkout.</p>
        <router-link to="/catalog" class="empty-cta">Mulai Belanja →</router-link>
      </div>

      <div v-else class="tx-layout">
        <!-- Left -->
        <div class="tx-main">
          <!-- Address -->
          <section class="section-gap reveal">
            <div class="block-title-wrap">
              <h2 class="block-title">Alamat Pengiriman</h2>
              <router-link to="/profile/address" class="block-link">Ganti</router-link>
            </div>
            <div v-if="loadingAddress" class="addr-card glass-panel">
              <div class="skeleton h-4 w-1/3 rounded-md mb-2"></div>
              <div class="skeleton h-3 w-1/2 rounded-md mb-1"></div>
              <div class="skeleton h-3 w-full rounded-md"></div>
            </div>
            <div v-else-if="address" class="addr-card glass-panel">
              <div class="addr-head">
                <div class="addr-label-wrap">
                  <span class="addr-label">{{ address.label }}</span>
                  <span v-if="address.is_default" class="default-badge">Utama</span>
                </div>
                <div class="addr-icon">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
              </div>
              <p class="addr-name">{{ address.recipient }} · {{ address.phone }}</p>
              <p class="addr-text">{{ address.full_address }}</p>
            </div>
            <p v-else class="text-sm text-black/50">
              Belum ada alamat.
              <router-link to="/profile/address" class="text-[#C1121F] font-bold"
                >Tambah alamat</router-link
              >
            </p>
          </section>

          <!-- Items -->
          <section class="section-gap reveal reveal-delay-1">
            <div class="block-title-wrap">
              <h2 class="block-title">
                Daftar Pesanan <span class="block-title-count">({{ totalQty }} item)</span>
              </h2>
            </div>
            <div class="items-list">
              <div v-for="item in items" :key="item.id" class="tx-item glass-panel">
                <div class="item-thumb">
                  <img :src="item.img" :alt="item.name" class="w-full h-full object-cover" />
                </div>
                <div class="item-details">
                  <h3 class="item-name">{{ item.name }}</h3>
                  <div class="item-meta">
                    <span class="meta-text"
                      >Size <span class="meta-strong">{{ item.size }}</span></span
                    >
                    <div class="meta-dot"></div>
                    <span class="meta-text"
                      >Qty <span class="meta-strong">{{ item.qty }}</span></span
                    >
                  </div>
                  <p class="item-price">Rp {{ formatPrice(item.price * item.qty) }}</p>
                </div>
              </div>
            </div>
          </section>

          <!-- Payment method -->
          <section class="section-gap reveal reveal-delay-2">
            <div class="block-title-wrap"><h2 class="block-title">Metode Pembayaran</h2></div>
            <div class="pay-list">
              <button
                v-for="method in paymentMethods"
                :key="method.value"
                @click="selectedPayment = method.value"
                class="pay-option"
                :class="
                  selectedPayment === method.value ? 'pay-active' : 'pay-inactive glass-panel'
                "
              >
                <span class="pay-icon" v-html="method.icon"></span>
                <div class="pay-info">
                  <p class="pay-name">{{ method.label }}</p>
                  <p class="pay-sub">{{ method.sub }}</p>
                </div>
                <span
                  class="pay-radio"
                  :class="{ 'pay-radio-active': selectedPayment === method.value }"
                ></span>
              </button>
            </div>
          </section>

          <!-- Notes -->
          <section class="section-gap reveal reveal-delay-3">
            <div class="block-title-wrap">
              <h2 class="block-title">Catatan untuk Penjual</h2>
              <span class="block-optional">Opsional</span>
            </div>
            <textarea
              v-model="notes"
              rows="3"
              placeholder="Contoh: tolong dikemas rapi, pakai bubble wrap"
              class="notes-input"
            ></textarea>
          </section>
        </div>

        <!-- Right: summary -->
        <aside class="tx-summary-wrap reveal reveal-delay-3">
          <div class="tx-summary glass-panel">
            <div class="summary-title-wrap">
              <div class="section-accent fashion-accent"></div>
              <h2 class="summary-title">Ringkasan Pembayaran</h2>
            </div>
            <div class="summary-rows">
              <div class="summary-row">
                <span class="summary-label">Subtotal ({{ totalQty }} item)</span
                ><span class="summary-value">Rp {{ formatPrice(subtotal) }}</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">Biaya Pengiriman</span
                ><span class="summary-free">Gratis</span>
              </div>
              <div class="summary-row summary-row-divider">
                <span class="summary-label">Biaya Layanan</span
                ><span class="summary-value">Rp {{ formatPrice(serviceFee) }}</span>
              </div>
              <div class="summary-total">
                <span class="total-label">Total Bayar</span
                ><span class="total-value">{{ formatRupiah(total) }}</span>
              </div>
            </div>

            <!-- Pay error -->
            <div v-if="payError" class="pay-error">{{ payError }}</div>

            <button @click="payNow" class="pay-btn" :disabled="paying || !address">
              <svg
                v-if="paying"
                class="animate-spin"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <circle cx="12" cy="12" r="10" stroke-opacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round" />
              </svg>
              <span>{{ paying ? 'Memproses...' : 'Bayar Sekarang' }}</span>
              <svg
                v-if="!paying"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.4"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
            <div class="secure-note">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
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
import { useCart } from '@/composables/useCart'

useScrollReveal()
const router = useRouter()
const { isLoggedIn } = useAuth()
const { items, hasItems, subtotal, totalQty, clear } = useTransaction()

const goBack = () => {
  if (window.history.state?.back) router.back()
  else router.push('/cart')
}
const { cart, cartSubtotal, clearCart } = useCart()

// Address
const address = ref(null)
const loadingAddress = ref(false)

async function fetchDefaultAddress() {
  if (!isLoggedIn.value) return
  loadingAddress.value = true
  try {
    const data = await api.get('/addresses')
    const list = Array.isArray(data) ? data : []
    address.value = list.find((a) => a.is_default) || list[0] || null
  } catch {
    /* fail silently */
  } finally {
    loadingAddress.value = false
  }
}

onMounted(fetchDefaultAddress)

// Payment
const paymentMethods = [
  {
    value: 'bank',
    label: 'Transfer Bank',
    sub: 'BCA, Mandiri, BNI, BRI',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="13" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="7" y1="15" x2="9" y2="15"/></svg>`,
  },
  {
    value: 'ewallet',
    label: 'E-Wallet',
    sub: 'GoPay, OVO, DANA, ShopeePay',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4z"/></svg>`,
  },
  {
    value: 'cod',
    label: 'Bayar di Tempat',
    sub: 'COD, bayar saat barang sampai',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v10"/><path d="M15 9.5C14.2 8.5 13 8 12 8c-1.7 0-3 .8-3 2s1.3 2 3 2 3 .8 3 2-1.3 2-3 2c-1 0-2.2-.5-3-1.5"/></svg>`,
  },
]

const selectedPayment = ref('bank')
const notes = ref('')
const paying = ref(false)
const payError = ref('')

import { formatRupiah } from '@/utils/currency'
const serviceFee = computed(() => Math.round(subtotal.value * 0.01))
const total = computed(() => subtotal.value + serviceFee.value)

async function payNow() {
  if (!address.value) {
    payError.value = 'Pilih alamat pengiriman terlebih dahulu.'
    return
  }
  paying.value = true
  payError.value = ''
  try {
    await api.post('/transactions/checkout', {
      items: items.value.map((i) => ({
        product_id: i.product_id || i.id,
        size: i.size,
        condition: i.condition,
        qty: i.qty || 1,
      })),
      address_id: address.value.id,
      payment_method: selectedPayment.value,
      notes: notes.value || undefined,
    })
    clear()
    clearCart()
    router.push('/profile/history')
  } catch (e) {
    payError.value = e.message || 'Pembayaran gagal. Silakan coba lagi.'
  } finally {
    paying.value = false
  }
}
</script>

<style scoped>
@reference "../assets/main.css";

.tx-root {
  @apply pb-8;
  padding: 0.75rem;
}
@media (min-width: 640px) {
  .tx-root {
    padding: 1rem;
  }
}
.section-gap {
  @apply mb-5 sm:mb-6;
}
.header-wrap {
  @apply flex items-center gap-3;
}
.back-btn {
  @apply w-9 h-9 rounded-lg flex items-center justify-center text-black/70 bg-white transition-all duration-200 active:scale-90;
  border: 2px solid #111;
  box-shadow: 2px 2px 0 0 #111;
}
.back-btn:hover {
  color: #c1121f;
  transform: translate(1px, 1px);
  box-shadow: 1px 1px 0 0 #111;
}
.section-accent {
  @apply w-1 h-7 rounded-full flex-shrink-0;
}
.fashion-accent {
  background: linear-gradient(135deg, #c1121f, #780000);
}
.page-title {
  @apply text-2xl font-bold tracking-tight text-gray-900;
  font-family: 'CalSans', serif;
  letter-spacing: -0.01em;
}
.empty-state {
  @apply flex flex-col items-center justify-center text-center py-20;
}
.empty-icon {
  @apply w-20 h-20 rounded-full flex items-center justify-center mb-5;
  background: linear-gradient(135deg, #c1121f, #780000);
  border: 2px solid #111;
  box-shadow: 4px 4px 0 0 #111;
}
.empty-title {
  @apply text-xl font-bold text-gray-900 mb-1;
  font-family: 'CalSans', serif;
}
.empty-sub {
  @apply text-sm text-black/50 mb-6;
}
.empty-cta {
  @apply inline-block px-6 py-3 text-sm font-bold rounded-xl text-white no-underline;
  background: linear-gradient(135deg, #c1121f, #780000);
  border: 2px solid #111;
  box-shadow: 4px 4px 0 0 #111;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}
.tx-layout {
  @apply flex flex-col lg:flex-row gap-5 sm:gap-6 items-start;
}
.tx-main {
  @apply flex-1 w-full min-w-0;
}
.block-title-wrap {
  @apply flex items-center justify-between gap-3 mb-2 sm:mb-3 flex-wrap;
}
.block-title {
  @apply text-sm sm:text-base font-bold text-gray-900;
  font-family: 'CalSans', serif;
}
.block-title-count {
  @apply text-xs font-medium text-black/40 ml-1;
  font-family: 'Helvetica', sans-serif;
}
.block-link {
  @apply text-[11px] sm:text-xs font-bold text-[#C1121F] no-underline px-2 py-1 rounded-md;
  border: 1.5px solid #111;
  background: white;
  transition: all 0.15s ease;
}
.block-link:hover {
  background: #c1121f;
  color: white;
}
.block-optional {
  @apply text-[10px] font-bold uppercase tracking-wider text-black/40 px-2 py-0.5 rounded-md;
  background: rgba(0, 0, 0, 0.05);
}
.addr-card {
  @apply rounded-2xl p-3.5 sm:p-5;
  border: 2px solid #111;
  box-shadow: 3px 3px 0 0 #111;
}
@media (min-width: 640px) {
  .addr-card {
    box-shadow: 4px 4px 0 0 #111;
  }
}
.addr-head {
  @apply flex items-start justify-between gap-3 mb-2;
}
.addr-label-wrap {
  @apply flex items-center gap-2;
}
.addr-label {
  @apply text-sm font-bold text-gray-900;
  font-family: 'CalSans', serif;
}
.default-badge {
  @apply text-[9px] font-bold uppercase tracking-wider text-white px-2 py-0.5 rounded-md;
  background: linear-gradient(135deg, #c1121f, #780000);
}
.addr-icon {
  @apply w-8 h-8 rounded-lg flex items-center justify-center text-[#C1121F] bg-white flex-shrink-0;
  border: 2px solid #111;
}
.addr-name {
  @apply text-[13px] font-semibold text-black/80 mb-1;
}
.addr-text {
  @apply text-xs text-black/55 leading-relaxed;
}
.items-list {
  @apply flex flex-col gap-3;
}
.tx-item {
  @apply rounded-2xl p-3 sm:p-4 flex flex-row gap-3 sm:gap-4;
  border: 2px solid #111;
  box-shadow: 3px 3px 0 0 #111;
}
@media (min-width: 640px) {
  .tx-item {
    box-shadow: 4px 4px 0 0 #111;
  }
}
.item-thumb {
  @apply w-16 h-16 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl overflow-hidden;
  background: #fdf0d5;
  border: 2px solid #111;
}
.item-details {
  @apply flex-1 flex flex-col justify-between min-w-0;
}
.item-name {
  @apply text-sm sm:text-base font-bold text-gray-900 leading-snug truncate;
}
.item-meta {
  @apply flex flex-wrap items-center gap-2 mt-1;
}
.meta-text {
  @apply text-xs text-black/50;
}
.meta-strong {
  @apply font-semibold text-black/80 ml-0.5;
}
.meta-dot {
  @apply w-1 h-1 rounded-full bg-black/20;
}
.item-price {
  @apply text-sm sm:text-base font-bold text-[#C1121F] mt-2;
}
.pay-list {
  @apply flex flex-col gap-3;
}
.pay-option {
  @apply flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-4 rounded-xl text-left w-full;
  border: 2px solid #111;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}
.pay-active {
  @apply text-white;
  background: linear-gradient(135deg, #c1121f, #780000);
  box-shadow: 3px 3px 0 0 #111;
}
.pay-inactive {
  @apply text-black/80;
  box-shadow: 2px 2px 0 0 #111;
}
.pay-inactive:hover {
  transform: translate(1px, 1px);
  box-shadow: 1px 1px 0 0 #111;
}
.pay-icon {
  @apply w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0;
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid #111;
}
.pay-inactive .pay-icon {
  background: white;
  color: #c1121f;
}
.pay-info {
  @apply flex-1 min-w-0;
}
.pay-name {
  @apply text-sm font-bold;
  font-family: 'CalSans', serif;
}
.pay-sub {
  @apply text-[11px] mt-0.5;
}
.pay-active .pay-sub {
  @apply text-white/80;
}
.pay-inactive .pay-sub {
  @apply text-black/50;
}
.pay-radio {
  @apply w-5 h-5 rounded-full flex-shrink-0;
  border: 2px solid #111;
  background: white;
}
.pay-radio-active {
  background: white;
  box-shadow: inset 0 0 0 4px #c1121f;
}
.notes-input {
  @apply w-full px-4 py-3 rounded-xl text-sm border-2 border-black/15 outline-none transition-all duration-200;
  background-color: rgba(255, 255, 255, 0.65);
  resize: vertical;
  min-height: 80px;
}
.notes-input:focus {
  border-color: #c1121f;
  box-shadow: 0 0 0 3px rgba(193, 18, 31, 0.18);
}
.notes-input::placeholder {
  @apply text-black/30;
}
.tx-summary-wrap {
  @apply w-full lg:w-[360px] lg:sticky lg:top-4 flex-shrink-0;
}
.tx-summary {
  @apply rounded-2xl p-4 sm:p-6;
  border: 2px solid #111;
  box-shadow: 3px 3px 0 0 #111;
}
@media (min-width: 640px) {
  .tx-summary {
    box-shadow: 4px 4px 0 0 #111;
  }
}
.summary-title-wrap {
  @apply flex items-center gap-3 mb-5;
}
.summary-title {
  @apply text-lg font-bold tracking-tight text-gray-900;
  font-family: 'CalSans', serif;
}
.summary-rows {
  @apply flex flex-col gap-3 mb-5;
}
.summary-row {
  @apply flex justify-between items-center;
}
.summary-row-divider {
  @apply pb-4 border-b border-black/10;
}
.summary-label {
  @apply text-sm text-black/60;
}
.summary-value {
  @apply text-sm font-semibold text-gray-900;
}
.summary-free {
  @apply text-sm font-bold text-emerald-600;
}
.summary-total {
  @apply flex justify-between items-center pt-1;
}
.total-label {
  @apply text-sm font-semibold text-black/70;
}
.total-value {
  @apply text-xl font-bold text-gray-900;
  font-family: 'CalSans', serif;
}
.pay-error {
  @apply mb-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-[#C1121F];
  background: rgba(193, 18, 31, 0.08);
  border: 1.5px solid rgba(193, 18, 31, 0.3);
}
.pay-btn {
  @apply w-full flex items-center justify-center gap-2 py-3 sm:py-3.5 mt-1 text-white text-sm font-bold rounded-xl;
  background: linear-gradient(135deg, #c1121f, #780000);
  border: 2px solid #111;
  box-shadow: 3px 3px 0 0 #111;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}
@media (min-width: 640px) {
  .pay-btn {
    box-shadow: 4px 4px 0 0 #111;
  }
}
.pay-btn:hover:not(:disabled) {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 0 #111;
}
.pay-btn:disabled {
  @apply opacity-60 cursor-not-allowed;
}
.secure-note {
  @apply flex items-center justify-center gap-1.5 text-black/40 text-[11px] mt-3;
}
.skeleton {
  @apply animate-pulse bg-black/10;
}
</style>
