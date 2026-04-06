import { onMounted, onUnmounted } from 'vue'

export function useScrollReveal() {
  let observer = null

  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.05, rootMargin: '0px 0px -10px 0px' },
    )

    setTimeout(() => {
      document.querySelectorAll('.reveal').forEach((el) => {
        observer.observe(el)
      })
    }, 100)
  })

  onUnmounted(() => {
    observer?.disconnect()
  })
}
