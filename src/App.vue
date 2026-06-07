<template>
  <div class="app-wrapper bg-[#FDF0D5] flex flex-col items-center w-full relative">
    <NavbarTop v-if="!isMobile && !isAuthPage" />

    <main
      class="page-main flex-1 w-full max-w-5xl px-3 sm:px-4 pt-3 sm:pt-4 md:pt-0 flex flex-col"
      :class="{ 'has-bottom-nav': isMobile && !isAuthPage }"
    >
      <router-view v-slot="{ Component, route }">
        <transition name="page" mode="out-in">
          <component :is="Component" :key="route.fullPath" />
        </transition>
      </router-view>
    </main>

    <AppFooter v-if="!isMobile && !isAuthPage" />

    <NavbarBottom v-if="isMobile && !isAuthPage" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import NavbarTop from '@/components/NavbarTop.vue'
import NavbarBottom from '@/components/NavbarBottom.vue'
import AppFooter from '@/components/AppFooter.vue'
import { useAuth } from '@/composables/useAuth'
import { usePresence } from '@/composables/usePresence'

const route = useRoute()
const isAuthPage = computed(() => ['login', 'register'].includes(route.name))

// ── Realtime presence ─────────────────────────────────────────────────────────
// Broadcast "online" for the whole session (any page), so chat can show real-time
// online/offline status of the other user.
const { user } = useAuth()
const { startPresence, stopPresence } = usePresence()
watch(
  () => user.value?.id,
  (id) => {
    if (id) startPresence(id)
    else stopPresence()
  },
  { immediate: true },
)

const isMobile = ref(window.innerWidth < 768)

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  stopPresence()
})
</script>

<style scoped>
/* Use dynamic viewport height so the layout matches the visible area on mobile
   (100vh is taller than the visible viewport when the address bar is shown,
   which let the fixed bottom navbar overlap page content). */
.app-wrapper {
  min-height: 100dvh;
}

/* Desktop default bottom padding (was pb-6). */
.page-main {
  padding-bottom: 1.5rem;
}

/* Mobile: reserve room for the fixed bottom navbar (72px) + the iOS home-indicator
   safe area + breathing space so page content (e.g. the Profile logout button) is
   never hidden behind it. Keep the 72px in sync with NavbarBottom's height. */
.page-main.has-bottom-nav {
  padding-bottom: calc(72px + env(safe-area-inset-bottom) + 1.25rem);
}
</style>
