-- Update addresses table to include missing columns used in UI
ALTER TABLE public.addresses 
ADD COLUMN IF NOT EXISTS label TEXT,
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT;

-- Verify columns
COMMENT ON COLUMN public.addresses.label IS 'Etiqueta de la dirección (Casa, Oficina, etc.)';
COMMENT ON COLUMN public.addresses.full_name IS 'Nombre de quien recibe';
COMMENT ON COLUMN public.addresses.phone IS 'Teléfono de contacto para la entrega';

-- ====================================================================
-- RLS POLICIES FOR ADDRESSES
-- ====================================================================

    -- Asegurar que RLS esté activo
    ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

    -- Eliminar políticas antiguas si existen para evitar duplicados
    DROP POLICY IF EXISTS "addresses_own_manage" ON public.addresses;
    DROP POLICY IF EXISTS "addresses_admin_manage" ON public.addresses;

    -- Política para usuarios (CRUD total sobre sus propias direcciones)
    -- El USING cubre SELECT, UPDATE, DELETE
    -- El WITH CHECK cubre INSERT y UPDATE
    CREATE POLICY "addresses_own_manage" 
    ON public.addresses FOR ALL 
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

    -- Política para administradores (Acceso total)
    CREATE POLICY "addresses_admin_manage" 
    ON public.addresses FOR ALL 
    TO authenticated
    USING (public.is_admin());
