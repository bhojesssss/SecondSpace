<template>
  <div class="catalog-root">

    <!-- ═══════════════════════════════════════ HEADER ═══════════════════════════════════════ -->
    <section class="section-gap">
      <div class="section-title-wrap">
        <div class="section-accent fashion-accent"></div>
        <h1 class="page-title">Catalog</h1>
      </div>

      <!-- Search (mobile only) -->
      <div class="md:hidden relative mb-5">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search products..."
          class="search-input"
        />
        <svg
          class="search-icon"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </div>

      <!-- Type Tabs -->
      <div class="tabs-track scrollbar-hide">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          @click="activeTab = tab.value"
          class="tab-btn"
          :class="getTabClass(tab.value)"
        >
          {{ tab.label }}
        </button>
      </div>
    </section>

    <!-- ═══════════════════════════════════════ CATEGORY CHIPS ═══════════════════════════════════════ -->
    <section class="section-gap reveal">
      <div class="section-title-wrap">
        <div
          class="section-accent"
          :class="activeTab === 'sports' ? 'sports-accent' : 'fashion-accent'"
        ></div>
        <h3 class="section-title">Categories</h3>
      </div>
      <div class="cats-track scrollbar-hide">
        <button
          v-for="cat in activeCategories"
          :key="cat"
          @click="activeCategory = cat"
          class="cat-chip"
          :class="getCatChipClass(cat)"
        >
          {{ cat }}
        </button>
      </div>
    </section>

    <!-- ═══════════════════════════════════════ SORT / VIEW BAR ═══════════════════════════════════════ -->
    <section class="sort-bar reveal">
      <span class="items-count">{{ filteredProducts.length }} items</span>
      <div class="flex gap-2">
        <select v-model="sortBy" class="sort-select glass-panel">
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="popular">Most Popular</option>
        </select>
        <button
          @click="showGrid = !showGrid"
          class="view-btn glass-panel"
          :title="showGrid ? 'Switch to list view' : 'Switch to grid view'"
        >
          <svg
            v-if="showGrid"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
          <svg
            v-else
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
        </button>
      </div>
    </section>

    <!-- ═══════════════════════════════════════ PRODUCTS GRID ═══════════════════════════════════════ -->
    <section>
      <div
        class="grid gap-3 sm:gap-4"
        :class="showGrid ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4' : 'grid-cols-1'"
      >
        <ProductCard
          v-for="(product, i) in filteredProducts"
          :key="product.id"
          :product="product"
          class="reveal"
          :class="`reveal-delay-${(i % 4) + 1}`"
        />
      </div>

      <!-- Empty state -->
      <div v-if="filteredProducts.length === 0" class="empty-state reveal">
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
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </div>
        <p class="empty-title">No products found</p>
        <p class="empty-sub">Coba cari dengan kata kunci lain.</p>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useScrollReveal } from '@/composables/useScrollReveal'
import ProductCard from '@/components/ProductCard.vue'

useScrollReveal()
const route = useRoute()
const router = useRouter()

const searchQuery = ref(route.query.q || '')
const activeTab = ref(route.query.type || 'all')
const activeCategory = ref(route.query.category || 'All')
const sortBy = ref('newest')
const showGrid = ref(true)

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

const tabs = [
  { label: 'All', value: 'all' },
  { label: 'Fashion', value: 'fashion' },
  { label: 'Sports', value: 'sports' },
]

const fashionCats = ['All', 'T-Shirts', 'Hoodies', 'Jackets', 'Pants', 'Shorts', 'Shoes', 'Bags', 'Accessories']
const sportsCats = ['All', 'Running', 'Basketball', 'Football', 'Padel', 'Gym']

const activeCategories = computed(() => {
  if (activeTab.value === 'sports') return sportsCats
  return fashionCats
})

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

// Mock products
const allProducts = [
  ...Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: ['Insurgent Graphic Tee', 'Vintage Hoodie', 'Denim Jacket', 'Slim Pants', 'Board Shorts', 'Sneakers', 'Tote Bag', 'Cap'][i % 8],
    price: [149000, 299000, 399000, 199000, 129000, 449000, 89000, 79000][i % 8],
    category: fashionCats[Math.floor(Math.random() * (fashionCats.length - 1)) + 1],
    type: 'fashion',
    img: new URL('@/assets/ImgCard/insurgent.jpeg', import.meta.url).href,
    sold: Math.floor(Math.random() * 50) + 1,
    size: ['S', 'M', 'L', 'XL'][Math.floor(Math.random() * 4)]
  })),
  ...Array.from({ length: 6 }, (_, i) => ({
    id: i + 20,
    name: ['Running Shoes', 'Basketball Jersey', 'Football Cleats', 'Gym Shorts', 'Sports Jacket', 'Training Pants'][i],
    price: [350000, 250000, 400000, 150000, 450000, 200000][i],
    category: sportsCats[i + 1],
    type: 'sports',
    img: new URL('@/assets/ImgCard/insurgent.jpeg', import.meta.url).href,
    sold: Math.floor(Math.random() * 30) + 1,
    size: ['S', 'M', 'L', 'XL'][Math.floor(Math.random() * 4)]
  }))
]

const filteredProducts = computed(() => {
  let result = [...allProducts]
  if (activeTab.value !== 'all') result = result.filter(p => p.type === activeTab.value)
  if (activeCategory.value !== 'All') result = result.filter(p => p.category === activeCategory.value)
  if (searchQuery.value) result = result.filter(p => p.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
  if (sortBy.value === 'price-asc') result.sort((a, b) => a.price - b.price)
  if (sortBy.value === 'price-desc') result.sort((a, b) => b.price - a.price)
  if (sortBy.value === 'popular') result.sort((a, b) => b.sold - a.sold)
  return result
})
</script>

<style scoped>
@reference "../assets/main.css";

/* ── Root & spacing ─────────────────────────────────────────────────────────── */
.catalog-root {
  @apply pb-8;
  padding: 1rem;
}
.section-gap {
  @apply mb-8;
}

/* ── Section titles ─────────────────────────────────────────────────────────── */
.section-title-wrap {
  @apply flex items-center gap-3 mb-5;
}
.section-accent {
  @apply w-1 h-7 rounded-full flex-shrink-0;
}
.fashion-accent {
  background: linear-gradient(135deg, #C1121F, #780000);
}
.sports-accent {
  background: linear-gradient(135deg, #669BBC, #003049);
}
.page-title {
  @apply text-2xl font-bold tracking-tight text-gray-900;
  font-family: 'CalSans', serif;
  letter-spacing: -0.01em;
}
.section-title {
  @apply text-base font-extrabold tracking-tight text-gray-900;
  letter-spacing: -0.01em;
}

/* ── Search input (brutalist) ───────────────────────────────────────────────── */
.search-input {
  @apply w-full h-11 pl-5 pr-11 rounded-xl text-sm
         focus:outline-none transition-colors duration-200;
  background-color: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 2px solid #111;
}
.search-input:focus {
  border-color: #C1121F;
}
.search-icon {
  @apply absolute right-4 top-1/2 -translate-y-1/2 text-black/40 pointer-events-none;
}

/* ── Type Tabs (brutalist) ──────────────────────────────────────────────────── */
.tabs-track {
  @apply flex gap-3 overflow-x-auto pb-2;
}
.tab-btn {
  @apply flex-shrink-0 px-5 sm:px-6 py-2.5 text-sm font-bold rounded-xl;
  border: 2px solid #111;
  transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
}
.tab-active-all,
.tab-active-fashion,
.tab-active-sports {
  @apply text-white;
  box-shadow: 4px 4px 0 0 #111;
}
.tab-active-all:hover,
.tab-active-fashion:hover,
.tab-active-sports:hover {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 0 #111;
}
.tab-active-all {
  background: linear-gradient(135deg, #111111, #333333);
}
.tab-active-fashion {
  background: linear-gradient(135deg, #C1121F, #780000);
}
.tab-active-sports {
  background: linear-gradient(135deg, #669BBC, #003049);
}
.tab-inactive {
  @apply text-black/70;
  box-shadow: 2px 2px 0 0 #111;
}
.tab-inactive:hover {
  @apply text-black;
  transform: translate(1px, 1px);
  box-shadow: 1px 1px 0 0 #111;
}

/* ── Category chips (brutalist) ─────────────────────────────────────────────── */
.cats-track {
  @apply flex gap-2.5 overflow-x-auto pb-2;
}
.cat-chip {
  @apply flex-shrink-0 px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold rounded-lg;
  border: 2px solid #111;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.cat-chip-active-fashion,
.cat-chip-active-sports {
  @apply text-white;
  box-shadow: 3px 3px 0 0 #111;
}
.cat-chip-active-fashion:hover,
.cat-chip-active-sports:hover {
  transform: translate(1.5px, 1.5px);
  box-shadow: 1.5px 1.5px 0 0 #111;
}
.cat-chip-active-fashion {
  background: linear-gradient(135deg, #C1121F, #780000);
}
.cat-chip-active-sports {
  background: linear-gradient(135deg, #669BBC, #003049);
}
.cat-chip-inactive {
  @apply text-black/70;
}
.cat-chip-inactive:hover {
  @apply text-black;
  box-shadow: 2px 2px 0 0 #111;
  transform: translate(-1px, -1px);
}

/* ── Sort / view bar (brutalist) ───────────────────────────────────────────── */
.sort-bar {
  @apply flex items-center justify-between mb-5 gap-3;
}
.items-count {
  @apply text-xs font-bold text-black/60 uppercase tracking-wider;
}
.sort-select {
  @apply text-sm rounded-xl px-4 py-2 cursor-pointer outline-none transition-colors duration-200;
  border: 2px solid #111;
}
.sort-select:focus {
  border-color: #C1121F;
}
.view-btn {
  @apply w-10 h-10 rounded-xl flex items-center justify-center
         text-black/70 hover:text-[#C1121F] transition-colors duration-200;
  border: 2px solid #111;
}

/* ── Empty state ───────────────────────────────────────────────────────────── */
.empty-state {
  @apply text-center py-20;
}
.empty-icon {
  @apply w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-5
         transition-transform duration-300 hover:scale-110;
  background: linear-gradient(135deg, #C1121F, #780000);
  box-shadow: 0 8px 24px -8px rgba(193, 18, 31, 0.5);
}
.empty-title {
  @apply font-bold text-lg text-gray-900 mb-1;
}
.empty-sub {
  @apply text-sm text-black/50;
}

/* ── Scrollbar hide util ───────────────────────────────────────────────────── */
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
