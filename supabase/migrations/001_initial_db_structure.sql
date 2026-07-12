-- LA VIE NATURELLE - FULL BACKEND SCHEMA
-- Senior Software Architect Implementation
-- Target: Supabase (PostgreSQL)

-- 1. EXTENSIONS & TYPES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum for User Roles
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'customer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Enum for Product Status
DO $$ BEGIN
    CREATE TYPE product_status AS ENUM ('draft', 'published', 'out_of_stock', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Enum for Order Status
DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Enum for Payment Status
DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. TABLES

-- Profiles (Extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    document_number TEXT, -- Added for verification/billing
    role user_role DEFAULT 'customer',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ -- Soft delete
);

-- Addresses
CREATE TABLE IF NOT EXISTS addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    country TEXT DEFAULT 'Colombia',
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    name_plural TEXT, -- Added for UI (e.g. 'Aceites Esenciales')
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL, -- For subcategories
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Products
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT, -- Short description
    full_description TEXT, -- Detailed description
    price DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    sale_price DECIMAL(12,2),
    sku TEXT UNIQUE,
    stock_quantity INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    status product_status DEFAULT 'draft',
    badge TEXT, -- e.g., 'Mas Vendido', 'Nuevo', 'Popular'
    
    -- Specific Product Details
    weight TEXT, -- Content/Weight (e.g., '50ml', '500g')
    origin TEXT, -- Product origin
    ingredients TEXT, -- List of ingredients
    usage_instructions TEXT, -- How to use
    benefits TEXT[], -- Array of benefits
    
    metadata JSONB DEFAULT '{}', -- For any other flexible attributes
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Product Multimedia
CREATE TABLE IF NOT EXISTS product_multimedia (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt_text TEXT,
    type TEXT DEFAULT 'image', -- image, video
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL, -- Nullable for guest
    
    -- Guest/Contact info (Snapshotted even for registered users)
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    document_number TEXT, -- Added for verification/tracking
    
    -- Financials
    status order_status DEFAULT 'pending',
    total_amount DECIMAL(12,2) NOT NULL,
    shipping_cost DECIMAL(12,2) DEFAULT 0.00,
    tax_amount DECIMAL(12,2) DEFAULT 0.00,
    
    -- Shipping Info (Snapshotted for historical accuracy)
    shipping_address_line1 TEXT NOT NULL,
    shipping_address_line2 TEXT,
    shipping_city TEXT NOT NULL,
    shipping_state TEXT NOT NULL,
    shipping_country TEXT DEFAULT 'Colombia',
    shipping_postal_code TEXT,
    
    -- Payment & Tracking
    payment_status payment_status DEFAULT 'pending',
    payment_method TEXT,
    tracking_number TEXT,
    courier_name TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(12,2) NOT NULL,
    total_price DECIMAL(12,2) NOT NULL,
    
    -- Snapshot of product data at time of purchase
    product_name_snapshot TEXT,
    product_sku_snapshot TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment Logs
CREATE TABLE IF NOT EXISTS payment_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    transaction_id TEXT,
    provider TEXT NOT NULL, -- e.g., 'stripe', 'payu', 'paypal'
    status TEXT,
    amount DECIMAL(12,2) NOT NULL,
    currency TEXT DEFAULT 'COP',
    raw_response JSONB, -- For debugging
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product Reviews
CREATE TABLE IF NOT EXISTS product_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_verified_purchase BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'pending', -- pending, approved, rejected
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 3. AUDIT TRIGGERS (Automating updated_at)

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all relevant tables
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT table_name 
        FROM information_schema.columns 
        WHERE column_name = 'updated_at' 
        AND table_schema = 'public'
    LOOP
        EXECUTE format('CREATE TRIGGER update_timestamp BEFORE UPDATE ON %I FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column()', t);
    END LOOP;
END $$;

-- 4. AUTH SYNC (auth.users -> public.profiles)
-- This trigger automatically creates a profile when a new user registers

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        new.id, 
        new.email, 
        COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute the function on every new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 5. RLS POLICIES (COMPREHENSIVE)

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_multimedia ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        SELECT role = 'admin' 
        FROM public.profiles 
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PROFILES
CREATE POLICY "Public profiles are viewable by owner" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (is_admin());

-- ADDRESSES
CREATE POLICY "Users can view own addresses" ON addresses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own addresses" ON addresses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own addresses" ON addresses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own addresses" ON addresses FOR DELETE USING (auth.uid() = user_id);

-- CATEGORIES
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (deleted_at IS NULL);
CREATE POLICY "Admins can manage categories" ON categories FOR ALL USING (is_admin());

-- PRODUCTS
CREATE POLICY "Published products are viewable by everyone" ON products FOR SELECT USING (status = 'published' AND deleted_at IS NULL);
CREATE POLICY "Admins can manage products" ON products FOR ALL USING (is_admin());

-- PRODUCT MULTIMEDIA
CREATE POLICY "Multimedia is viewable by everyone" ON product_multimedia FOR SELECT USING (true);
CREATE POLICY "Admins can manage multimedia" ON product_multimedia FOR ALL USING (is_admin());

-- ORDERS
-- Users can view their own orders (by ID or matching email for guests)
CREATE POLICY "Users can view own orders" ON orders FOR SELECT 
USING (auth.uid() = user_id OR email = (SELECT email FROM profiles WHERE id = auth.uid()));

-- Allow everyone to create an order (required for checkout)
CREATE POLICY "Anyone can create an order" ON orders FOR INSERT WITH CHECK (true);

-- Only admins can update orders (e.g., status changes)
CREATE POLICY "Admins can manage orders" ON orders FOR UPDATE USING (is_admin());

-- ORDER ITEMS
CREATE POLICY "Users can view own order items" ON order_items FOR SELECT 
USING (EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND (orders.user_id = auth.uid() OR orders.email = (SELECT email FROM profiles WHERE id = auth.uid()))
));
CREATE POLICY "Anyone can insert order items" ON order_items FOR INSERT WITH CHECK (true);

-- PRODUCT REVIEWS
CREATE POLICY "Reviews are viewable by everyone" ON product_reviews FOR SELECT USING (status = 'approved');
CREATE POLICY "Authenticated users can insert reviews" ON product_reviews FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update/delete own reviews" ON product_reviews FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all reviews" ON product_reviews FOR ALL USING (is_admin());

-- PAYMENT LOGS
CREATE POLICY "Only admins can view payment logs" ON payment_logs FOR SELECT USING (is_admin());

-- 6. INITIAL SEED DATA (OPTIONAL)
-- INSERT INTO categories (name, name_plural, slug) VALUES ('Aceite Esencial', 'Aceites Esenciales', 'aceites-esenciales');
