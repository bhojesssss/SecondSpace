<template>
  <div class="app-wrapper min-h-screen bg-[#FDF0D5] flex flex-col items-center w-full relative">
    <NavbarTop v-if="!isMobile && !isAuthPage" />

    <main class="flex-1 w-full max-w-5xl px-4 pt-4 md:pt-0 pb-6 flex flex-col">
      <router-view v-slot="{ Component, route }">
        <transition name="page" mode="out-in">
          <component :is="Component" :key="route.fullPath" />
        </transition>
      </router-view>
    </main>

    <NavbarBottom v-if="isMobile && !isAuthPage" />
    <div v-if="isMobile && !isAuthPage" class="pb-20"></div>
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
