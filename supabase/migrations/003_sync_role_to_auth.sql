-- ====================================================================
-- Sincronización de Roles: public.profiles -> auth.users (raw_app_meta_data)
-- ====================================================================

-- 1. Limpieza (Opcional, para evitar conflictos si ya existía una versión previa)
DROP TRIGGER IF EXISTS tr_sync_role_to_auth ON public.profiles;
DROP FUNCTION IF EXISTS public.handle_sync_role_to_auth();

-- 2. Creación de la Función de Sincronización
-- Usamos SECURITY DEFINER para que tenga permisos sobre el esquema auth.
CREATE OR REPLACE FUNCTION public.handle_sync_role_to_auth()
RETURNS TRIGGER AS $$
BEGIN
    -- Actualizamos la metadata en la tabla interna de Supabase Auth
    -- Nota: El nombre real de la columna es 'raw_app_meta_data'
    UPDATE auth.users
    SET raw_app_meta_data = jsonb_set(
        COALESCE(raw_app_meta_data, '{}'::jsonb),
        '{role}',
        to_jsonb(NEW.role)
    )
    WHERE id = NEW.id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = auth;

-- 3. Creación del Trigger
-- Se activa cada vez que se crea un perfil o se cambia el rol en public.profiles
CREATE TRIGGER tr_sync_role_to_auth
    AFTER INSERT OR UPDATE OF role ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_sync_role_to_auth();

-- 4. Migración de Usuarios Existentes
-- Este bloque recorre tu tabla profiles y actualiza auth.users inmediatamente
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN SELECT id, role FROM public.profiles LOOP
        UPDATE auth.users
        SET raw_app_meta_data = jsonb_set(
            COALESCE(raw_app_meta_data, '{}'::jsonb),
            '{role}',
            to_jsonb(r.role)
        )
        WHERE id = r.id;
    END LOOP;
END $$;

-- 5. Comentario de Documentación
COMMENT ON FUNCTION public.handle_sync_role_to_auth() IS 'Sincroniza el rol de la tabla profiles con raw_app_meta_data de auth para optimizar el Proxy de Next.js.';