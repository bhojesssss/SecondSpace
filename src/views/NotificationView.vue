<template>
  <div class="notif-root">

    <section class="section-gap">
      <div class="section-title-wrap">
        <div class="section-accent fashion-accent"></div>
        <h1 class="page-title">
          Notifikasi
          <span v-if="unreadCount > 0" class="unread-badge">{{ unreadCount }}</span>
        </h1>
        <button v-if="unreadCount > 0" @click="markAllRead" class="mark-all-btn">Tandai Semua Dibaca</button>
      </div>
    </section>

    <!-- Loading skeleton -->
    <div v-if="loading" class="notif-list">
      <div v-for="i in 4" :key="i" class="notif-card glass-panel">
        <div class="skeleton w-12 h-12 rounded-xl flex-shrink-0"></div>
        <div class="flex-1 flex flex-col gap-2">
          <div class="skeleton skeleton-line w-1/2"></div>
          <div class="skeleton skeleton-line-sm w-3/4"></div>
        </div>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error-banner">
      <p class="error-text">{{ error }}</p>
      <button @click="loadNotifications" class="retry-btn">Coba Lagi</button>
    </div>

    <!-- Empty -->
    <div v-else-if="notifications.length === 0" class="empty-state reveal">
      <div class="empty-icon">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
      </div>
      <p class="empty-title">Belum Ada Notifikasi</p>
      <p class="empty-sub">Notifikasi akan muncul di sini.</p>
    </div>

    <!-- List -->
    <div v-else class="notif-list">
      <router-link
        v-for="(notif, idx) in notifications"
        :key="notif.id"
        :to="`/notifications/${notif.id}`"
        @click="markAsRead(notif.id)"
        class="notif-card glass-panel reveal no-underline"
        :class="[`reveal-delay-${(idx % 4) + 1}`, notif.is_read ? '' : 'notif-unread']"
      >
        <div class="notif-icon-wrap" :class="getTypeClass(notif.type)">
          <span class="notif-icon-text">{{ notif.icon || getDefaultIcon(notif.type) }}</span>
        </div>
        <div class="notif-body">
          <div class="notif-top">
            <p class="notif-title">{{ notif.title }}</p>
            <span class="notif-time">{{ notif.time || notif.created_at || '' }}</span>
          </div>
          <p class="notif-msg">{{ notif.message }}</p>
        </div>
        <div v-if="!notif.is_read" class="notif-dot"></div>
      </router-link>
    </div>

  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { useNotifications } from '@/composables/useNotifications'

useScrollReveal()
const { notifications, unreadCount, fetchNotifications, markAsRead, markAllRead } = useNotifications()

const loading = ref(false)
const error   = ref(null)

import { ref } from 'vue'

async function loadNotifications() {
  loading.value = true
  error.value = null
  try {
    await fetchNotifications()
  } catch (e) {
    error.value = e.message || 'Gagal memuat notifikasi.'
  } finally {
    loading.value = false
  }
}

onMounted(loadNotifications)

const getTypeClass = (type) => ({
  order: 'icon-order',
  promo: 'icon-promo',
  chat:  'icon-chat',
}[type] || 'icon-order')

const getDefaultIcon = (type) => ({
  order: '📦', promo: '🏷️', chat: '💬',
}[type] || '🔔')
</script>

<style scoped>
@reference "../assets/main.css";

.notif-root { @apply pb-8; padding: 1rem; }
.section-gap { @apply mb-6; }
.section-title-wrap { @apply flex items-center gap-3 flex-wrap; }
.section-accent { @apply w-1 h-7 rounded-full flex-shrink-0; }
.fashion-accent { background: linear-gradient(135deg, #C1121F, #780000); }
.page-title { @apply text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2 flex-1; font-family: 'CalSans', serif; letter-spacing: -0.01em; }
.unread-badge { @apply text-xs font-bold text-white rounded-md px-2 py-0.5; background: linear-gradient(135deg, #C1121F, #780000); }
.mark-all-btn { @apply text-xs font-bold text-[#C1121F] px-3 py-1.5 rounded-lg bg-white; border: 2px solid #111; box-shadow: 2px 2px 0 0 #111; transition: transform 0.15s ease, box-shadow 0.15s ease; }
.mark-all-btn:hover { transform: translate(1px,1px); box-shadow: 1px 1px 0 0 #111; }

.notif-list { @apply flex flex-col gap-3; }
.notif-card { @apply relative flex items-start gap-3 sm:gap-4 rounded-2xl p-4 no-underline; border: 2px solid #111; box-shadow: 4px 4px 0 0 #111; transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease; color: inherit; }
.notif-card:hover { transform: translate(1.5px,1.5px); box-shadow: 2.5px 2.5px 0 0 #111; }
.notif-unread { background: rgba(193,18,31,0.04); }
.notif-icon-wrap { @apply w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0; border: 2px solid #111; }
.icon-order { background: rgba(193,18,31,0.1); }
.icon-promo { background: rgba(102,155,188,0.12); }
.icon-chat  { background: rgba(0,48,73,0.08); }
.notif-icon-text { @apply text-xl leading-none; }
.notif-body { @apply flex-1 min-w-0; }
.notif-top { @apply flex items-start justify-between gap-2 mb-1; }
.notif-title { @apply text-sm font-bold text-gray-900 leading-snug; }
.notif-time { @apply text-[10px] text-black/40 uppercase tracking-wide font-bold flex-shrink-0; }
.notif-msg { @apply text-xs text-black/55 leading-snug; }
.notif-dot { @apply absolute top-3 right-3 w-2.5 h-2.5 rounded-full; background: #C1121F; box-shadow: 0 0 6px rgba(193,18,31,0.5); }

.empty-state { @apply flex flex-col items-center justify-center text-center py-20; }
.empty-icon { @apply w-20 h-20 rounded-full flex items-center justify-center mb-5; background: linear-gradient(135deg, #C1121F, #780000); border: 2px solid #111; box-shadow: 4px 4px 0 0 #111; }
.empty-title { @apply text-xl font-bold text-gray-900 mb-1; font-family: 'CalSans', serif; }
.empty-sub { @apply text-sm text-black/50; }

.skeleton { @apply animate-pulse bg-black/10 rounded-xl; }
.skeleton-line { height: 14px; @apply rounded-md; }
.skeleton-line-sm { height: 12px; @apply rounded-md; }
.error-banner { @apply flex flex-col items-center gap-3 py-10 text-center; }
.error-text { @apply text-sm font-semibold text-[#C1121F]; }
.retry-btn { @apply px-5 py-2 text-sm font-bold rounded-xl text-white; background: linear-gradient(135deg, #C1121F, #780000); border: 2px solid #111; box-shadow: 3px 3px 0 0 #111; }
</style>
