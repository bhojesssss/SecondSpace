<template>
  <router-link :to="`/product/${product.id}`" class="product-card group block" :class="{ 'is-sold': isSoldOut }">
    <div class="card-frame" style="aspect-ratio: 1">
      <img
        :src="product.img"
        :alt="product.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div v-if="isSoldOut" class="sold-overlay">
        <span class="sold-stamp">SOLD</span>
      </div>
      <!-- Wishlist button -->
      <button v-if="!isSoldOut" @click.prevent="toggleWishlist" class="wishlist-btn" aria-label="Wishlist">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          :fill="isWishlisted ? 'white' : 'none'"
          stroke="white"
          stroke-width="2"
        >
          <path
            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
          />
        </svg>
      </button>
    </div>
    <!-- Info -->
    <div class="card-info">
      <div class="flex items-center justify-between gap-2">
        <span class="card-price">{{ formatRupiah(product.price) }}</span>
        <span class="card-size">{{ sizeLabel }}</span>
      </div>
      <p class="card-name">{{ product.name }}</p>
      <p class="card-sold">{{ isSoldOut ? 'Habis terjual' : `Terjual ${product.sold || 0}` }}</p>
    </div>
  </router-link>
</template>

<script setup>
import { ref, computed } from 'vue'
import api from '@/services/api'

const props = defineProps({
  product: { type: Object, required: true },
})

const isWishlisted = ref(false)
const toggling = ref(false)

const isSoldOut = computed(() => {
  const p = props.product
  const stockNum = Number(p.stock)
  if (Number.isFinite(stockNum) && stockNum <= 0) return true
  if (p.is_available === false) return true
  return false
})

const sizeLabel = computed(() => {
  const p = props.product
  if (Array.isArray(p.sizes) && p.sizes.length) {
    return p.sizes.length > 1 ? `${p.sizes[0]} +${p.sizes.length - 1}` : p.sizes[0]
  }
  return p.size || '-'
})

const toggleWishlist = async () => {
  if (toggling.value || !props.product.id) return
  toggling.value = true
  const wasWishlisted = isWishlisted.value
  isWishlisted.value = !isWishlisted.value
  try {
    if (wasWishlisted) {
      await api.delete(`/wishlist/${props.product.id}`)
    } else {
      await api.post(`/wishlist/${props.product.id}`)
    }
  } catch (e) {
    isWishlisted.value = wasWishlisted
    console.error('Wishlist toggle failed:', e.message)
  } finally {
    toggling.value = false
  }
}

import { formatRupiah } from '@/utils/currency'
</script>

<style scoped>
@reference "../assets/main.css";

.product-card {
  @apply cursor-pointer block;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}
.card-frame {
  @apply rounded-xl overflow-hidden bg-[#C1121F] relative;
  border: 2px solid #111;
  box-shadow: 3px 3px 0 0 #111;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}
.product-card:hover .card-frame {
  transform: translate(1.5px, 1.5px);
  box-shadow: 1.5px 1.5px 0 0 #111;
}
.wishlist-btn {
  @apply absolute top-2 right-2 w-7 h-7 rounded-lg
         flex items-center justify-center
         bg-black/40 hover:bg-[#C1121F]
         transition-colors duration-200;
  border: 1.5px solid #111;
}
.card-info {
  @apply mt-3 px-0.5;
}
.card-price {
  @apply text-sm sm:text-base font-bold text-[#C1121F] leading-none;
  font-family: 'CalSans', serif;
}
.card-size {
  @apply text-[10px] sm:text-[11px] font-bold text-black/50 uppercase tracking-wider flex-shrink-0;
}
.card-name {
  @apply text-[13px] sm:text-sm font-semibold text-black/80 mt-1.5 truncate leading-snug;
}
.card-sold {
  @apply text-[11px] sm:text-xs text-black/45 mt-1;
}

/* Sold-out state */
.product-card.is-sold .card-frame img {
  filter: grayscale(1) brightness(0.7);
}
.product-card.is-sold .card-frame {
  background: #9a9a9a;
  box-shadow: 3px 3px 0 0 #555;
}
.product-card.is-sold:hover .card-frame {
  transform: none;
  box-shadow: 3px 3px 0 0 #555;
}
.product-card.is-sold .card-price {
  @apply text-black/45 line-through;
}
.product-card.is-sold .card-name,
.product-card.is-sold .card-size {
  @apply text-black/35;
}
.product-card.is-sold .card-sold {
  @apply font-bold text-black/55;
}

.sold-overlay {
  @apply absolute inset-0 flex items-center justify-center;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(1px);
  pointer-events: none;
}
.sold-stamp {
  @apply text-white font-bold text-2xl sm:text-3xl uppercase tracking-widest;
  font-family: 'CalSans', serif;
  border: 3px solid white;
  padding: 0.35rem 1.1rem;
  transform: rotate(-12deg);
  box-shadow: 3px 3px 0 0 rgba(0, 0, 0, 0.5);
  background: rgba(193, 18, 31, 0.85);
  letter-spacing: 0.15em;
}
</style>
