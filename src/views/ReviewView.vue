<template>
  <div class="review-root">
    <button @click="$router.back()" class="back-btn">← Kembali</button>

    <h1 class="page-title">Beri Ulasan</h1>

    <div v-if="loading" class="skeleton-block">Memuat...</div>

    <div v-else-if="error" class="error-banner">{{ error }}</div>

    <div v-else-if="order" class="review-card">
      <div class="product-info">
        <img :src="order.product_image" class="product-img" />
        <div>
          <p class="product-name">{{ order.product_name }}</p>
          <p class="product-meta">Size {{ order.size }} · {{ order.condition }}</p>
        </div>
      </div>

      <div class="rating-section">
        <p class="label">Rating</p>
        <div class="star-row">
          <button v-for="s in 5" :key="s" @click="rating = s" class="star-btn"
            :class="s <= rating ? 'star-active' : 'star-inactive'">★</button>
        </div>
      </div>

      <div class="comment-section">
        <p class="label">Komentar</p>
        <textarea v-model="comment" rows="4" class="comment-input"
          placeholder="Bagaimana kualitas barangnya?"></textarea>
      </div>

      <button @click="submitReview" :disabled="submitting || !rating" class="submit-btn">
        {{ submitting ? 'Mengirim...' : 'Kirim Ulasan' }}
      </button>

      <p v-if="submitError" class="submit-error">{{ submitError }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()

const order = ref(null)
const loading = ref(false)
const error = ref(null)
const rating = ref(0)
const comment = ref('')
const submitting = ref(false)
const submitError = ref('')

async function fetchOrder() {
  loading.value = true
  try {
    const data = await api.get(`/orders/${route.params.id}`)
    order.value = data
  } catch (e) {
    error.value = e.message || 'Gagal memuat pesanan.'
  } finally {
    loading.value = false
  }
}

async function submitReview() {
  if (!rating.value || !order.value) return
  submitting.value = true
  submitError.value = ''
  try {
    await api.post(`/products/${order.value.product_id}/reviews`, {
      order_id: order.value.id,
      rating: rating.value,
      comment: comment.value
    })
    alert('Terima kasih atas ulasannya!')
    router.push('/profile/history')
  } catch (e) {
    submitError.value = e.message || 'Gagal mengirim ulasan.'
  } finally {
    submitting.value = false
  }
}

onMounted(fetchOrder)
</script>

<style scoped>
@reference "../assets/main.css";

.review-root { @apply pb-8; padding: 0.75rem; }
@media (min-width: 640px) { .review-root { padding: 1rem; } }
.back-btn { @apply inline-flex items-center gap-1.5 mb-4 sm:mb-5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold text-black bg-white; border: 2px solid #111; box-shadow: 2px 2px 0 0 #111; transition: transform 0.15s ease, box-shadow 0.15s ease; }
@media (min-width: 640px) { .back-btn { box-shadow: 3px 3px 0 0 #111; } }
.back-btn:hover { transform: translate(1px,1px); box-shadow: 1px 1px 0 0 #111; }
.page-title { @apply text-xl sm:text-2xl font-bold mb-4 sm:mb-5; font-family: 'CalSans', serif; }
.review-card { @apply bg-white rounded-2xl p-4 sm:p-5; border: 2px solid #111; box-shadow: 3px 3px 0 0 #111; }
@media (min-width: 640px) { .review-card { box-shadow: 4px 4px 0 0 #111; } }
.product-info { @apply flex gap-3 mb-4 sm:mb-5 pb-4 sm:pb-5 border-b border-black/10; }
.product-img { @apply w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover flex-shrink-0; border: 2px solid #111; }
.product-name { @apply text-sm font-bold; }
.product-meta { @apply text-xs text-black/50 mt-1; }
.label { @apply text-[11px] sm:text-xs font-bold uppercase tracking-widest text-black/70 mb-2; }
.rating-section { @apply mb-4 sm:mb-5; }
.star-row { @apply flex gap-2; }
.star-btn { @apply text-3xl transition-transform duration-150 hover:scale-110; line-height: 1; }
.star-active { @apply text-yellow-400; }
.star-inactive { @apply text-black/20; }
.comment-section { @apply mb-4 sm:mb-5; }
.comment-input { @apply w-full p-3 rounded-xl text-sm resize-none; border: 2px solid #111; min-height: 100px; }
.comment-input:focus { outline: none; border-color: #C1121F; }
.submit-btn { @apply w-full py-3 sm:py-3.5 text-white text-sm font-bold rounded-xl; background: linear-gradient(135deg, #C1121F, #780000); border: 2px solid #111; box-shadow: 3px 3px 0 0 #111; transition: transform 0.15s ease, box-shadow 0.15s ease; }
@media (min-width: 640px) { .submit-btn { box-shadow: 4px 4px 0 0 #111; } }
.submit-btn:hover:not(:disabled) { transform: translate(2px,2px); box-shadow: 2px 2px 0 0 #111; }
.submit-btn:disabled { @apply opacity-60 cursor-not-allowed; }
.submit-error { @apply text-sm text-[#C1121F] font-semibold mt-3; }
.error-banner { @apply text-center py-10 text-[#C1121F] font-semibold; }
</style>
