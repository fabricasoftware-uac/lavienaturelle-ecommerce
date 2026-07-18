-- Enable Realtime for catalog tables
-- This allows the client-side catalog to receive live updates

ALTER PUBLICATION supabase_realtime ADD TABLE products;
ALTER PUBLICATION supabase_realtime ADD TABLE categories;
ALTER PUBLICATION supabase_realtime ADD TABLE product_multimedia;
