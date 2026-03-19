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
          <div class="flex gap-2 overflow-x-auto scrollbar-hide">
            <div v-for="i in 4" :key="i"
              class="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-[#C1121F] cursor-pointer border-2 transition-all duration-200"
              :class="activeThumb === i ? 'border-[#C1121F]' : 'border-transparent opacity-60'"
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

          <p class="text-2xl font-bold text-[#C1121F] mb-1">Rp {{ formatPrice(product.price) }}</p>
          <p class="text-xs text-black/40 mb-4">Terjual {{ product.sold }} · ⭐ 4.8</p>

          <!-- Size selector -->
          <div class="mb-4">
            <p class="text-sm font-bold mb-2">Size</p>
            <div class="flex gap-2 flex-wrap">
              <button
                v-for="size in ['S', 'M', 'L', 'XL', 'XXL']"
                :key="size"
                @click="selectedSize = size"
                class="w-10 h-10 rounded-lg text-sm font-bold border-2 transition-all duration-200"
                :class="selectedSize === size
                  ? 'border-[#C1121F] bg-[#C1121F] text-white'
                  : 'border-black/20 bg-white hover:border-[#C1121F]'"
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
                class="px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all duration-200"
                :class="selectedCondition === cond
                  ? 'border-[#C1121F] bg-[#C1121F] text-white'
                  : 'border-black/20 bg-white hover:border-[#C1121F]'"
              >{{ cond }}</button>
            </div>
          </div>

          <!-- Description -->
          <div class="mb-6">
            <p class="text-sm font-bold mb-1">Description</p>
            <p class="text-sm text-black/60 leading-relaxed">{{ product.description }}</p>
          </div>

          <!-- Seller info -->
          <div class="flex items-center gap-3 p-3 bg-white/60 rounded-xl mb-6">
            <div class="w-10 h-10 rounded-full bg-[#669BBC] flex items-center justify-center text-white font-bold text-sm">S</div>
            <div>
              <p class="text-sm font-bold">SecondSeller</p>
              <p class="text-xs text-black/40">Bandar Lampung · ⭐ 4.9</p>
            </div>
            <button @click="$router.push('/chat')" class="ml-auto px-3 py-1.5 border border-[#C1121F] text-[#C1121F] text-xs font-bold rounded-full hover:bg-[#C1121F] hover:text-white transition-colors">Chat</button>
          </div>

          <!-- CTA Buttons -->
          <div class="flex gap-3">
            <button
              @click="addToCart"
              class="flex-1 py-3 border-2 border-[#C1121F] text-[#C1121F] font-bold rounded-xl hover:bg-[#C1121F] hover:text-white transition-all duration-200 text-sm"
            >+ Keranjang</button>
            <button
              @click="buyNow"
              class="flex-1 py-3 bg-[#C1121F] text-white font-bold rounded-xl hover:bg-[#780000] transition-all duration-200 text-sm shadow-lg shadow-[#C1121F]/30"
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