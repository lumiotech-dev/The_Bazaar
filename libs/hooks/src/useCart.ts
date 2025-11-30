import { useState, useCallback } from 'react'
import type { CartItem } from '@bazaar/types'

interface UseCartReturn {
  items: CartItem[]
  total: number
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clear: () => void
}

/**
 * Hook for managing shopping cart state
 */
export function useCart(): UseCartReturn {
  const [items, setItems] = useState<CartItem[]>([])

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId)
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId ? { ...i, quantity: i.quantity + item.quantity } : i
        )
      }
      return [...prev, item]
    })
  }, [])

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId))
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity } : i))
    )
  }, [removeItem])

  const clear = useCallback(() => {
    setItems([])
  }, [])

  return { items, total, addItem, removeItem, updateQuantity, clear }
}
