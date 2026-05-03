-- 1. Asegurarse de que el bucket existe
INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Permitir que cualquier usuario (o solo autenticados) vea las imágenes
CREATE POLICY "Cualquiera puede ver imágenes"
ON storage.objects FOR SELECT
USING (bucket_id = 'products');

-- 3. Permitir subida a usuarios autenticados
CREATE POLICY "Usuarios autenticados pueden subir imágenes"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'products');

-- 4. Permitir actualizar y borrar a usuarios autenticados
CREATE POLICY "Usuarios autenticados pueden editar/borrar imágenes"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'products');

-- Eliminar políticas anteriores para evitar conflictos
DROP POLICY IF EXISTS "Usuarios autenticados pueden subir imágenes" ON storage.objects;
DROP POLICY IF EXISTS "Usuarios autenticados pueden editar/borrar imágenes" ON storage.objects;

-- 1. La lectura sigue siendo pública para que los clientes vean los productos
-- (Ya existe como "Cualquiera puede ver imágenes")

-- 2. Permitir INSERT solo a Admins
CREATE POLICY "Solo admins pueden subir imágenes"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'products' AND 
  (auth.jwt() ->> 'role' = 'admin' OR 
   EXISTS (
     SELECT 1 FROM public.profiles 
     WHERE id = auth.uid() AND role = 'admin'
   ))
);

-- 3. Permitir UPDATE y DELETE solo a Admins
CREATE POLICY "Solo admins pueden editar o borrar imágenes"
ON storage.objects FOR ALL
TO authenticated
USING (
  bucket_id = 'products' AND 
  (auth.jwt() ->> 'role' = 'admin' OR 
   EXISTS (
     SELECT 1 FROM public.profiles 
     WHERE id = auth.uid() AND role = 'admin'
   ))
);
