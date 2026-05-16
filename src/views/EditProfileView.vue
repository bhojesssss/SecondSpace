<template>
  <div class="edit-root">

    <AuthGate v-if="!isLoggedIn" title="Login untuk Edit Profil" message="Masuk dulu untuk mengubah informasi profil kamu." />

    <template v-else>
      <section class="section-gap">
        <div class="header-wrap">
          <button @click="goBack" class="back-btn" aria-label="Back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <div class="section-accent fashion-accent"></div>
          <h1 class="page-title">Edit Profil</h1>
        </div>
      </section>

      <!-- Loading skeleton -->
      <div v-if="loading" class="flex flex-col items-center gap-6">
        <div class="skeleton w-28 h-28 rounded-full"></div>
        <div class="w-full flex flex-col gap-4">
          <div class="skeleton skeleton-line w-full"></div>
          <div class="skeleton skeleton-line w-full"></div>
          <div class="skeleton skeleton-line w-3/4"></div>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="loadError" class="error-banner">
        <p class="error-text">{{ loadError }}</p>
        <button @click="loadProfile" class="retry-btn">Coba Lagi</button>
      </div>

      <template v-else>
        <!-- Avatar -->
        <section class="section-gap reveal">
          <div class="avatar-wrap">
            <div class="avatar-circle">
              <img v-if="avatarPreview" :src="avatarPreview" class="avatar-img" />
              <span v-else>{{ form.name[0]?.toUpperCase() || 'U' }}</span>
            </div>
            <label class="avatar-edit">
              <input type="file" accept="image/*" @change="onAvatarChange" class="hidden" />
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            </label>
          </div>
          <p class="avatar-hint">Ketuk pensil untuk ubah foto</p>
        </section>

        <!-- Save error -->
        <div v-if="saveError" class="save-error-banner">{{ saveError }}</div>

        <!-- Form -->
        <form @submit.prevent="handleSave" class="form-stack">
          <section class="reveal reveal-delay-1">
            <div class="field">
              <label class="field-label">Nama Lengkap</label>
              <input v-model="form.name" type="text" required class="field-input" :disabled="saving" />
            </div>
            <div class="field">
              <label class="field-label">Email</label>
              <input v-model="form.email" type="email" required class="field-input" :disabled="saving" />
            </div>
            <div class="field">
              <label class="field-label">No. Telepon</label>
              <input v-model="form.phone" type="tel" placeholder="08xxxxxxxxxx" class="field-input" :disabled="saving" />
            </div>
          </section>

          <section class="reveal reveal-delay-2">
            <div class="field">
              <label class="field-label">Kota / Lokasi</label>
              <input v-model="form.city" type="text" placeholder="Bandar Lampung" class="field-input" :disabled="saving" />
            </div>
            <div class="field">
              <label class="field-label">Bio</label>
              <textarea v-model="form.bio" rows="3" placeholder="Sedikit tentang kamu..." class="field-input field-textarea" maxlength="160" :disabled="saving"></textarea>
              <p class="hint">{{ form.bio.length }}/160 karakter</p>
            </div>
          </section>

          <div class="action-stack">
            <button type="submit" class="save-btn" :disabled="saving">
              <svg v-if="saving" class="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/></svg>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              <span>{{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}</span>
            </button>
            <button type="button" @click="goBack" class="cancel-btn" :disabled="saving">Batal</button>
          </div>
        </form>
      </template>
    </template>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { useAuth } from '@/composables/useAuth'
import AuthGate from '@/components/AuthGate.vue'
import api from '@/services/api'

useScrollReveal()
const router = useRouter()
const { isLoggedIn, fetchMe } = useAuth()
const goBack = () => { if (window.history.state?.back) router.back(); else router.push('/profile') }

const loading   = ref(false)
const loadError = ref(null)
const saving    = ref(false)
const saveError = ref('')
const avatarPreview = ref(null)

const form = reactive({ name: '', email: '', phone: '', city: '', bio: '' })

async function loadProfile() {
  loading.value = true
  loadError.value = null
  try {
    const data = await api.get('/users/me')
    form.name  = data.name  || data.full_name || ''
    form.email = data.email || ''
    form.phone = data.phone || ''
    form.city  = data.city  || ''
    form.bio   = data.bio   || ''
  } catch (e) {
    loadError.value = e.message || 'Gagal memuat profil.'
  } finally {
    loading.value = false
  }
}

onMounted(() => { if (isLoggedIn.value) loadProfile() })

const onAvatarChange = (e) => {
  const file = e.target.files?.[0]
  if (file) avatarPreview.value = URL.createObjectURL(file)
}

async function handleSave() {
  saving.value = true
  saveError.value = ''
  try {
    await api.patch('/users/me', {
      name:  form.name,
      email: form.email,
      phone: form.phone,
      city:  form.city,
      bio:   form.bio,
    })
    await fetchMe()
    router.push('/profile')
  } catch (e) {
    saveError.value = e.message || 'Gagal menyimpan perubahan.'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
@reference "../assets/main.css";

.edit-root { @apply pb-8; padding: 0.75rem; }
@media (min-width: 640px) { .edit-root { padding: 1rem; } }
.section-gap { @apply mb-5 sm:mb-6; }
.header-wrap { @apply flex items-center gap-3; }
.back-btn { @apply w-9 h-9 rounded-lg flex items-center justify-center text-black/70 bg-white transition-all duration-200 active:scale-90; border: 2px solid #111; box-shadow: 2px 2px 0 0 #111; }
.back-btn:hover { color: #C1121F; transform: translate(1px,1px); box-shadow: 1px 1px 0 0 #111; }
.section-accent { @apply w-1 h-7 rounded-full flex-shrink-0; }
.fashion-accent { background: linear-gradient(135deg, #C1121F, #780000); }
.page-title { @apply text-xl sm:text-2xl font-bold tracking-tight text-gray-900; font-family: 'CalSans', serif; }
.avatar-wrap { @apply relative w-fit mx-auto; }
.avatar-circle { @apply w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center text-white text-3xl sm:text-4xl font-bold overflow-hidden; background: linear-gradient(135deg, #003049, #669BBC); border: 3px solid #111; box-shadow: 3px 3px 0 0 #111; font-family: 'CalSans', serif; }
@media (min-width: 640px) { .avatar-circle { box-shadow: 4px 4px 0 0 #111; } }
.avatar-img { @apply w-full h-full object-cover; }
.avatar-edit { @apply absolute -bottom-1 -right-1 w-9 h-9 rounded-full flex items-center justify-center text-white cursor-pointer; background: linear-gradient(135deg, #C1121F, #780000); border: 2px solid #111; box-shadow: 2px 2px 0 0 #111; transition: transform 0.15s ease, box-shadow 0.15s ease; }
.avatar-edit:hover { transform: translate(1px,1px); box-shadow: 1px 1px 0 0 #111; }
.avatar-hint { @apply text-center text-[11px] text-black/45 mt-3; }
.save-error-banner { @apply mb-4 px-4 py-3 rounded-xl text-sm font-semibold text-[#C1121F]; background: rgba(193,18,31,0.08); border: 1.5px solid rgba(193,18,31,0.3); }
.form-stack { @apply flex flex-col gap-2; }
.field { @apply flex flex-col mb-3 sm:mb-4; }
.field-label { @apply text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-black/70 mb-2; }
.field-input { @apply w-full h-11 sm:h-12 px-3.5 sm:px-4 rounded-xl text-sm border-2 border-black/15 outline-none transition-all duration-200; background-color: rgba(255,255,255,0.65); backdrop-filter: blur(12px); }
.field-input:focus { border-color: #C1121F; box-shadow: 0 0 0 3px rgba(193,18,31,0.18); }
.field-input::placeholder { @apply text-black/30; }
.field-input:disabled { @apply opacity-60 cursor-not-allowed; }
.field-textarea { @apply h-auto py-3 leading-snug; resize: vertical; min-height: 90px; }
.hint { @apply text-[11px] text-black/45 mt-2 text-right; }
.action-stack { @apply flex flex-col gap-3 mt-4; }
.save-btn { @apply w-full flex items-center justify-center gap-2 py-3 sm:py-3.5 text-white text-sm font-bold rounded-xl transition-all duration-150; background: linear-gradient(135deg, #C1121F, #780000); border: 2px solid #111; box-shadow: 3px 3px 0 0 #111; }
@media (min-width: 640px) { .save-btn { box-shadow: 4px 4px 0 0 #111; } }
.save-btn:hover:not(:disabled) { transform: translate(2px,2px); box-shadow: 2px 2px 0 0 #111; }
.save-btn:disabled { @apply opacity-60 cursor-not-allowed; }
.cancel-btn { @apply w-full py-3 bg-white text-black/70 text-sm font-bold rounded-xl transition-all duration-150; border: 2px solid #111; box-shadow: 3px 3px 0 0 #111; }
.cancel-btn:hover:not(:disabled) { transform: translate(1.5px,1.5px); box-shadow: 1.5px 1.5px 0 0 #111; }
.skeleton { @apply animate-pulse bg-black/10; }
.skeleton-line { height: 48px; @apply rounded-xl; }
.error-banner { @apply flex flex-col items-center gap-3 py-10 text-center; }
.error-text { @apply text-sm font-semibold text-[#C1121F]; }
.retry-btn { @apply px-5 py-2 text-sm font-bold rounded-xl text-white; background: linear-gradient(135deg, #C1121F, #780000); border: 2px solid #111; box-shadow: 3px 3px 0 0 #111; }
</style>
