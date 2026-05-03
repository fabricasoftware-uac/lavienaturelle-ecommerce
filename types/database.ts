export type UserRole = 'admin' | 'customer';
export type ProductStatus = 'draft' | 'published' | 'out_of_stock' | 'archived';
export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Profile {
  id: string;
  email: string;
  full_name?: string | null;
  phone?: string | null;
  document_number?: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface Address {
  id: string;
  user_id: string;
  address_line1: string;
  address_line2?: string | null;
  city: string;
  state: string;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface Category {
  id: string;
  name: string;
  name_plural?: string | null;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  parent_id?: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface Product {
  id: string;
  category_id?: string | null;
  name: string;
  slug: string;
  description?: string | null;
  full_description?: string | null;
  price: number;
  sale_price?: number | null;
  sku?: string | null;
  stock_quantity: number;
  is_featured: boolean;
  status: ProductStatus;
  badge?: string | null;
  weight?: string | null;
  origin?: string | null;
  ingredients?: string | null;
  usage_instructions?: string | null;
  benefits?: string[] | null;
  metadata?: any;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface ProductMultimedia {
  id: string;
  product_id: string;
  url: string;
  alt_text?: string | null;
  type: string;
  display_order: number;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id?: string | null;
  email: string;
  full_name: string;
  phone?: string | null;
  document_number?: string | null;
  status: OrderStatus;
  total_amount: number;
  shipping_cost: number;
  tax_amount: number;
  shipping_address_line1: string;
  shipping_address_line2?: string | null;
  shipping_city: string;
  shipping_state: string;
  shipping_country: string;
  shipping_postal_code?: string | null;
  payment_status: PaymentStatus;
  payment_method?: string | null;
  tracking_number?: string | null;
  courier_name?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  product_name_snapshot?: string | null;
  product_sku_snapshot?: string | null;
  created_at: string;
}

export interface PaymentLog {
  id: string;
  order_id: string;
  transaction_id?: string | null;
  provider: string;
  status?: string | null;
  amount: number;
  currency: string;
  raw_response?: any;
  created_at: string;
}

export interface ProductReview {
  id: string;
  product_id: string;
  user_id?: string | null;
  rating: number;
  comment?: string | null;
  is_verified_purchase: boolean;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

// Helper types for relations often fetched together
export interface ProductWithDetails extends Product {
  categories?: Pick<Category, 'name'> | null;
  product_multimedia?: Pick<ProductMultimedia, 'url' | 'display_order'>[];
}

// Application specific types (mapped from Database)
export interface AppProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  categoryId: string;
  price: number;
  stock: number;
  stockStatus: "In Stock" | "Low Stock" | "Out of Stock";
  status: "Active" | "Draft";
  image: string;
  images: string[];
  description: string;
  fullDescription: string;
  content: string;
  origin: string;
  ingredients: string;
  benefits: string[];
  usage: string;
  badge: string;
}
