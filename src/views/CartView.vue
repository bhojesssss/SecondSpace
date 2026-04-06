<!-- CartView.vue -->
<template>
  <div class="min-h-screen bg-[#FDF0D5] pb-8">
    <div class="pb-6">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-1 h-7 bg-[#C1121F] rounded-full"></div>
        <h1 class="text-2xl font-bold" style="font-family: 'CalSans', serif;">Keranjang</h1>
      </div>

      <div v-if="cartItems.length === 0" class="text-center py-20 reveal">
        <div class="w-24 h-24 bg-gradient-to-br from-[#C1121F] to-[#780000] rounded-full mx-auto flex items-center justify-center text-5xl mb-6 shadow-lg shadow-[#C1121F]/40 transform hover:scale-110 transition-transform duration-300">
          🛍️
        </div>
        <p class="font-bold text-lg mb-1">Keranjang kosong</p>
        <p class="text-sm text-black/50 mb-6">Yuk belanja dulu!</p>
        <router-link to="/catalog" class="px-8 py-3 bg-gradient-to-r from-[#C1121F] to-[#780000] text-white font-bold rounded-full text-sm shadow-md hover:shadow-lg active:scale-95 transition-all">Browse Catalog</router-link>
      </div>

      <div v-else>
        <div class="space-y-3 mb-6">
          <div v-for="item in cartItems" :key="item.id"
            class="flex gap-3 glass-panel rounded-xl p-3 reveal shadow-sm hover:shadow-md active:scale-[1.02] transition-all"
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
        <div class="glass-panel rounded-xl p-4 shadow-sm reveal reveal-delay-1">
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
          <button class="w-full mt-4 py-3 bg-gradient-to-r from-[#C1121F] to-[#780000] text-white font-bold rounded-xl active:scale-[0.98] transition-all shadow-lg shadow-[#C1121F]/30 hover:opacity-90">
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