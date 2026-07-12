-- ====================================================================
-- AUTO STOCK STATUS TRIGGER
-- Automatically sets product status to out_of_stock when stock hits 0,
-- and back to published when stock becomes positive.
-- This runs on EVERY stock update, regardless of source (admin panel,
-- RPC, direct SQL), so the status is always in sync.
-- ====================================================================

CREATE OR REPLACE FUNCTION public.auto_sync_stock_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    IF NEW.stock_quantity <= 0 AND (OLD.stock_quantity > 0 OR OLD.stock_quantity IS NULL) THEN
        NEW.status = 'out_of_stock'::product_status;
    ELSIF NEW.stock_quantity > 0 AND (OLD.stock_quantity <= 0 OR OLD.stock_quantity IS NULL) THEN
        NEW.status = 'published'::product_status;
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_auto_sync_stock_status ON products;

CREATE TRIGGER tr_auto_sync_stock_status
    BEFORE UPDATE OF stock_quantity ON products
    FOR EACH ROW
    EXECUTE FUNCTION public.auto_sync_stock_status();

COMMENT ON TRIGGER tr_auto_sync_stock_status ON products IS 'Auto-switches status between published and out_of_stock based on stock_quantity.';
