import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/catalog',
      name: 'catalog',
      component: () => import('@/views/CatalogView.vue'),
    },
    {
      path: '/product/:id',
      name: 'product-detail',
      component: () => import('@/views/ProductDetailView.vue'),
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('@/views/CartView.vue'),
    },
    {
      path: '/transaction',
      name: 'transaction',
      component: () => import('@/views/TransactionView.vue'),
    },
    {
      path: '/chat',
      name: 'chat',
      component: () => import('@/views/ChatView.vue'),
    },
    {
      path: '/notifications',
      name: 'notifications',
      component: () => import('@/views/NotificationView.vue'),
    },
    {
      path: '/notifications/:id',
      name: 'notification-detail',
      component: () => import('@/views/NotificationDetailView.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
    },
    {
      path: '/profile/history',
      name: 'profile-history',
      component: () => import('@/views/PurchaseHistoryView.vue'),
    },
    {
      path: '/profile/sell',
      name: 'profile-sell',
      component: () => import('@/views/SellItemView.vue'),
    },
    {
      path: '/profile/edit',
      name: 'profile-edit',
      component: () => import('@/views/EditProfileView.vue'),
    },
    {
      path: '/profile/address',
      name: 'profile-address',
      component: () => import('@/views/AddressView.vue'),
    },
    {
      path: '/profile/help',
      name: 'profile-help',
      component: () => import('@/views/HelpView.vue'),
    },
    {
      path: '/profile/terms',
      name: 'profile-terms',
      component: () => import('@/views/TermsView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0, behavior: 'smooth' }
  }
})

export default router