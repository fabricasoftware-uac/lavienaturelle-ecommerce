"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"
import { AppProduct, Profile } from "@/types/database"

export type Product = AppProduct;

export interface CartItem extends Product {
  quantity: number
}

export interface User {
  email: string
  role: "customer" | "admin"
  name: string
  document_number?: string
  phone?: string
}

interface StoreContextType {
  cart: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  cartTotal: number
  cartCount: number
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (name: string, email: string, password: string, documentNumber?: string, phone?: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)
const CART_STORAGE_KEY = "lavienaturelle_cart"

// Fake credentials
const USERS = {
  "usuario@gmail.com": { password: "testuser", role: "user" as const, name: "Usuario" },
  "admin@gmail.com": { password: "testuser", role: "admin" as const, name: "Administrador" },
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const supabase = createClient()
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          // Get additional user data from profiles
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single()

          setUser({
            email: session.user.email!,
            role: (profile?.role as "customer" | "admin") || "customer",
            name: profile?.full_name || session.user.user_metadata?.full_name || "Usuario",
            document_number: profile?.document_number || session.user.user_metadata?.document_number,
            phone: profile?.phone || session.user.user_metadata?.phone,
          })
        } else {
          setUser(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

  const addToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
    setIsCartOpen(true)
  }, [])

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId))
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId)
      return
    }
    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
    )
  }, [removeFromCart])

  const clearCart = useCallback(() => {
    setCart([])
  }, [])

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) {
      return { success: false, error: error.message }
    }
    
    return { success: true }
  }, [supabase])

  const register = useCallback(async (name: string, email: string, password: string, documentNumber?: string, phone?: string): Promise<{ success: boolean; error?: string }> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          document_number: documentNumber,
          phone: phone,
        },
      },
    })
    
    if (error) {
      return { success: false, error: error.message }
    }
    
    return { success: true }
  }, [supabase])

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
  }, [supabase])

  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      const storedCart = window.localStorage.getItem(CART_STORAGE_KEY)
      if (!storedCart) return

      const parsed = JSON.parse(storedCart)
      if (Array.isArray(parsed)) {
        setCart(parsed)
      }
    } catch (error) {
      console.error("Error loading cart from storage", error)
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    } catch (error) {
      console.error("Error saving cart to storage", error)
    }
  }, [cart])

  return (
    <StoreContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}
