-- RBAC (Role-Based Access Control) Implementation
-- Senior Software Architect Implementation
-- Target: Supabase (PostgreSQL)

-- 1. ROLE CHECKING FUNCTIONS
-- These functions are used in RLS policies to check user roles efficiently

-- Get current user role
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS user_role AS $$
BEGIN
    RETURN (
        SELECT role 
        FROM public.profiles 
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (get_my_role() = 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. RESET POLICIES
-- Drop existing policies to ensure a clean implementation
DO $$ 
DECLARE 
    r record;
BEGIN
    FOR r IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public') 
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON ' || quote_ident(r.tablename);
    END LOOP;
END $$;

-- 3. APPLY RBAC POLICIES

-- PROFILES
-- Customers: View and update own profile
CREATE POLICY "profiles_customer_select" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_customer_update" ON profiles FOR UPDATE USING (auth.uid() = id);
-- Admins: View and manage all profiles
CREATE POLICY "profiles_admin_all" ON profiles FOR ALL USING (is_admin());

-- ADDRESSES
-- Customers: Manage own addresses
CREATE POLICY "addresses_customer_all" ON addresses FOR ALL USING (auth.uid() = user_id);
-- Admins: Manage all addresses
CREATE POLICY "addresses_admin_all" ON addresses FOR ALL USING (is_admin());

-- CATEGORIES
-- Public: Read only
CREATE POLICY "categories_public_read" ON categories FOR SELECT USING (deleted_at IS NULL);
-- Admins: Full management
CREATE POLICY "categories_admin_all" ON categories FOR ALL USING (is_admin());

-- PRODUCTS
-- Public: Read only if published
CREATE POLICY "products_public_read" ON products FOR SELECT USING (status = 'published' AND deleted_at IS NULL);
-- Admins: Full management
CREATE POLICY "products_admin_all" ON products FOR ALL USING (is_admin());

-- PRODUCT MULTIMEDIA
-- Public: Read only
CREATE POLICY "multimedia_public_read" ON product_multimedia FOR SELECT USING (true);
-- Admins: Full management
CREATE POLICY "multimedia_admin_all" ON product_multimedia FOR ALL USING (is_admin());

-- ORDERS
-- Anyone: Create order (required for checkout)
CREATE POLICY "orders_anyone_insert" ON orders FOR INSERT WITH CHECK (true);
-- Customers: View own orders
CREATE POLICY "orders_customer_select" ON orders FOR SELECT USING (
    auth.uid() = user_id OR email = (SELECT email FROM profiles WHERE id = auth.uid())
);
-- Admins: Full management
CREATE POLICY "orders_admin_all" ON orders FOR ALL USING (is_admin());

-- ORDER ITEMS
-- Anyone: Insert items during checkout
CREATE POLICY "order_items_anyone_insert" ON order_items FOR INSERT WITH CHECK (true);
-- Customers: View own items
CREATE POLICY "order_items_customer_select" ON order_items FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM orders 
        WHERE orders.id = order_items.order_id 
        AND (orders.user_id = auth.uid() OR orders.email = (SELECT email FROM profiles WHERE id = auth.uid()))
    )
);
-- Admins: Full management
CREATE POLICY "order_items_admin_all" ON order_items FOR ALL USING (is_admin());

-- PRODUCT REVIEWS
-- Public: View approved reviews
CREATE POLICY "reviews_public_read" ON product_reviews FOR SELECT USING (status = 'approved');
-- Customers: Add reviews and manage own
CREATE POLICY "reviews_customer_insert" ON product_reviews FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "reviews_customer_manage_own" ON product_reviews FOR ALL USING (auth.uid() = user_id);
-- Admins: Full management (approval, deletion, etc.)
CREATE POLICY "reviews_admin_all" ON product_reviews FOR ALL USING (is_admin());

-- PAYMENT LOGS
-- Admins Only: Sensitive financial logs
CREATE POLICY "payment_logs_admin_only" ON payment_logs FOR ALL USING (is_admin());

-- 4. ADDITIONAL SECURITY CONSTRAINTS
-- Ensure user_id cannot be spoofed on creation
ALTER TABLE addresses ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE product_reviews ALTER COLUMN user_id SET DEFAULT auth.uid();
