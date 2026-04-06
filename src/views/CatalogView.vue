<template>
  <div class="min-h-screen bg-[#FDF0D5] pb-8">

    <!-- Header -->
    <div class="px-4 pt-4 pb-3 max-w-6xl mx-auto">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-1 h-7 bg-[linear-gradient(135deg,#C1121F,#780000)] rounded-full"></div>
        <h1 class="text-2xl font-bold" style="font-family: 'CalSans', serif;">Catalog</h1>
      </div>

      <!-- Search (mobile only) -->
      <div class="md:hidden relative mb-3">
        <input v-model="searchQuery" type="text" placeholder="Search products..."
          class="w-full h-10 pl-5 pr-10 rounded-full border border-black/10 glass-panel shadow-sm hover:shadow-md text-sm focus:outline-none focus:border-[#C1121F] focus:ring-2 focus:ring-[#C1121F]/20 transition-all duration-300" />
      </div>

      <!-- Filter Tabs -->
      <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          @click="activeTab = tab.value"
          class="flex-shrink-0 px-5 py-2 rounded-full text-xs font-bold transition-all duration-300 shadow-sm hover:shadow-md active:scale-95"
          :class="activeTab === tab.value
            ? (tab.value === 'sports' ? 'bg-gradient-to-r from-[#669BBC] to-[#003049] text-white shadow-[#669BBC]/30' : 'bg-gradient-to-r from-[#C1121F] to-[#780000] text-white shadow-[#C1121F]/30')
            : 'glass-panel text-black/60 hover:text-black'"
        >{{ tab.label }}</button>
      </div>
    </div>

    <!-- Category chips -->
    <div class="px-4 pb-4 max-w-6xl mx-auto">
      <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          v-for="cat in activeCategories"
          :key="cat"
          @click="activeCategory = cat"
          class="flex-shrink-0 px-4 py-1.5 rounded-full text-xs transition-all duration-300 border-2 active:scale-95 hover:shadow-sm"
          :class="activeCategory === cat
            ? 'bg-black text-white border-black shadow-md'
            : 'bg-transparent text-black/60 border-black/10 hover:border-black/30 hover:text-black/80'"
        >{{ cat }}</button>
      </div>
    </div>

    <!-- Sort & Filter bar -->
    <div class="px-4 pb-4 max-w-6xl mx-auto flex items-center justify-between reveal">
      <span class="text-xs font-bold text-black/50">{{ filteredProducts.length }} items</span>
      <div class="flex gap-2">
        <select v-model="sortBy" class="text-xs border border-black/10 rounded-xl px-3 py-2 glass-panel focus:outline-none focus:border-[#C1121F] focus:ring-1 focus:ring-[#C1121F] hover:shadow-sm transition-all cursor-pointer">
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="popular">Most Popular</option>
        </select>
        <button @click="showGrid = !showGrid" class="p-2 rounded-xl border border-black/10 glass-panel hover:text-[#C1121F] transition-all hover:shadow-sm active:scale-95">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Products Grid -->
    <div class="px-4 max-w-6xl mx-auto">
      <div class="grid gap-3" :class="showGrid ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4' : 'grid-cols-1'">
        <ProductCard
          v-for="(product, i) in filteredProducts"
          :key="product.id"
          :product="product"
          class="reveal"
          :class="`reveal-delay-${(i % 4) + 1}`"
        />
      </div>
      <div v-if="filteredProducts.length === 0" class="text-center py-20 reveal">
        <div class="w-24 h-24 bg-gradient-to-br from-[#111111] to-[#333333] rounded-full mx-auto flex items-center justify-center text-5xl mb-6 shadow-lg shadow-black/20 transform hover:scale-110 transition-transform duration-300">
          🔍
        </div>
        <p class="font-bold text-lg mb-1">No products found</p>
        <p class="text-sm text-black/50 mb-6">Coba cari dengan kata kunci lain.</p>
      </div>
    </div>
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
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>