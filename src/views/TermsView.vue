<template>
  <div class="terms-root">

    <!-- ═══════════════════════════════════════ HEADER ═══════════════════════════════════════ -->
    <section class="section-gap">
      <div class="header-wrap">
        <button @click="goBack" class="back-btn" aria-label="Back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
        <div class="section-accent fashion-accent"></div>
        <h1 class="page-title">Syarat & Ketentuan</h1>
      </div>
      <p class="last-updated">Terakhir diperbarui: 1 Mei 2026</p>
    </section>

    <!-- ═══════════════════════════════════════ INTRO CARD ═══════════════════════════════════════ -->
    <section class="section-gap reveal">
      <div class="intro-card">
        <div class="intro-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
        </div>
        <p class="intro-text">
          Selamat datang di SecondSpace. Dengan menggunakan platform kami, kamu setuju
          dengan syarat dan ketentuan berikut. Mohon baca dengan seksama.
        </p>
      </div>
    </section>

    <!-- ═══════════════════════════════════════ TOC ═══════════════════════════════════════ -->
    <section class="section-gap reveal reveal-delay-1">
      <div class="toc-card glass-panel">
        <p class="toc-title">Daftar Isi</p>
        <div class="toc-list">
          <a
            v-for="(s, i) in sections"
            :key="s.id"
            :href="`#${s.id}`"
            class="toc-item"
          >
            <span class="toc-num">{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="toc-label">{{ s.title }}</span>
          </a>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════ SECTIONS ═══════════════════════════════════════ -->
    <section
      v-for="(s, i) in sections"
      :key="s.id"
      :id="s.id"
      class="terms-section reveal"
      :class="`reveal-delay-${(i % 4) + 1}`"
    >
      <div class="terms-section-head">
        <span class="terms-num">{{ String(i + 1).padStart(2, '0') }}</span>
        <h3 class="terms-title">{{ s.title }}</h3>
      </div>
      <div class="terms-body glass-panel">
        <p v-for="(p, pi) in s.paragraphs" :key="pi" class="terms-p">
          {{ p }}
        </p>
        <ul v-if="s.points" class="terms-list">
          <li v-for="(pt, pti) in s.points" :key="pti">{{ pt }}</li>
        </ul>
      </div>
    </section>

    <!-- ═══════════════════════════════════════ CONTACT FOOTER ═══════════════════════════════════════ -->
    <section class="reveal mt-2">
      <div class="footer-card">
        <p class="footer-title">Ada pertanyaan?</p>
        <p class="footer-sub">Hubungi tim legal kami di legal@secondspace.id</p>
        <router-link to="/profile/help" class="footer-btn">Buka Bantuan</router-link>
      </div>
    </section>

  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useScrollReveal } from '@/composables/useScrollReveal'
useScrollReveal()

const router = useRouter()

const goBack = () => {
  if (window.history.state?.back) router.back()
  else router.push('/profile')
}

const sections = [
  {
    id: 'penerimaan',
    title: 'Penerimaan Ketentuan',
    paragraphs: [
      'Dengan mengakses dan menggunakan SecondSpace, kamu menyatakan setuju untuk terikat pada syarat dan ketentuan ini.',
      'Jika kamu tidak setuju dengan salah satu bagian dari ketentuan ini, mohon untuk tidak menggunakan layanan kami.',
    ],
  },
  {
    id: 'akun',
    title: 'Akun Pengguna',
    paragraphs: [
      'Untuk menggunakan fitur penuh, kamu wajib mendaftar akun dengan informasi yang benar dan terkini.',
    ],
    points: [
      'Kamu bertanggung jawab menjaga kerahasiaan password.',
      'Satu akun untuk satu orang. Akun ganda dapat dinonaktifkan.',
      'Akun di bawah 17 tahun harus dengan persetujuan orang tua.',
    ],
  },
  {
    id: 'jual-beli',
    title: 'Aturan Jual & Beli',
    paragraphs: [
      'SecondSpace adalah marketplace untuk barang preloved fashion dan olahraga. Semua transaksi dilakukan antar pengguna dengan SecondSpace sebagai perantara.',
    ],
    points: [
      'Penjual wajib mendeskripsikan barang secara akurat.',
      'Foto harus asli, bukan dari internet.',
      'Pembeli wajib membayar dalam 24 jam setelah pesanan.',
      'Komisi platform sebesar 5% dari harga jual.',
    ],
  },
  {
    id: 'larangan',
    title: 'Barang yang Dilarang',
    paragraphs: [
      'Demi keamanan komunitas, beberapa kategori barang tidak diizinkan dijual:',
    ],
    points: [
      'Barang palsu atau replika tanpa label "replica".',
      'Pakaian dalam bekas pakai.',
      'Barang yang melanggar hak cipta.',
      'Barang ilegal atau berbahaya.',
    ],
  },
  {
    id: 'pembayaran',
    title: 'Pembayaran & Refund',
    paragraphs: [
      'Pembayaran ditahan oleh SecondSpace sampai pembeli konfirmasi terima barang. Setelah konfirmasi, dana akan diteruskan ke penjual dalam 1-2 hari kerja.',
      'Refund tersedia jika barang tidak sesuai deskripsi atau rusak saat diterima. Pengajuan refund maksimal 3 hari setelah barang diterima.',
    ],
  },
  {
    id: 'privasi',
    title: 'Privasi & Data',
    paragraphs: [
      'Kami mengumpulkan data pribadi sesuai dengan Kebijakan Privasi yang berlaku. Data hanya digunakan untuk operasional platform dan tidak diperjualbelikan ke pihak ketiga.',
    ],
  },
  {
    id: 'perubahan',
    title: 'Perubahan Ketentuan',
    paragraphs: [
      'SecondSpace berhak mengubah syarat dan ketentuan ini sewaktu-waktu. Perubahan akan diberitahukan melalui notifikasi dalam aplikasi.',
      'Penggunaan layanan setelah perubahan dianggap sebagai persetujuan terhadap ketentuan baru.',
    ],
  },
]
</script>

<style scoped>
@reference "../assets/main.css";

/* ── Root ───────────────────────────────────────────────────────────────────── */
.terms-root {
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
.last-updated {
  @apply text-[11px] text-black/45 mt-2 ml-12 font-bold uppercase tracking-wider;
}

/* ── Intro card ───────────────────────────────────────────────────────────── */
.intro-card {
  @apply flex items-start gap-3 rounded-2xl p-4 sm:p-5 bg-white;
  border: 2px solid #111;
  box-shadow: 4px 4px 0 0 #C1121F;
}
.intro-icon {
  @apply w-11 h-11 rounded-full flex items-center justify-center text-white flex-shrink-0;
  background: linear-gradient(135deg, #C1121F, #780000);
  border: 2px solid #111;
}
.intro-text {
  @apply text-sm text-black/75 leading-relaxed;
}

/* ── TOC ───────────────────────────────────────────────────────────────────── */
.toc-card {
  @apply rounded-2xl p-4 sm:p-5;
  border: 2px solid #111;
  box-shadow: 4px 4px 0 0 #111;
}
.toc-title {
  @apply text-[11px] font-bold uppercase tracking-widest text-black/50 mb-3;
}
.toc-list {
  @apply flex flex-col gap-1;
}
.toc-item {
  @apply flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-semibold text-black/75 no-underline
         transition-colors duration-150;
}
.toc-item:hover {
  background: rgba(193, 18, 31, 0.08);
  color: #C1121F;
}
.toc-num {
  @apply text-[11px] font-bold text-[#C1121F] min-w-[24px];
  font-family: 'CalSans', serif;
}
.toc-label {
  @apply text-[13px];
}

/* ── Sections ──────────────────────────────────────────────────────────────── */
.terms-section {
  @apply mb-6;
  scroll-margin-top: 1rem;
}
.terms-section-head {
  @apply flex items-baseline gap-2 mb-2;
}
.terms-num {
  @apply text-base font-bold text-[#C1121F];
  font-family: 'CalSans', serif;
}
.terms-title {
  @apply text-base sm:text-lg font-bold text-gray-900;
  font-family: 'CalSans', serif;
  letter-spacing: -0.01em;
}
.terms-body {
  @apply rounded-2xl p-4 sm:p-5;
  border: 2px solid #111;
  box-shadow: 3px 3px 0 0 #111;
}
.terms-p {
  @apply text-[13px] text-black/70 leading-relaxed mb-2 last:mb-0;
}
.terms-list {
  @apply mt-3 pl-5 space-y-1.5;
  list-style: disc;
}
.terms-list li {
  @apply text-[13px] text-black/70 leading-relaxed;
}

/* ── Footer card ───────────────────────────────────────────────────────────── */
.footer-card {
  @apply rounded-2xl p-5 text-center bg-white;
  border: 2px solid #111;
  box-shadow: 4px 4px 0 0 #111;
}
.footer-title {
  @apply text-base font-bold text-gray-900 mb-1;
  font-family: 'CalSans', serif;
}
.footer-sub {
  @apply text-xs text-black/55 mb-4;
}
.footer-btn {
  @apply inline-block px-6 py-2.5 text-xs font-bold rounded-xl text-white no-underline;
  background: linear-gradient(135deg, #C1121F, #780000);
  border: 2px solid #111;
  box-shadow: 3px 3px 0 0 #111;
  transition: all 0.15s ease;
}
.footer-btn:hover {
  transform: translate(1.5px, 1.5px);
  box-shadow: 1.5px 1.5px 0 0 #111;
}
.footer-btn:active {
  transform: translate(3px, 3px);
  box-shadow: 0 0 0 0 #111;
}
</style>
