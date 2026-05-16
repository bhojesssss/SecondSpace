<template>
  <div class="help-root">

    <!-- ═══════════════════════════════════════ HEADER ═══════════════════════════════════════ -->
    <section class="section-gap">
      <div class="header-wrap">
        <button @click="goBack" class="back-btn" aria-label="Back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
        <div class="section-accent fashion-accent"></div>
        <h1 class="page-title">Bantuan</h1>
      </div>
    </section>

    <!-- ═══════════════════════════════════════ SEARCH ═══════════════════════════════════════ -->
    <section class="section-gap reveal">
      <div class="search-wrap">
        <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          v-model="search"
          type="text"
          placeholder="Cari bantuan..."
          class="search-input"
        />
      </div>
    </section>

    <!-- ═══════════════════════════════════════ CATEGORY CARDS ═══════════════════════════════════════ -->
    <section class="section-gap reveal reveal-delay-1">
      <div class="cat-section-header">
        <div class="section-accent fashion-accent"></div>
        <p class="section-title">Topik Populer</p>
      </div>
      <div class="cat-grid">
        <button
          v-for="cat in categories"
          :key="cat.label"
          @click="activeCategory = cat.value"
          class="cat-card"
          :class="activeCategory === cat.value ? 'cat-active' : ''"
        >
          <div class="cat-icon" :class="cat.iconClass" v-html="cat.icon"></div>
          <p class="cat-label">{{ cat.label }}</p>
        </button>
      </div>
    </section>

    <!-- ═══════════════════════════════════════ FAQ ACCORDION ═══════════════════════════════════════ -->
    <section class="section-gap reveal reveal-delay-2">
      <div class="cat-section-header">
        <div class="section-accent fashion-accent"></div>
        <p class="section-title">Pertanyaan Umum</p>
      </div>

      <div v-if="filteredFaqs.length === 0" class="no-results">
        <p>Tidak ada hasil untuk "{{ search }}"</p>
      </div>

      <div v-else class="faq-list">
        <div
          v-for="(faq, idx) in filteredFaqs"
          :key="faq.id"
          class="faq-item glass-panel"
        >
          <button @click="toggleFaq(faq.id)" class="faq-header">
            <span class="faq-q">{{ faq.q }}</span>
            <svg
              class="faq-chevron"
              :class="openFaqs.has(faq.id) ? 'rotate-180' : ''"
              width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"
            >
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          <div v-if="openFaqs.has(faq.id)" class="faq-body">
            <p>{{ faq.a }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════ CONTACT CARD ═══════════════════════════════════════ -->
    <section class="reveal reveal-delay-3">
      <div class="contact-card">
        <div class="contact-overlay"></div>
        <div class="contact-deco"></div>
        <div class="contact-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
          </svg>
        </div>
        <p class="contact-title">Masih butuh bantuan?</p>
        <p class="contact-sub">Tim support kami siap bantu kamu 24/7.</p>
        <div class="contact-actions">
          <a href="mailto:support@secondspace.id" class="contact-btn">Email Support</a>
          <router-link to="/chat" class="contact-btn contact-secondary">Live Chat</router-link>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useScrollReveal } from '@/composables/useScrollReveal'
useScrollReveal()

const router = useRouter()

const goBack = () => {
  if (window.history.state?.back) router.back()
  else router.push('/profile')
}

const search = ref('')
const activeCategory = ref('all')
const openFaqs = ref(new Set([1]))

const toggleFaq = (id) => {
  if (openFaqs.value.has(id)) openFaqs.value.delete(id)
  else openFaqs.value.add(id)
  openFaqs.value = new Set(openFaqs.value)
}

const wrap = (paths) =>
  `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`

const categories = [
  {
    value: 'order', label: 'Pesanan', iconClass: 'icon-fashion',
    icon: wrap('<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>'),
  },
  {
    value: 'payment', label: 'Pembayaran', iconClass: 'icon-sports',
    icon: wrap('<rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>'),
  },
  {
    value: 'account', label: 'Akun', iconClass: 'icon-fashion',
    icon: wrap('<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>'),
  },
  {
    value: 'sell', label: 'Jual', iconClass: 'icon-sports',
    icon: wrap('<path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>'),
  },
]

const faqs = [
  { id: 1, cat: 'order',   q: 'Bagaimana cara melacak pesanan saya?', a: 'Buka menu Riwayat Pembelian, pilih pesanan dengan status "Dikirim", lalu tap tombol Lacak. Kamu akan melihat update lokasi paket secara real-time.' },
  { id: 2, cat: 'order',   q: 'Berapa lama estimasi pengiriman?',     a: 'Estimasi pengiriman 2-5 hari kerja untuk Pulau Jawa dan 4-8 hari untuk luar Jawa, tergantung kurir yang dipilih.' },
  { id: 3, cat: 'payment', q: 'Metode pembayaran apa saja yang didukung?', a: 'Kami mendukung transfer bank (BCA, Mandiri, BNI, BRI), e-wallet (GoPay, OVO, Dana, ShopeePay), dan QRIS.' },
  { id: 4, cat: 'payment', q: 'Apakah ada biaya tambahan?',                a: 'Tidak ada biaya admin tambahan. Kamu hanya membayar harga barang + ongkir sesuai kurir pilihan.' },
  { id: 5, cat: 'account', q: 'Bagaimana cara mengubah password?',         a: 'Saat ini fitur ubah password sedang dalam pengembangan. Sementara ini, kamu bisa hubungi support untuk reset password.' },
  { id: 6, cat: 'sell',    q: 'Bagaimana cara mulai jual barang?',         a: 'Buka Profil → Jual Barang. Upload foto, isi detail barang (kondisi, ukuran, harga), lalu tap Pasang Barang. Barang langsung tampil di katalog.' },
  { id: 7, cat: 'sell',    q: 'Berapa komisi penjualan?',                   a: 'SecondSpace mengambil komisi 5% dari harga jual. Sisanya akan ditransfer ke rekening kamu setelah pembeli konfirmasi terima barang.' },
]

const filteredFaqs = computed(() => {
  let list = faqs
  if (activeCategory.value !== 'all') {
    list = list.filter(f => f.cat === activeCategory.value)
  }
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter(f => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q))
  }
  return list
})
</script>

<style scoped>
@reference "../assets/main.css";

/* ── Root ───────────────────────────────────────────────────────────────────── */
.help-root {
  @apply pb-8;
  padding: 0.75rem;
}
@media (min-width: 640px) { .help-root { padding: 1rem; } }
.section-gap {
  @apply mb-5 sm:mb-6;
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

/* ── Search ────────────────────────────────────────────────────────────────── */
.search-wrap {
  @apply relative;
}
.search-icon {
  @apply absolute left-4 top-1/2 -translate-y-1/2 text-black/40 pointer-events-none;
}
.search-input {
  @apply w-full h-12 pl-11 pr-4 rounded-xl text-sm
         border-2 border-black/15 outline-none bg-white
         transition-all duration-200;
  box-shadow: 3px 3px 0 0 #111;
}
.search-input:focus {
  border-color: #C1121F;
}

/* ── Section sub-header ────────────────────────────────────────────────────── */
.cat-section-header {
  @apply flex items-center gap-2 mb-3;
}
.cat-section-header .section-accent {
  @apply h-4;
}
.section-title {
  @apply text-[11px] font-bold uppercase tracking-widest text-black/50;
}

/* ── Category grid ─────────────────────────────────────────────────────────── */
.cat-grid {
  @apply grid grid-cols-2 sm:grid-cols-4 gap-3;
}
.cat-card {
  @apply flex flex-col items-center gap-2 p-4 rounded-2xl bg-white
         transition-all duration-150;
  border: 2px solid #111;
  box-shadow: 3px 3px 0 0 #111;
}
.cat-card:hover {
  transform: translate(1.5px, 1.5px);
  box-shadow: 1.5px 1.5px 0 0 #111;
}
.cat-active {
  background: #FDF0D5;
}
.cat-icon {
  @apply w-12 h-12 rounded-full flex items-center justify-center text-white;
  border: 2px solid #111;
}
.icon-fashion {
  background: linear-gradient(135deg, #C1121F, #780000);
}
.icon-sports {
  background: linear-gradient(135deg, #669BBC, #003049);
}
.cat-label {
  @apply text-xs font-bold text-black/80;
}

/* ── FAQ ───────────────────────────────────────────────────────────────────── */
.faq-list {
  @apply flex flex-col gap-3;
}
.faq-item {
  @apply rounded-2xl overflow-hidden;
  border: 2px solid #111;
  box-shadow: 3px 3px 0 0 #111;
}
.faq-header {
  @apply w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left;
}
.faq-q {
  @apply text-sm font-bold text-gray-900 flex-1;
}
.faq-chevron {
  @apply text-black/50 flex-shrink-0 transition-transform duration-200;
}
.faq-chevron.rotate-180 {
  transform: rotate(180deg);
}
.faq-body {
  @apply px-4 pb-4 text-[13px] text-black/65 leading-relaxed border-t border-black/10 pt-3;
}
.no-results {
  @apply text-center py-8 text-sm text-black/45;
}

/* ── Contact card ──────────────────────────────────────────────────────────── */
.contact-card {
  @apply relative overflow-hidden rounded-2xl p-6 text-white text-center;
  background: linear-gradient(135deg, #003049, #669BBC);
  border: 2px solid #111;
  box-shadow: 4px 4px 0 0 #111;
}
.contact-overlay {
  @apply absolute inset-0 bg-white/5 pointer-events-none;
}
.contact-deco {
  @apply absolute -top-10 -right-10 w-32 h-32 rounded-full pointer-events-none;
  background: rgba(255, 255, 255, 0.08);
}
.contact-icon {
  @apply relative z-10 w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-3;
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid #fff;
}
.contact-title {
  @apply relative z-10 text-lg font-bold mb-1;
  font-family: 'CalSans', serif;
}
.contact-sub {
  @apply relative z-10 text-xs text-white/75 mb-4;
}
.contact-actions {
  @apply relative z-10 flex flex-col sm:flex-row gap-2 sm:gap-3 max-w-xs mx-auto;
}
.contact-btn {
  @apply flex-1 px-4 py-2.5 text-xs font-bold rounded-xl bg-white text-[#003049] no-underline;
  border: 2px solid #111;
  box-shadow: 3px 3px 0 0 #111;
  transition: all 0.15s ease;
}
.contact-secondary {
  background: rgba(255, 255, 255, 0.15);
  @apply text-white;
}
.contact-btn:hover {
  transform: translate(1.5px, 1.5px);
  box-shadow: 1.5px 1.5px 0 0 #111;
}
</style>
