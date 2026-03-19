<template>
  <div>

    <!-- HERO CAROUSEL FASHION -->
    <section class="pb-6">
      <div class="carousel-wrapper relative rounded-2xl overflow-hidden shadow-lg" style="height: 220px;">
        <div
          class="carousel-track flex h-full transition-transform duration-500 ease-in-out"
          :style="{ transform: `translateX(-${fashionIndex * 100}%)` }"
        >
          <!-- Slide 1 -->
          <div class="carousel-slide flex-shrink-0 w-full h-full relative bg-[#C1121F]">
            <img src="@/assets/ImgBanner/banner1/fashion1.png" class="absolute right-0 bottom-0 h-full object-cover object-right" alt="" />
            <div class="absolute inset-0 flex flex-col justify-center px-8">
              <h2 class="text-white text-4xl leading-tight mb-4" style="font-family: 'CalSans', serif;">Thrifting easier<br/>with us.</h2>
              <button @click="$router.push('/catalog')" class="w-fit px-5 py-2 bg-white text-[#C1121F] text-sm font-bold rounded-full hover:bg-[#FDF0D5] transition-colors">Shop Now</button>
            </div>
          </div>
          <!-- Slide 2 -->
          <div class="carousel-slide flex-shrink-0 w-full h-full relative bg-[#780000]">
            <img src="@/assets/ImgBanner/banner2/fashion2.png" class="absolute inset-0 w-full h-full object-cover opacity-60" alt="" />
            <div class="absolute inset-0 flex flex-col justify-center px-8">
              <h2 class="text-white text-4xl leading-tight" style="font-family: 'CalSans', serif;">Good Fashion</h2>
              <p class="text-white/80 text-sm mt-1">Without Overprice</p>
            </div>
          </div>
          <!-- Slide 3 -->
          <div class="carousel-slide flex-shrink-0 w-full h-full relative bg-[#C1121F]">
            <img src="@/assets/ImgBanner/banner3/fashion2.png" class="absolute right-0 bottom-0 h-full object-cover object-right opacity-70" alt="" />
            <div class="absolute inset-0 flex flex-col justify-center px-8">
              <h2 class="text-white text-4xl leading-tight" style="font-family: 'CalSans', serif;">Be Yourself.</h2>
            </div>
          </div>
        </div>

        <!-- Arrows -->
        <button @click="prevFashion" class="carousel-arrow left-2">&#8592;</button>
        <button @click="nextFashion" class="carousel-arrow right-2">&#8594;</button>

        <!-- Dots -->
        <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          <button v-for="(_, i) in 3" :key="i" @click="fashionIndex = i"
            class="w-2 h-2 rounded-full transition-all duration-300"
            :class="fashionIndex === i ? 'bg-white w-5' : 'bg-white/50'"
          />
        </div>
      </div>
    </section>

    <!-- BROWSE ON FASHION -->
    <section class="pb-6 reveal">
      <h3 class="text-sm font-bold mb-3">Browse on Fashion</h3>
      <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        <router-link
          v-for="cat in fashionCategories"
          :key="cat.label"
          :to="`/catalog?category=${cat.label.toLowerCase()}`"
          class="category-chip flex-shrink-0 flex flex-col items-center gap-1.5 group"
        >
          <div class="w-14 h-14 rounded-xl bg-[#C1121F] flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-200 shadow-md">
            <img :src="cat.img" :alt="cat.label" class="w-10 h-10 object-contain" />
          </div>
          <span class="text-[10px] text-center font-medium">{{ cat.label }}</span>
        </router-link>
      </div>
    </section>

    <!-- RECOMMENDED FOR YOU -->
    <section class="pb-6 reveal reveal-delay-1">
      <h3 class="text-sm font-bold mb-3">Recommended for You</h3>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        <ProductCard
          v-for="(product, i) in recommendedProducts"
          :key="i"
          :product="product"
          class="reveal"
          :class="`reveal-delay-${(i % 4) + 1}`"
        />
      </div>
    </section>

    <!-- SPORTS CAROUSEL -->
    <section class="pb-8 reveal">
      <div class="carousel-wrapper relative rounded-2xl overflow-hidden shadow-lg" style="height: 200px;">
        <div
          class="carousel-track flex h-full transition-transform duration-500 ease-in-out"
          :style="{ transform: `translateX(-${sportsIndex * 100}%)` }"
        >
          <!-- Sports Slide 1 -->
          <div class="carousel-slide flex-shrink-0 w-full h-full relative bg-[#669BBC]">
            <img src="@/assets/ImgBanner/banner4/sports1.png" class="absolute right-0 bottom-0 h-full object-cover object-right" alt="" />
            <div class="absolute inset-0 flex flex-col justify-center px-8">
              <h2 class="text-white text-3xl leading-tight" style="font-family: 'CalSans', serif;">Play More,<br/><span class="text-[#FDF0D5]">Pay Less.</span></h2>
            </div>
          </div>
          <!-- Sports Slide 2 -->
          <div class="carousel-slide flex-shrink-0 w-full h-full relative bg-[#003049]">
            <img src="@/assets/ImgBanner/banner5/sports2.png" class="absolute right-0 bottom-0 h-full object-cover" alt="" />
            <div class="absolute inset-0 flex flex-col justify-center px-8">
              <h2 class="text-white text-3xl leading-tight" style="font-family: 'CalSans', serif;">Move Without Limits</h2>
            </div>
          </div>
          <!-- Sports Slide 3 -->
          <div class="carousel-slide flex-shrink-0 w-full h-full relative bg-[#669BBC]">
            <img src="@/assets/ImgBanner/banner6/sports4.png" class="absolute right-0 bottom-0 h-full object-cover" alt="" />
            <div class="absolute inset-0 flex flex-col justify-center px-8">
              <h2 class="text-white text-3xl leading-tight mb-1" style="font-family: 'CalSans', serif;">Trending Sports</h2>
              <p class="text-white/70 text-xs tracking-widest uppercase">Running · Padel · Basketball · Football</p>
              <button @click="$router.push('/catalog?type=sports')" class="mt-3 w-fit px-4 py-1.5 bg-[#C1121F] text-white text-xs font-bold rounded-full hover:bg-[#780000] transition-colors">Explore Now</button>
            </div>
          </div>
        </div>

        <button @click="prevSports" class="carousel-arrow left-2">&#8592;</button>
        <button @click="nextSports" class="carousel-arrow right-2">&#8594;</button>

        <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          <button v-for="(_, i) in 3" :key="i" @click="sportsIndex = i"
            class="w-2 h-2 rounded-full transition-all duration-300"
            :class="sportsIndex === i ? 'bg-white w-5' : 'bg-white/50'"
          />
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useScrollReveal } from '@/composables/useScrollReveal'
import ProductCard from '@/components/ProductCard.vue'

useScrollReveal()

// Fashion carousel
const fashionIndex = ref(0)
let fashionTimer = null
const nextFashion = () => { fashionIndex.value = (fashionIndex.value + 1) % 3 }
const prevFashion = () => { fashionIndex.value = (fashionIndex.value + 2) % 3 }

// Sports carousel
const sportsIndex = ref(0)
let sportsTimer = null
const nextSports = () => { sportsIndex.value = (sportsIndex.value + 1) % 3 }
const prevSports = () => { sportsIndex.value = (sportsIndex.value + 2) % 3 }

onMounted(() => {
  fashionTimer = setInterval(nextFashion, 4000)
  sportsTimer = setInterval(nextSports, 4500)
})
onUnmounted(() => {
  clearInterval(fashionTimer)
  clearInterval(sportsTimer)
})

const fashionCategories = [
  { label: 'T-Shirts', img: new URL('@/assets/ImgCard/t-shirt.avif', import.meta.url).href },
  { label: 'Hoodies', img: new URL('@/assets/ImgCard/hoodie.avif', import.meta.url).href },
  { label: 'Jackets', img: new URL('@/assets/ImgCard/jacket.avif', import.meta.url).href },
  { label: 'Pants', img: new URL('@/assets/ImgCard/pants.png', import.meta.url).href },
  { label: 'Shorts', img: new URL('@/assets/ImgCard/shorts.avif', import.meta.url).href },
  { label: 'Shoes', img: new URL('@/assets/ImgCard/shoes.png', import.meta.url).href },
  { label: 'Bags', img: new URL('@/assets/ImgCard/bag.png', import.meta.url).href },
  { label: 'Accessories', img: new URL('@/assets/ImgCard/accesories.png', import.meta.url).href },
]

const recommendedProducts = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  name: `Insurgent Graphic Tee`,
  price: 499000,
  category: 'T-Shirts',
  img: new URL('@/assets/ImgCard/insurgent.jpeg', import.meta.url).href,
  sold: 12,
  size: 'L'
}))
</script>

<style scoped>

@reference "../assets/main.css";

.carousel-arrow {
  @apply absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-white/30 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-white/50 transition-all duration-200 text-sm font-bold z-10;
}
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>