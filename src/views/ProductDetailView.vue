<template>
  <div class="pd-root">
    <button @click="$router.back()" class="back-btn">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="m15 18-6-6 6-6" />
      </svg>
      <span>Back</span>
    </button>

    <div v-if="loading" class="md:grid md:grid-cols-2 md:gap-10">
      <div>
        <div class="skeleton skeleton-square mb-3"></div>
        <div class="flex gap-2">
          <div v-for="i in 4" :key="i" class="skeleton w-16 h-16 rounded-xl"></div>
        </div>
      </div>
      <div class="mt-5 md:mt-0 flex flex-col gap-4">
        <div class="skeleton skeleton-line w-24 rounded-md"></div>
        <div class="skeleton skeleton-line-lg w-3/4 rounded-md"></div>
        <div class="skeleton skeleton-line w-1/2 rounded-md"></div>
        <div class="skeleton h-24 w-full rounded-xl mt-4"></div>
      </div>
    </div>

    <div v-else-if="error" class="error-banner">
      <p class="error-text">{{ error }}</p>
      <button @click="fetchProduct" class="retry-btn">Coba Lagi</button>
    </div>

    <div v-else class="md:grid md:grid-cols-2 md:gap-10">
      <div class="reveal">
        <div class="main-img-wrap">
          <img :src="product.img" :alt="product.name" class="w-full h-full object-cover" />
          <button
            @click="isWishlisted = !isWishlisted"
            class="img-wishlist-btn"
            aria-label="Wishlist"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              :fill="isWishlisted ? 'white' : 'none'"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
              />
            </svg>
          </button>
        </div>
        <div class="thumbs-track scrollbar-hide">
          <div
            v-for="(imgUrl, i) in productImages"
            :key="i"
            class="thumb-item"
            :class="activeThumb === i ? 'thumb-active' : 'thumb-inactive'"
            @click="changeImage(i, imgUrl)"
          >
            <img :src="imgUrl" class="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      <div class="info-section reveal reveal-delay-1">
        <div class="title-row">
          <div class="min-w-0">
            <span class="category-tag">{{ product.category }}</span>
            <h1 class="product-title">{{ product.name }}</h1>
          </div>
        </div>
        <p class="product-price">{{ formatRupiah(product.price) }}</p>
        <p class="product-meta">
          Terjual {{ product.sold }} <span class="meta-dot">·</span> ⭐
          {{ product.rating || '4.8' }} ({{ product.review_count || 0 }} ulasan)
        </p>

        <div class="opt-block">
          <p class="opt-label">Size</p>
          <div class="opt-row">
            <button
              v-for="size in ['S', 'M', 'L', 'XL', 'XXL']"
              :key="size"
              @click="selectedSize = size"
              class="size-btn"
              :class="selectedSize === size ? 'size-active' : 'size-inactive glass-panel'"
            >
              {{ size }}
            </button>
          </div>
        </div>

        <div class="opt-block">
          <p class="opt-label">Condition</p>
          <div class="opt-row">
            <button
              v-for="cond in ['Like New', 'Good', 'Fair']"
              :key="cond"
              @click="selectedCondition = cond"
              class="cond-btn"
              :class="selectedCondition === cond ? 'cond-active' : 'cond-inactive glass-panel'"
            >
              {{ cond }}
            </button>
          </div>
        </div>

        <div class="opt-block">
          <p class="opt-label">Description</p>
          <p class="desc-text">{{ product.description }}</p>
        </div>

        <div class="seller-card glass-panel">
          <div class="seller-avatar">{{ (product.seller_name || 'S')[0].toUpperCase() }}</div>
          <div class="seller-info">
            <p class="seller-name">{{ product.seller_name || 'SecondSeller' }}</p>
            <p class="seller-meta">
              {{ product.seller_location || 'Indonesia' }} <span class="meta-dot">·</span> ⭐
              {{ product.seller_rating || '4.9' }}
            </p>
          </div>
          <button @click="startChatWithSeller" class="seller-chat-btn">Chat</button>
        </div>

        <div class="cta-row">
          <button @click="handleAddToCart" class="cta-secondary" :disabled="addingToCart">
            {{ addingToCart ? 'Menambahkan...' : '+ Keranjang' }}
          </button>
          <button @click="buyNow" class="cta-primary">Beli Sekarang</button>
        </div>
        <p v-if="cartMsg" class="cart-msg">{{ cartMsg }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { useAuth } from '@/composables/useAuth'
import { useTransaction } from '@/composables/useTransaction'
import api from '@/services/api'
import { useCart } from '@/composables/useCart'
import { formatRupiah } from '@/utils/currency'

useScrollReveal()
const route = useRoute()
const router = useRouter()
const { isLoggedIn } = useAuth()
const { setItems } = useTransaction()
const { addToCart: addItemToCart } = useCart()

const isWishlisted = ref(false)
const selectedSize = ref('M')
const selectedCondition = ref('Like New')
const activeThumb = ref(0)
const addingToCart = ref(false)
const cartMsg = ref('')

const product = ref({
  id: null,
  name: '',
  price: 0,
  category: '',
  img: '',
  sold: 0,
  size: 'M',
  description: '',
  images: [],
  seller_id: null,
  seller_name: '',
  seller_location: '',
  seller_rating: '',
  rating: '',
  review_count: 0,
})

const productImages = computed(() =>
  Array.isArray(product.value.images) && product.value.images.length
    ? product.value.images
    : [product.value.img].filter(Boolean),
)

const loading = ref(false)
const error = ref(null)

// Function baru untuk handle ganti gambar biar gak conflict sama formatter
const changeImage = (index, url) => {
  activeThumb.value = index
  product.value.img = url
}

async function fetchProduct() {
  loading.value = true
  error.value = null
  try {
    const data = await api.get(`/products/${route.params.id}`)
    const imgs = Array.isArray(data.images) ? data.images : []
    product.value = {
      id: data.id,
      name: data.name,
      price: data.price,
      category: data.category || data.category_name || '',
      img: imgs[0] || data.img || data.image_url || '',
      images: imgs,
      sold: data.sold || data.sold_count || 0,
      size: data.size || 'M',
      description: data.description || '',
      seller_id: data.seller_id || data.seller?.id || data.profiles?.id || null,
      seller_name: data.seller?.name || data.seller_name || 'SecondSeller',
      seller_location: data.seller?.location || data.seller_location || 'Indonesia',
      seller_rating: data.seller?.rating || data.seller_rating || '4.9',
      rating: data.rating || '4.8',
      review_count: data.review_count || 0,
    }
    selectedSize.value = data.size || 'M'
  } catch (e) {
    error.value = e.message || 'Gagal memuat detail produk.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchProduct)

async function handleAddToCart() {
  if (!isLoggedIn.value) {
    router.push('/login')
    return
  }

  addingToCart.value = true
  cartMsg.value = ''

  try {
    const cartItem = {
      id: product.value.id,
      product_id: product.value.id,
      name: product.value.name,
      price: product.value.price,
      img: product.value.img,
      size: selectedSize.value,
      condition: selectedCondition.value,
      qty: 1,
    }

    addItemToCart(cartItem)

    await api.post('/cart', {
      product_id: product.value.id,
      size: selectedSize.value,
      condition: selectedCondition.value,
      qty: 1,
    })

    cartMsg.value = '✓ Ditambahkan ke keranjang!'

    setTimeout(() => {
      cartMsg.value = ''
    }, 3000)
  } catch (e) {
    cartMsg.value = e.message || 'Gagal menambahkan ke keranjang.'
  } finally {
    addingToCart.value = false
  }
}

async function startChatWithSeller() {
  if (!isLoggedIn.value) {
    router.push('/login')
    return
  }
  try {
    const data = await api.post('/chats', {
      seller_id: product.value.seller_id || product.value.profiles?.id || product.value.seller?.id,
      product_id: product.value.id,
    })
    router.push('/chat')
  } catch (e) {
    alert('Gagal memulai chat: ' + (e.message || ''))
  }
}

function buyNow() {
  if (!isLoggedIn.value) {
    router.push('/login')
    return
  }
  setItems(
    [
      {
        id: product.value.id,
        name: product.value.name,
        price: product.value.price,
        img: product.value.img,
        size: selectedSize.value,
        condition: selectedCondition.value,
        qty: 1,
      },
    ],
    'buy-now',
  )
  router.push('/transaction')
}
</script>

<style scoped>
@reference "../assets/main.css";

.pd-root {
  @apply pb-8;
  padding: 0.75rem;
}
@media (min-width: 640px) {
  .pd-root {
    padding: 1rem;
  }
}
.back-btn {
  @apply inline-flex items-center gap-1.5 mb-4 sm:mb-5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold text-black bg-white;
  border: 2px solid #111;
  box-shadow: 2px 2px 0 0 #111;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease,
    background-color 0.15s ease;
}
@media (min-width: 640px) {
  .back-btn {
    box-shadow: 3px 3px 0 0 #111;
  }
}
.back-btn:hover {
  background: linear-gradient(135deg, #c1121f, #780000);
  color: white;
  transform: translate(1.5px, 1.5px);
  box-shadow: 1.5px 1.5px 0 0 #111;
}

.main-img-wrap {
  @apply relative rounded-2xl overflow-hidden mb-3;
  aspect-ratio: 1;
  background: #c1121f;
  border: 2px solid #111;
  box-shadow: 3px 3px 0 0 #111;
}
@media (min-width: 640px) {
  .main-img-wrap {
    box-shadow: 4px 4px 0 0 #111;
  }
}
.img-wishlist-btn {
  @apply absolute top-3 right-3 w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-200;
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid #111;
}
.img-wishlist-btn:hover {
  background: #c1121f;
}
.thumbs-track {
  @apply flex gap-2 overflow-x-auto snap-x snap-mandatory pb-1;
}
.thumb-item {
  @apply flex-shrink-0 snap-center w-16 h-16 rounded-xl overflow-hidden cursor-pointer transition-all duration-300;
  background: #c1121f;
  border: 2px solid #111;
}
.thumb-active {
  box-shadow: 3px 3px 0 0 #c1121f;
}
.thumb-inactive {
  @apply opacity-60 hover:opacity-100;
}

.info-section {
  @apply mt-5 md:mt-0;
}
.title-row {
  @apply flex items-start justify-between gap-3 mb-3;
}
.category-tag {
  @apply inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md text-white;
  background: linear-gradient(135deg, #c1121f, #780000);
}
.product-title {
  @apply text-xl sm:text-2xl font-bold tracking-tight text-gray-900 mt-2 leading-tight;
  font-family: 'CalSans', serif;
  letter-spacing: -0.01em;
}
.product-price {
  @apply text-2xl sm:text-3xl font-bold leading-none mb-1;
  font-family: 'CalSans', serif;
  background: linear-gradient(135deg, #c1121f, #780000);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.product-meta {
  @apply text-xs text-black/50 mb-6;
}
.meta-dot {
  @apply text-black/30 mx-1;
}
.opt-block {
  @apply mb-5 sm:mb-6;
}
.opt-label {
  @apply text-[11px] sm:text-xs font-bold uppercase tracking-widest text-black/60 mb-2 sm:mb-3;
}
.opt-row {
  @apply flex flex-wrap gap-2;
}
.size-btn {
  @apply inline-flex items-center justify-center min-w-[44px] h-10 sm:h-11 px-3 text-sm font-bold rounded-xl;
  border: 2px solid #111;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}
.size-active {
  @apply text-white;
  background: linear-gradient(135deg, #c1121f, #780000);
  box-shadow: 3px 3px 0 0 #111;
}
.size-active:hover {
  transform: translate(1.5px, 1.5px);
  box-shadow: 1.5px 1.5px 0 0 #111;
}
.size-inactive {
  @apply text-black/80;
}
.size-inactive:hover {
  @apply text-black;
  box-shadow: 2px 2px 0 0 #111;
  transform: translate(-1px, -1px);
}
.cond-btn {
  @apply inline-flex items-center justify-center px-4 py-2 text-xs font-bold rounded-xl;
  border: 2px solid #111;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}
.cond-active {
  @apply text-white;
  background: linear-gradient(135deg, #c1121f, #780000);
  box-shadow: 3px 3px 0 0 #111;
}
.cond-active:hover {
  transform: translate(1.5px, 1.5px);
  box-shadow: 1.5px 1.5px 0 0 #111;
}
.cond-inactive {
  @apply text-black/80;
}
.cond-inactive:hover {
  @apply text-black;
  box-shadow: 2px 2px 0 0 #111;
  transform: translate(-1px, -1px);
}
.desc-text {
  @apply text-sm text-black/60 leading-relaxed;
}
.seller-card {
  @apply flex items-center gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-2xl mb-6;
  border: 2px solid #111;
  box-shadow: 3px 3px 0 0 #111;
}
@media (min-width: 640px) {
  .seller-card {
    box-shadow: 4px 4px 0 0 #111;
  }
}
.seller-avatar {
  @apply w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg flex-shrink-0;
  background: linear-gradient(135deg, #669bbc, #003049);
  border: 2px solid #111;
}
.seller-info {
  @apply flex-1 min-w-0;
}
.seller-name {
  @apply text-sm font-bold text-gray-900 truncate;
}
.seller-meta {
  @apply text-[10px] uppercase tracking-wider text-black/50 mt-0.5 truncate;
}
.seller-chat-btn {
  @apply px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold rounded-xl bg-white text-[#C1121F] flex-shrink-0;
  border: 2px solid #111;
  box-shadow: 2px 2px 0 0 #111;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease,
    background-color 0.15s ease,
    color 0.15s ease;
}
@media (min-width: 640px) {
  .seller-chat-btn {
    box-shadow: 3px 3px 0 0 #111;
  }
}
.seller-chat-btn:hover {
  background: #c1121f;
  color: white;
  transform: translate(1.5px, 1.5px);
  box-shadow: 1.5px 1.5px 0 0 #111;
}
.cta-row {
  @apply flex gap-2 sm:gap-4;
}
.cta-secondary {
  @apply flex-1 py-3 sm:py-3.5 px-2 text-xs sm:text-sm font-bold rounded-xl text-[#C1121F] bg-white whitespace-nowrap;
  border: 2px solid #111;
  box-shadow: 3px 3px 0 0 #111;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease,
    background-color 0.15s ease,
    color 0.15s ease;
}
@media (min-width: 640px) {
  .cta-secondary {
    box-shadow: 4px 4px 0 0 #111;
  }
}
.cta-secondary:hover:not(:disabled) {
  background: #fdf0d5;
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 0 #111;
}
.cta-secondary:disabled {
  @apply opacity-60 cursor-not-allowed;
}
.cta-primary {
  @apply flex-1 py-3 sm:py-3.5 px-2 text-xs sm:text-sm font-bold rounded-xl text-white whitespace-nowrap;
  background: linear-gradient(135deg, #c1121f, #780000);
  border: 2px solid #111;
  box-shadow: 3px 3px 0 0 #111;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}
@media (min-width: 640px) {
  .cta-primary {
    box-shadow: 4px 4px 0 0 #111;
  }
}
.cta-primary:hover {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 0 #111;
}
.cart-msg {
  @apply text-center text-xs font-semibold text-emerald-600 mt-3;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Skeleton */
.skeleton {
  @apply animate-pulse bg-black/10;
}
.skeleton-square {
  aspect-ratio: 1;
  @apply w-full rounded-2xl;
}
.skeleton-line {
  height: 16px;
  @apply rounded-md;
}
.skeleton-line-lg {
  height: 24px;
  @apply rounded-md;
}

/* Error */
.error-banner {
  @apply flex flex-col items-center gap-3 py-20 text-center;
}
.error-text {
  @apply text-sm font-semibold text-[#C1121F];
}
.retry-btn {
  @apply px-5 py-2 text-sm font-bold rounded-xl text-white;
  background: linear-gradient(135deg, #c1121f, #780000);
  border: 2px solid #111;
  box-shadow: 3px 3px 0 0 #111;
}
</style>
