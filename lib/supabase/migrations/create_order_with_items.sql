-- ====================================================================
-- CREATE ORDER (RLS bypass via SECURITY DEFINER)
-- Bypasses RLS policies entirely so checkouts work regardless of
-- whether INSERT policies exist on orders / order_items.
-- Both anon and authenticated roles can use it.
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
BEGIN
    -- 1. Insert order
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
        (p_order->>'total_amount')::NUMERIC,
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

    -- 2. Insert items
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        INSERT INTO order_items (
            order_id, product_id, quantity, unit_price, total_price,
            product_name_snapshot, product_sku_snapshot
        ) VALUES (
            v_order_id,
            (v_item->>'id')::UUID,
            (v_item->>'quantity')::INT,
            (v_item->>'price')::NUMERIC,
            ((v_item->>'price')::NUMERIC * (v_item->>'quantity')::INT),
            v_item->>'name',
            COALESCE(v_item->>'sku', '')
        );
    END LOOP;

    RETURN jsonb_build_object('id', v_order_id, 'order_number', v_order_number);
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_order_with_items(JSONB, JSONB) TO anon, authenticated;

COMMENT ON FUNCTION public.create_order_with_items(JSONB, JSONB) IS 'Creates an order with items bypassing RLS via SECURITY DEFINER. Accepts order data and items array as JSONB.';
