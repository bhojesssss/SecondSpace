<template>
  <div class="addr-root">

    <!-- ═══════════════════════════════════════ AUTH GATE ═══════════════════════════════════════ -->
    <AuthGate
      v-if="!isLoggedIn"
      title="Login untuk Alamat"
      message="Masuk dulu untuk kelola alamat pengiriman kamu."
    />

    <template v-else>
    <!-- ═══════════════════════════════════════ HEADER ═══════════════════════════════════════ -->
    <section class="section-gap">
      <div class="header-wrap">
        <button @click="goBack" class="back-btn" aria-label="Back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
        <div class="section-accent fashion-accent"></div>
        <h1 class="page-title">Alamat Saya</h1>
      </div>
    </section>

    <!-- ═══════════════════════════════════════ EMPTY STATE ═══════════════════════════════════════ -->
    <div v-if="addresses.length === 0 && !showForm" class="empty-state reveal">
      <div class="empty-icon">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      </div>
      <p class="empty-title">Belum Ada Alamat</p>
      <p class="empty-sub">Tambahkan alamat untuk kemudahan checkout.</p>
    </div>

    <!-- ═══════════════════════════════════════ ADDRESS LIST ═══════════════════════════════════════ -->
    <div v-else-if="!showForm" class="addr-list">
      <div
        v-for="(addr, idx) in addresses"
        :key="addr.id"
        class="addr-card glass-panel reveal"
        :class="`reveal-delay-${(idx % 4) + 1}`"
      >
        <div class="addr-head">
          <div class="addr-label-wrap">
            <span class="addr-label">{{ addr.label }}</span>
            <span v-if="addr.isDefault" class="default-badge">Utama</span>
          </div>
          <div class="addr-actions">
            <button @click="editAddress(addr)" class="icon-btn" aria-label="Edit">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 20h9"/>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
            </button>
            <button @click="deleteAddress(addr.id)" class="icon-btn icon-danger" aria-label="Delete">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6"/><path d="M14 11v6"/>
              </svg>
            </button>
          </div>
        </div>

        <p class="addr-name">{{ addr.recipient }} · {{ addr.phone }}</p>
        <p class="addr-text">{{ addr.fullAddress }}</p>

        <button v-if="!addr.isDefault" @click="setDefault(addr.id)" class="set-default-btn">
          Jadikan Utama
        </button>
      </div>
    </div>

    <!-- ═══════════════════════════════════════ ADD/EDIT FORM ═══════════════════════════════════════ -->
    <form v-else @submit.prevent="saveAddress" class="form-card glass-panel reveal">
      <p class="form-title">{{ editingId ? 'Edit Alamat' : 'Tambah Alamat' }}</p>

      <div class="field">
        <label class="field-label">Label</label>
        <div class="seg-row">
          <button
            v-for="l in labelOptions"
            :key="l"
            type="button"
            @click="form.label = l"
            class="seg-btn"
            :class="form.label === l ? 'seg-active' : 'seg-inactive'"
          >{{ l }}</button>
        </div>
      </div>

      <div class="field">
        <label class="field-label">Nama Penerima</label>
        <input v-model="form.recipient" type="text" required class="field-input" />
      </div>

      <div class="field">
        <label class="field-label">No. Telepon</label>
        <input v-model="form.phone" type="tel" required placeholder="08xxxxxxxxxx" class="field-input" />
      </div>

      <div class="field">
        <label class="field-label">Alamat Lengkap</label>
        <textarea
          v-model="form.fullAddress"
          rows="3"
          required
          placeholder="Jalan, RT/RW, Kelurahan, Kecamatan, Kota, Provinsi, Kode Pos"
          class="field-input field-textarea"
        ></textarea>
      </div>

      <label class="default-toggle">
        <input v-model="form.isDefault" type="checkbox" class="toggle-cb" />
        <span>Jadikan alamat utama</span>
      </label>

      <div class="form-actions">
        <button type="submit" class="save-btn">Simpan</button>
        <button type="button" @click="cancelForm" class="cancel-btn">Batal</button>
      </div>
    </form>

    <!-- ═══════════════════════════════════════ ADD CTA (FAB-style) ═══════════════════════════════════════ -->
    <button v-if="!showForm" @click="openForm" class="add-btn">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"/>
        <line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
      <span>Tambah Alamat Baru</span>
    </button>
    </template>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { useAuth } from '@/composables/useAuth'
import AuthGate from '@/components/AuthGate.vue'
useScrollReveal()

const router = useRouter()
const { isLoggedIn } = useAuth()

const goBack = () => {
  if (window.history.state?.back) router.back()
  else router.push('/profile')
}

const labelOptions = ['Rumah', 'Kantor', 'Kos', 'Lainnya']

const addresses = ref([
  {
    id: 1,
    label: 'Rumah',
    recipient: 'Bhojana Adhipa',
    phone: '081234567890',
    fullAddress: 'Jl. Kartini No. 12, RT 03/RW 05, Kel. Pelita, Kec. Tanjung Karang Pusat, Bandar Lampung, Lampung 35116',
    isDefault: true,
  },
  {
    id: 2,
    label: 'Kos',
    recipient: 'Bhojana Adhipa',
    phone: '081234567890',
    fullAddress: 'Jl. ZA Pagar Alam Gg. Mawar No. 8, Rajabasa, Bandar Lampung, Lampung 35142',
    isDefault: false,
  },
])

const showForm = ref(false)
const editingId = ref(null)

const blankForm = () => ({
  label: 'Rumah',
  recipient: '',
  phone: '',
  fullAddress: '',
  isDefault: false,
})

const form = reactive(blankForm())

const openForm = () => {
  Object.assign(form, blankForm())
  editingId.value = null
  showForm.value = true
}

const editAddress = (addr) => {
  Object.assign(form, addr)
  editingId.value = addr.id
  showForm.value = true
}

const cancelForm = () => {
  showForm.value = false
  editingId.value = null
}

const saveAddress = () => {
  if (form.isDefault) {
    addresses.value.forEach(a => { a.isDefault = false })
  }
  if (editingId.value) {
    const idx = addresses.value.findIndex(a => a.id === editingId.value)
    if (idx !== -1) addresses.value[idx] = { ...addresses.value[idx], ...form }
  } else {
    addresses.value.push({ ...form, id: Date.now() })
  }
  cancelForm()
}

const deleteAddress = (id) => {
  if (confirm('Hapus alamat ini?')) {
    addresses.value = addresses.value.filter(a => a.id !== id)
  }
}

const setDefault = (id) => {
  addresses.value.forEach(a => { a.isDefault = a.id === id })
}
</script>

<style scoped>
@reference "../assets/main.css";

/* ── Root ───────────────────────────────────────────────────────────────────── */
.addr-root {
  @apply pb-8;
  padding: 1rem;
}
.section-gap {
  @apply mb-6;
}

/* ── Header ─────────────────────────────────────────────────────────────────── */
.header-wrap {
  @apply flex items-center gap-3;
}
.back-btn {
  @apply w-9 h-9 rounded-lg flex items-center justify-center
         text-black/70 bg-white
         transition-all duration-200 active:scale-90;
  border: 2px solid #111;
  box-shadow: 2px 2px 0 0 #111;
}
.back-btn:hover {
  color: #C1121F;
  transform: translate(1px, 1px);
  box-shadow: 1px 1px 0 0 #111;
}
.section-accent {
  @apply w-1 h-7 rounded-full flex-shrink-0;
}
.fashion-accent {
  background: linear-gradient(135deg, #C1121F, #780000);
}
.page-title {
  @apply text-2xl font-bold tracking-tight text-gray-900;
  font-family: 'CalSans', serif;
}

/* ── Empty state ────────────────────────────────────────────────────────────── */
.empty-state {
  @apply flex flex-col items-center justify-center text-center py-16;
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

/* ── List ──────────────────────────────────────────────────────────────────── */
.addr-list {
  @apply flex flex-col gap-4 mb-4;
}
.addr-card {
  @apply rounded-2xl p-4 sm:p-5;
  border: 2px solid #111;
  box-shadow: 4px 4px 0 0 #111;
}

.addr-head {
  @apply flex items-start justify-between gap-3 mb-3;
}
.addr-label-wrap {
  @apply flex items-center gap-2;
}
.addr-label {
  @apply text-sm font-bold text-gray-900;
  font-family: 'CalSans', serif;
}
.default-badge {
  @apply text-[9px] font-bold uppercase tracking-wider text-white px-2 py-0.5 rounded-md;
  background: linear-gradient(135deg, #C1121F, #780000);
}
.addr-actions {
  @apply flex gap-1.5;
}
.icon-btn {
  @apply w-8 h-8 rounded-lg flex items-center justify-center bg-white text-black/60
         transition-all duration-150;
  border: 2px solid #111;
}
.icon-btn:hover {
  color: #C1121F;
  transform: translate(1px, 1px);
}
.icon-danger:hover {
  background: #C1121F;
  color: white;
}

.addr-name {
  @apply text-[13px] font-semibold text-black/80 mb-1;
}
.addr-text {
  @apply text-xs text-black/55 leading-relaxed;
}
.set-default-btn {
  @apply mt-3 text-[11px] font-bold text-[#C1121F] px-3 py-1.5 rounded-md bg-white;
  border: 1.5px solid #111;
  transition: all 0.15s ease;
}
.set-default-btn:hover {
  background: #C1121F;
  color: white;
}

/* ── Add CTA ───────────────────────────────────────────────────────────────── */
.add-btn {
  @apply w-full flex items-center justify-center gap-2 py-3.5 mt-2
         text-white text-sm font-bold rounded-xl
         transition-all duration-150;
  background: linear-gradient(135deg, #C1121F, #780000);
  border: 2px solid #111;
  box-shadow: 4px 4px 0 0 #111;
}
.add-btn:hover {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 0 #111;
}
.add-btn:active {
  transform: translate(4px, 4px);
  box-shadow: 0 0 0 0 #111;
}

/* ── Form card ─────────────────────────────────────────────────────────────── */
.form-card {
  @apply rounded-2xl p-4 sm:p-6;
  border: 2px solid #111;
  box-shadow: 4px 4px 0 0 #111;
}
.form-title {
  @apply text-lg font-bold mb-4 text-gray-900;
  font-family: 'CalSans', serif;
}
.field {
  @apply flex flex-col mb-4;
}
.field-label {
  @apply text-[11px] font-bold uppercase tracking-widest text-black/70 mb-2;
}
.field-input {
  @apply w-full h-12 px-4 rounded-xl text-sm
         border-2 border-black/15 outline-none
         transition-all duration-200;
  background-color: rgba(255, 255, 255, 0.65);
}
.field-input:focus {
  border-color: #C1121F;
  box-shadow: 0 0 0 3px rgba(193, 18, 31, 0.18);
}
.field-input::placeholder {
  @apply text-black/30;
}
.field-textarea {
  @apply h-auto py-3 leading-snug;
  resize: vertical;
  min-height: 90px;
}

.seg-row {
  @apply flex flex-wrap gap-2;
}
.seg-btn {
  @apply px-3.5 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-150;
  border: 2px solid #111;
}
.seg-active {
  @apply text-white;
  background: linear-gradient(135deg, #C1121F, #780000);
  box-shadow: 2px 2px 0 0 #111;
}
.seg-inactive {
  @apply bg-white text-black/70;
}
.seg-inactive:hover {
  background: #FDF0D5;
}

.default-toggle {
  @apply flex items-center gap-2 cursor-pointer text-xs text-black/70 font-semibold mb-4 select-none;
}
.toggle-cb {
  @apply w-4 h-4 rounded border-2 border-black/30 cursor-pointer;
  accent-color: #C1121F;
}

.form-actions {
  @apply flex gap-2;
}
.save-btn {
  @apply flex-1 py-3 text-white text-sm font-bold rounded-xl
         transition-all duration-150;
  background: linear-gradient(135deg, #C1121F, #780000);
  border: 2px solid #111;
  box-shadow: 3px 3px 0 0 #111;
}
.save-btn:hover {
  transform: translate(1.5px, 1.5px);
  box-shadow: 1.5px 1.5px 0 0 #111;
}
.cancel-btn {
  @apply flex-1 py-3 bg-white text-black/70 text-sm font-bold rounded-xl
         transition-all duration-150;
  border: 2px solid #111;
  box-shadow: 3px 3px 0 0 #111;
}
.cancel-btn:hover {
  transform: translate(1.5px, 1.5px);
  box-shadow: 1.5px 1.5px 0 0 #111;
}
</style>
