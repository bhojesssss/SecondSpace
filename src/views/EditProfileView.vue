<template>
  <div class="edit-root">

    <!-- ═══════════════════════════════════════ AUTH GATE ═══════════════════════════════════════ -->
    <AuthGate
      v-if="!isLoggedIn"
      title="Login untuk Edit Profil"
      message="Masuk dulu untuk mengubah informasi profil kamu."
    />

    <template v-else>
    <!-- ═══════════════════════════════════════ HEADER ═══════════════════════════════════════ -->
    <section class="section-gap">
      <div class="header-wrap">
        <button @click="goBack" class="back-btn" aria-label="Back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
        <div class="section-accent fashion-accent"></div>
        <h1 class="page-title">Edit Profil</h1>
      </div>
    </section>

    <!-- ═══════════════════════════════════════ AVATAR ═══════════════════════════════════════ -->
    <section class="section-gap reveal">
      <div class="avatar-wrap">
        <div class="avatar-circle">
          <img v-if="avatarPreview" :src="avatarPreview" class="avatar-img" />
          <span v-else>{{ form.name[0]?.toUpperCase() || 'U' }}</span>
        </div>
        <label class="avatar-edit">
          <input type="file" accept="image/*" @change="onAvatarChange" class="hidden" />
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 20h9"/>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
          </svg>
        </label>
      </div>
      <p class="avatar-hint">Ketuk pensil untuk ubah foto</p>
    </section>

    <!-- ═══════════════════════════════════════ FORM ═══════════════════════════════════════ -->
    <form @submit.prevent="handleSave" class="form-stack">
      <section class="reveal reveal-delay-1">
        <div class="field">
          <label class="field-label">Nama Lengkap</label>
          <input v-model="form.name" type="text" required class="field-input" />
        </div>

        <div class="field">
          <label class="field-label">Email</label>
          <input v-model="form.email" type="email" required class="field-input" />
        </div>

        <div class="field">
          <label class="field-label">No. Telepon</label>
          <input v-model="form.phone" type="tel" placeholder="08xxxxxxxxxx" class="field-input" />
        </div>
      </section>

      <section class="reveal reveal-delay-2">
        <div class="field">
          <label class="field-label">Lokasi</label>
          <input v-model="form.location" type="text" placeholder="Kota, Provinsi" class="field-input" />
        </div>

        <div class="field">
          <label class="field-label">Bio</label>
          <textarea
            v-model="form.bio"
            rows="3"
            placeholder="Sedikit tentang kamu..."
            class="field-input field-textarea"
            maxlength="160"
          ></textarea>
          <p class="hint">{{ form.bio.length }}/160 karakter</p>
        </div>
      </section>

      <!-- ═══════════════════════════════════════ ACTIONS ═══════════════════════════════════════ -->
      <div class="action-stack">
        <button type="submit" class="save-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span>Simpan Perubahan</span>
        </button>
        <button type="button" @click="goBack" class="cancel-btn">Batal</button>
      </div>
    </form>
    </template>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { useAuth } from '@/composables/useAuth'
import AuthGate from '@/components/AuthGate.vue'
useScrollReveal()

const router = useRouter()
const { user, isLoggedIn, login } = useAuth()

const goBack = () => {
  if (window.history.state?.back) router.back()
  else router.push('/profile')
}

const form = reactive({
  name: user.value?.name || '',
  email: user.value?.email || '',
  phone: '',
  location: 'Bandar Lampung, Lampung',
  bio: '',
})

const avatarPreview = ref(null)
const onAvatarChange = (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  avatarPreview.value = URL.createObjectURL(file)
}

const handleSave = () => {
  login({ name: form.name, email: form.email })
  alert('Profil berhasil diperbarui!')
  router.push('/profile')
}
</script>

<style scoped>
@reference "../assets/main.css";

/* ── Root ───────────────────────────────────────────────────────────────────── */
.edit-root {
  @apply pb-8;
  padding: 1rem;
}
.section-gap {
  @apply mb-6;
}

/* ── Header ─────────────────────────────────────────────────────────────────── */
.header-wrap {
  @apply flex items-center gap-3;
}
.back-btn {
  @apply w-9 h-9 rounded-lg flex items-center justify-center
         text-black/70 bg-white
         transition-all duration-200 active:scale-90;
  border: 2px solid #111;
  box-shadow: 2px 2px 0 0 #111;
}
.back-btn:hover {
  color: #C1121F;
  transform: translate(1px, 1px);
  box-shadow: 1px 1px 0 0 #111;
}
.section-accent {
  @apply w-1 h-7 rounded-full flex-shrink-0;
}
.fashion-accent {
  background: linear-gradient(135deg, #C1121F, #780000);
}
.page-title {
  @apply text-2xl font-bold tracking-tight text-gray-900;
  font-family: 'CalSans', serif;
}

/* ── Avatar ────────────────────────────────────────────────────────────────── */
.avatar-wrap {
  @apply relative w-fit mx-auto;
}
.avatar-circle {
  @apply w-28 h-28 rounded-full flex items-center justify-center
         text-white text-4xl font-bold overflow-hidden;
  background: linear-gradient(135deg, #003049, #669BBC);
  border: 3px solid #111;
  box-shadow: 4px 4px 0 0 #111;
  font-family: 'CalSans', serif;
}
.avatar-img {
  @apply w-full h-full object-cover;
}
.avatar-edit {
  @apply absolute -bottom-1 -right-1 w-9 h-9 rounded-full
         flex items-center justify-center text-white cursor-pointer;
  background: linear-gradient(135deg, #C1121F, #780000);
  border: 2px solid #111;
  box-shadow: 2px 2px 0 0 #111;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.avatar-edit:hover {
  transform: translate(1px, 1px);
  box-shadow: 1px 1px 0 0 #111;
}
.avatar-hint {
  @apply text-center text-[11px] text-black/45 mt-3;
}

/* ── Form ───────────────────────────────────────────────────────────────────── */
.form-stack {
  @apply flex flex-col gap-2;
}
.field {
  @apply flex flex-col mb-4;
}
.field-label {
  @apply text-[11px] font-bold uppercase tracking-widest text-black/70 mb-2;
}
.field-input {
  @apply w-full h-12 px-4 rounded-xl text-sm
         border-2 border-black/15 outline-none
         transition-all duration-200;
  background-color: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
.field-input:focus {
  border-color: #C1121F;
  box-shadow: 0 0 0 3px rgba(193, 18, 31, 0.18);
}
.field-input::placeholder {
  @apply text-black/30;
}
.field-textarea {
  @apply h-auto py-3 leading-snug;
  resize: vertical;
  min-height: 90px;
}
.hint {
  @apply text-[11px] text-black/45 mt-2 text-right;
}

/* ── Actions ───────────────────────────────────────────────────────────────── */
.action-stack {
  @apply flex flex-col gap-3 mt-4;
}
.save-btn {
  @apply w-full flex items-center justify-center gap-2 py-3.5
         text-white text-sm font-bold rounded-xl
         transition-all duration-150;
  background: linear-gradient(135deg, #C1121F, #780000);
  border: 2px solid #111;
  box-shadow: 4px 4px 0 0 #111;
}
.save-btn:hover {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 0 #111;
}
.save-btn:active {
  transform: translate(4px, 4px);
  box-shadow: 0 0 0 0 #111;
}
.cancel-btn {
  @apply w-full py-3 bg-white text-black/70 text-sm font-bold rounded-xl
         transition-all duration-150;
  border: 2px solid #111;
  box-shadow: 3px 3px 0 0 #111;
}
.cancel-btn:hover {
  transform: translate(1.5px, 1.5px);
  box-shadow: 1.5px 1.5px 0 0 #111;
}
.cancel-btn:active {
  transform: translate(3px, 3px);
  box-shadow: 0 0 0 0 #111;
}
</style>
