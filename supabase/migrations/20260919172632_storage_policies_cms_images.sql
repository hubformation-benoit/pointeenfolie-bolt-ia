/*
# Storage policies for cms-images bucket

Creates public read access and authenticated write access for the cms-images storage bucket.
*/

-- Public read for cms-images bucket
DROP POLICY IF EXISTS "public_read_cms_images" ON storage.objects;
CREATE POLICY "public_read_cms_images" ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'cms-images');

-- Authenticated insert for cms-images bucket
DROP POLICY IF EXISTS "auth_insert_cms_images" ON storage.objects;
CREATE POLICY "auth_insert_cms_images" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'cms-images');

-- Authenticated update for cms-images bucket
DROP POLICY IF EXISTS "auth_update_cms_images" ON storage.objects;
CREATE POLICY "auth_update_cms_images" ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'cms-images')
  WITH CHECK (bucket_id = 'cms-images');

-- Authenticated delete for cms-images bucket
DROP POLICY IF EXISTS "auth_delete_cms_images" ON storage.objects;
CREATE POLICY "auth_delete_cms_images" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'cms-images');
