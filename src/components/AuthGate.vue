<template>
  <div class="gate-root reveal">
    <div class="gate-icon">
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    </div>

    <h2 class="gate-title">{{ title }}</h2>
    <p class="gate-message">{{ message }}</p>

    <div class="gate-actions">
      <router-link to="/login" class="gate-primary">Masuk</router-link>
      <router-link to="/register" class="gate-secondary">Daftar</router-link>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title:   { type: String, default: 'Login Dulu' },
  message: { type: String, default: 'Masuk untuk lanjut akses fitur ini.' },
})
</script>

<style scoped>
@reference "../assets/main.css";

.gate-root {
  @apply flex flex-col items-center justify-center text-center w-full;
  min-height: 60vh;
  padding: 3rem 1rem;
}

.gate-icon {
  @apply w-20 h-20 rounded-full flex items-center justify-center mb-5;
  background: linear-gradient(135deg, #C1121F, #780000);
  border: 2px solid #111;
  box-shadow: 4px 4px 0 0 #111;
}

.gate-title {
  @apply text-2xl font-bold text-gray-900 mb-2;
  font-family: 'CalSans', serif;
  letter-spacing: -0.01em;
}

.gate-message {
  @apply text-sm text-black/60 mb-7 max-w-xs;
}

.gate-actions {
  @apply flex flex-col sm:flex-row gap-3 w-full max-w-xs;
}

.gate-primary,
.gate-secondary {
  @apply flex-1 inline-flex items-center justify-center py-3
         text-sm font-bold rounded-xl no-underline
         transition-all duration-150;
  border: 2px solid #111;
  box-shadow: 4px 4px 0 0 #111;
}

.gate-primary {
  @apply text-white;
  background: linear-gradient(135deg, #C1121F, #780000);
}

.gate-secondary {
  @apply text-[#C1121F] bg-white;
}

.gate-primary:hover,
.gate-secondary:hover {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 0 #111;
}

.gate-primary:active,
.gate-secondary:active {
  transform: translate(4px, 4px);
  box-shadow: 0 0 0 0 #111;
}
</style>
