<template>
  <footer class="app-footer">
    <!-- Brutalist brand accent strip -->
    <div class="accent-strip"></div>

    <div class="footer-inner">
      <!-- Brand block -->
      <div class="brand-col">
        <router-link to="/" class="inline-block">
          <img src="/logowhites.png" alt="SecondSpace" class="footer-logo" />
        </router-link>
        <p class="brand-tagline">
          Ruang kedua buat fashion &amp; sports gear preloved-mu. Beli, jual,
          dan beri kesempatan kedua ke barang berkualitas.
        </p>

        <div class="socials">
          <a href="https://www.instagram.com/bhojanaradhipa/" target="_blank" rel="noopener noreferrer" class="social-btn" aria-label="Instagram">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
          </a>
          <a href="https://www.instagram.com/bhojanaradhipa/" target="_blank" rel="noopener noreferrer" class="social-btn" aria-label="Twitter">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
            </svg>
          </a>
          <a href="https://www.instagram.com/bhojanaradhipa/" target="_blank" rel="noopener noreferrer" class="social-btn" aria-label="TikTok">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
            </svg>
          </a>
        </div>
      </div>

      <!-- Link columns -->
      <div class="link-col">
        <h4 class="col-title">Belanja</h4>
        <router-link to="/catalog" class="footer-link">Katalog</router-link>
        <router-link to="/catalog?cat=fashion" class="footer-link">Fashion</router-link>
        <router-link to="/catalog?cat=sports" class="footer-link">Sports</router-link>
        <router-link to="/profile/sell" class="footer-link">Jual Barang</router-link>
      </div>

      <div class="link-col">
        <h4 class="col-title">Akun</h4>
        <router-link to="/profile" class="footer-link">Profil</router-link>
        <router-link to="/profile/wishlist" class="footer-link">Wishlist</router-link>
        <router-link to="/profile/history" class="footer-link">Riwayat</router-link>
        <router-link to="/cart" class="footer-link">Keranjang</router-link>
      </div>

      <div class="link-col">
        <h4 class="col-title">Bantuan</h4>
        <router-link to="/profile/help" class="footer-link">Pusat Bantuan</router-link>
        <router-link to="/profile/terms" class="footer-link">Syarat &amp; Ketentuan</router-link>
        <router-link to="/profile/address" class="footer-link">Alamat</router-link>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="footer-bottom">
      <div class="footer-bottom-inner">
        <span>&copy; {{ year }} SecondSpace. Semua hak dilindungi.</span>
        <span class="made-with">Dibuat untuk preloved lovers.</span>
      </div>
    </div>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>

<style scoped>
@reference "../assets/main.css";

.app-footer {
  /* Full-bleed: the app shell (.app-wrapper) is capped at max-width 1440px and
     centered, so a width:100% footer leaves the cream body background showing on
     either side at >1440px (4K). Stretch to the full viewport width instead — the
     wrapper centers us, body has overflow-x:hidden so no horizontal scrollbar. */
  width: 100vw;
  align-self: center;
  background-color: #111111;
  color: #ffffff;
  margin-top: 3rem;
}

/* Brutalist brand accent strip: fashion red → sports blue split */
.accent-strip {
  height: 6px;
  width: 100%;
  background: linear-gradient(90deg, #c1121f 0%, #780000 50%, #003049 50%, #669bbc 100%);
}

.footer-inner {
  max-width: 64rem; /* match <main> max-w-5xl */
  margin: 0 auto;
  padding: 3rem 1.5rem 2rem;
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr 1fr;
  gap: 2.5rem;
}

@media (max-width: 900px) {
  .footer-inner {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
  .brand-col {
    grid-column: 1 / -1;
  }
}

/* ── Brand column ── */
.footer-logo {
  height: 2.25rem;
  width: auto;
}
.brand-tagline {
  margin-top: 1rem;
  font-size: 0.85rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.6);
  max-width: 22rem;
}
.socials {
  margin-top: 1.25rem;
  display: flex;
  gap: 0.75rem;
}
.social-btn {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem; /* rounded-lg — small icon button */
  color: #111;
  background: #fff;
  border: 2px solid #fff;
  box-shadow: 3px 3px 0 0 #c1121f;
  transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease, color 0.15s ease;
}
.social-btn:hover {
  transform: translate(1.5px, 1.5px);
  box-shadow: 1.5px 1.5px 0 0 #c1121f;
  background: #c1121f;
  color: #fff;
  border-color: #c1121f;
}

/* ── Link columns ── */
.link-col {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.col-title {
  font-family: 'CalSans', serif;
  font-size: 1.05rem;
  margin-bottom: 0.25rem;
  color: #fff;
}
.footer-link {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.65);
  text-decoration: none;
  width: fit-content;
  transition: color 0.15s ease, transform 0.15s ease;
}
.footer-link:hover {
  color: #fff;
  transform: translateX(3px);
}

/* ── Bottom bar ── */
.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}
.footer-bottom-inner {
  max-width: 64rem;
  margin: 0 auto;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.5);
}
.made-with {
  white-space: nowrap;
}

@media (max-width: 520px) {
  .footer-bottom-inner {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
