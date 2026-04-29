<template>
  <div class="home-root">

    <!-- ═══════════════════════════════════════ FASHION CAROUSEL ═══════════════════════════════════════ -->
    <section class="section-gap">
      <div
        class="carousel-wrapper relative rounded-2xl overflow-hidden carousel-h"
        @touchstart.passive="fashionSwipe.start"
        @touchend.passive="fashionSwipe.end"
      >
        <div
          class="carousel-track flex h-full transition-transform duration-600 ease-in-out"
          :style="{ transform: `translateX(-${fashionIndex * 100}%)` }"
        >
          <!-- Slide 1 -->
          <div class="carousel-slide flex-shrink-0 w-full h-full relative bg-[#780000]">
            <img
              src="@/assets/ImgBanner/banner1/fashion1.png"
              class="absolute right-0 bottom-0 h-full w-1/2 object-cover object-right"
              alt="Fashion banner"
            />
            <!-- gradient overlay: left readable, right fades to image -->
            <div class="absolute inset-0" style="background: linear-gradient(to right, #780000 42%, #78000099 62%, transparent 80%);"></div>
            <div class="absolute inset-0 flex flex-col justify-center px-7 sm:px-12 md:px-16 py-7 sm:py-9 md:py-10 z-10">
              <p class="text-[#FDF0D5]/70 text-xs font-semibold tracking-[0.2em] uppercase mb-2">Fashion · Thrift</p>
              <h2 class="text-white text-3xl sm:text-4xl md:text-5xl leading-tight mb-4" style="font-family: 'CalSans', serif;">
                Thrifting<br/>easier with us.
              </h2>
              <button
                @click="$router.push('/catalog')"
                class="cta-btn fashion-cta"
              >
                Shop Now →
              </button>
            </div>
          </div>

          <!-- Slide 2 -->
          <div class="carousel-slide flex-shrink-0 w-full h-full relative bg-[#C1121F]">
            <img
              src="@/assets/ImgBanner/banner2/fashion2.png"
              class="absolute right-0 bottom-0 h-full w-2/3 object-cover object-right"
              alt="Good Fashion banner"
            />
            <div class="absolute inset-0" style="background: linear-gradient(to right, #C1121F 38%, #C1121F99 58%, transparent 76%);"></div>
            <div class="absolute inset-0 flex flex-col justify-center px-7 sm:px-12 md:px-16 py-7 sm:py-9 md:py-10 z-10">
              <p class="text-[#FDF0D5]/70 text-xs font-semibold tracking-[0.2em] uppercase mb-2">Style · Value</p>
              <h2 class="text-white text-3xl sm:text-4xl md:text-5xl leading-tight mb-2" style="font-family: 'CalSans', serif;">
                Good Fashion
              </h2>
              <p class="text-white/75 text-base mb-4">Without Overprice.</p>
              <button
                @click="$router.push('/catalog')"
                class="cta-btn fashion-cta"
              >
                Explore Now →
              </button>
            </div>
          </div>

          <!-- Slide 3 -->
          <div class="carousel-slide flex-shrink-0 w-full h-full relative bg-[#780000]">
            <img
              src="@/assets/ImgBanner/banner3/fashion2.png"
              class="absolute right-0 bottom-0 h-full w-1/2 object-cover object-right opacity-80"
              alt="Be Yourself banner"
            />
            <div class="absolute inset-0" style="background: linear-gradient(to right, #780000 40%, #78000099 60%, transparent 78%);"></div>
            <div class="absolute inset-0 flex flex-col justify-center px-7 sm:px-12 md:px-16 py-7 sm:py-9 md:py-10 z-10">
              <p class="text-[#FDF0D5]/70 text-xs font-semibold tracking-[0.2em] uppercase mb-2">Express · Yourself</p>
              <h2 class="text-white text-3xl sm:text-4xl md:text-5xl leading-tight mb-4" style="font-family: 'CalSans', serif;">
                Be Yourself.
              </h2>
              <button
                @click="$router.push('/catalog')"
                class="cta-btn fashion-cta"
              >
                Browse Styles →
              </button>
            </div>
          </div>
        </div>

        <!-- Arrows -->
        <button @click="prevFashion" class="carousel-arrow left-3">&#8592;</button>
        <button @click="nextFashion" class="carousel-arrow right-3">&#8594;</button>

        <!-- Dots -->
        <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          <button
            v-for="(_, i) in 3"
            :key="i"
            @click="fashionIndex = i"
            class="dot-btn transition-all duration-300"
            :class="fashionIndex === i ? 'dot-active' : 'dot-inactive'"
          />
        </div>
      </div>
    </section>

    <!-- ════════════════════════════════════════ BROWSE ON FASHION ════════════════════════════════════════ -->
    <section class="section-gap reveal">
      <div class="section-title-wrap">
        <div class="section-accent fashion-accent"></div>
        <h3 class="section-title">Browse on Fashion</h3>
      </div>
      <div class="chips-track scrollbar-hide">
        <router-link
          v-for="cat in fashionCategories"
          :key="cat.label"
          :to="`/catalog?category=${cat.label.toLowerCase()}`"
          class="chip-link"
        >
          <div class="chip-icon fashion-chip">
            <img :src="cat.img" :alt="cat.label" class="chip-img" />
          </div>
          <span class="chip-label">{{ cat.label }}</span>
        </router-link>
      </div>
    </section>

    <!-- ══════════════════════════════════════ RECOMMENDED FOR YOU ══════════════════════════════════════ -->
    <section class="section-gap reveal reveal-delay-1">
      <div class="section-title-wrap">
        <div class="section-accent fashion-accent"></div>
        <h3 class="section-title">Recommended for You</h3>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <ProductCard
          v-for="(product, i) in recommendedProducts"
          :key="i"
          :product="product"
          class="reveal"
          :class="`reveal-delay-${(i % 4) + 1}`"
        />
      </div>
    </section>

    <!-- ═══════════════════════════════════════ SPORTS CAROUSEL ═══════════════════════════════════════ -->
    <section class="section-gap reveal reveal-delay-2">
      <div
        class="carousel-wrapper relative rounded-2xl overflow-hidden carousel-h"
        @touchstart.passive="sportsSwipe.start"
        @touchend.passive="sportsSwipe.end"
      >
        <div
          class="carousel-track flex h-full transition-transform duration-600 ease-in-out"
          :style="{ transform: `translateX(-${sportsIndex * 100}%)` }"
        >
          <!-- Sports Slide 1 -->
          <div class="carousel-slide flex-shrink-0 w-full h-full relative bg-[#003049]">
            <img
              src="@/assets/ImgBanner/banner4/sports1.png"
              class="absolute right-0 bottom-0 h-full w-1/2 object-cover object-right"
              alt="Sports banner"
            />
            <div class="absolute inset-0" style="background: linear-gradient(to right, #003049 42%, #00304999 62%, transparent 80%);"></div>
            <div class="absolute inset-0 flex flex-col justify-center px-7 sm:px-12 md:px-16 py-7 sm:py-9 md:py-10 z-10">
              <p class="text-[#FDF0D5]/70 text-xs font-semibold tracking-[0.2em] uppercase mb-2">Sports · Thrift</p>
              <h2 class="text-white text-3xl sm:text-4xl md:text-5xl leading-tight mb-4" style="font-family: 'CalSans', serif;">
                Play More,<br/>
                <span class="text-[#669BBC]">Pay Less.</span>
              </h2>
              <button
                @click="$router.push('/catalog?type=sports')"
                class="cta-btn sports-cta"
              >
                Shop Sports →
              </button>
            </div>
          </div>

          <!-- Sports Slide 2 -->
          <div class="carousel-slide flex-shrink-0 w-full h-full relative bg-[#669BBC]">
            <img
              src="@/assets/ImgBanner/banner5/sports2.png"
              class="absolute right-0 bottom-0 h-full w-1/2 object-cover object-right"
              alt="Sports banner 2"
            />
            <div class="absolute inset-0" style="background: linear-gradient(to right, #669BBC 40%, #669BBC99 60%, transparent 78%);"></div>
            <div class="absolute inset-0 flex flex-col justify-center px-7 sm:px-12 md:px-16 py-7 sm:py-9 md:py-10 z-10">
              <p class="text-[#FDF0D5]/70 text-xs font-semibold tracking-[0.2em] uppercase mb-2">Gear Up · Perform</p>
              <h2 class="text-white text-3xl sm:text-4xl md:text-5xl leading-tight mb-2" style="font-family: 'CalSans', serif;">
                Move Without<br/>Limits
              </h2>
              <p class="text-white/75 text-base mb-4">Premium sports gear, thrifted.</p>
              <button
                @click="$router.push('/catalog?type=sports')"
                class="cta-btn sports-dark-cta"
              >
                Explore Gear →
              </button>
            </div>
          </div>

          <!-- Sports Slide 3 -->
          <div class="carousel-slide flex-shrink-0 w-full h-full relative bg-[#003049]">
            <img
              src="@/assets/ImgBanner/banner6/sports4.png"
              class="absolute right-0 bottom-0 h-full w-1/2 object-cover object-right"
              alt="Sports banner 3"
            />
            <div class="absolute inset-0" style="background: linear-gradient(to right, #003049 42%, #00304999 62%, transparent 80%);"></div>
            <div class="absolute inset-0 flex flex-col justify-center px-7 sm:px-12 md:px-16 py-7 sm:py-9 md:py-10 z-10">
              <p class="text-[#FDF0D5]/70 text-xs font-semibold tracking-[0.2em] uppercase mb-2">Trending · Now</p>
              <h2 class="text-white text-3xl sm:text-4xl md:text-5xl leading-tight mb-2" style="font-family: 'CalSans', serif;">
                Trending Sports
              </h2>
              <p class="text-white/60 text-xs tracking-widest uppercase mb-4">Running · Padel · Basketball · Football</p>
              <button
                @click="$router.push('/catalog?type=sports')"
                class="cta-btn sports-cta"
              >
                Explore Now →
              </button>
            </div>
          </div>
        </div>

        <!-- Arrows -->
        <button @click="prevSports" class="carousel-arrow left-3">&#8592;</button>
        <button @click="nextSports" class="carousel-arrow right-3">&#8594;</button>

        <!-- Dots -->
        <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          <button
            v-for="(_, i) in 3"
            :key="i"
            @click="sportsIndex = i"
            class="dot-btn transition-all duration-300"
            :class="sportsIndex === i ? 'dot-active' : 'dot-inactive'"
          />
        </div>
      </div>
    </section>

    <!-- ════════════════════════════════════════ BROWSE ON SPORTS ════════════════════════════════════════ -->
    <section class="section-gap reveal reveal-delay-3">
      <div class="section-title-wrap">
        <div class="section-accent sports-accent"></div>
        <h3 class="section-title">Browse on Sports</h3>
      </div>
      <div class="chips-track scrollbar-hide">
        <router-link
          v-for="cat in sportsCategories"
          :key="cat.label"
          :to="`/catalog?type=sports&category=${cat.label.toLowerCase()}`"
          class="chip-link"
        >
          <div class="chip-icon sports-chip">
            <img :src="cat.img" :alt="cat.label" class="chip-img" />
          </div>
          <span class="chip-label">{{ cat.label }}</span>
        </router-link>
      </div>
    </section>

    <!-- ══════════════════════════════════ RECOMMENDED FOR YOU (SPORTS) ══════════════════════════════════ -->
    <section class="section-gap reveal reveal-delay-4">
      <div class="section-title-wrap">
        <div class="section-accent sports-accent"></div>
        <h3 class="section-title">Recommended for You</h3>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <ProductCard
          v-for="(product, i) in sportsProducts"
          :key="i"
          :product="product"
          class="reveal"
          :class="`reveal-delay-${(i % 4) + 1}`"
        />
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useScrollReveal } from '@/composables/useScrollReveal'
import ProductCard from '@/components/ProductCard.vue'

useScrollReveal()

// ── Fashion carousel ──────────────────────────────────────────────────────────
const fashionIndex = ref(0)
let fashionTimer = null
const nextFashion = () => { fashionIndex.value = (fashionIndex.value + 1) % 3 }
const prevFashion = () => { fashionIndex.value = (fashionIndex.value + 2) % 3 }

// ── Sports carousel ───────────────────────────────────────────────────────────
const sportsIndex = ref(0)
let sportsTimer = null
const nextSports = () => { sportsIndex.value = (sportsIndex.value + 1) % 3 }
const prevSports = () => { sportsIndex.value = (sportsIndex.value + 2) % 3 }

// ── Swipe handlers (mobile/touch) ─────────────────────────────────────────────
const createSwipeHandlers = (onPrev, onNext) => {
  let startX = 0, startY = 0
  return {
    start: (e) => {
      startX = e.changedTouches[0].screenX
      startY = e.changedTouches[0].screenY
    },
    end: (e) => {
      const dx = e.changedTouches[0].screenX - startX
      const dy = e.changedTouches[0].screenY - startY
      // Require predominantly horizontal swipe of at least 50px to avoid
      // triggering on vertical scrolls / accidental drags.
      if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return
      dx < 0 ? onNext() : onPrev()
    },
  }
}
const fashionSwipe = createSwipeHandlers(prevFashion, nextFashion)
const sportsSwipe = createSwipeHandlers(prevSports, nextSports)

onMounted(() => {
  fashionTimer = setInterval(nextFashion, 4000)
  sportsTimer = setInterval(nextSports, 4500)
})
onUnmounted(() => {
  clearInterval(fashionTimer)
  clearInterval(sportsTimer)
})

// ── Fashion categories ────────────────────────────────────────────────────────
const fashionCategories = [
  { label: 'T-Shirts',     img: new URL('@/assets/ImgCard/t-shirt.avif',    import.meta.url).href },
  { label: 'Hoodies',      img: new URL('@/assets/ImgCard/hoodie.avif',     import.meta.url).href },
  { label: 'Jackets',      img: new URL('@/assets/ImgCard/jacket.avif',     import.meta.url).href },
  { label: 'Pants',        img: new URL('@/assets/ImgCard/pants.png',       import.meta.url).href },
  { label: 'Shorts',       img: new URL('@/assets/ImgCard/shorts.avif',     import.meta.url).href },
  { label: 'Shoes',        img: new URL('@/assets/ImgCard/shoes.png',       import.meta.url).href },
  { label: 'Bags',         img: new URL('@/assets/ImgCard/bag.png',         import.meta.url).href },
  { label: 'Accessories',  img: new URL('@/assets/ImgCard/accesories.png',  import.meta.url).href },
]

// ── Sports categories (reusing available card assets) ─────────────────────────
const sportsCategories = [
  { label: 'Running',     img: new URL('@/assets/ImgCard/shoes.png',       import.meta.url).href },
  { label: 'Basketball',  img: new URL('@/assets/ImgCard/shorts.avif',     import.meta.url).href },
  { label: 'Football',    img: new URL('@/assets/ImgCard/shoes.png',       import.meta.url).href },
  { label: 'Padel',       img: new URL('@/assets/ImgCard/bag.png',         import.meta.url).href },
  { label: 'Gym',         img: new URL('@/assets/ImgCard/t-shirt.avif',    import.meta.url).href },
  { label: 'Shoes',       img: new URL('@/assets/ImgCard/shoes.png',       import.meta.url).href },
  { label: 'Shorts',      img: new URL('@/assets/ImgCard/shorts.avif',     import.meta.url).href },
  { label: 'Jerseys',     img: new URL('@/assets/ImgCard/t-shirt.avif',    import.meta.url).href },
]

// ── Recommended products (fashion) ────────────────────────────────────────────
const recommendedProducts = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  name: 'Insurgent Graphic Tee',
  price: 499000,
  category: 'T-Shirts',
  img: new URL('@/assets/ImgCard/insurgent.jpeg', import.meta.url).href,
  sold: 12,
  size: 'L',
}))

// ── Sports products ───────────────────────────────────────────────────────────
const sportsProducts = [
  { id: 101, name: 'Running Shorts',      price: 159000, category: 'Shorts',  img: new URL('@/assets/ImgCard/shorts.avif', import.meta.url).href, sold: 8,  size: 'M' },
  { id: 102, name: 'Sport Sneakers',      price: 349000, category: 'Shoes',   img: new URL('@/assets/ImgCard/shoes.png',   import.meta.url).href, sold: 15, size: 'L' },
  { id: 103, name: 'Gym Tee',             price: 129000, category: 'T-Shirts',img: new URL('@/assets/ImgCard/t-shirt.avif',import.meta.url).href, sold: 6,  size: 'M' },
  { id: 104, name: 'Sport Duffel Bag',    price: 219000, category: 'Bags',    img: new URL('@/assets/ImgCard/bag.png',     import.meta.url).href, sold: 4,  size: '-' },
]
</script>

<style scoped>
@reference "../assets/main.css";

/* ── Root & spacing ─────────────────────────────────────────────────────────── */
.home-root {
  @apply pb-8;
  padding: 1rem;
}
.section-gap {
  @apply mb-10;
}

/* ── Section title ──────────────────────────────────────────────────────────── */
.section-title-wrap {
  @apply flex items-center gap-3 mb-5;
}
.section-accent {
  @apply w-1 h-7 rounded-full flex-shrink-0;
}
.fashion-accent {
  background: #C1121F;
}
.sports-accent {
  background: #669BBC;
}
.section-title {
  @apply text-base font-extrabold tracking-tight text-gray-900;
  letter-spacing: -0.01em;
}

/* ── Carousel ───────────────────────────────────────────────────────────────── */
.carousel-wrapper {
  border: 2px solid #111;
  box-shadow: 6px 6px 0 0 #111;
}
.carousel-h {
  height: 240px;
}
@media (min-width: 640px) {
  .carousel-h { height: 280px; }
}
@media (min-width: 768px) {
  .carousel-h { height: 300px; }
}
.carousel-track {
  will-change: transform;
}
.carousel-slide {
  /* defined inline per-slide for bg color */
}

/* ── Carousel arrows ─────────────────────────────────────────────────────────── */
.carousel-arrow {
  @apply absolute top-1/2 -translate-y-1/2 z-20
         w-9 h-9 rounded-lg
         bg-white/20 backdrop-blur-sm text-white
         flex items-center justify-center
         text-base font-bold
         border border-white/20
         opacity-0
         hover:bg-white/40 hover:scale-110
         transition-all duration-200;
  pointer-events: none;
}
.carousel-wrapper:hover .carousel-arrow,
.carousel-arrow:focus-visible {
  @apply opacity-100;
  pointer-events: auto;
}
/* Touch-only devices: hide arrows entirely, swipe replaces them. */
@media (hover: none) {
  .carousel-arrow {
    display: none;
  }
}

/* ── Dots ───────────────────────────────────────────────────────────────────── */
.dot-btn {
  @apply rounded-full h-2;
}
.dot-active {
  @apply bg-white w-6;
  box-shadow: 0 0 6px rgba(255,255,255,0.6);
}
.dot-inactive {
  @apply bg-white/40 w-2 hover:bg-white/70;
}

/* ── CTA buttons (brutalist) ─────────────────────────────────────────────────── */
.cta-btn {
  @apply w-fit px-5 py-2.5 text-sm font-bold rounded-xl;
  border: 2px solid #111;
  box-shadow: 4px 4px 0 0 #111;
  transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
}
.cta-btn:hover {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 0 #111;
}
.cta-btn:active {
  transform: translate(4px, 4px);
  box-shadow: 0 0 0 0 #111;
}
.fashion-cta {
  @apply bg-white text-[#C1121F];
}
.fashion-cta:hover {
  @apply bg-[#FDF0D5];
}
.sports-cta {
  @apply bg-[#669BBC] text-white;
}
.sports-cta:hover {
  @apply bg-[#669BBC];
}
.sports-dark-cta {
  @apply bg-[#003049] text-white;
}

/* ── Category chips (brutalist frame) ────────────────────────────────────────── */
.chip-icon {
  border: 2px solid #111;
  box-shadow: 3px 3px 0 0 #111;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.chip-link:hover .chip-icon {
  transform: translate(1.5px, 1.5px);
  box-shadow: 1.5px 1.5px 0 0 #111;
}

/* ── Category chips ──────────────────────────────────────────────────────────── */
.chips-track {
  @apply flex gap-4 overflow-x-auto pb-2;
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.chips-track::-webkit-scrollbar {
  display: none;
}
.chip-link {
  @apply flex-shrink-0 flex flex-col items-center gap-2 no-underline;
}
.chip-icon {
  @apply w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center overflow-hidden;
}
.fashion-chip {
  background: linear-gradient(135deg, #C1121F, #780000);
}
.sports-chip {
  background: linear-gradient(135deg, #669BBC, #003049);
}
.chip-img {
  @apply w-10 h-10 object-contain drop-shadow-sm;
}
.chip-label {
  @apply text-[11px] text-center font-semibold text-gray-700;
}

/* ── Scrollbar hide util ─────────────────────────────────────────────────────── */
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>