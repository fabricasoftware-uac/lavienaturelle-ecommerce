export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          document_number: string | null
          role: Database['public']['Enums']['user_role']
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          document_number?: string | null
          role?: Database['public']['Enums']['user_role']
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          document_number?: string | null
          role?: Database['public']['Enums']['user_role']
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "auth.users"
            referencedColumns: ["id"]
          }
        ]
      }
      addresses: {
        Row: {
          id: string
          user_id: string | null
          label: string | null
          full_name: string | null
          address_line1: string
          address_line2: string | null
          city: string
          state: string
          country: string
          phone: string | null
          is_default: boolean
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          label?: string | null
          full_name?: string | null
          address_line1: string
          address_line2?: string | null
          city: string
          state: string
          country?: string
          phone?: string | null
          is_default?: boolean
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          label?: string | null
          full_name?: string | null
          address_line1?: string
          address_line2?: string | null
          city?: string
          state?: string
          country?: string
          phone?: string | null
          is_default?: boolean
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      categories: {
        Row: {
          id: string
          name: string
          name_plural: string | null
          slug: string
          description: string | null
          image_url: string | null
          parent_id: string | null
          display_order: number
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          name: string
          name_plural?: string | null
          slug: string
          description?: string | null
          image_url?: string | null
          parent_id?: string | null
          display_order?: number
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          name_plural?: string | null
          slug?: string
          description?: string | null
          image_url?: string | null
          parent_id?: string | null
          display_order?: number
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      products: {
        Row: {
          id: string
          category_id: string | null
          name: string
          slug: string
          description: string | null
          full_description: string | null
          price: number
          sale_price: number | null
          sku: string | null
          stock_quantity: number
          is_featured: boolean
          status: Database['public']['Enums']['product_status']
          badge: string | null
          weight: string | null
          origin: string | null
          ingredients: string | null
          usage_instructions: string | null
          benefits: string[] | null
          metadata: Json
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          category_id?: string | null
          name: string
          slug: string
          description?: string | null
          full_description?: string | null
          price?: number
          sale_price?: string | null
          sku?: string | null
          stock_quantity?: number
          is_featured?: boolean
          status?: Database['public']['Enums']['product_status']
          badge?: string | null
          weight?: string | null
          origin?: string | null
          ingredients?: string | null
          usage_instructions?: string | null
          benefits?: string[] | null
          metadata?: Json
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          category_id?: string | null
          name?: string
          slug?: string
          description?: string | null
          full_description?: string | null
          price?: number
          sale_price?: string | null
          sku?: string | null
          stock_quantity?: number
          is_featured?: boolean
          status?: Database['public']['Enums']['product_status']
          badge?: string | null
          weight?: string | null
          origin?: string | null
          ingredients?: string | null
          usage_instructions?: string | null
          benefits?: string[] | null
          metadata?: Json
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      product_multimedia: {
        Row: {
          id: string
          product_id: string
          url: string
          alt_text: string | null
          type: string
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          url: string
          alt_text?: string | null
          type?: string
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          url?: string
          alt_text?: string | null
          type?: string
          display_order?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_multimedia_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      orders: {
        Row: {
          id: string
          order_number: string
          user_id: string | null
          email: string
          full_name: string
          phone: string | null
          document_number: string | null
          status: Database['public']['Enums']['order_status']
          total_amount: number
          shipping_cost: number
          tax_amount: number
          shipping_address_line1: string
          shipping_address_line2: string | null
          shipping_city: string
          shipping_state: string
          shipping_country: string
          shipping_postal_code: string | null
          payment_status: Database['public']['Enums']['payment_status']
          payment_method: string | null
          tracking_number: string | null
          courier_name: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          order_number: string
          user_id?: string | null
          email: string
          full_name: string
          phone?: string | null
          document_number?: string | null
          status?: Database['public']['Enums']['order_status']
          total_amount: number
          shipping_cost?: number
          tax_amount?: number
          shipping_address_line1: string
          shipping_address_line2?: string | null
          shipping_city: string
          shipping_state: string
          shipping_country?: string
          shipping_postal_code?: string | null
          payment_status?: Database['public']['Enums']['payment_status']
          payment_method?: string | null
          tracking_number?: string | null
          courier_name?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          order_number?: string
          user_id?: string | null
          email?: string
          full_name?: string
          phone?: string | null
          document_number?: string | null
          status?: Database['public']['Enums']['order_status']
          total_amount?: number
          shipping_cost?: number
          tax_amount?: number
          shipping_address_line1?: string
          shipping_address_line2?: string | null
          shipping_city?: string
          shipping_state?: string
          shipping_country?: string
          shipping_postal_code?: string | null
          payment_status?: Database['public']['Enums']['payment_status']
          payment_method?: string | null
          tracking_number?: string | null
          courier_name?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          quantity: number
          unit_price: number
          total_price: number
          product_name_snapshot: string | null
          product_sku_snapshot: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id?: string | null
          quantity: number
          unit_price: number
          total_price: number
          product_name_snapshot?: string | null
          product_sku_snapshot?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string | null
          quantity?: number
          unit_price?: number
          total_price?: number
          product_name_snapshot?: string | null
          product_sku_snapshot?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      payment_logs: {
        Row: {
          id: string
          order_id: string
          transaction_id: string | null
          provider: string
          status: string | null
          amount: number
          currency: string
          raw_response: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          transaction_id?: string | null
          provider: string
          status?: string | null
          amount: number
          currency?: string
          raw_response?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          transaction_id?: string | null
          provider?: string
          status?: string | null
          amount?: number
          currency?: string
          raw_response?: Json | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_logs_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          }
        ]
      }
      product_reviews: {
        Row: {
          id: string
          product_id: string
          user_id: string | null
          rating: number
          comment: string | null
          is_verified_purchase: boolean
          status: string
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          product_id: string
          user_id?: string | null
          rating: number
          comment?: string | null
          is_verified_purchase?: boolean
          status?: string
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          product_id?: string
          user_id?: string | null
          rating?: number
          comment?: string | null
          is_verified_purchase?: boolean
          status?: string
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      update_updated_at_column: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      handle_new_user: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      get_order_by_tracking: {
        Args: {
          order_num: string
          doc_num: string
        }
        Returns: Json
      }
      create_order_with_items: {
        Args: {
          p_order: Json
          p_items: Json
        }
        Returns: Json
      }
      claim_guest_orders: {
        Args: {
          p_email: string
          p_user_id: string
        }
        Returns: number
      }
    }
    Enums: {
      user_role: 'admin' | 'customer'
      product_status: 'draft' | 'published' | 'out_of_stock' | 'archived'
      order_status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
      payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
    }
  }
}

// Convenience re-exports (same names as before - all imports keep working)
export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type Address = Database['public']['Tables']['addresses']['Row']
export type AddressInsert = Database['public']['Tables']['addresses']['Insert']
export type AddressUpdate = Database['public']['Tables']['addresses']['Update']

export type Category = Database['public']['Tables']['categories']['Row']
export type CategoryInsert = Database['public']['Tables']['categories']['Insert']
export type CategoryUpdate = Database['public']['Tables']['categories']['Update']

export type Product = Database['public']['Tables']['products']['Row']
export type ProductInsert = Database['public']['Tables']['products']['Insert']
export type ProductUpdate = Database['public']['Tables']['products']['Update']

export type ProductMultimedia = Database['public']['Tables']['product_multimedia']['Row']

export type Order = Database['public']['Tables']['orders']['Row']
export type OrderInsert = Database['public']['Tables']['orders']['Insert']
export type OrderUpdate = Database['public']['Tables']['orders']['Update']

export type OrderItem = Database['public']['Tables']['order_items']['Row']
export type OrderItemInsert = Database['public']['Tables']['order_items']['Insert']

export type PaymentLog = Database['public']['Tables']['payment_logs']['Row']

export type ProductReview = Database['public']['Tables']['product_reviews']['Row']
export type ProductReviewInsert = Database['public']['Tables']['product_reviews']['Insert']

// Enums
export type UserRole = Database['public']['Enums']['user_role']
export type ProductStatus = Database['public']['Enums']['product_status']
export type OrderStatus = Database['public']['Enums']['order_status']
export type PaymentStatus = Database['public']['Enums']['payment_status']

// Composite types (relations often fetched together)
export interface ProductWithDetails extends Product {
  categories?: Pick<Category, 'slug' | 'name'> | null
  product_multimedia?: Pick<ProductMultimedia, 'url' | 'display_order'>[]
}

export interface OrderWithDetails extends Order {
  order_items: (OrderItem & {
    products?: {
      product_multimedia: { url: string }[]
    } | null
  })[]
}

// UI-mapped Order for Dashboard components
export interface MappedOrder {
  id: string
  realId: string
  full_name: string
  phone: string | null
  productName: string
  mainImage: string
  status: string
  statusColor: "green" | "blue" | "amber"
  trackingId: string
  carrier: string
  date: string
  items: number
  total: number
  order_items: (OrderItem & {
    products?: {
      product_multimedia: { url: string }[]
    } | null
  })[]
  address: string
  paymentMethod: string
  tracking_number?: string | null
  courier_name?: string | null
}

// Customer-facing product type (mapped from Database)
export interface CatalogProduct {
  id: string
  name: string
  price: number
  category: string
  categoryName: string
  image: string
  images: string[]
  description: string
  fullDescription: string
  badge: string
  details: {
    weight: string
    origin: string
    ingredients: string
    usage: string
    benefits: string[]
  }
  inStock: boolean
  stockQuantity: number
}

// Application specific types (mapped from Database)
export interface AppProduct {
  id: string
  name: string
  sku: string
  category: string
  categoryName: string
  categoryId: string
  price: number
  stock: number
  stockStatus: "In Stock" | "Low Stock" | "Out of Stock"
  status: "Active" | "Draft"
  image: string
  images: string[]
  description: string
  fullDescription: string
  content: string
  origin: string
  ingredients: string
  benefits: string[]
  usage: string
  badge: string
}
