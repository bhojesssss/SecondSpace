<template>
  <div class="min-h-screen bg-[#FDF0D5]">
    <!-- Back button -->
    <div class="px-4 pt-4 max-w-6xl mx-auto">
      <button @click="$router.back()" class="flex items-center gap-2 text-sm text-black/60 hover:text-black transition-colors mb-4">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="m15 18-6-6 6-6"/>
        </svg>
        Back
      </button>
    </div>

    <div class="px-4 max-w-6xl mx-auto">
      <div class="md:grid md:grid-cols-2 md:gap-8">

        <!-- Image Section -->
        <div class="reveal">
          <!-- Main image -->
          <div class="rounded-2xl overflow-hidden bg-[#C1121F] mb-3" style="aspect-ratio: 1;">
            <img :src="product.img" :alt="product.name" class="w-full h-full object-cover" />
          </div>
          <!-- Thumbnails -->
          <div class="flex gap-2 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-1">
            <div v-for="i in 4" :key="i"
              class="flex-shrink-0 snap-center w-16 h-16 rounded-xl overflow-hidden bg-[#C1121F] cursor-pointer border-2 transition-all duration-300"
              :class="activeThumb === i ? 'border-[#C1121F] shadow-md scale-[1.02]' : 'border-transparent opacity-60 hover:opacity-100'"
              @click="activeThumb = i"
            >
              <img :src="product.img" class="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        <!-- Info Section -->
        <div class="mt-4 md:mt-0 reveal reveal-delay-1">
          <div class="flex items-start justify-between mb-2">
            <div>
              <span class="text-xs text-[#C1121F] font-bold uppercase tracking-wider">{{ product.category }}</span>
              <h1 class="text-xl font-bold mt-1" style="font-family: 'CalSans', serif;">{{ product.name }}</h1>
            </div>
            <button @click="isWishlisted = !isWishlisted" class="p-2 rounded-full hover:bg-black/5 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" :fill="isWishlisted ? '#C1121F' : 'none'" :stroke="isWishlisted ? '#C1121F' : 'currentColor'" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
          </div>

          <p class="text-3xl font-bold text-[#C1121F] mb-1 leading-none" style="font-family: 'CalSans', serif;">Rp {{ formatPrice(product.price) }}</p>
          <p class="text-xs text-black/50 mb-4">Terjual {{ product.sold }} · ⭐ 4.8 (24 ulasan)</p>

          <!-- Size selector -->
          <div class="mb-4">
            <p class="text-sm font-bold mb-2">Size</p>
            <div class="flex gap-2 flex-wrap">
              <button
                v-for="size in ['S', 'M', 'L', 'XL', 'XXL']"
                :key="size"
                @click="selectedSize = size"
                class="w-10 h-10 rounded-xl text-sm font-bold border-2 transition-all duration-300 active:scale-95"
                :class="selectedSize === size
                  ? 'border-[#C1121F] bg-gradient-to-br from-[#C1121F] to-[#780000] text-white shadow-md shadow-[#C1121F]/30'
                  : 'border-black/10 glass-panel hover:border-black/30 text-black/70'"
              >{{ size }}</button>
            </div>
          </div>

          <!-- Condition -->
          <div class="mb-4">
            <p class="text-sm font-bold mb-2">Condition</p>
            <div class="flex gap-2">
              <button
                v-for="cond in ['Like New', 'Good', 'Fair']"
                :key="cond"
                @click="selectedCondition = cond"
                class="px-4 py-2 rounded-full text-xs font-bold border-2 transition-all duration-300 active:scale-95"
                :class="selectedCondition === cond
                  ? 'border-[#C1121F] bg-gradient-to-br from-[#C1121F] to-[#780000] text-white shadow-md shadow-[#C1121F]/30'
                  : 'border-black/10 glass-panel hover:border-black/30 text-black/70'"
              >{{ cond }}</button>
            </div>
          </div>

          <!-- Description -->
          <div class="mb-6">
            <p class="text-sm font-bold mb-1">Description</p>
            <p class="text-sm text-black/60 leading-relaxed">{{ product.description }}</p>
          </div>

          <!-- Seller info -->
          <div class="flex items-center gap-3 p-3 glass-panel rounded-xl mb-6 shadow-sm hover:shadow-md transition-shadow">
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-[#669BBC] to-[#003049] flex items-center justify-center text-white font-bold text-lg shadow-inner">S</div>
            <div>
              <p class="text-sm font-bold">SecondSeller</p>
              <p class="text-[10px] uppercase tracking-wider text-black/50">Bandar Lampung · ⭐ 4.9</p>
            </div>
            <button @click="$router.push('/chat')" class="ml-auto px-4 py-2 border-2 border-[#C1121F] text-[#C1121F] text-xs font-bold rounded-full hover:bg-[#C1121F] hover:text-white active:scale-95 transition-all">Chat</button>
          </div>

          <!-- CTA Buttons -->
          <div class="flex gap-3">
            <button
              @click="addToCart"
              class="flex-1 py-3 border-2 border-[#C1121F] text-[#C1121F] font-bold rounded-xl active:bg-[#C1121F] hover:bg-[#C1121F] active:text-white hover:text-white active:scale-95 transition-all duration-300 text-sm"
            >+ Keranjang</button>
            <button
              @click="buyNow"
              class="flex-1 py-3 bg-gradient-to-r from-[#C1121F] to-[#780000] text-white font-bold rounded-xl active:scale-95 hover:opacity-90 transition-all duration-300 text-sm shadow-lg shadow-[#C1121F]/30"
            >Beli Sekarang</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useScrollReveal } from '@/composables/useScrollReveal'

useScrollReveal()
const router = useRouter()

const isWishlisted = ref(false)
const selectedSize = ref('M')
const selectedCondition = ref('Like New')
const activeThumb = ref(1)

const product = ref({
  id: 1,
  name: 'Insurgent Graphic Tee',
  price: 499000,
  category: 'T-Shirts',
  img: new URL('@/assets/ImgCard/insurgent.jpeg', import.meta.url).href,
  sold: 12,
  size: 'L',
  description: 'Kaos grafis premium dengan desain unik. Bahan cotton combed 30s yang nyaman dan adem. Kondisi preloved seperti baru, hanya dipakai 2-3 kali. Cocok untuk tampilan kasual sehari-hari.'
})

const formatPrice = (price) => price.toLocaleString('id-ID')
const addToCart = () => alert('Ditambahkan ke keranjang!')
const buyNow = () => router.push('/cart')
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>