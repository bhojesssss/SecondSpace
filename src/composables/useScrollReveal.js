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
            { threshold: 0.1 }
        )

        document.querySelectorAll('.reveal').forEach((el) => {
            observer.observe(el)
        })
    })

    onUnmounted(() => {
        observer?.disconnect()
    })
}