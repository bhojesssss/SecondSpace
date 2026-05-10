<template>
  <div class="notif-root">

    <!-- ═══════════════════════════════════════ AUTH GATE ═══════════════════════════════════════ -->
    <AuthGate
      v-if="!isLoggedIn"
      title="Login untuk Notifikasi"
      message="Masuk dulu untuk lihat update pesanan, chat, dan promo."
    />

    <template v-else>
    <!-- ═══════════════════════════════════════ HEADER ═══════════════════════════════════════ -->
    <section class="section-gap">
      <div class="header-wrap">
        <div class="section-title-wrap">
          <div class="section-accent fashion-accent"></div>
          <h1 class="page-title">
            Notifikasi
            <span v-if="unreadCount > 0" class="unread-badge">{{ unreadCount }}</span>
          </h1>
        </div>
        <button
          v-if="unreadCount > 0"
          @click="markAllRead"
          class="mark-all-btn"
        >
          Tandai semua dibaca
        </button>
      </div>
    </section>

    <!-- ═══════════════════════════════════════ EMPTY STATE ═══════════════════════════════════════ -->
    <div v-if="notifications.length === 0" class="empty-state reveal">
      <div class="empty-icon">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      </div>
      <p class="empty-title">Belum Ada Notifikasi</p>
      <p class="empty-sub">Update pesanan dan promo akan muncul di sini.</p>
    </div>

    <!-- ═══════════════════════════════════════ NOTIFICATIONS ═══════════════════════════════════════ -->
    <div v-else class="notif-list">
      <router-link
        v-for="(notif, idx) in notifications"
        :key="notif.id"
        :to="`/notifications/${notif.id}`"
        class="notif-item"
        :class="[notif.read ? 'notif-read' : 'notif-unread glass-panel', `reveal reveal-delay-${(idx % 4) + 1}`]"
      >
        <div class="notif-icon" :class="iconClass(notif.type)">
          <span>{{ notif.icon }}</span>
        </div>
        <div class="notif-body">
          <p class="notif-title" :class="notif.read ? 'opacity-60' : ''">{{ notif.title }}</p>
          <p class="notif-message">{{ notif.message }}</p>
          <p class="notif-time">{{ notif.time }}</p>
        </div>
        <div v-if="!notif.read" class="notif-dot"></div>
      </router-link>
    </div>
    </template>

  </div>
</template>

<script setup>
import { useScrollReveal } from '@/composables/useScrollReveal'
import { useAuth } from '@/composables/useAuth'
import { useNotifications } from '@/composables/useNotifications'
import AuthGate from '@/components/AuthGate.vue'
useScrollReveal()

const { isLoggedIn } = useAuth()
const { notifications, unreadCount, markAllRead } = useNotifications()

const iconClass = (type) => {
  if (type === 'promo') return 'icon-sports'
  if (type === 'chat') return 'icon-dark'
  return 'icon-fashion'
}
</script>

<style scoped>
@reference "../assets/main.css";

/* ── Root ───────────────────────────────────────────────────────────────────── */
.notif-root {
  @apply pb-8;
  padding: 1rem;
}
.section-gap {
  @apply mb-6;
}

/* ── Header ─────────────────────────────────────────────────────────────────── */
.header-wrap {
  @apply flex items-center justify-between gap-3 flex-wrap;
}
.section-title-wrap {
  @apply flex items-center gap-3;
}
.section-accent {
  @apply w-1 h-7 rounded-full flex-shrink-0;
}
.fashion-accent {
  background: linear-gradient(135deg, #C1121F, #780000);
}
.page-title {
  @apply text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2;
  font-family: 'CalSans', serif;
  letter-spacing: -0.01em;
}
.unread-badge {
  @apply text-xs font-bold text-white rounded-md px-2 py-0.5 min-w-[22px] text-center;
  background: linear-gradient(135deg, #C1121F, #780000);
  font-family: 'Helvetica', sans-serif;
  box-shadow: 0 2px 8px -2px rgba(193, 18, 31, 0.5);
}
.mark-all-btn {
  @apply text-[11px] sm:text-xs font-bold text-[#C1121F] px-3 sm:px-4 py-2 rounded-xl
         bg-white whitespace-nowrap;
  border: 2px solid #111;
  box-shadow: 3px 3px 0 0 #111;
  transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease, color 0.15s ease;
}
.mark-all-btn:hover {
  background: #C1121F;
  color: white;
  transform: translate(1.5px, 1.5px);
  box-shadow: 1.5px 1.5px 0 0 #111;
}
.mark-all-btn:active {
  transform: translate(3px, 3px);
  box-shadow: 0 0 0 0 #111;
}

/* ── Empty state ────────────────────────────────────────────────────────────── */
.empty-state {
  @apply flex flex-col items-center justify-center text-center py-20;
}
.empty-icon {
  @apply w-20 h-20 rounded-full flex items-center justify-center mb-5;
  background: linear-gradient(135deg, #C1121F, #780000);
  border: 2px solid #111;
  box-shadow: 4px 4px 0 0 #111;
}
.empty-title {
  @apply text-xl font-bold text-gray-900 mb-1;
  font-family: 'CalSans', serif;
}
.empty-sub {
  @apply text-sm text-black/50;
}

/* ── List (brutalist) ──────────────────────────────────────────────────────── */
.notif-list {
  @apply flex flex-col gap-4;
}
.notif-item {
  @apply flex gap-3 sm:gap-4 p-3 sm:p-5 rounded-2xl cursor-pointer no-underline text-inherit;
  border: 2px solid #111;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.notif-item:hover {
  transform: translate(1.5px, 1.5px);
}
.notif-unread {
  background: rgba(255, 255, 255, 0.85);
  box-shadow: 4px 4px 0 0 #C1121F;
}
.notif-unread:hover {
  box-shadow: 2.5px 2.5px 0 0 #C1121F;
}
.notif-read {
  background: rgba(255, 255, 255, 0.5);
  box-shadow: 3px 3px 0 0 #111;
}
.notif-read:hover {
  box-shadow: 1.5px 1.5px 0 0 #111;
}

/* ── Icon avatars ──────────────────────────────────────────────────────────── */
.notif-icon {
  @apply w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center
         text-xl;
  border: 2px solid #111;
}
.icon-fashion {
  background: linear-gradient(135deg, #C1121F, #780000);
}
.icon-sports {
  background: linear-gradient(135deg, #669BBC, #003049);
}
.icon-dark {
  background: linear-gradient(135deg, #111111, #333333);
}

/* ── Body ──────────────────────────────────────────────────────────────────── */
.notif-body {
  @apply flex-1 min-w-0 mt-0.5;
}
.notif-title {
  @apply text-sm font-bold text-gray-900 leading-snug;
}
.notif-message {
  @apply text-[13px] text-black/60 mt-1 leading-snug;
}
.notif-time {
  @apply text-[10px] text-black/40 mt-2 tracking-wider uppercase font-bold;
}
.notif-dot {
  @apply w-2.5 h-2.5 rounded-full flex-shrink-0 mt-2;
  background: linear-gradient(135deg, #C1121F, #780000);
  box-shadow: 0 2px 6px -1px rgba(193, 18, 31, 0.5);
}
</style>
