<template>
  <div class="auth-root">
    <div class="auth-split">
      <!-- Brand panel — desktop split screen -->
      <aside class="brand-panel">
        <span class="brand-blob brand-blob-1"></span>
        <span class="brand-blob brand-blob-2"></span>
        <div class="brand-content">
          <img src="@/assets/Img/logo.svg" class="brand-panel-logo" alt="SecondSpace" />
          <h2 class="brand-headline">Gabung SecondSpace.</h2>
          <p class="brand-tagline">Bikin akun dan mulai jual-beli fashion &amp; sport preloved dengan mudah dan aman.</p>
          <ul class="brand-features">
            <li class="brand-feature"><span class="brand-feature-icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span><span>Pasang barang gratis dalam menit</span></li>
            <li class="brand-feature"><span class="brand-feature-icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span><span>Jangkau ribuan pembeli preloved</span></li>
            <li class="brand-feature"><span class="brand-feature-icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span><span>Transaksi aman &amp; terverifikasi</span></li>
          </ul>
        </div>
      </aside>

      <!-- Form panel -->
      <div class="form-panel">
        <router-link to="/" class="brand-link">
          <img src="@/assets/Img/logo.svg" class="brand-logo" alt="SecondSpace" />
        </router-link>

        <div class="auth-card">
          <div class="corner-block"></div>

        <h1 class="auth-title">Join SecondSpace</h1>
        <p class="auth-subtitle">Bikin akun untuk mulai jual &amp; beli preloved.</p>

        <!-- Error banner -->
        <div v-if="registerError" class="auth-error">{{ registerError }}</div>

        <form @submit.prevent="handleRegister" class="auth-form">
          <div class="field">
            <label for="name" class="field-label">Nama Lengkap</label>
            <input id="name" v-model="name" type="text" required placeholder="Nama kamu" class="field-input" :disabled="loading" />
          </div>

          <div class="field">
            <label for="email" class="field-label">Email</label>
            <input id="email" v-model="email" type="email" required placeholder="kamu@email.com" class="field-input" :disabled="loading" />
          </div>

          <div class="field">
            <label for="phone" class="field-label">No. Telepon</label>
            <input id="phone" v-model="phone" type="tel" placeholder="08xxxxxxxxxx" class="field-input" :disabled="loading" />
          </div>

          <div class="field">
            <label for="password" class="field-label">Password</label>
            <div class="relative">
              <input id="password" v-model="password" :type="showPwd ? 'text' : 'password'" required minlength="6" placeholder="Minimal 6 karakter" class="field-input pr-12" :disabled="loading" />
              <button type="button" @click="showPwd = !showPwd" class="pwd-toggle" :aria-label="showPwd ? 'Hide password' : 'Show password'">
                <svg v-if="showPwd" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
          </div>

          <div class="field">
            <label for="confirm" class="field-label">Konfirmasi Password</label>
            <input id="confirm" v-model="confirm" :type="showPwd ? 'text' : 'password'" required placeholder="Ulang password" class="field-input" :class="{ 'field-error': confirm && confirm !== password }" :disabled="loading" />
            <p v-if="confirm && confirm !== password" class="field-hint">Password tidak cocok</p>
          </div>

          <label class="terms">
            <input type="checkbox" v-model="agreed" required class="remember-cb" />
            <span>Saya setuju dengan <a href="#" class="inline-link">Syarat &amp; Ketentuan</a></span>
          </label>

          <button type="submit" class="auth-submit" :disabled="!canSubmit || loading">
            <svg v-if="loading" class="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/></svg>
            <span>{{ loading ? 'Mendaftar...' : 'Daftar Sekarang' }}</span>
            <svg v-if="!loading" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </form>

        <div class="auth-divider"><span>atau</span></div>

        <p class="auth-switch">
          Sudah punya akun?
          <router-link to="/login" class="switch-link">Masuk</router-link>
        </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { register } = useAuth()

const name    = ref('')
const email   = ref('')
const phone   = ref('')
const password = ref('')
const confirm  = ref('')
const agreed   = ref(false)
const showPwd  = ref(false)
const loading  = ref(false)
const registerError = ref('')

const canSubmit = computed(() =>
  name.value && email.value && password.value.length >= 6 &&
  confirm.value === password.value && agreed.value
)

async function handleRegister() {
  if (!canSubmit.value) return
  loading.value = true
  registerError.value = ''
  try {
    await register({ name: name.value, email: email.value, password: password.value, phone: phone.value })
    router.push('/')
  } catch (e) {
    registerError.value = e.message || 'Pendaftaran gagal. Coba lagi.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@reference "../assets/main.css";

.auth-root { @apply flex flex-col items-center justify-center w-full py-6 sm:py-8; min-height: calc(100dvh - 4rem); }
.auth-split { @apply w-full max-w-md; }
.form-panel { @apply w-full flex flex-col items-center px-1; }
.brand-panel { @apply hidden; }
.brand-link { @apply mb-5 sm:mb-6 transition-transform duration-200 hover:scale-105; }
.brand-logo { @apply h-9 sm:h-10; }
.auth-card { @apply relative w-full p-4 sm:p-7 rounded-2xl bg-white; border: 2px solid #111; box-shadow: 5px 5px 0 0 #111; }
@media (min-width: 640px) { .auth-card { box-shadow: 8px 8px 0 0 #111; } }

/* ── Desktop split screen ───────────────────────────────── */
.brand-content { @apply relative z-10 flex flex-col; }
.brand-panel-logo { @apply h-10 mb-8 self-start; filter: brightness(0) invert(1); }
.brand-headline { @apply text-3xl lg:text-4xl font-bold leading-tight mb-4; font-family: 'CalSans', serif; letter-spacing: -0.02em; }
.brand-tagline { @apply text-sm text-white/85 leading-relaxed mb-8 max-w-xs; }
.brand-features { @apply flex flex-col gap-3.5 list-none p-0 m-0; }
.brand-feature { @apply flex items-center gap-3 text-sm font-semibold text-white/95; }
.brand-feature-icon { @apply w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-white; background: rgba(255,255,255,0.16); border: 1.5px solid rgba(255,255,255,0.4); }
.brand-blob { @apply absolute rounded-full pointer-events-none; }
.brand-blob-1 { width: 240px; height: 240px; top: -70px; right: -70px; background: rgba(255,255,255,0.1); }
.brand-blob-2 { width: 180px; height: 180px; bottom: -60px; left: -50px; background: rgba(0,0,0,0.12); }

@media (min-width: 768px) {
  .auth-root { @apply py-8; }
  .auth-split {
    @apply max-w-4xl flex items-stretch rounded-2xl overflow-hidden bg-white;
    border: 2px solid #111;
    box-shadow: 10px 10px 0 0 #111;
  }
  .brand-panel {
    @apply relative flex flex-col justify-center p-10 lg:p-12 text-white overflow-hidden;
    flex: 0 0 44%;
    background: linear-gradient(135deg, #C1121F, #780000);
    border-right: 2px solid #111;
  }
  .form-panel { @apply flex-1 justify-center px-10 lg:px-14 py-12; max-width: none; }
  .brand-link { display: none; }
  .auth-card { @apply max-w-sm p-0 rounded-none bg-transparent; border: none; box-shadow: none; }
  .corner-block { display: none; }
}
.corner-block { @apply absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-8 h-8 sm:w-10 sm:h-10 rounded-md; background: linear-gradient(135deg, #C1121F, #780000); border: 2px solid #111; }
.auth-title { @apply text-xl sm:text-3xl font-bold mb-1 text-gray-900; font-family: 'CalSans', serif; letter-spacing: -0.02em; }
.auth-subtitle { @apply text-xs sm:text-sm text-black/60 mb-4; }
.auth-error { @apply mb-4 px-4 py-3 rounded-xl text-sm font-semibold text-[#C1121F]; background: rgba(193,18,31,0.08); border: 1.5px solid rgba(193,18,31,0.3); }
.auth-form { @apply flex flex-col gap-3 sm:gap-4; }
.field { @apply flex flex-col; }
.field-label { @apply text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-black/70 mb-1.5 sm:mb-2; }
.field-input { @apply w-full h-11 sm:h-12 px-3.5 sm:px-4 rounded-xl text-sm border-2 border-black/15 outline-none transition-all duration-200; background-color: rgba(255,255,255,0.65); backdrop-filter: blur(12px); }
.field-input:focus { border-color: #C1121F; box-shadow: 0 0 0 3px rgba(193,18,31,0.18); }
.field-input::placeholder { @apply text-black/30; }
.field-input:disabled { @apply opacity-60 cursor-not-allowed; }
.field-error { border-color: #C1121F !important; }
.field-hint { @apply text-[11px] font-semibold text-[#C1121F] mt-1.5; }
.pwd-toggle { @apply absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-black/40 hover:text-[#C1121F] hover:bg-black/5 transition-all duration-200; }
.terms { @apply flex items-start gap-2 text-xs text-black/70 font-semibold cursor-pointer select-none mt-1 leading-snug; }
.remember-cb { @apply w-4 h-4 rounded border-2 border-black/30 cursor-pointer flex-shrink-0 mt-0.5; accent-color: #C1121F; }
.inline-link { @apply text-[#C1121F] font-bold no-underline hover:underline; }
.auth-submit { @apply w-full flex items-center justify-center gap-2 py-3 sm:py-3.5 mt-2 text-white text-sm font-bold rounded-xl transition-all duration-150; background: linear-gradient(135deg, #C1121F, #780000); border: 2px solid #111; box-shadow: 3px 3px 0 0 #111; }
@media (min-width: 640px) { .auth-submit { box-shadow: 4px 4px 0 0 #111; } }
.auth-submit:hover:not(:disabled) { transform: translate(2px,2px); box-shadow: 2px 2px 0 0 #111; }
.auth-submit:active:not(:disabled) { transform: translate(4px,4px); box-shadow: 0 0 0 0 #111; }
.auth-submit:disabled { @apply opacity-60 cursor-not-allowed; }
.auth-divider { @apply flex items-center gap-3 my-6 text-[10px] text-black/40 uppercase tracking-widest font-bold; }
.auth-divider::before,.auth-divider::after { content: ''; @apply flex-1 h-px; background: rgba(0,0,0,0.12); }
.auth-switch { @apply text-center text-sm text-black/60; }
.switch-link { @apply font-bold text-[#C1121F] no-underline hover:underline; }
</style>
