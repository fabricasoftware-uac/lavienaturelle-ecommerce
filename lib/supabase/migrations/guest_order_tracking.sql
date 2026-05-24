-- ====================================================================
-- GUEST ORDER TRACKING (Secure alternative to open RLS)
-- Problem: guests can't SELECT their own orders because RLS policies
-- only allow auth.uid() / auth.jwt() ->> 'email'.
-- Mitigation: SECURITY DEFINER RPC that returns a single order when
-- both order_number AND document_number match. No auth required.
-- ====================================================================

-- Function: lookup order + items by order_number + document_number
-- Returns JSONB with full order snapshot including nested order_items array.
-- SECURITY DEFINER bypasses RLS safely because it only exposes the
-- exact row matching both secrets (order_number + document_number).
CREATE OR REPLACE FUNCTION public.get_order_by_tracking(order_num TEXT, doc_num TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'id', o.id,
        'order_number', o.order_number,
        'status', o.status,
        'payment_status', o.payment_status,
        'total_amount', o.total_amount,
        'email', o.email,
        'full_name', o.full_name,
        'phone', o.phone,
        'document_number', o.document_number,
        'shipping_address_line1', o.shipping_address_line1,
        'shipping_address_line2', o.shipping_address_line2,
        'shipping_city', o.shipping_city,
        'shipping_state', o.shipping_state,
        'shipping_country', o.shipping_country,
        'payment_method', o.payment_method,
        'tracking_number', o.tracking_number,
        'courier_name', o.courier_name,
        'created_at', o.created_at,
        'updated_at', o.updated_at,
        'user_id', o.user_id,
        'order_items', COALESCE(
            (
                SELECT jsonb_agg(
                    jsonb_build_object(
                        'id', oi.id,
                        'order_id', oi.order_id,
                        'product_id', oi.product_id,
                        'quantity', oi.quantity,
                        'unit_price', oi.unit_price,
                        'total_price', oi.total_price,
                        'product_name_snapshot', oi.product_name_snapshot,
                        'product_sku_snapshot', oi.product_sku_snapshot
                    ) ORDER BY oi.created_at
                )
                FROM order_items oi
                WHERE oi.order_id = o.id
            ),
            '[]'::jsonb
        )
    )
    INTO result
    FROM orders o
    WHERE o.order_number = upper(order_num)
      AND o.document_number = doc_num;

    RETURN result;
END;
$$;

-- Grant execute to both authenticated and anon roles so guests can use it
GRANT EXECUTE ON FUNCTION public.get_order_by_tracking(TEXT, TEXT) TO anon, authenticated;

COMMENT ON FUNCTION public.get_order_by_tracking(TEXT, TEXT) IS 'Secure guest order lookup by order_number + document_number. Bypasses RLS via SECURITY DEFINER but only returns the exact matching row.';
