<script setup>
import { onMounted, onUnmounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { Home, Grid2x2, ShoppingBag, MessageSquare, User } from 'lucide-vue-next'

import { useCart } from '@/composables/useCart'
import { useChats } from '@/composables/useChats'

const route = useRoute()

const { cartCount } = useCart()

const { totalUnread, fetchChats } = useChats()

let chatInterval = null

onMounted(async () => {
  await fetchChats()

  chatInterval = setInterval(async () => {
    await fetchChats()
  }, 5000)
})

onUnmounted(() => {
  if (chatInterval) {
    clearInterval(chatInterval)
  }
})

const menus = [
  {
    name: 'Home',
    path: '/',
    icon: Home,
  },
  {
    name: 'Catalog',
    path: '/catalog',
    icon: Grid2x2,
  },
  {
    name: 'Cart',
    path: '/cart',
    icon: ShoppingBag,
  },
  {
    name: 'Chat',
    path: '/chat',
    icon: MessageSquare,
  },
  {
    name: 'Profile',
    path: '/profile',
    icon: User,
  },
]
</script>

<template>
  <nav class="navbar-bottom">
    <RouterLink
      v-for="menu in menus"
      :key="menu.path"
      :to="menu.path"
      class="nav-item"
      :class="{ active: route.path === menu.path }"
    >
      <div class="icon-wrapper">
        <component :is="menu.icon" :size="22" />

        <!-- CART BADGE -->
        <span v-if="menu.path === '/cart' && cartCount > 0" class="badge">
          {{ cartCount }}
        </span>

        <!-- CHAT BADGE -->
        <span v-if="menu.path === '/chat' && totalUnread > 0" class="badge">
          {{ totalUnread }}
        </span>
      </div>

      <span class="label">
        {{ menu.name }}
      </span>
    </RouterLink>
  </nav>
</template>

<style scoped>
.navbar-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: calc(72px + env(safe-area-inset-bottom));
  padding-bottom: env(safe-area-inset-bottom);
  background: #f6ecd2;
  border-top: 1px solid #d9ccb0;

  display: flex;
  justify-content: space-around;
  align-items: center;

  z-index: 999;
}

.nav-item {
  text-decoration: none;
  color: #8c8475;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;

  font-size: 12px;
}

.nav-item.active {
  color: #b30000;
}

.icon-wrapper {
  position: relative;
}

.badge {
  position: absolute;
  top: -6px;
  right: -10px;

  min-width: 18px;
  height: 18px;

  padding: 0 5px;
  border-radius: 999px;

  background: #d60000;
  color: white;

  font-size: 10px;
  font-weight: 700;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 2px solid #f6ecd2;
}

.label {
  font-size: 11px;
}
</style>
