import { onMounted, onUnmounted } from 'vue'

export function useScrollReveal() {
  let intersectionObserver = null
  let mutationObserver = null

  onMounted(() => {
    intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.05, rootMargin: '0px 0px -10px 0px' },
    )

    const observeAll = () => {
      document.querySelectorAll('.reveal:not(.visible)').forEach((el) => {
        intersectionObserver.observe(el)
      })
    }

    setTimeout(observeAll, 100)

    mutationObserver = new MutationObserver(observeAll)
    mutationObserver.observe(document.body, { childList: true, subtree: true })
  })

  onUnmounted(() => {
    intersectionObserver?.disconnect()
    mutationObserver?.disconnect()
  })
}
