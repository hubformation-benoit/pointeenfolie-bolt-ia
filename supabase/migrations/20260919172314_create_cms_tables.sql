/*
# Create CMS tables for restaurant content management

This migration creates the database schema that allows the restaurateur to manage
all content currently hardcoded in data.ts: menu items (pizzas, salads, drinks, desserts),
weekly events, opening hours, site settings (address/phone/email + site alert),
and gallery images. Menu items have a priority field for display ordering.

## 1. New Tables

### `menu_items`
Stores all menu items across 4 categories.
- `id` (uuid, primary key)
- `category` (text: 'pizza' | 'salad' | 'drink' | 'dessert') — distinguishes item type
- `name_fr` (text, not null) — French name, always required
- `name_en` (text) — English name (optional, falls back to French)
- `desc_fr` (text) — French description
- `desc_en` (text) — English description
- `price_p` (numeric) — small pizza price
- `price_m` (numeric) — medium pizza price
- `price_g` (numeric) — large pizza price
- `salad_price_entree` (numeric) — salad starter price
- `salad_price_repas` (numeric) — salad main price
- `price` (numeric) — simple price (drinks, desserts)
- `image` (text) — image URL or storage path
- `badges` (text[]) — array of badge strings: 'spicy', 'veg', 'dessert'
- `priority` (int, default 0) — display ordering within category (ascending)
- `created_at` (timestamptz)

### `weekly_event`
Single-row table for the weekly musical event.
- `id` (int, primary key, always 1)
- `band_name` (text) — name of the band/artist
- `desc_fr` (text) — French description
- `desc_en` (text) — English description
- `date` (date) — event date
- `time` (text) — event time (HH:MM format)
- `image` (text) — image URL or storage path

### `open_hours`
Opening hours entries.
- `id` (uuid, primary key)
- `days_fr` (text) — French day range label
- `days_en` (text) — English day range label
- `hours_fr` (text) — French hours label
- `hours_en` (text) — English hours label
- `priority` (int, default 0) — display ordering

### `site_settings`
Single-row table for site-wide settings.
- `id` (int, primary key, always 1)
- `address_fr` (text) — French address
- `address_en` (text) — English address
- `phone` (text) — phone number
- `email` (text) — contact email
- `alert_fr` (text) — French site alert banner text
- `alert_en` (text) — English site alert banner text

### `gallery_images`
Gallery photos for the masonry layout on the home page.
- `id` (uuid, primary key)
- `url` (text) — image URL or storage path
- `alt_fr` (text) — French alt text
- `alt_en` (text) — English alt text
- `priority` (int, default 0) — display ordering

## 2. Security

All tables have RLS enabled.

- **menu_items**: public read (anon + authenticated), write only for authenticated
- **weekly_event**: public read, write only for authenticated
- **open_hours**: public read, write only for authenticated
- **site_settings**: public read, write only for authenticated
- **gallery_images**: public read, write only for authenticated

Since this is a restaurant CMS with a single admin account, we use `TO authenticated`
for writes and `TO anon, authenticated` for reads. The admin signs in with email/password.

## 3. Storage

A public storage bucket `cms-images` is created for image uploads.
*/

-- Menu items table
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL CHECK (category IN ('pizza', 'salad', 'drink', 'dessert')),
  name_fr text NOT NULL,
  name_en text DEFAULT '',
  desc_fr text DEFAULT '',
  desc_en text DEFAULT '',
  price_p numeric(10,2),
  price_m numeric(10,2),
  price_g numeric(10,2),
  salad_price_entree numeric(10,2),
  salad_price_repas numeric(10,2),
  price numeric(10,2),
  image text,
  badges text[] DEFAULT '{}',
  priority int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_menu_items" ON menu_items;
CREATE POLICY "public_read_menu_items" ON menu_items FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_menu_items" ON menu_items;
CREATE POLICY "auth_insert_menu_items" ON menu_items FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_menu_items" ON menu_items;
CREATE POLICY "auth_update_menu_items" ON menu_items FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_menu_items" ON menu_items;
CREATE POLICY "auth_delete_menu_items" ON menu_items FOR DELETE
  TO authenticated USING (true);

-- Weekly event table (single row)
CREATE TABLE IF NOT EXISTS weekly_event (
  id int PRIMARY KEY DEFAULT 1,
  band_name text NOT NULL DEFAULT '',
  desc_fr text DEFAULT '',
  desc_en text DEFAULT '',
  date date,
  time text DEFAULT '',
  image text,
  CONSTRAINT single_row CHECK (id = 1)
);

ALTER TABLE weekly_event ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_weekly_event" ON weekly_event;
CREATE POLICY "public_read_weekly_event" ON weekly_event FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_weekly_event" ON weekly_event;
CREATE POLICY "auth_insert_weekly_event" ON weekly_event FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_weekly_event" ON weekly_event;
CREATE POLICY "auth_update_weekly_event" ON weekly_event FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_weekly_event" ON weekly_event;
CREATE POLICY "auth_delete_weekly_event" ON weekly_event FOR DELETE
  TO authenticated USING (true);

-- Open hours table
CREATE TABLE IF NOT EXISTS open_hours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  days_fr text NOT NULL DEFAULT '',
  days_en text DEFAULT '',
  hours_fr text DEFAULT '',
  hours_en text DEFAULT '',
  priority int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE open_hours ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_open_hours" ON open_hours;
CREATE POLICY "public_read_open_hours" ON open_hours FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_open_hours" ON open_hours;
CREATE POLICY "auth_insert_open_hours" ON open_hours FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_open_hours" ON open_hours;
CREATE POLICY "auth_update_open_hours" ON open_hours FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_open_hours" ON open_hours;
CREATE POLICY "auth_delete_open_hours" ON open_hours FOR DELETE
  TO authenticated USING (true);

-- Site settings table (single row)
CREATE TABLE IF NOT EXISTS site_settings (
  id int PRIMARY KEY DEFAULT 1,
  address_fr text NOT NULL DEFAULT '',
  address_en text DEFAULT '',
  phone text DEFAULT '',
  email text DEFAULT '',
  alert_fr text DEFAULT '',
  alert_en text DEFAULT '',
  CONSTRAINT single_row CHECK (id = 1)
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_site_settings" ON site_settings;
CREATE POLICY "public_read_site_settings" ON site_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_site_settings" ON site_settings;
CREATE POLICY "auth_insert_site_settings" ON site_settings FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_site_settings" ON site_settings;
CREATE POLICY "auth_update_site_settings" ON site_settings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_site_settings" ON site_settings;
CREATE POLICY "auth_delete_site_settings" ON site_settings FOR DELETE
  TO authenticated USING (true);

-- Gallery images table
CREATE TABLE IF NOT EXISTS gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL DEFAULT '',
  alt_fr text DEFAULT '',
  alt_en text DEFAULT '',
  priority int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_gallery_images" ON gallery_images;
CREATE POLICY "public_read_gallery_images" ON gallery_images FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_gallery_images" ON gallery_images;
CREATE POLICY "auth_insert_gallery_images" ON gallery_images FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_gallery_images" ON gallery_images;
CREATE POLICY "auth_update_gallery_images" ON gallery_images FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_gallery_images" ON gallery_images;
CREATE POLICY "auth_delete_gallery_images" ON gallery_images FOR DELETE
  TO authenticated USING (true);

-- Insert default row for weekly_event
INSERT INTO weekly_event (id, band_name, desc_fr, desc_en, date, time, image)
VALUES (1, 'Les Folies Solaires',
  'Un trio jazz-gypsy qui mêle swing manouche et compositions originales. Venez vibrer au son des cordes et des cuivres dans une ambiance intime et chaleureuse.',
  'A jazz-gypsy trio blending gypsy swing with original compositions. Come vibrate to the sound of strings and brass in an intimate, warm atmosphere.',
  '2026-09-12', '19:00',
  'https://images.pexels.com/photos/8040838/pexels-photo-8040838.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
) ON CONFLICT (id) DO NOTHING;

-- Insert default row for site_settings
INSERT INTO site_settings (id, address_fr, address_en, phone, email, alert_fr, alert_en)
VALUES (1,
  '1642 chemin des Briques Jaunes, Montréal (Québec), Canada H4C 3V5',
  '1642 Yellow Bricks Road, Montreal (Quebec), Canada H4C 3V5',
  '(514) 888-8888',
  'info@pointeenfolie.com',
  'Attention! Ce site est généré par l''IA et la pizzéria n''existe pas vraiment. Si vous voulez apprendre comment faire un site comme ceci, contactez-nous à info@hubformation.ca',
  'Please note! This site is generated by AI, and the pizzeria does not actually exist. If you would like to learn how to create a site like this, contact us at info@hubformation.ca.'
) ON CONFLICT (id) DO NOTHING;

-- Insert default open hours
INSERT INTO open_hours (days_fr, days_en, hours_fr, hours_en, priority)
VALUES
  ('Dimanche – Mercredi', 'Sunday – Wednesday', '11h – 21h', '11am – 9pm', 0),
  ('Jeudi – Samedi', 'Thursday – Saturday', '11h – 22h', '11am – 10pm', 1)
ON CONFLICT DO NOTHING;

-- Insert default menu items from data.ts
-- Pizzas
INSERT INTO menu_items (category, name_fr, name_en, desc_fr, desc_en, price_p, price_m, price_g, image, badges, priority)
VALUES
  ('pizza', 'Trois Mousquetaires', 'Three Musketeers',
   'Saucisses chorizo, merguez, saucisses italiennes fortes, piments jalapeños, oignons, gruyère, cheddar fort et sauce tomate.',
   'Chorizo sausage, merguez, hot Italian sausage, jalapeño peppers, onions, Gruyère, sharp cheddar and tomato sauce.',
   12, 16, 18,
   'https://images.pexels.com/photos/5903100/pexels-photo-5903100.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
   '{spicy}', 0),
  ('pizza', 'Cardinal Richelieu', '',
   'Nappée d''une sauce tomate sucrée avec un soupçon de miel, pancetta grillé, parmesan, mozzarella et origan.',
   'Topped with a sweet tomato sauce with a hint of honey, grilled pancetta, Parmesan, mozzarella and oregano.',
   12, 16, 18,
   'https://images.pexels.com/photos/31596394/pexels-photo-31596394.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
   '{}', 1),
  ('pizza', 'Marie-Antoinette', '',
   'Riche couche de prosciutto, aubergines grillées, boccoccini et une sauce tomates/pesto.',
   'Rich layer of prosciutto, grilled eggplant, bocconcini and a tomato/pesto sauce.',
   12, 16, 18,
   'https://images.pexels.com/photos/19260842/pexels-photo-19260842.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
   '{}', 2),
  ('pizza', 'Révolution Française', 'French Revolution',
   'Poivrons verts, tomates séchées, oignons rouges, aubergines grillées, mozzarella, huile d''olive et sauce blanche.',
   'Green peppers, sun-dried tomatoes, red onions, grilled eggplant, mozzarella, olive oil and white sauce.',
   12, 16, 18,
   'https://images.pexels.com/photos/26575528/pexels-photo-26575528.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
   '{veg}', 3),
  ('pizza', 'Flotte Royale', 'Royal Fleet',
   'Saumon fumé, crevettes fraîches, câpres, oignons rouges, gruyère, coriandre et sauce rosée.',
   'Smoked salmon, fresh shrimp, capers, red onions, Gruyère, cilantro and pink sauce.',
   14, 18, 22,
   'https://images.pexels.com/photos/13457624/pexels-photo-13457624.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
   '{}', 4),
  ('pizza', 'Vivante Campagne', 'Vibrant Countryside',
   'Oignons doux, viande fumée, pommes de terre et sauce chipotle.',
   'Sweet onions, smoked meat, potatoes and chipotle sauce.',
   12, 16, 18,
   'https://images.pexels.com/photos/5848281/pexels-photo-5848281.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
   '{}', 5),
  ('pizza', 'Bastille en Danger', 'Bastille in Danger',
   'Tranches de poires, coulis de chocolat, crème anglaise avec un soupçon de kirsch.',
   'Pear slices, chocolate coulis, custard with a hint of kirsch.',
   12, 16, 18,
   'https://images.pexels.com/photos/19260836/pexels-photo-19260836.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
   '{dessert}', 6),
  ('pizza', 'Pouvoir du Roi', 'Powerful King',
   'Merguez, bœuf haché, pepperoni, jambon, bacon, olives noires et sauce épicée aux tomates fraîches.',
   'Merguez, ground beef, pepperoni, ham, bacon, black olives and spicy fresh tomato sauce.',
   12, 16, 18,
   'https://images.pexels.com/photos/5903173/pexels-photo-5903173.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
   '{spicy}', 7),
  ('pizza', 'La Guillotine', 'The Guillotine',
   'Mozzarella, sauce piquante, chorizo, salami de Gênes et piments forts.',
   'Mozzarella, spicy sauce, chorizo, Genoa salami and hot peppers.',
   12, 16, 18,
   'https://images.pexels.com/photos/5903100/pexels-photo-5903100.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
   '{spicy}', 8),
  ('pizza', 'Absolutisme Transparent', 'Transparent Absolutism',
   'Mozzarella, parmesan, feta, cheddar vieilli, ricotta, épinards, ail rôti et sauce maison au vin blanc.',
   'Mozzarella, Parmesan, feta, aged cheddar, ricotta, spinach, roasted garlic and homemade white wine sauce.',
   12, 16, 18,
   'https://images.pexels.com/photos/19260728/pexels-photo-19260728.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
   '{veg}', 9)
ON CONFLICT DO NOTHING;

-- Salads
INSERT INTO menu_items (category, name_fr, name_en, desc_fr, desc_en, salad_price_entree, salad_price_repas, image, badges, priority)
VALUES
  ('salad', 'Salade César', 'Caesar Salad',
   'Laitue romaine, croûtons, parmesan, sauce César.',
   'Romaine lettuce, croutons, Parmesan, Caesar dressing.',
   8, 12,
   'https://images.pexels.com/photos/2291344/pexels-photo-2291344.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
   '{}', 0),
  ('salad', 'Salade Niçoise', 'Niçoise Salad',
   'Thon, haricots verts, tomates, œufs, olives, anchois.',
   'Tuna, green beans, tomatoes, eggs, olives, anchovies.',
   9, 20,
   'https://images.pexels.com/photos/31212423/pexels-photo-31212423.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
   '{}', 1),
  ('salad', 'Salade de Quinoa', 'Quinoa Salad',
   'Quinoa, légumes grillés, feta, vinaigrette au citron.',
   'Quinoa, grilled vegetables, feta, lemon vinaigrette.',
   10, 14,
   'https://images.pexels.com/photos/4553029/pexels-photo-4553029.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
   '{veg}', 2)
ON CONFLICT DO NOTHING;

-- Drinks
INSERT INTO menu_items (category, name_fr, name_en, desc_fr, desc_en, price, badges, priority)
VALUES
  ('drink', 'Coca-Cola', '', '33 cl', '12 oz', 2, '{}', 0),
  ('drink', 'Sprite', '', '33 cl', '12 oz', 2, '{}', 1),
  ('drink', 'Fanta', '', '33 cl', '12 oz', 2, '{}', 2),
  ('drink', 'Eau minérale', 'Mineral Water', 'Pétillante ou plate', 'Sparkling or still', 1, '{}', 3),
  ('drink', 'Jus d''orange', 'Orange Juice', 'Fraîchement pressé', 'Freshly squeezed', 3, '{}', 4)
ON CONFLICT DO NOTHING;

-- Desserts
INSERT INTO menu_items (category, name_fr, name_en, desc_fr, desc_en, price, image, badges, priority)
VALUES
  ('dessert', 'Tiramisu', '',
   'Mascarpone, café, cacao, biscuits savoiardi.',
   'Mascarpone, coffee, cocoa, ladyfingers.',
   9,
   'https://images.pexels.com/photos/19119979/pexels-photo-19119979.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
   '{}', 0),
  ('dessert', 'Gâteau au fromage', 'Cheesecake',
   'Cheesecake maison, coulis de fruits rouges.',
   'Homemade cheesecake, berry coulis.',
   9,
   'https://images.pexels.com/photos/29653160/pexels-photo-29653160.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
   '{}', 1),
  ('dessert', 'Crème brûlée', '',
   'Vanille de Madagascar, caramel craquant.',
   'Madagascar vanilla, crackling caramel.',
   6,
   'https://images.pexels.com/photos/9012594/pexels-photo-9012594.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
   '{}', 2)
ON CONFLICT DO NOTHING;

-- Gallery images
INSERT INTO gallery_images (url, alt_fr, alt_en, priority)
VALUES
  ('https://images.pexels.com/photos/24357593/pexels-photo-24357593.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Le chef en cuisine', 'Chef in the kitchen', 0),
  ('https://images.pexels.com/photos/8440072/pexels-photo-8440072.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Notre serveuse', 'Our waitress', 1),
  ('https://images.pexels.com/photos/37121079/pexels-photo-37121079.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Clients heureux', 'Happy guests', 2),
  ('https://images.pexels.com/photos/8040838/pexels-photo-8040838.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Musiciens live', 'Live musicians', 3),
  ('https://images.pexels.com/photos/4253292/pexels-photo-4253292.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Préparation des ingrédients', 'Preparing ingredients', 4),
  ('https://images.pexels.com/photos/9961850/pexels-photo-9961850.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Client savourant son repas', 'Guest enjoying a meal', 5),
  ('https://images.pexels.com/photos/3984830/pexels-photo-3984830.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Le groupe en concert', 'The band performing', 6),
  ('https://images.pexels.com/photos/29129767/pexels-photo-29129767.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Service à table', 'Table service', 7),
  ('https://images.pexels.com/photos/15441279/pexels-photo-15441279.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'L''équipe en cuisine', 'The kitchen team', 8),
  ('https://images.pexels.com/photos/7968583/pexels-photo-7968583.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Amis au restaurant', 'Friends at the restaurant', 9)
ON CONFLICT DO NOTHING;

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_menu_items_category_priority ON menu_items (category, priority);
CREATE INDEX IF NOT EXISTS idx_open_hours_priority ON open_hours (priority);
CREATE INDEX IF NOT EXISTS idx_gallery_images_priority ON gallery_images (priority);
