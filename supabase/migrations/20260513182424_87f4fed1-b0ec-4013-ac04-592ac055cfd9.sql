
-- Ensure has_role can be executed by API roles (used inside RLS policies)
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_exists() TO anon, authenticated;

-- Bootstrap function: lets the first authenticated user claim admin role.
-- Once any admin exists, this becomes a no-op.
CREATE OR REPLACE FUNCTION public.bootstrap_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
BEGIN
  IF uid IS NULL THEN
    RETURN false;
  END IF;
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    RETURN false;
  END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (uid, 'admin')
  ON CONFLICT DO NOTHING;
  RETURN true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.bootstrap_admin() TO authenticated;

-- Backfill: grant admin to the already-created Catalog account
INSERT INTO public.user_roles (user_id, role)
SELECT '3fcb1024-ac74-43fd-aab5-16794f690435'::uuid, 'admin'::public.app_role
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_roles
  WHERE user_id = '3fcb1024-ac74-43fd-aab5-16794f690435' AND role = 'admin'
);
