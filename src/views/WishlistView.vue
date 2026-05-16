<template>
  <div class="wl-root">

    <AuthGate v-if="!isLoggedIn" title="Login untuk Wishlist" message="Masuk dulu untuk lihat barang favoritmu." />

    <template v-else>
      <section class="section-gap">
        <div class="header-wrap">
          <button @click="$router.back()" class="back-btn" aria-label="Back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <div class="section-accent fashion-accent"></div>
          <h1 class="page-title">Wishlist <span v-if="items.length" class="count">({{ items.length }})</span></h1>
        </div>
      </section>

      <!-- Loading -->
      <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        <div v-for="i in 8" :key="i" class="skeleton aspect-square rounded-2xl"></div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="error-banner">
        <p class="error-text">{{ error }}</p>
        <button @click="fetchWishlist" class="retry-btn">Coba Lagi</button>
      </div>

      <!-- Empty -->
      <div v-else-if="items.length === 0" class="empty-state reveal">
        <div class="empty-icon">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </div>
        <p class="empty-title">Wishlist Kosong</p>
        <p class="empty-sub">Tap ikon hati di produk untuk menyimpan favorit.</p>
        <router-link to="/catalog" class="empty-cta">Browse Katalog</router-link>
      </div>

      <!-- Grid -->
      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        <ProductCard
          v-for="(item, idx) in items"
          :key="item.id"
          :product="item.product"
          class="reveal"
          :class="`reveal-delay-${(idx % 4) + 1}`"
        />
      </div>
    </template>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { useAuth } from '@/composables/useAuth'
import AuthGate from '@/components/AuthGate.vue'
import ProductCard from '@/components/ProductCard.vue'
import api from '@/services/api'

useScrollReveal()
const { isLoggedIn } = useAuth()

const items = ref([])
const loading = ref(false)
const error = ref(null)

const mapItem = (w) => {
  const p = w.products || w.product || {}
  const imgs = Array.isArray(p.images) ? p.images : []
  return {
    id: w.id,
    product_id: p.id,
    product: {
      id: p.id,
      name: p.name,
      price: p.price,
      img: imgs[0] || '',
      images: imgs,
      sold: p.sold_count || 0,
      sold_count: p.sold_count || 0,
      size: p.size || '',
      category: p.categories?.name || '',
    }
  }
}

async function fetchWishlist() {
  if (!isLoggedIn.value) return
  loading.value = true
  error.value = null
  try {
    const data = await api.get('/wishlist')
    const list = Array.isArray(data) ? data : []
    items.value = list.map(mapItem).filter(i => i.product_id)
  } catch (e) {
    error.value = e.message || 'Gagal memuat wishlist.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchWishlist)
</script>

<style scoped>
@reference "../assets/main.css";

.wl-root { @apply pb-8; padding: 0.75rem; }
@media (min-width: 640px) { .wl-root { padding: 1rem; } }
.section-gap { @apply mb-5 sm:mb-6; }
.header-wrap { @apply flex items-center gap-3; }
.back-btn { @apply w-9 h-9 rounded-lg flex items-center justify-center text-black/70 bg-white transition-all duration-200 active:scale-90; border: 2px solid #111; box-shadow: 2px 2px 0 0 #111; }
.back-btn:hover { color: #C1121F; transform: translate(1px,1px); box-shadow: 1px 1px 0 0 #111; }
.section-accent { @apply w-1 h-7 rounded-full flex-shrink-0; }
.fashion-accent { background: linear-gradient(135deg, #C1121F, #780000); }
.page-title { @apply text-2xl font-bold tracking-tight text-gray-900; font-family: 'CalSans', serif; letter-spacing: -0.01em; }
.count { @apply text-base font-medium text-black/40 ml-1; font-family: 'Helvetica', sans-serif; }

.skeleton { @apply animate-pulse bg-black/10; }

.error-banner { @apply flex flex-col items-center gap-3 py-10 text-center; }
.error-text { @apply text-sm font-semibold text-[#C1121F]; }
.retry-btn { @apply px-5 py-2 text-sm font-bold rounded-xl text-white; background: linear-gradient(135deg, #C1121F, #780000); border: 2px solid #111; box-shadow: 3px 3px 0 0 #111; }

.empty-state { @apply flex flex-col items-center justify-center text-center py-20; }
.empty-icon { @apply w-20 h-20 rounded-full flex items-center justify-center mb-5; background: linear-gradient(135deg, #C1121F, #780000); border: 2px solid #111; box-shadow: 4px 4px 0 0 #111; }
.empty-title { @apply text-xl font-bold text-gray-900 mb-1; font-family: 'CalSans', serif; }
.empty-sub { @apply text-sm text-black/50 mb-6; }
.empty-cta { @apply inline-block px-6 py-3 text-sm font-bold rounded-xl text-white no-underline; background: linear-gradient(135deg, #C1121F, #780000); border: 2px solid #111; box-shadow: 4px 4px 0 0 #111; transition: transform 0.15s ease, box-shadow 0.15s ease; }
.empty-cta:hover { transform: translate(2px,2px); box-shadow: 2px 2px 0 0 #111; }
</style>
