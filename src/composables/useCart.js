import { ref, computed, watch } from 'vue'

const cart = ref(JSON.parse(localStorage.getItem('cart') || '[]'))

watch(
  cart,
  (newCart) => {
    localStorage.setItem('cart', JSON.stringify(newCart))
  },
  { deep: true }
)

const cartCount = computed(() =>
  cart.value.reduce((sum, item) => sum + (item.qty || 1), 0)
)

const cartSubtotal = computed(() =>
  cart.value.reduce((sum, item) => {
    return sum + (item.price * (item.qty || 1))
  }, 0)
)

export function useCart() {
  const addToCart = (product) => {
    const existing = cart.value.find((i) => i.id === product.id)

    if (existing) {
      existing.qty += 1
    } else {
      cart.value.push({
        ...product,
        qty: 1,
      })
    }
  }

  const removeFromCart = (productId) => {
    cart.value = cart.value.filter((i) => i.id !== productId)
  }

  const increaseQty = (productId) => {
    const item = cart.value.find((i) => i.id === productId)

    if (item) {
      item.qty += 1
    }
  }

  const decreaseQty = (productId) => {
    const item = cart.value.find((i) => i.id === productId)

    if (!item) return

    item.qty -= 1

    if (item.qty <= 0) {
      removeFromCart(productId)
    }
  }

  const updateQty = (productId, qty) => {
    const item = cart.value.find((i) => i.id === productId)

    if (!item) return

    item.qty = qty

    if (item.qty <= 0) {
      removeFromCart(productId)
    }
  }

  const clearCart = () => {
    cart.value = []
  }

  return {
    cart,
    cartCount,
    cartSubtotal,
    addToCart,
    removeFromCart,
    increaseQty,
    decreaseQty,
    updateQty,
    clearCart,
  }
}