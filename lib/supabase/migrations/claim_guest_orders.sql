-- ====================================================================
-- CLAIM GUEST ORDERS ON REGISTRATION / LOGIN
-- When a guest places an order with email=X and later registers with
-- the same email, this function links all their guest orders to their
-- new auth account.
-- SECURITY DEFINER so it can UPDATE rows where user_id IS NULL (RLS
-- normally blocks UPDATE on orders for non-admin users).
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
    UPDATE orders
    SET user_id = p_user_id
    WHERE email = p_email
      AND user_id IS NULL;

    GET DIAGNOSTICS v_count = ROW_COUNT;
    RETURN v_count;
END;
$$;

-- Only authenticated users can call this (they must provide their own email + id)
GRANT EXECUTE ON FUNCTION public.claim_guest_orders(TEXT, UUID) TO authenticated;

COMMENT ON FUNCTION public.claim_guest_orders(TEXT, UUID) IS 'Links guest orders (user_id IS NULL) matching the given email to the authenticated user. Returns count of linked orders.';
