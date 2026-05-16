<template>
  <div class="addr-root">

    <AuthGate v-if="!isLoggedIn" title="Login untuk Alamat" message="Masuk dulu untuk kelola alamat pengiriman kamu." />

    <template v-else>
      <section class="section-gap">
        <div class="header-wrap">
          <button @click="goBack" class="back-btn" aria-label="Back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <div class="section-accent fashion-accent"></div>
          <h1 class="page-title">Alamat Saya</h1>
          <button @click="openForm()" class="add-btn">+ Tambah</button>
        </div>
      </section>

      <!-- Loading -->
      <div v-if="loading" class="addr-list">
        <div v-for="i in 2" :key="i" class="addr-card glass-panel">
          <div class="flex flex-col gap-2 flex-1">
            <div class="skeleton skeleton-line w-1/3"></div>
            <div class="skeleton skeleton-line-sm w-3/4"></div>
            <div class="skeleton skeleton-line-sm w-full mt-1"></div>
          </div>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="error-banner">
        <p class="error-text">{{ error }}</p>
        <button @click="fetchAddresses" class="retry-btn">Coba Lagi</button>
      </div>

      <!-- Empty -->
      <div v-else-if="addresses.length === 0" class="empty-state reveal">
        <p class="empty-title">Belum Ada Alamat</p>
        <p class="empty-sub">Tambah alamat pengiriman pertama kamu.</p>
        <button @click="openForm()" class="empty-cta">+ Tambah Alamat</button>
      </div>

      <!-- Cards -->
      <div v-else class="addr-list">
        <div v-for="(addr, idx) in addresses" :key="addr.id" class="addr-card glass-panel reveal" :class="`reveal-delay-${(idx % 3) + 1}`">
          <div class="card-main">
            <div class="label-row">
              <span class="addr-label">{{ addr.label }}</span>
              <span v-if="addr.is_default || addr.isDefault" class="default-badge">Utama</span>
            </div>
            <p class="addr-name">{{ addr.recipient }} · {{ addr.phone }}</p>
            <p class="addr-text">{{ addr.full_address || addr.fullAddress }}</p>
          </div>
          <div class="card-actions">
            <button @click="openForm(addr)" class="action-btn edit-btn">Edit</button>
            <button @click="deleteAddress(addr.id)" class="action-btn delete-btn">Hapus</button>
            <button v-if="!(addr.is_default || addr.isDefault)" @click="setDefault(addr.id)" class="action-btn default-btn">Jadikan Utama</button>
          </div>
        </div>
      </div>

      <!-- Form modal -->
      <transition name="modal-fade">
        <div v-if="showForm" class="modal-backdrop" @click.self="closeForm">
          <div class="modal-card reveal">
            <div class="modal-header">
              <h2 class="modal-title">{{ editingAddr ? 'Edit Alamat' : 'Tambah Alamat' }}</h2>
              <button @click="closeForm" class="modal-close">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <form @submit.prevent="saveAddress" class="modal-form">
              <div class="field"><label class="field-label">Label (cth. Rumah, Kantor)</label><input v-model="form.label" required class="field-input" /></div>
              <div class="field"><label class="field-label">Nama Penerima</label><input v-model="form.recipient" required class="field-input" /></div>
              <div class="field"><label class="field-label">No. Telepon</label><input v-model="form.phone" type="tel" required class="field-input" /></div>
              <div class="field"><label class="field-label">Alamat Lengkap</label><textarea v-model="form.full_address" required rows="3" class="field-input field-textarea"></textarea></div>
              <label class="default-check">
                <input type="checkbox" v-model="form.is_default" class="cb" />
                <span>Jadikan alamat utama</span>
              </label>
              <button type="submit" class="save-btn" :disabled="saving">{{ saving ? 'Menyimpan...' : 'Simpan Alamat' }}</button>
            </form>
          </div>
        </div>
      </transition>
    </template>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { useAuth } from '@/composables/useAuth'
import AuthGate from '@/components/AuthGate.vue'
import api from '@/services/api'

useScrollReveal()
const router = useRouter()
const { isLoggedIn } = useAuth()
const goBack = () => { if (window.history.state?.back) router.back(); else router.push('/profile') }

const addresses = ref([])
const loading   = ref(false)
const error     = ref(null)

async function fetchAddresses() {
  loading.value = true
  error.value = null
  try {
    const data = await api.get('/addresses')
    addresses.value = Array.isArray(data) ? data : []
  } catch (e) {
    error.value = e.message || 'Gagal memuat alamat.'
  } finally {
    loading.value = false
  }
}

onMounted(() => { if (isLoggedIn.value) fetchAddresses() })

// Form
const showForm    = ref(false)
const editingAddr = ref(null)
const saving      = ref(false)
const form = reactive({ label: '', recipient: '', phone: '', full_address: '', is_default: false })

function openForm(addr = null) {
  editingAddr.value = addr
  if (addr) {
    form.label        = addr.label || ''
    form.recipient    = addr.recipient || ''
    form.phone        = addr.phone || ''
    form.full_address = addr.full_address || addr.fullAddress || ''
    form.is_default   = !!(addr.is_default || addr.isDefault)
  } else {
    Object.assign(form, { label: '', recipient: '', phone: '', full_address: '', is_default: false })
  }
  showForm.value = true
}

function closeForm() { showForm.value = false; editingAddr.value = null }

async function saveAddress() {
  saving.value = true
  try {
    const payload = { label: form.label, recipient: form.recipient, phone: form.phone, full_address: form.full_address, is_default: form.is_default }
    if (editingAddr.value) {
      const updated = await api.put(`/addresses/${editingAddr.value.id}`, payload)
      const idx = addresses.value.findIndex(a => a.id === editingAddr.value.id)
      if (idx !== -1) addresses.value[idx] = updated
    } else {
      const created = await api.post('/addresses', payload)
      addresses.value.push(created)
    }
    closeForm()
  } catch (e) {
    alert('Gagal menyimpan alamat: ' + (e.message || ''))
  } finally {
    saving.value = false
  }
}

async function deleteAddress(id) {
  if (!confirm('Hapus alamat ini?')) return
  try {
    await api.delete(`/addresses/${id}`)
    addresses.value = addresses.value.filter(a => a.id !== id)
  } catch (e) {
    alert('Gagal menghapus alamat: ' + (e.message || ''))
  }
}

async function setDefault(id) {
  try {
    await api.patch(`/addresses/${id}`, { is_default: true })
    addresses.value.forEach(a => { a.is_default = a.id === id })
  } catch (e) {
    alert('Gagal mengubah alamat utama: ' + (e.message || ''))
  }
}
</script>

<style scoped>
@reference "../assets/main.css";

.addr-root { @apply pb-8; padding: 0.75rem; }
@media (min-width: 640px) { .addr-root { padding: 1rem; } }
.section-gap { @apply mb-5 sm:mb-6; }
.header-wrap { @apply flex items-center gap-2 sm:gap-3 flex-wrap; }
.back-btn { @apply w-9 h-9 rounded-lg flex items-center justify-center text-black/70 bg-white transition-all duration-200 active:scale-90; border: 2px solid #111; box-shadow: 2px 2px 0 0 #111; }
.back-btn:hover { color: #C1121F; transform: translate(1px,1px); box-shadow: 1px 1px 0 0 #111; }
.section-accent { @apply w-1 h-7 rounded-full flex-shrink-0; }
.fashion-accent { background: linear-gradient(135deg, #C1121F, #780000); }
.page-title { @apply text-xl sm:text-2xl font-bold tracking-tight text-gray-900 flex-1; font-family: 'CalSans', serif; }
.add-btn { @apply px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold rounded-xl text-white whitespace-nowrap; background: linear-gradient(135deg, #C1121F, #780000); border: 2px solid #111; box-shadow: 2px 2px 0 0 #111; transition: transform 0.15s ease, box-shadow 0.15s ease; }
@media (min-width: 640px) { .add-btn { box-shadow: 3px 3px 0 0 #111; } }
.add-btn:hover { transform: translate(1.5px,1.5px); box-shadow: 1.5px 1.5px 0 0 #111; }

.addr-list { @apply flex flex-col gap-3 sm:gap-4; }
.addr-card { @apply rounded-2xl p-3.5 sm:p-5; border: 2px solid #111; box-shadow: 3px 3px 0 0 #111; }
@media (min-width: 640px) { .addr-card { box-shadow: 4px 4px 0 0 #111; } }
.card-main { @apply mb-3; }
.label-row { @apply flex items-center gap-2 mb-1; }
.addr-label { @apply text-sm font-bold text-gray-900; font-family: 'CalSans', serif; }
.default-badge { @apply text-[9px] font-bold uppercase tracking-wider text-white px-2 py-0.5 rounded-md; background: linear-gradient(135deg, #C1121F, #780000); }
.addr-name { @apply text-[13px] font-semibold text-black/80 mb-1; }
.addr-text { @apply text-xs text-black/55 leading-relaxed; }
.card-actions { @apply flex flex-wrap gap-2 mt-3 pt-3 border-t border-black/5; }
.action-btn { @apply px-3 py-1.5 text-[11px] font-bold rounded-lg; border: 2px solid #111; transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease, color 0.15s ease; }
.edit-btn    { @apply bg-white text-black/70; box-shadow: 2px 2px 0 0 #111; }
.edit-btn:hover { background: #FDF0D5; transform: translate(1px,1px); box-shadow: 1px 1px 0 0 #111; }
.delete-btn  { @apply bg-white text-[#C1121F]; box-shadow: 2px 2px 0 0 #111; }
.delete-btn:hover { background: #C1121F; color: white; transform: translate(1px,1px); box-shadow: 1px 1px 0 0 #111; }
.default-btn { @apply text-[#669BBC]; background: rgba(102,155,188,0.08); box-shadow: 2px 2px 0 0 #111; }
.default-btn:hover { background: #003049; color: white; transform: translate(1px,1px); box-shadow: 1px 1px 0 0 #111; }

.empty-state { @apply flex flex-col items-center text-center gap-3 py-16; }
.empty-title { @apply text-lg font-bold text-gray-900; font-family: 'CalSans', serif; }
.empty-sub { @apply text-sm text-black/50; }
.empty-cta { @apply px-6 py-3 text-sm font-bold rounded-xl text-white; background: linear-gradient(135deg, #C1121F, #780000); border: 2px solid #111; box-shadow: 4px 4px 0 0 #111; transition: transform 0.15s ease, box-shadow 0.15s ease; }
.empty-cta:hover { transform: translate(2px,2px); box-shadow: 2px 2px 0 0 #111; }

/* Modal */
.modal-backdrop { @apply fixed inset-0 flex items-end sm:items-center justify-center z-50 p-3 sm:p-6; background: rgba(0,0,0,0.4); backdrop-filter: blur(4px); }
.modal-card { @apply w-full max-w-md rounded-3xl p-4 sm:p-7 bg-white; border: 2px solid #111; box-shadow: 5px 5px 0 0 #C1121F; }
@media (min-width: 640px) { .modal-card { box-shadow: 8px 8px 0 0 #C1121F; } }
.modal-header { @apply flex items-center justify-between mb-5; }
.modal-title { @apply text-lg sm:text-xl font-bold text-gray-900; font-family: 'CalSans', serif; }
.modal-close { @apply w-9 h-9 rounded-lg flex items-center justify-center text-black/60 hover:bg-black/5 hover:text-[#C1121F] transition-colors duration-200; }
.modal-form { @apply flex flex-col gap-4; }
.field { @apply flex flex-col; }
.field-label { @apply text-[11px] font-bold uppercase tracking-widest text-black/70 mb-2; }
.field-input { @apply w-full h-12 px-4 rounded-xl text-sm border-2 border-black/15 outline-none transition-all duration-200; background-color: rgba(255,255,255,0.65); }
.field-input:focus { border-color: #C1121F; box-shadow: 0 0 0 3px rgba(193,18,31,0.18); }
.field-textarea { @apply h-auto py-3 leading-snug; resize: vertical; min-height: 90px; }
.default-check { @apply flex items-center gap-2 cursor-pointer text-sm font-semibold text-black/70; }
.cb { @apply w-4 h-4 rounded cursor-pointer; accent-color: #C1121F; }
.save-btn { @apply w-full py-3.5 text-sm font-bold text-white rounded-xl; background: linear-gradient(135deg, #C1121F, #780000); border: 2px solid #111; box-shadow: 4px 4px 0 0 #111; transition: transform 0.15s ease, box-shadow 0.15s ease; }
.save-btn:hover:not(:disabled) { transform: translate(2px,2px); box-shadow: 2px 2px 0 0 #111; }
.save-btn:disabled { @apply opacity-60 cursor-not-allowed; }

.modal-fade-enter-active,.modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter-from,.modal-fade-leave-to { opacity: 0; }

.skeleton { @apply animate-pulse bg-black/10 rounded-xl; }
.skeleton-line { height: 14px; @apply rounded-md; }
.skeleton-line-sm { height: 12px; @apply rounded-md; }
.error-banner { @apply flex flex-col items-center gap-3 py-10 text-center; }
.error-text { @apply text-sm font-semibold text-[#C1121F]; }
.retry-btn { @apply px-5 py-2 text-sm font-bold rounded-xl text-white; background: linear-gradient(135deg, #C1121F, #780000); border: 2px solid #111; box-shadow: 3px 3px 0 0 #111; }
</style>
