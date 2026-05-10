import { ref, computed } from 'vue'

const items = ref([])
const source = ref(null)

const setItems = (newItems, src = 'cart') => {
  items.value = newItems.map(i => ({ ...i }))
  source.value = src
}

const clear = () => {
  items.value = []
  source.value = null
}

const subtotal = computed(() =>
  items.value.reduce((sum, i) => sum + i.price * (i.qty || 1), 0)
)
const totalQty = computed(() =>
  items.value.reduce((sum, i) => sum + (i.qty || 1), 0)
)
const hasItems = computed(() => items.value.length > 0)

export function useTransaction() {
  return { items, source, setItems, clear, subtotal, totalQty, hasItems }
}
