<template>
  <div class="auth-root">
    <div class="auth-frame">

      <!-- Brand -->
      <router-link to="/" class="brand-link">
        <img src="@/assets/Img/logo.svg" class="brand-logo" alt="SecondSpace" />
      </router-link>

      <!-- Card -->
      <div class="auth-card">
        <!-- Decoration corner block -->
        <div class="corner-block"></div>

        <h1 class="auth-title">Join SecondSpace</h1>
        <p class="auth-subtitle">Bikin akun untuk mulai jual & beli preloved.</p>

        <form @submit.prevent="handleRegister" class="auth-form">
          <div class="field">
            <label for="name" class="field-label">Nama Lengkap</label>
            <input
              id="name"
              v-model="name"
              type="text"
              required
              placeholder="Nama kamu"
              class="field-input"
            />
          </div>

          <div class="field">
            <label for="email" class="field-label">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              placeholder="kamu@email.com"
              class="field-input"
            />
          </div>

          <div class="field">
            <label for="password" class="field-label">Password</label>
            <div class="relative">
              <input
                id="password"
                v-model="password"
                :type="showPwd ? 'text' : 'password'"
                required
                minlength="6"
                placeholder="Minimal 6 karakter"
                class="field-input pr-12"
              />
              <button
                type="button"
                @click="showPwd = !showPwd"
                class="pwd-toggle"
                :aria-label="showPwd ? 'Hide password' : 'Show password'"
              >
                <svg v-if="showPwd" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                  <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
                <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="field">
            <label for="confirm" class="field-label">Konfirmasi Password</label>
            <input
              id="confirm"
              v-model="confirm"
              :type="showPwd ? 'text' : 'password'"
              required
              placeholder="Ulang password"
              class="field-input"
              :class="{ 'field-error': confirm && confirm !== password }"
            />
            <p v-if="confirm && confirm !== password" class="field-hint">
              Password tidak cocok
            </p>
          </div>

          <label class="terms">
            <input type="checkbox" v-model="agreed" required class="remember-cb" />
            <span>
              Saya setuju dengan
              <a href="#" class="inline-link">Syarat & Ketentuan</a>
            </span>
          </label>

          <button type="submit" class="auth-submit" :disabled="!canSubmit">
            <span>Daftar Sekarang</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
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
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { login } = useAuth()

const name = ref('')
const email = ref('')
const password = ref('')
const confirm = ref('')
const agreed = ref(false)
const showPwd = ref(false)

const canSubmit = computed(() =>
  name.value &&
  email.value &&
  password.value.length >= 6 &&
  confirm.value === password.value &&
  agreed.value
)

const handleRegister = () => {
  if (!canSubmit.value) return
  login({ name: name.value, email: email.value })
  router.push('/')
}
</script>

<style scoped>
@reference "../assets/main.css";

/* ── Root ───────────────────────────────────────────────────────────────────── */
.auth-root {
  @apply flex flex-col items-center justify-center w-full py-8;
  min-height: calc(100vh - 5rem);
}
.auth-frame {
  @apply w-full max-w-md flex flex-col items-center;
}

/* ── Brand ──────────────────────────────────────────────────────────────────── */
.brand-link {
  @apply mb-6 transition-transform duration-200 hover:scale-105;
}
.brand-logo {
  @apply h-10;
}

/* ── Card (brutalist) ───────────────────────────────────────────────────────── */
.auth-card {
  @apply relative w-full p-5 sm:p-7 rounded-2xl bg-white;
  border: 2px solid #111;
  box-shadow: 6px 6px 0 0 #C1121F;
}
@media (min-width: 640px) {
  .auth-card { box-shadow: 8px 8px 0 0 #C1121F; }
}
.corner-block {
  @apply absolute -top-3 -right-3 w-10 h-10 rounded-md;
  background: linear-gradient(135deg, #C1121F, #780000);
  border: 2px solid #111;
}

/* ── Title ──────────────────────────────────────────────────────────────────── */
.auth-title {
  @apply text-2xl sm:text-3xl font-bold mb-1 text-gray-900;
  font-family: 'CalSans', serif;
  letter-spacing: -0.02em;
}
.auth-subtitle {
  @apply text-sm text-black/60 mb-6;
}

/* ── Form ───────────────────────────────────────────────────────────────────── */
.auth-form {
  @apply flex flex-col gap-4;
}
.field {
  @apply flex flex-col;
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
.field-error {
  border-color: #C1121F !important;
}
.field-hint {
  @apply text-[11px] font-semibold text-[#C1121F] mt-1.5;
}

/* ── Password toggle ────────────────────────────────────────────────────────── */
.pwd-toggle {
  @apply absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg
         text-black/40 hover:text-[#C1121F] hover:bg-black/5
         transition-all duration-200;
}

/* ── Terms ──────────────────────────────────────────────────────────────────── */
.terms {
  @apply flex items-start gap-2 text-xs text-black/70 font-semibold cursor-pointer select-none mt-1 leading-snug;
}
.remember-cb {
  @apply w-4 h-4 rounded border-2 border-black/30 cursor-pointer flex-shrink-0 mt-0.5;
  accent-color: #C1121F;
}
.inline-link {
  @apply text-[#C1121F] font-bold no-underline hover:underline;
}

/* ── Submit (brutalist CTA) ─────────────────────────────────────────────────── */
.auth-submit {
  @apply w-full flex items-center justify-center gap-2 py-3.5 mt-2
         text-white text-sm font-bold rounded-xl
         transition-all duration-150;
  background: linear-gradient(135deg, #C1121F, #780000);
  border: 2px solid #111;
  box-shadow: 4px 4px 0 0 #111;
}
.auth-submit:hover:not(:disabled) {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 0 #111;
}
.auth-submit:active:not(:disabled) {
  transform: translate(4px, 4px);
  box-shadow: 0 0 0 0 #111;
}
.auth-submit:disabled {
  @apply opacity-60 cursor-not-allowed;
}

/* ── Divider ───────────────────────────────────────────────────────────────── */
.auth-divider {
  @apply flex items-center gap-3 my-6 text-[10px] text-black/40 uppercase tracking-widest font-bold;
}
.auth-divider::before,
.auth-divider::after {
  content: '';
  @apply flex-1 h-px;
  background: rgba(0, 0, 0, 0.12);
}

/* ── Switch ────────────────────────────────────────────────────────────────── */
.auth-switch {
  @apply text-center text-sm text-black/60;
}
.switch-link {
  @apply font-bold text-[#C1121F] no-underline hover:underline;
}
</style>
