-- ====================================================================
-- MIGRATION 014: Add Wholesale Price support (>= 12 units)
-- ====================================================================

-- 1. Add wholesale_price column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS wholesale_price DECIMAL(12,2);

-- 2. Update create_order_with_items RPC to apply wholesale pricing when quantity >= 12
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
    v_db_wholesale_price NUMERIC(12,2);
    v_effective_price NUMERIC(12,2);
    v_calculated_total NUMERIC(12,2) := 0;
BEGIN
    -- 1. Insert order (total_amount updated after computing items)
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
        0,
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

        -- Read stock AND prices from DB with row lock
        SELECT stock_quantity, price, sale_price, wholesale_price
        INTO v_stock, v_db_price, v_db_sale_price, v_db_wholesale_price
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

        -- Price determination:
        -- If quantity >= 12, use wholesale_price if available, otherwise default to 20% discount (or sale_price)
        IF v_quantity >= 12 THEN
            IF v_db_wholesale_price IS NOT NULL AND v_db_wholesale_price > 0 THEN
                v_effective_price := v_db_wholesale_price;
            ELSIF v_db_sale_price IS NOT NULL AND v_db_sale_price > 0 THEN
                v_effective_price := v_db_sale_price;
            ELSE
                v_effective_price := ROUND(v_db_price * 0.8, -2);
            END IF;
        ELSE
            -- Detal (1-11 units)
            v_effective_price := COALESCE(v_db_sale_price, v_db_price);
        END IF;

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

    -- 3. Update order total with the verified calculated amount
    UPDATE orders
    SET total_amount = v_calculated_total
    WHERE id = v_order_id;

    RETURN jsonb_build_object('id', v_order_id, 'order_number', v_order_number, 'total_amount', v_calculated_total);
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_order_with_items(JSONB, JSONB) TO anon, authenticated;

COMMENT ON FUNCTION public.create_order_with_items(JSONB, JSONB) IS 'Creates an order with items applying retail or wholesale pricing based on quantity (>= 12 units). Prices are verified against DB.';
