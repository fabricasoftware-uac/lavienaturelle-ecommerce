-- ====================================================================
-- RBAC OPTIMIZADO (Role-Based Access Control)
-- Objetivo: Usar los metadatos del JWT en lugar de consultas a tablas
-- ====================================================================

-- 1. ACTUALIZACIÓN DE FUNCIONES DE VERIFICACIÓN
-- Estas funciones ahora son mucho más rápidas ya que no hacen SELECT

-- Función para obtener el rol directamente del JWT
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS user_role AS $$
BEGIN
    -- Obtenemos el rol desde app_metadata dentro del JWT
    -- Supabase mapea 'raw_app_meta_data' de la tabla auth.users a 'app_metadata' en el JWT
    RETURN (auth.jwt() -> 'app_metadata' ->> 'role')::user_role;
EXCEPTION
    WHEN OTHERS THEN
        RETURN 'customer'::user_role; -- Fallback por seguridad
END;
$$ LANGUAGE plpgsql STABLE;

-- Función rápida para verificar si es admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (public.get_my_role() = 'admin');
END;
$$ LANGUAGE plpgsql STABLE;

-- 2. REINICIO DE POLÍTICAS EXISTENTES
-- Limpiamos para aplicar la nueva lógica optimizada
DO $$ 
DECLARE 
    r record;
BEGIN
    FOR r IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public') 
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON ' || quote_ident(r.tablename);
    END LOOP;
END $$;

-- 3. APLICACIÓN DE POLÍTICAS OPTIMIZADAS Y EXTENDIDAS

-- PROFILES
CREATE POLICY "profiles_read_own" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_admin_manage" ON profiles FOR ALL USING (is_admin());

-- ADDRESSES
CREATE POLICY "addresses_own_manage" ON addresses FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "addresses_admin_manage" ON addresses FOR ALL USING (is_admin());

-- CATEGORIES
-- Los admins pueden ver incluso las eliminadas lógicamente
CREATE POLICY "categories_read_public" ON categories FOR SELECT USING (deleted_at IS NULL OR is_admin());
CREATE POLICY "categories_admin_manage" ON categories FOR ALL USING (is_admin());

-- PRODUCTS
-- Los admins pueden ver productos en draft o eliminados
CREATE POLICY "products_read_public" ON products FOR SELECT USING ((status = 'published' AND deleted_at IS NULL) OR is_admin());
CREATE POLICY "products_admin_manage" ON products FOR ALL USING (is_admin());

-- PRODUCT MULTIMEDIA
CREATE POLICY "multimedia_read_all" ON product_multimedia FOR SELECT USING (true);
CREATE POLICY "multimedia_admin_manage" ON product_multimedia FOR ALL USING (is_admin());

-- ORDERS
-- Permitimos insertar a cualquiera para checkout de invitados
CREATE POLICY "orders_insert_any" ON orders FOR INSERT WITH CHECK (true);
-- Clientes ven sus órdenes por ID o por Email (crucial para invitados que luego se registran)
CREATE POLICY "orders_read_own" ON orders FOR SELECT USING (
    auth.uid() = user_id OR 
    email = auth.jwt() ->> 'email'
);
-- Admins: Control total (pueden editar tracking, transportadora, etc)
CREATE POLICY "orders_admin_manage" ON orders FOR ALL USING (is_admin());

-- ORDER ITEMS
CREATE POLICY "order_items_insert_any" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "order_items_read_own" ON order_items FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM orders 
        WHERE orders.id = order_items.order_id 
        AND (orders.user_id = auth.uid() OR orders.email = auth.jwt() ->> 'email')
    )
);
CREATE POLICY "order_items_admin_manage" ON order_items FOR ALL USING (is_admin());

-- PRODUCT REVIEWS
CREATE POLICY "reviews_read_public" ON product_reviews FOR SELECT USING (status = 'approved' OR is_admin());
CREATE POLICY "reviews_insert_logged" ON product_reviews FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "reviews_manage_own" ON product_reviews FOR ALL USING (auth.uid() = user_id OR is_admin());

-- PAYMENT LOGS
-- Los admins tienen acceso total a los logs de pago para soporte
CREATE POLICY "payment_logs_admin_manage" ON payment_logs FOR ALL USING (is_admin());

-- 4. PERMISOS ADICIONALES PARA ADMIN
-- Nos aseguramos que el admin pueda hacer bypass de los defaults de auth.uid()
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

COMMENT ON FUNCTION public.get_my_role() IS 'Versión optimizada que lee el rol desde el JWT (app_metadata) evitando queries innecesarias.';
