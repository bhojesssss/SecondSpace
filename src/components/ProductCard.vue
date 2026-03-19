<template>
  <router-link :to="`/product/${product.id}`" class="product-card group block">
    <div class="rounded-xl overflow-hidden bg-[#C1121F] relative" style="aspect-ratio: 1;">
      <img
        :src="product.img"
        :alt="product.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <!-- Wishlist button -->
      <button
        @click.prevent="toggleWishlist"
        class="absolute top-2 right-2 w-7 h-7 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/40 transition-all duration-200"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" :fill="isWishlisted ? 'white' : 'none'" stroke="white" stroke-width="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>
    </div>
    <!-- Info -->
    <div class="mt-2 px-1">
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold text-[#C1121F]">Rp {{ formatPrice(product.price) }}</span>
        <span class="text-[10px] text-black/40">{{ product.size }}</span>
      </div>
      <p class="text-[11px] text-black/60 mt-0.5 truncate">{{ product.name }}</p>
      <p class="text-[10px] text-black/30">Terjual {{ product.sold }}</p>
    </div>
  </router-link>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  product: { type: Object, required: true }
})

const isWishlisted = ref(false)
const toggleWishlist = () => { isWishlisted.value = !isWishlisted.value }
const formatPrice = (price) => price.toLocaleString('id-ID')
</script>

<style scoped>

@reference "../assets/main.css";

.product-card {
  @apply cursor-pointer;
}
.product-card:hover .rounded-xl {
  @apply shadow-lg;
}
</style>