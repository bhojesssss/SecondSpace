<template>
  <div class="sell-root">

    <AuthGate v-if="!isLoggedIn" title="Login untuk Jual" message="Masuk dulu untuk mulai jual barang preloved kamu." />

    <template v-else>
      <section class="section-gap">
        <div class="header-wrap">
          <button @click="goBack" class="back-btn" aria-label="Back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <div class="section-accent fashion-accent"></div>
          <h1 class="page-title">{{ isEdit ? 'Edit Barang' : 'Jual Barang' }}</h1>
        </div>
        <p class="page-sub">{{ isEdit ? 'Perbarui detail barang kamu di bawah.' : 'Lengkapi detail barang preloved kamu di bawah.' }}</p>
      </section>

      <!-- Error banner -->
      <div v-if="submitError" class="submit-error-banner">{{ submitError }}</div>

      <!-- Loading state for edit mode -->
      <div v-if="loadingProduct" class="loading-state">
        <svg class="animate-spin" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/></svg>
        <p>Memuat data barang...</p>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="form-stack">
        <!-- Images -->
        <section class="reveal">
          <p class="field-label">Foto Barang</p>
          <div class="upload-grid">
            <label v-for="(slot, i) in 4" :key="i" class="upload-slot" :class="imageFiles[i] ? 'has-img' : ''">
              <input type="file" accept="image/*" @change="onFileChange($event, i)" class="hidden" />
              <img v-if="imagePreviews[i]" :src="imagePreviews[i]" class="slot-preview" />
              <div v-else class="slot-empty">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                <span class="slot-text">{{ i === 0 ? 'Utama' : 'Foto' }}</span>
              </div>
              <button v-if="imagePreviews[i]" type="button" @click.prevent="removeImage(i)" class="slot-remove">×</button>
            </label>
          </div>
          <p class="hint">Maks 4 foto · Foto pertama jadi cover.</p>
        </section>

        <!-- Name & Category -->
        <section class="reveal reveal-delay-1">
          <div class="field">
            <label class="field-label">Nama Barang</label>
            <input v-model="form.name" type="text" required placeholder="cth. Nike Hoodie Vintage" class="field-input" />
          </div>
          <div class="field">
            <label class="field-label">Kategori</label>
            <div class="seg-row">
              <button v-for="c in categories" :key="c" type="button" @click="setCategory(c)" class="seg-btn" :class="getCategoryClass(c)">{{ c }}</button>
            </div>
          </div>
          <transition name="subcat-fade" mode="out-in">
            <div v-if="form.category" :key="form.category" class="field">
              <label class="field-label">Subkategori {{ form.category }}</label>
              <div class="subcat-track scrollbar-hide">
                <button v-for="s in activeSubcategories" :key="s" type="button" @click="form.subcategory = s" class="subcat-chip" :class="getSubcatClass(s)">{{ s }}</button>
              </div>
            </div>
          </transition>
        </section>

        <!-- Condition & Size -->
        <section class="reveal reveal-delay-2">
          <div class="field">
            <label class="field-label">Kondisi</label>
            <div class="seg-row">
              <button v-for="c in conditions" :key="c" type="button" @click="form.condition = c" class="seg-btn seg-narrow" :class="form.condition === c ? 'seg-active' : 'seg-inactive'">{{ c }}</button>
            </div>
          </div>
          <div class="field">
            <label class="field-label">Ukuran Tersedia <span class="label-hint">(pilih satu atau lebih)</span></label>
            <div class="seg-row">
              <button v-for="s in sizes" :key="s" type="button" @click="toggleSize(s)" class="seg-btn seg-narrow" :class="form.sizes.includes(s) ? 'seg-active' : 'seg-inactive'">{{ s }}</button>
            </div>
            <p v-if="form.sizes.length === 0" class="hint hint-warn">Pilih minimal satu ukuran.</p>
          </div>
          <div class="field">
            <label class="field-label">Stok</label>
            <div class="stock-input-wrap">
              <button type="button" @click="adjustStock(-1)" class="stock-btn" :disabled="form.stock <= 1">−</button>
              <input v-model.number="form.stock" type="number" min="1" required class="field-input stock-input" />
              <button type="button" @click="adjustStock(1)" class="stock-btn">+</button>
            </div>
            <p class="hint">Jumlah barang yang kamu punya untuk dijual.</p>
          </div>
        </section>

        <!-- Price & Description -->
        <section class="reveal reveal-delay-3">
          <div class="field">
            <label class="field-label">Harga</label>
            <div class="price-input-wrap">
              <span class="price-prefix">Rp</span>
              <input v-model.number="form.price" type="number" min="0" required placeholder="0" class="field-input price-input" />
            </div>
            <p v-if="form.price > 0" class="hint">{{ formatPrice(form.price) }}</p>
          </div>
          <div class="field">
            <label class="field-label">Deskripsi</label>
            <textarea v-model="form.description" rows="4" required placeholder="Ceritakan kondisi, brand, alasan jual, dll." class="field-input field-textarea"></textarea>
          </div>
        </section>

        <button type="submit" class="submit-btn" :disabled="submitting">
          <span v-if="submitting">
            <svg class="animate-spin inline-block mr-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/></svg>
            Memproses...
          </span>
          <span v-else>{{ isEdit ? 'Simpan Perubahan' : 'Pasang Barang' }}</span>
          <svg v-if="!submitting" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </button>
      </form>
    </template>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { useAuth } from '@/composables/useAuth'
import AuthGate from '@/components/AuthGate.vue'
import api from '@/services/api'
import { uploadProductImage } from '@/services/supabase'

useScrollReveal()
const router = useRouter()
const route  = useRoute()
const { isLoggedIn } = useAuth()
const goBack = () => { if (window.history.state?.back) router.back(); else router.push('/profile') }

const editId = computed(() => route.query.edit || null)
const isEdit = computed(() => !!editId.value)
const loadingProduct = ref(false)

const categories = ['Fashion', 'Sports']
const fashionSubcats = ['T-Shirts', 'Hoodies', 'Jackets', 'Pants', 'Shorts', 'Shoes', 'Bags', 'Accessories']
const sportsSubcats  = ['Running', 'Basketball', 'Football', 'Padel', 'Gym', 'Sport Shoes', 'Sport Shorts', 'Jerseys']
const conditions = ['Like New', 'Good', 'Fair']
const sizes      = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

// Maps subcategory name → category_id (matches schema seed INSERT order)
const categoryIdMap = {
  // Fashion (1-8)
  'T-Shirts': 1, 'Hoodies': 2, 'Jackets': 3, 'Pants': 4,
  'Shorts': 5, 'Shoes': 6, 'Bags': 7, 'Accessories': 8,
  // Sports (9-16)
  'Running': 9, 'Basketball': 10, 'Football': 11, 'Padel': 12,
  'Gym': 13, 'Sport Shoes': 14, 'Sport Shorts': 15, 'Jerseys': 16,
}

const form = reactive({
  name: '', category: 'Fashion', subcategory: '', condition: 'Like New',
  sizes: [], stock: 1,
  price: null, description: '',
})

const toggleSize = (s) => {
  const i = form.sizes.indexOf(s)
  if (i >= 0) form.sizes.splice(i, 1)
  else form.sizes.push(s)
}
const adjustStock = (delta) => {
  const next = (Number(form.stock) || 0) + delta
  form.stock = Math.max(1, next)
}

const activeSubcategories = computed(() => form.category === 'Sports' ? sportsSubcats : fashionSubcats)
const setCategory = (c) => { if (form.category === c) return; form.category = c; form.subcategory = '' }
const getCategoryClass = (c) => { if (form.category !== c) return 'seg-inactive'; return c === 'Sports' ? 'seg-active-sports' : 'seg-active' }
const getSubcatClass = (s) => { if (form.subcategory !== s) return 'subcat-inactive'; return form.category === 'Sports' ? 'subcat-active-sports' : 'subcat-active-fashion' }

const imageFiles    = ref([null, null, null, null])
const imagePreviews = ref([null, null, null, null])

const onFileChange = (e, i) => {
  const file = e.target.files?.[0]
  if (!file) return
  imageFiles.value[i]    = file
  imagePreviews.value[i] = URL.createObjectURL(file)
}
const removeImage = (i) => { imageFiles.value[i] = null; imagePreviews.value[i] = null }
const formatPrice = (p) => 'Rp ' + (p || 0).toLocaleString('id-ID')

const submitting  = ref(false)
const submitError = ref('')

// Reverse: category_id (1-16) → { category, subcategory }
const categoryFromId = (id) => {
  const entry = Object.entries(categoryIdMap).find(([, v]) => v === id)
  if (!entry) return null
  const [subcategory, cid] = entry
  return { subcategory, category: cid <= 8 ? 'Fashion' : 'Sports' }
}

// Load product in edit mode
async function loadProduct() {
  if (!isEdit.value || !isLoggedIn.value) return
  loadingProduct.value = true
  submitError.value = ''
  try {
    const data = await api.get(`/products/${editId.value}`)
    form.name        = data.name || ''
    form.description = data.description || ''
    form.price       = data.price ?? null
    form.condition   = data.condition || 'Like New'
    form.sizes       = Array.isArray(data.sizes) && data.sizes.length
      ? [...data.sizes]
      : (data.size ? [data.size] : [])
    form.stock       = Number.isFinite(data.stock) ? data.stock : 1
    const cat = categoryFromId(data.category_id)
    if (cat) {
      form.category    = cat.category
      form.subcategory = cat.subcategory
    }
    const imgs = Array.isArray(data.images) ? data.images : []
    for (let i = 0; i < 4; i++) {
      imageFiles.value[i] = null
      imagePreviews.value[i] = imgs[i] || null
    }
  } catch (e) {
    submitError.value = e.message || 'Gagal memuat data barang.'
  } finally {
    loadingProduct.value = false
  }
}

onMounted(loadProduct)

async function handleSubmit() {
  if (!form.subcategory) { submitError.value = 'Pilih subkategori terlebih dahulu.'; return }
  if (!form.sizes.length) { submitError.value = 'Pilih minimal satu ukuran yang tersedia.'; return }
  if (!form.stock || form.stock < 1) { submitError.value = 'Stok minimal 1.'; return }
  const hasAnyImage = imageFiles.value.some(Boolean) || imagePreviews.value.some(Boolean)
  if (!hasAnyImage) { submitError.value = 'Tambahkan minimal satu foto.'; return }

  submitting.value = true
  submitError.value = ''
  try {
    // Build final image URL list: upload new files, keep existing URLs as-is
    const imageUrls = []
    for (let i = 0; i < 4; i++) {
      const file = imageFiles.value[i]
      const existing = imagePreviews.value[i]
      if (file) {
        imageUrls.push(await uploadProductImage(file))
      } else if (existing && /^https?:\/\//.test(existing)) {
        imageUrls.push(existing)
      }
    }

    const payload = {
      name:        form.name,
      description: form.description,
      price:       form.price,
      category_id: categoryIdMap[form.subcategory] || 1,
      condition:   form.condition,
      size:        form.sizes[0],
      sizes:       form.sizes,
      stock:       form.stock,
      images:      imageUrls,
    }

    if (isEdit.value) {
      await api.patch(`/products/${editId.value}`, payload)
      alert('Perubahan berhasil disimpan!')
      router.push('/profile/listings')
    } else {
      await api.post('/products', payload)
      alert('Barang berhasil dipasang!')
      router.push('/profile')
    }
  } catch (e) {
    submitError.value = e.message || (isEdit.value ? 'Gagal menyimpan perubahan.' : 'Gagal memasang barang. Silakan coba lagi.')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
@reference "../assets/main.css";

.sell-root { @apply pb-8; padding: 0.75rem; }
@media (min-width: 640px) { .sell-root { padding: 1rem; } }
.section-gap { @apply mb-4 sm:mb-5; }
.header-wrap { @apply flex items-center gap-3; }
.back-btn { @apply w-9 h-9 rounded-lg flex items-center justify-center text-black/70 bg-white transition-all duration-200 active:scale-90; border: 2px solid #111; box-shadow: 2px 2px 0 0 #111; }
.back-btn:hover { color: #C1121F; transform: translate(1px,1px); box-shadow: 1px 1px 0 0 #111; }
.section-accent { @apply w-1 h-7 rounded-full flex-shrink-0; }
.fashion-accent { background: linear-gradient(135deg, #C1121F, #780000); }
.page-title { @apply text-xl sm:text-2xl font-bold tracking-tight text-gray-900; font-family: 'CalSans', serif; }
.page-sub { @apply text-xs sm:text-sm text-black/55 mt-2 ml-12; }

.submit-error-banner { @apply mb-4 px-4 py-3 rounded-xl text-sm font-semibold text-[#C1121F]; background: rgba(193,18,31,0.08); border: 1.5px solid rgba(193,18,31,0.3); }

.form-stack { @apply flex flex-col gap-5 sm:gap-6; }
.field { @apply flex flex-col mb-3 sm:mb-4; }
.field-label { @apply text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-black/70 mb-2; }
.field-input { @apply w-full h-11 sm:h-12 px-3.5 sm:px-4 rounded-xl text-sm border-2 border-black/15 outline-none transition-all duration-200; background-color: rgba(255,255,255,0.65); backdrop-filter: blur(12px); }
.field-input:focus { border-color: #C1121F; box-shadow: 0 0 0 3px rgba(193,18,31,0.18); }
.field-input::placeholder { @apply text-black/30; }
.field-textarea { @apply h-auto py-3 leading-snug; resize: vertical; min-height: 110px; }
.hint { @apply text-[11px] text-black/45 mt-2; }

.upload-grid { @apply grid grid-cols-4 gap-2 sm:gap-3 mb-1; }
.upload-slot { @apply relative aspect-square rounded-xl cursor-pointer overflow-hidden bg-white; border: 2px dashed #111; transition: transform 0.15s ease, box-shadow 0.15s ease; }
.upload-slot:hover { transform: translate(1px,1px); }
.upload-slot.has-img { border-style: solid; box-shadow: 2px 2px 0 0 #111; }
.slot-empty { @apply absolute inset-0 flex flex-col items-center justify-center gap-1 text-black/40; }
.slot-text { @apply text-[10px] font-bold uppercase tracking-wider; }
.slot-preview { @apply absolute inset-0 w-full h-full object-cover; }
.slot-remove { @apply absolute top-1 right-1 w-5 h-5 rounded-md bg-black text-white text-sm font-bold flex items-center justify-center; line-height: 1; }

.seg-row { @apply flex flex-wrap gap-2; }
.seg-btn { @apply px-4 py-2 rounded-lg text-xs font-bold transition-all duration-150; border: 2px solid #111; }
.seg-narrow { @apply px-3 py-1.5 text-[11px]; }
.seg-active { @apply text-white; background: linear-gradient(135deg, #C1121F, #780000); box-shadow: 2px 2px 0 0 #111; }
.seg-active-sports { @apply text-white; background: linear-gradient(135deg, #669BBC, #003049); box-shadow: 2px 2px 0 0 #111; }
.seg-inactive { @apply bg-white text-black/70; }
.seg-inactive:hover { background: #FDF0D5; }

.subcat-track { @apply flex flex-wrap gap-2; }
.subcat-chip { @apply flex-shrink-0 px-3.5 py-1.5 text-[11px] font-bold rounded-lg bg-white text-black/70; border: 2px solid #111; transition: transform 0.15s ease, box-shadow 0.15s ease; }
.subcat-inactive:hover { @apply text-black; background: #FDF0D5; transform: translate(-1px,-1px); box-shadow: 2px 2px 0 0 #111; }
.subcat-active-fashion,.subcat-active-sports { @apply text-white; box-shadow: 3px 3px 0 0 #111; }
.subcat-active-fashion { background: linear-gradient(135deg, #C1121F, #780000); }
.subcat-active-sports  { background: linear-gradient(135deg, #669BBC, #003049); }
.subcat-fade-enter-active,.subcat-fade-leave-active { transition: opacity 0.18s ease, transform 0.18s ease; }
.subcat-fade-enter-from,.subcat-fade-leave-to { opacity: 0; transform: translateY(-4px); }

.price-input-wrap { @apply relative; }
.price-prefix { @apply absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-black/60 z-10; }
.price-input { @apply pl-11; }
.price-input::-webkit-outer-spin-button,.price-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
.price-input { -moz-appearance: textfield; }

.label-hint { @apply normal-case tracking-normal text-[10px] font-medium text-black/40 ml-1; }
.hint-warn { color: #C1121F; font-weight: 600; }

.stock-input-wrap { @apply flex items-center gap-2; }
.stock-btn { @apply w-11 h-11 sm:h-12 rounded-xl text-lg font-bold bg-white text-black/80 flex-shrink-0; border: 2px solid #111; box-shadow: 2px 2px 0 0 #111; transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease; }
.stock-btn:hover:not(:disabled) { background: #FDF0D5; transform: translate(1px,1px); box-shadow: 1px 1px 0 0 #111; }
.stock-btn:disabled { @apply opacity-40 cursor-not-allowed; }
.stock-input { @apply text-center font-bold; max-width: 100px; }
.stock-input::-webkit-outer-spin-button,.stock-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
.stock-input { -moz-appearance: textfield; }

.submit-btn { @apply w-full flex items-center justify-center gap-2 py-3 sm:py-3.5 text-white text-sm font-bold rounded-xl transition-all duration-150; background: linear-gradient(135deg, #C1121F, #780000); border: 2px solid #111; box-shadow: 3px 3px 0 0 #111; }
@media (min-width: 640px) { .submit-btn { box-shadow: 4px 4px 0 0 #111; } }
.submit-btn:hover:not(:disabled) { transform: translate(2px,2px); box-shadow: 2px 2px 0 0 #111; }
.submit-btn:active:not(:disabled) { transform: translate(4px,4px); box-shadow: 0 0 0 0 #111; }
.submit-btn:disabled { @apply opacity-70 cursor-not-allowed; }
.loading-state { @apply flex flex-col items-center justify-center gap-2 py-16 text-black/60 text-sm font-semibold; }
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
