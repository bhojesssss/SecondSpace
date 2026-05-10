<template>
  <nav class="navbar-top fixed top-0 w-full flex justify-center z-50 bg-[#FDF0D5]">
    <div class="w-full max-w-5xl px-4 h-14 flex items-center justify-between gap-4">
      <!-- Logo -->
      <router-link to="/" class="flex-shrink-0">
        <img src="@/assets/Img/logo.svg" alt="SecondSpace" class="h-8" />
      </router-link>

      <!-- Search Bar -->
      <div class="flex-1 max-w-xl">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search Bar"
            class="w-full h-9 pl-4 pr-10 rounded-xl border border-black/20 bg-white/80 text-sm font-body focus:outline-none focus:border-[#C1121F] transition-colors"
            @keyup.enter="handleSearch"
          />
          <button class="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-[#C1121F] transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Icons -->
      <div class="flex items-center gap-3 ml-2">
        <router-link to="/catalog" class="nav-icon-btn" aria-label="Catalog">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="7" height="7"/>
            <rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/>
          </svg>
        </router-link>

        <template v-if="isLoggedIn">
          <router-link to="/cart" class="nav-icon-btn relative">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <span v-if="cartCount > 0" class="absolute -top-1 -right-1 bg-[#C1121F] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{{ cartCount }}</span>
          </router-link>

          <router-link to="/chat" class="nav-icon-btn relative">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span v-if="chatCount > 0" class="absolute -top-1 -right-1 bg-[#C1121F] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{{ chatCount }}</span>
          </router-link>

          <router-link to="/notifications" class="nav-icon-btn relative">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span v-if="notifCount > 0" class="absolute -top-1 -right-1 bg-[#C1121F] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{{ notifCount }}</span>
          </router-link>

          <router-link to="/profile" class="nav-icon-btn">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </router-link>
        </template>

        <template v-else>
          <router-link to="/login" class="nav-text-btn">Login</router-link>
          <router-link to="/register" class="nav-cta-btn">Register</router-link>
        </template>
      </div>
    </div>
  </nav>
  <!-- Spacer -->
  <div class="h-14"></div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { isLoggedIn } = useAuth()
const searchQuery = ref('')
const cartCount = ref(2)
const chatCount = ref(3)
const notifCount = ref(5)

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: '/catalog', query: { q: searchQuery.value } })
  }
}
</script>

<style scoped>

@reference "../assets/main.css";

.nav-icon-btn {
  @apply p-1.5 rounded-lg hover:bg-black/5 transition-all duration-200 text-black/70 hover:text-black cursor-pointer flex items-center justify-center;
}

/* Auth buttons (logged-out state) */
.nav-text-btn {
  @apply px-3 py-1.5 text-sm font-bold rounded-xl text-black/80 hover:text-[#C1121F] transition-colors;
}
.nav-cta-btn {
  @apply px-3.5 py-1.5 text-sm font-bold rounded-xl bg-[#C1121F] text-white border-2 border-black;
  box-shadow: 3px 3px 0 0 #111;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.nav-cta-btn:hover {
  transform: translate(1.5px, 1.5px);
  box-shadow: 1.5px 1.5px 0 0 #111;
}
</style>