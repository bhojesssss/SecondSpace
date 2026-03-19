<template>
  <nav class="navbar-top fixed top-0 left-0 right-0 z-50 bg-[#FDF0D5] border-b border-black/10 shadow-sm">
    <div class="max-w-6xl mx-auto px-6 h-14 flex items-center gap-4">
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
            class="w-full h-9 pl-4 pr-10 rounded-full border border-black/20 bg-white/80 text-sm font-body focus:outline-none focus:border-[#C1121F] transition-colors"
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
          <div class="w-8 h-8 rounded-full bg-[#669BBC] flex items-center justify-center text-white text-sm font-bold">
            U
          </div>
        </router-link>
      </div>
    </div>
  </nav>
  <!-- Spacer -->
  <div class="h-14"></div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
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
</style>