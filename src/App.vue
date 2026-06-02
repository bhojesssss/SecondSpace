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

    <NavbarBottom v-if="isMobile && !isAuthPage" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import NavbarTop from '@/components/NavbarTop.vue'
import NavbarBottom from '@/components/NavbarBottom.vue'

const route = useRoute()
const isAuthPage = computed(() => ['login', 'register'].includes(route.name))

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
