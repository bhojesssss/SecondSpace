<template>
  <div class="catalog-root">

    <!-- ═══════════════════════════════════════ HEADER ═══════════════════════════════════════ -->
    <section class="section-gap">
      <div class="section-title-wrap">
        <div class="section-accent fashion-accent"></div>
        <h1 class="page-title">Catalog</h1>
      </div>
      <div class="md:hidden relative search-wrap">
        <input v-model="searchQuery" type="text" placeholder="Search products..." class="search-input" />
        <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
      </div>
      <div class="tabs-track scrollbar-hide">
        <button v-for="tab in tabs" :key="tab.value" @click="activeTab = tab.value" class="tab-btn" :class="getTabClass(tab.value)">{{ tab.label }}</button>
      </div>
    </section>

    <!-- ═══════════════════════════════════════ CATEGORY CHIPS ═══════════════════════════════════════ -->
    <section class="section-gap reveal">
      <div class="section-title-wrap">
        <div class="section-accent" :class="activeTab === 'sports' ? 'sports-accent' : 'fashion-accent'"></div>
        <h3 class="section-title">Categories</h3>
      </div>
      <div class="cats-track scrollbar-hide">
        <button v-for="cat in activeCategories" :key="cat" @click="activeCategory = cat" class="cat-chip" :class="getCatChipClass(cat)">{{ cat }}</button>
      </div>
    </section>

    <!-- ═══════════════════════════════════════ SORT / VIEW BAR ═══════════════════════════════════════ -->
    <section class="sort-bar reveal">
      <span class="items-count">{{ products.length }} items</span>
      <div class="flex gap-2">
        <div class="sort-dd" ref="sortDdRef">
          <button type="button" class="sort-trigger" :class="{ 'is-open': sortOpen }" @click="sortOpen = !sortOpen" aria-haspopup="listbox" :aria-expanded="sortOpen">
            <span class="sort-trigger-label">{{ activeSortLabel }}</span>
            <svg class="sort-chevron" :class="{ 'is-open': sortOpen }" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          <transition name="sort-pop">
            <ul v-if="sortOpen" class="sort-menu" role="listbox">
              <li v-for="opt in sortOptions" :key="opt.value" role="option" :aria-selected="sortBy === opt.value" class="sort-option" :class="{ 'is-active': sortBy === opt.value }" @click="selectSort(opt.value)">
                <span>{{ opt.label }}</span>
                <svg v-if="sortBy === opt.value" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </li>
            </ul>
          </transition>
        </div>
        <button @click="showGrid = !showGrid" class="view-btn glass-panel" :title="showGrid ? 'Switch to list view' : 'Switch to grid view'">
          <svg v-if="showGrid" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
          </svg>
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
          </svg>
        </button>
      </div>
    </section>

    <!-- ═══════════════════════════════════════ PRODUCTS GRID ═══════════════════════════════════════ -->
    <section>
      <!-- Loading skeleton -->
      <div v-if="loading" class="grid gap-3 sm:gap-4" :class="showGrid ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4' : 'grid-cols-1'">
        <div v-for="i in 8" :key="i" class="skeleton-card">
          <div class="skeleton skeleton-img"></div>
          <div class="skeleton skeleton-line mt-3"></div>
          <div class="skeleton skeleton-line-sm mt-2"></div>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="error-banner">
        <p class="error-text">{{ error }}</p>
        <button @click="fetchProducts" class="retry-btn">Coba Lagi</button>
      </div>

      <!-- Data -->
      <template v-else>
        <div class="grid gap-3 sm:gap-4" :class="showGrid ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4' : 'grid-cols-1'">
          <ProductCard v-for="(product, i) in products" :key="product.id" :product="product" class="reveal" :class="`reveal-delay-${(i % 4) + 1}`" />
        </div>
        <div v-if="products.length === 0" class="empty-state reveal">
          <div class="empty-icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <p class="empty-title">No products found</p>
          <p class="empty-sub">Coba cari dengan kata kunci lain.</p>
        </div>
      </template>
    </section>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useScrollReveal } from '@/composables/useScrollReveal'
import ProductCard from '@/components/ProductCard.vue'
import api from '@/services/api'

useScrollReveal()
const route = useRoute()
const router = useRouter()

const searchQuery = ref(route.query.q || '')
const activeTab = ref(route.query.type || 'all')
const activeCategory = ref(route.query.category || 'All')
const sortBy = ref('newest')
const showGrid = ref(true)

const sortOptions = [
  { value: 'newest',     label: 'Newest' },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'popular',    label: 'Most Popular' },
]
const sortOpen = ref(false)
const sortDdRef = ref(null)
const activeSortLabel = computed(() => sortOptions.find(o => o.value === sortBy.value)?.label || 'Sort')
const selectSort = (value) => { sortBy.value = value; sortOpen.value = false }

const handleClickOutside = (e) => { if (sortOpen.value && sortDdRef.value && !sortDdRef.value.contains(e.target)) sortOpen.value = false }
const handleEsc = (e) => { if (e.key === 'Escape') sortOpen.value = false }
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleEsc)
  fetchProducts()
})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleEsc)
  if (_debounceTimer) clearTimeout(_debounceTimer)
})

// Sync filters to URL
watch([activeTab, activeCategory, searchQuery], () => {
  router.replace({
    query: {
      ...route.query,
      type: activeTab.value !== 'all' ? activeTab.value : undefined,
      category: activeCategory.value !== 'All' ? activeCategory.value : undefined,
      q: searchQuery.value || undefined,
    }
  })
}, { deep: true })

// Debounced re-fetch on filter change
let _debounceTimer = null
watch([activeTab, activeCategory, searchQuery, sortBy], () => {
  clearTimeout(_debounceTimer)
  _debounceTimer = setTimeout(fetchProducts, 400)
}, { deep: true })

const tabs = [
  { label: 'All',     value: 'all' },
  { label: 'Fashion', value: 'fashion' },
  { label: 'Sports',  value: 'sports' },
]

const fashionCats = ['All', 'T-Shirts', 'Hoodies', 'Jackets', 'Pants', 'Shorts', 'Shoes', 'Bags', 'Accessories']
const sportsCats  = ['All', 'Running', 'Basketball', 'Football', 'Padel', 'Gym']

const activeCategories = computed(() => activeTab.value === 'sports' ? sportsCats : fashionCats)

const getTabClass = (value) => {
  if (activeTab.value !== value) return 'tab-inactive glass-panel'
  if (value === 'sports') return 'tab-active-sports'
  if (value === 'fashion') return 'tab-active-fashion'
  return 'tab-active-all'
}
const getCatChipClass = (cat) => {
  if (activeCategory.value !== cat) return 'cat-chip-inactive glass-panel'
  return activeTab.value === 'sports' ? 'cat-chip-active-sports' : 'cat-chip-active-fashion'
}

// ── API ───────────────────────────────────────────────────────────────────────
const products = ref([])
const loading  = ref(false)
const error    = ref(null)

const mapProduct = (p) => ({
  id:       p.id,
  name:     p.name,
  price:    p.price,
  category: p.category || p.category_name || '',
  img:      Array.isArray(p.images) ? p.images[0] : (p.img || p.image_url || ''),
  sold:     p.sold || p.sold_count || 0,
  size:     p.size || '-',
  sizes:    Array.isArray(p.sizes) ? p.sizes : (p.size ? [p.size] : []),
  stock:    Number.isFinite(p.stock) ? p.stock : (p.stock != null ? Number(p.stock) : null),
  is_available: p.is_available !== false,
})

async function fetchProducts() {
  loading.value = true
  error.value = null
  try {
    const params = {}
    if (activeTab.value !== 'all')    params.type = activeTab.value
    if (activeCategory.value !== 'All') params.category = activeCategory.value.toLowerCase()
    if (searchQuery.value)             params.q = searchQuery.value
    if (sortBy.value)                  params.sort = sortBy.value

    const data = await api.get('/products', { params })
    products.value = (Array.isArray(data) ? data : []).map(mapProduct)
  } catch (e) {
    error.value = e.message || 'Gagal memuat produk. Silakan coba lagi.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@reference "../assets/main.css";

.catalog-root { @apply pb-8; padding: 0.75rem; }
@media (min-width: 640px) { .catalog-root { padding: 1rem; } }
.section-gap { @apply mb-6 sm:mb-8; }
.section-title-wrap { @apply flex items-center gap-3 mb-4 sm:mb-5; }
.section-accent { @apply w-1 h-6 sm:h-7 rounded-full flex-shrink-0; }
.fashion-accent { background: linear-gradient(135deg, #C1121F, #780000); }
.sports-accent  { background: linear-gradient(135deg, #669BBC, #003049); }
.page-title { @apply text-2xl font-bold tracking-tight text-gray-900; font-family: 'CalSans', serif; letter-spacing: -0.01em; }
.section-title { @apply text-base font-extrabold tracking-tight text-gray-900; letter-spacing: -0.01em; }

.search-wrap { margin-bottom: 1rem; }
.search-input { @apply w-full h-11 pl-5 pr-11 rounded-xl text-sm focus:outline-none transition-colors duration-200; background-color: rgba(255,255,255,0.65); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 2px solid #111; }
.search-input:focus { border-color: #C1121F; }
.search-icon { @apply absolute right-4 top-1/2 -translate-y-1/2 text-black/40 pointer-events-none; }

.tabs-track { @apply flex gap-2 sm:gap-3 overflow-x-auto pb-2; }
.tab-btn { @apply flex-shrink-0 px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-bold rounded-xl; border: 2px solid #111; transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease; }
.tab-active-all,.tab-active-fashion,.tab-active-sports { @apply text-white; box-shadow: 4px 4px 0 0 #111; }
.tab-active-all:hover,.tab-active-fashion:hover,.tab-active-sports:hover { transform: translate(2px, 2px); box-shadow: 2px 2px 0 0 #111; }
.tab-active-all    { background: linear-gradient(135deg, #111111, #333333); }
.tab-active-fashion { background: linear-gradient(135deg, #C1121F, #780000); }
.tab-active-sports  { background: linear-gradient(135deg, #669BBC, #003049); }
.tab-inactive { @apply text-black/70; box-shadow: 2px 2px 0 0 #111; }
.tab-inactive:hover { @apply text-black; transform: translate(1px,1px); box-shadow: 1px 1px 0 0 #111; }

.cats-track { @apply flex gap-2.5 overflow-x-auto pb-2; }
.cat-chip { @apply flex-shrink-0 px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold rounded-lg; border: 2px solid #111; transition: transform 0.15s ease, box-shadow 0.15s ease; }
.cat-chip-active-fashion,.cat-chip-active-sports { @apply text-white; box-shadow: 3px 3px 0 0 #111; }
.cat-chip-active-fashion:hover,.cat-chip-active-sports:hover { transform: translate(1.5px,1.5px); box-shadow: 1.5px 1.5px 0 0 #111; }
.cat-chip-active-fashion { background: linear-gradient(135deg, #C1121F, #780000); }
.cat-chip-active-sports  { background: linear-gradient(135deg, #669BBC, #003049); }
.cat-chip-inactive { @apply text-black/70; }
.cat-chip-inactive:hover { @apply text-black; box-shadow: 2px 2px 0 0 #111; transform: translate(-1px,-1px); }

.sort-bar { @apply flex items-center justify-between mb-5 gap-2 sm:gap-3 relative flex-wrap; z-index: 30; }
.items-count { @apply text-xs font-bold text-black/60 uppercase tracking-wider; }
.sort-dd { @apply relative; }
.sort-trigger { @apply flex items-center justify-between gap-2 text-xs sm:text-sm font-bold rounded-xl px-3 sm:px-4 py-2 bg-white text-black cursor-pointer outline-none; min-width: 132px; border: 2px solid #111; box-shadow: 3px 3px 0 0 #111; transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease; }
@media (min-width: 640px) { .sort-trigger { min-width: 168px; } }
.sort-trigger:hover { transform: translate(1.5px,1.5px); box-shadow: 1.5px 1.5px 0 0 #111; }
.sort-trigger.is-open { border-color: #C1121F; transform: translate(1.5px,1.5px); box-shadow: 1.5px 1.5px 0 0 #111; }
.sort-trigger-label { @apply truncate; }
.sort-chevron { @apply flex-shrink-0 text-black/70; transition: transform 0.2s ease; }
.sort-chevron.is-open { transform: rotate(180deg); color: #C1121F; }
.sort-menu { @apply absolute right-0 top-full mt-2 w-48 sm:w-56 rounded-xl bg-white overflow-hidden; border: 2px solid #111; box-shadow: 4px 4px 0 0 #111; z-index: 40; list-style: none; padding: 0.25rem; margin-left: 0; }
.sort-option { @apply flex items-center justify-between text-sm font-semibold text-black/80 px-3 py-2.5 rounded-lg cursor-pointer; transition: background-color 0.12s ease, color 0.12s ease; }
.sort-option:hover { @apply bg-[#FDF0D5] text-black; }
.sort-option.is-active { background: linear-gradient(135deg, #C1121F, #780000); @apply text-white; }
.sort-option.is-active:hover { @apply text-white; }
.sort-pop-enter-active,.sort-pop-leave-active { transition: transform 0.15s ease, opacity 0.15s ease; transform-origin: top right; }
.sort-pop-enter-from,.sort-pop-leave-to { opacity: 0; transform: scale(0.96) translateY(-4px); }
.view-btn { @apply w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-white text-black/70 hover:text-[#C1121F] cursor-pointer flex-shrink-0; border: 2px solid #111; box-shadow: 3px 3px 0 0 #111; transition: transform 0.15s ease, box-shadow 0.15s ease; }
.view-btn:hover { transform: translate(1.5px,1.5px); box-shadow: 1.5px 1.5px 0 0 #111; }

.empty-state { @apply text-center py-20; }
.empty-icon { @apply w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-5 transition-transform duration-300 hover:scale-110; background: linear-gradient(135deg, #C1121F, #780000); box-shadow: 0 8px 24px -8px rgba(193,18,31,0.5); }
.empty-title { @apply font-bold text-lg text-gray-900 mb-1; }
.empty-sub { @apply text-sm text-black/50; }

.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

/* ── Skeleton ────────────────────────────────────────────────────── */
.skeleton { @apply animate-pulse bg-black/10 rounded-xl; }
.skeleton-card { @apply rounded-2xl overflow-hidden p-1; border: 2px solid #e5e5e5; }
.skeleton-img { height: 150px; @apply rounded-xl; }
.skeleton-line { height: 14px; @apply rounded-md w-3/4; }
.skeleton-line-sm { height: 12px; @apply rounded-md w-1/2; }

/* ── Error ───────────────────────────────────────────────────────── */
.error-banner { @apply flex flex-col items-center gap-3 py-10 text-center; }
.error-text { @apply text-sm font-semibold text-[#C1121F]; }
.retry-btn { @apply px-5 py-2 text-sm font-bold rounded-xl text-white; background: linear-gradient(135deg, #C1121F, #780000); border: 2px solid #111; box-shadow: 3px 3px 0 0 #111; transition: transform 0.15s ease, box-shadow 0.15s ease; }
.retry-btn:hover { transform: translate(1.5px,1.5px); box-shadow: 1.5px 1.5px 0 0 #111; }
</style>
