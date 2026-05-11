
ALTER FUNCTION public.touch_updated_at() SET search_path = public;

-- Restrict execute on security definer functions
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.touch_updated_at() FROM anon, authenticated, public;
-- admin_exists must be callable by anon for first-run setup check
REVOKE EXECUTE ON FUNCTION public.admin_exists() FROM authenticated;
GRANT EXECUTE ON FUNCTION public.admin_exists() TO anon;

-- Restrict listing for product-images bucket: only allow direct path access
DROP POLICY IF EXISTS "public read product images" ON storage.objects;
CREATE POLICY "public read product images" ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');
-- (kept; listing is fine for a public catalog gallery)
