<!-- CartView.vue -->
<template>
  <div class="min-h-screen bg-[#FDF0D5] pb-8">
    <div class="pb-6">
      <h1 class="text-2xl font-bold mb-4" style="font-family: 'CalSans', serif;">Keranjang</h1>

      <div v-if="cartItems.length === 0" class="text-center py-20">
        <p class="text-5xl mb-4">🛍️</p>
        <p class="font-bold text-lg mb-1">Keranjang kosong</p>
        <p class="text-sm text-black/50 mb-4">Yuk belanja dulu!</p>
        <router-link to="/catalog" class="px-6 py-2 bg-[#C1121F] text-white font-bold rounded-full text-sm">Browse Catalog</router-link>
      </div>

      <div v-else>
        <div class="space-y-3 mb-6">
          <div v-for="item in cartItems" :key="item.id"
            class="flex gap-3 bg-white/60 rounded-xl p-3 reveal"
          >
            <div class="w-20 h-20 rounded-lg overflow-hidden bg-[#C1121F] flex-shrink-0">
              <img :src="item.img" class="w-full h-full object-cover" />
            </div>
            <div class="flex-1">
              <p class="text-sm font-bold">{{ item.name }}</p>
              <p class="text-xs text-black/40">Size {{ item.size }} · {{ item.condition }}</p>
              <p class="text-sm font-bold text-[#C1121F] mt-1">Rp {{ formatPrice(item.price) }}</p>
            </div>
            <div class="flex flex-col items-end justify-between">
              <button @click="removeItem(item.id)" class="text-black/30 hover:text-red-500 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
              <div class="flex items-center gap-2">
                <button @click="item.qty--" :disabled="item.qty <= 1" class="w-6 h-6 rounded-full border border-black/20 flex items-center justify-center text-sm hover:border-[#C1121F] disabled:opacity-30">-</button>
                <span class="text-sm font-bold w-4 text-center">{{ item.qty }}</span>
                <button @click="item.qty++" class="w-6 h-6 rounded-full border border-black/20 flex items-center justify-center text-sm hover:border-[#C1121F]">+</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Summary -->
        <div class="bg-white/60 rounded-xl p-4">
          <div class="flex justify-between text-sm mb-1">
            <span class="text-black/60">Subtotal ({{ cartItems.length }} item)</span>
            <span>Rp {{ formatPrice(subtotal) }}</span>
          </div>
          <div class="flex justify-between text-sm mb-3">
            <span class="text-black/60">Ongkir</span>
            <span class="text-green-600 font-bold">Gratis</span>
          </div>
          <div class="border-t border-black/10 pt-3 flex justify-between font-bold">
            <span>Total</span>
            <span class="text-[#C1121F]">Rp {{ formatPrice(subtotal) }}</span>
          </div>
          <button class="w-full mt-4 py-3 bg-[#C1121F] text-white font-bold rounded-xl hover:bg-[#780000] transition-colors shadow-lg shadow-[#C1121F]/30">
            Checkout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useScrollReveal } from '@/composables/useScrollReveal'
useScrollReveal()

const cartItems = ref([
  { id: 1, name: 'Insurgent Graphic Tee', price: 499000, size: 'L', condition: 'Like New', qty: 1, img: new URL('@/assets/ImgCard/insurgent.jpeg', import.meta.url).href },
  { id: 2, name: 'Vintage Hoodie', price: 299000, size: 'M', condition: 'Good', qty: 1, img: new URL('@/assets/ImgCard/hoodie.avif', import.meta.url).href },
])

const subtotal = computed(() => cartItems.value.reduce((sum, item) => sum + item.price * item.qty, 0))
const formatPrice = (price) => price.toLocaleString('id-ID')
const removeItem = (id) => { cartItems.value = cartItems.value.filter(i => i.id !== id) }
</script>