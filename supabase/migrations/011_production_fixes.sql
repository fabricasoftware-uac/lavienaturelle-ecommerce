-- ====================================================================
-- PRODUCTION FIXES: Security + Data Integrity
-- Issues found in pre-launch review
-- ====================================================================

-- ====================================================================
-- FIX 1: RLS blocks out_of_stock products from public view
-- Problem: products_read_public only allowed status='published'
--          but getProducts() queries ['published', 'out_of_stock']
-- Solution: Allow both 'published' and 'out_of_stock' for public reads
-- ====================================================================

DROP POLICY IF EXISTS "products_read_public" ON products;
CREATE POLICY "products_read_public" ON products FOR SELECT USING (
    (status IN ('published', 'out_of_stock') AND deleted_at IS NULL) OR is_admin()
);

-- ====================================================================
-- FIX 2: claim_guest_orders allows any authenticated user to steal orders
-- Problem: No caller verification — any authenticated user can pass
--          someone else's email and user_id to steal their guest orders
-- Solution: Verify p_user_id matches auth.uid() and p_email matches JWT
-- ====================================================================

CREATE OR REPLACE FUNCTION public.claim_guest_orders(p_email TEXT, p_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_count INTEGER;
BEGIN
    -- Security: verify the caller is claiming their own orders
    IF auth.uid() IS NULL OR auth.uid() != p_user_id THEN
        RAISE EXCEPTION 'No autorizado: solo puedes reclamar tus propias órdenes';
    END IF;

    -- Verify the email matches the authenticated user's email from JWT
    IF p_email != auth.jwt() ->> 'email' THEN
        RAISE EXCEPTION 'No autorizado: el email no coincide con tu sesión';
    END IF;

    UPDATE orders
    SET user_id = p_user_id
    WHERE email = p_email
      AND user_id IS NULL;

    GET DIAGNOSTICS v_count = ROW_COUNT;
    RETURN v_count;
END;
$$;

GRANT EXECUTE ON FUNCTION public.claim_guest_orders(TEXT, UUID) TO authenticated;

COMMENT ON FUNCTION public.claim_guest_orders(TEXT, UUID) IS 'Links guest orders (user_id IS NULL) matching the caller email to the authenticated user. Verified against auth.uid() and JWT email.';

-- ====================================================================
-- FIX 3: Price manipulation — order items accept arbitrary client prices
-- Problem: RPC inserts unit_price from client JSONB without validating
--          against DB. Users can set prices to $1 via localStorage.
-- Solution: RPC reads actual price from products table (with FOR UPDATE)
--          and ignores the client-supplied price entirely.
-- ====================================================================

CREATE OR REPLACE FUNCTION public.create_order_with_items(p_order JSONB, p_items JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_order_id UUID;
    v_order_number TEXT;
    v_item JSONB;
    v_product_id UUID;
    v_quantity INT;
    v_stock INT;
    v_db_price NUMERIC(12,2);
    v_db_sale_price NUMERIC(12,2);
    v_effective_price NUMERIC(12,2);
    v_calculated_total NUMERIC(12,2) := 0;
BEGIN
    -- 1. Insert order (total_amount will be recalculated after items)
    INSERT INTO orders (
        order_number, user_id, email, full_name, phone, document_number,
        total_amount, shipping_cost, tax_amount,
        shipping_address_line1, shipping_address_line2,
        shipping_city, shipping_state, shipping_country,
        payment_status, payment_method, status
    ) VALUES (
        p_order->>'order_number',
        (p_order->>'user_id')::UUID,
        p_order->>'email',
        p_order->>'full_name',
        p_order->>'phone',
        p_order->>'document_number',
        0, -- placeholder, updated after items are processed
        COALESCE((p_order->>'shipping_cost')::NUMERIC, 0),
        COALESCE((p_order->>'tax_amount')::NUMERIC, 0),
        p_order->>'shipping_address_line1',
        p_order->>'shipping_address_line2',
        p_order->>'shipping_city',
        p_order->>'shipping_state',
        COALESCE(p_order->>'shipping_country', 'Colombia'),
        COALESCE((p_order->>'payment_status')::payment_status, 'pending'::payment_status),
        p_order->>'payment_method',
        COALESCE((p_order->>'status')::order_status, 'pending'::order_status)
    )
    RETURNING id, order_number INTO v_order_id, v_order_number;

    -- 2. Insert items + decrement stock atomically
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_product_id := (v_item->>'id')::UUID;
        v_quantity := (v_item->>'quantity')::INT;

        -- Read stock AND price from DB (FOR UPDATE locks the row)
        SELECT stock_quantity, price, sale_price
        INTO v_stock, v_db_price, v_db_sale_price
        FROM products
        WHERE id = v_product_id
        FOR UPDATE;

        IF v_stock IS NULL THEN
            RAISE EXCEPTION 'Producto no encontrado: %', v_item->>'name';
        END IF;

        IF v_stock < v_quantity THEN
            RAISE EXCEPTION 'Stock insuficiente para %: disponible %, requerido %',
                v_item->>'name', v_stock, v_quantity;
        END IF;

        -- Use DB price, never the client-supplied price
        v_effective_price := COALESCE(v_db_sale_price, v_db_price);

        -- Insert order item with verified price
        INSERT INTO order_items (
            order_id, product_id, quantity, unit_price, total_price,
            product_name_snapshot, product_sku_snapshot
        ) VALUES (
            v_order_id,
            v_product_id,
            v_quantity,
            v_effective_price,
            (v_effective_price * v_quantity),
            v_item->>'name',
            COALESCE(v_item->>'sku', '')
        );

        -- Accumulate calculated total
        v_calculated_total := v_calculated_total + (v_effective_price * v_quantity);

        -- Decrement stock
        UPDATE products
        SET stock_quantity = stock_quantity - v_quantity,
            status = CASE
                WHEN stock_quantity - v_quantity <= 0 THEN 'out_of_stock'::product_status
                ELSE status
            END
        WHERE id = v_product_id;
    END LOOP;

    -- 3. Update order total with the real calculated amount
    UPDATE orders
    SET total_amount = v_calculated_total
    WHERE id = v_order_id;

    RETURN jsonb_build_object('id', v_order_id, 'order_number', v_order_number, 'total_amount', v_calculated_total);
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_order_with_items(JSONB, JSONB) TO anon, authenticated;

COMMENT ON FUNCTION public.create_order_with_items(JSONB, JSONB) IS 'Creates an order with items bypassing RLS via SECURITY DEFINER. Prices are read from the products table, not the client. Total is calculated from DB prices.';