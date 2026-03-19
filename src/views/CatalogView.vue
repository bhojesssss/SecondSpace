<template>
  <div class="min-h-screen bg-[#FDF0D5] pb-8">

    <!-- Header -->
    <div class="px-4 pt-4 pb-3 max-w-6xl mx-auto">
      <h1 class="text-2xl font-bold mb-3" style="font-family: 'CalSans', serif;">Catalog</h1>

      <!-- Search (mobile only) -->
      <div class="md:hidden relative mb-3">
        <input v-model="searchQuery" type="text" placeholder="Search products..."
          class="w-full h-9 pl-4 pr-10 rounded-full border border-black/20 bg-white/80 text-sm focus:outline-none focus:border-[#C1121F] transition-colors" />
      </div>

      <!-- Filter Tabs -->
      <div class="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          @click="activeTab = tab.value"
          class="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200"
          :class="activeTab === tab.value
            ? (tab.value === 'sports' ? 'bg-[#669BBC] text-white' : 'bg-[#C1121F] text-white')
            : 'bg-white/60 text-black/60 hover:bg-white'"
        >{{ tab.label }}</button>
      </div>
    </div>

    <!-- Category chips -->
    <div class="px-4 pb-4 max-w-6xl mx-auto">
      <div class="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <button
          v-for="cat in activeCategories"
          :key="cat"
          @click="activeCategory = cat"
          class="flex-shrink-0 px-3 py-1 rounded-full text-xs transition-all duration-200 border"
          :class="activeCategory === cat
            ? 'bg-black text-white border-black'
            : 'bg-transparent text-black/60 border-black/20 hover:border-black/40'"
        >{{ cat }}</button>
      </div>
    </div>

    <!-- Sort & Filter bar -->
    <div class="px-4 pb-4 max-w-6xl mx-auto flex items-center justify-between">
      <span class="text-xs text-black/50">{{ filteredProducts.length }} items</span>
      <div class="flex gap-2">
        <select v-model="sortBy" class="text-xs border border-black/20 rounded-lg px-2 py-1 bg-white/80 focus:outline-none focus:border-[#C1121F]">
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="popular">Most Popular</option>
        </select>
        <button @click="showGrid = !showGrid" class="p-1 rounded-lg border border-black/20 bg-white/80 hover:bg-white transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
      <div v-if="filteredProducts.length === 0" class="text-center py-16 text-black/40">
        <p class="text-4xl mb-3">🔍</p>
        <p class="font-medium">No products found</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useScrollReveal } from '@/composables/useScrollReveal'
import ProductCard from '@/components/ProductCard.vue'

useScrollReveal()
const route = useRoute()

const searchQuery = ref(route.query.q || '')
const activeTab = ref(route.query.type || 'all')
const activeCategory = ref('All')
const sortBy = ref('newest')
const showGrid = ref(true)

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