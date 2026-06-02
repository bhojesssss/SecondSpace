<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { Home, Grid2x2, ShoppingBag, MessageSquare, User } from 'lucide-vue-next'

import { useChats } from '@/composables/useChats'
import { useAuth } from '@/composables/useAuth'
import api from '@/services/api'

const route = useRoute()

const { isLoggedIn } = useAuth()
const { totalUnread, fetchChats } = useChats()

// Cart count comes from the server cart (same source as NavbarTop / CartView),
// not the localStorage composable — otherwise the badge would always read 0.
const cartCount = ref(0)

async function fetchCounts() {
  if (!isLoggedIn.value) {
    cartCount.value = 0
    return
  }
  try {
    const cartData = await api.get('/cart')
    const list = Array.isArray(cartData) ? cartData : []
    cartCount.value = list.reduce((s, i) => s + (i.qty || 1), 0)
  } catch {
    // silent
  }
  await fetchChats()
}

let pollInterval = null

onMounted(() => {
  fetchCounts()
  pollInterval = setInterval(fetchCounts, 5000)
})

onUnmounted(() => {
  if (pollInterval) {
    clearInterval(pollInterval)
  }
})

watch(isLoggedIn, fetchCounts)

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
