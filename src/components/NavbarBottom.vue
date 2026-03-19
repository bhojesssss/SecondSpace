<template>
  <nav class="fixed bottom-0 left-0 right-0 z-50 bg-[#FDF0D5] border-t border-black/10 shadow-lg">
    <div class="flex items-center justify-around h-16 px-2">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="nav-bottom-item"
        :class="{ active: isActive(item.path) }"
      >
        <div class="relative">
          <component :is="item.icon" />
          <span
            v-if="item.badge"
            class="absolute -top-1 -right-1 bg-[#C1121F] text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold"
          >{{ item.badge }}</span>
        </div>
        <span class="text-[10px] mt-0.5 font-medium">{{ item.label }}</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { h } from 'vue'

const route = useRoute()

const Icon = (paths) => h('svg', { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, paths.map(d => h('path', { d })))

const navItems = [
  {
    path: '/',
    label: 'Home',
    icon: () => h('svg', { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, [
      h('path', { d: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' }),
      h('polyline', { points: '9 22 9 12 15 12 15 22' })
    ])
  },
  {
    path: '/catalog',
    label: 'Catalog',
    icon: () => h('svg', { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, [
      h('rect', { x: 3, y: 3, width: 7, height: 7 }),
      h('rect', { x: 14, y: 3, width: 7, height: 7 }),
      h('rect', { x: 14, y: 14, width: 7, height: 7 }),
      h('rect', { x: 3, y: 14, width: 7, height: 7 })
    ])
  },
  {
    path: '/cart',
    label: 'Cart',
    badge: 2,
    icon: () => h('svg', { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, [
      h('path', { d: 'M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z' }),
      h('line', { x1: 3, y1: 6, x2: 21, y2: 6 }),
      h('path', { d: 'M16 10a4 4 0 0 1-8 0' })
    ])
  },
  {
    path: '/chat',
    label: 'Chat',
    badge: 3,
    icon: () => h('svg', { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, [
      h('path', { d: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' })
    ])
  },
  {
    path: '/profile',
    label: 'Profile',
    icon: () => h('svg', { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, [
      h('path', { d: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' }),
      h('circle', { cx: 12, cy: 7, r: 4 })
    ])
  }
]

const isActive = (path) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<style scoped>

@reference "../assets/main.css";

.nav-bottom-item {
  @apply flex flex-col items-center justify-center flex-1 py-1 text-black/40 transition-all duration-200;
}
.nav-bottom-item.active {
  @apply text-[#C1121F];
}
.nav-bottom-item:not(.active):hover {
  @apply text-black/70;
}
</style>