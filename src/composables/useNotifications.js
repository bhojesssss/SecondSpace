import { ref, computed } from 'vue'

const notifications = ref([
  {
    id: 1,
    type: 'order',
    icon: '📦',
    title: 'Pesanan Dikonfirmasi',
    message: 'Insurgent Graphic Tee sudah dikonfirmasi penjual',
    detail: 'Pesanan kamu dengan ID #ORD2401 telah dikonfirmasi oleh SecondSeller. Barang sedang dipersiapkan dan akan segera dikirimkan dalam 1-2 hari kerja. Kamu akan mendapat notifikasi update lokasi paket setelah dikirim.',
    time: '5 menit lalu',
    fullDate: '1 Mei 2026 · 10:25 WIB',
    read: false,
    link: '/profile/history',
    linkLabel: 'Lihat Pesanan',
  },
  {
    id: 2,
    type: 'promo',
    icon: '🏷️',
    title: 'Flash Sale Fashion!',
    message: 'Diskon hingga 50% untuk koleksi fashion hari ini',
    detail: 'Jangan lewatkan promo Flash Sale Fashion hari ini! Diskon hingga 50% untuk semua koleksi t-shirt, hoodie, dan jaket preloved pilihan. Promo berlaku sampai pukul 23:59 hari ini saja. Buruan checkout sebelum kehabisan!',
    time: '1 jam lalu',
    fullDate: '1 Mei 2026 · 09:30 WIB',
    read: false,
    link: '/catalog',
    linkLabel: 'Lihat Katalog',
  },
  {
    id: 3,
    type: 'chat',
    icon: '💬',
    title: 'Pesan Baru',
    message: 'SecondSeller: Oke kak, barang sudah disiapkan',
    detail: 'Kamu mendapat pesan baru dari SecondSeller terkait pesanan Insurgent Graphic Tee. Buka chat untuk melanjutkan percakapan dan tanya detail tambahan tentang barang.',
    time: '2 jam lalu',
    fullDate: '1 Mei 2026 · 08:15 WIB',
    read: false,
    link: '/chat',
    linkLabel: 'Buka Chat',
  },
  {
    id: 4,
    type: 'promo',
    icon: '⚽',
    title: 'Sports Week',
    message: 'Koleksi olahraga terbaru sudah hadir!',
    detail: 'Koleksi gear olahraga terbaru sudah hadir di SecondSpace. Mulai dari running shoes, jersey bola, sampai gear gym preloved berkualitas. Cek sekarang sebelum kehabisan stok!',
    time: '1 hari lalu',
    fullDate: '30 Apr 2026 · 14:00 WIB',
    read: true,
    link: '/catalog?type=sports',
    linkLabel: 'Lihat Sports',
  },
  {
    id: 5,
    type: 'order',
    icon: '✅',
    title: 'Ulasan Berhasil',
    message: 'Terima kasih sudah memberikan ulasan!',
    detail: 'Terima kasih sudah memberikan ulasan untuk pesanan #ORD2354. Ulasan kamu sangat membantu pembeli lain dalam memilih barang. Kamu mendapat 50 poin SecondSpace yang bisa ditukar dengan voucher.',
    time: '2 hari lalu',
    fullDate: '29 Apr 2026 · 16:42 WIB',
    read: true,
    link: '/profile/history',
    linkLabel: 'Lihat Riwayat',
  },
])

const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

const getById = (id) => notifications.value.find(n => n.id === Number(id))

const markAsRead = (id) => {
  const n = getById(id)
  if (n) n.read = true
}

const markAllRead = () => {
  notifications.value.forEach(n => { n.read = true })
}

export function useNotifications() {
  return { notifications, unreadCount, getById, markAsRead, markAllRead }
}
