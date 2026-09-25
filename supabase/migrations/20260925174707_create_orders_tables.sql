/*
# Create orders, order_items, and order_status_changes tables

## Purpose
Stores customer orders placed from the public site, their line items, and
a full history of status changes. The admin dashboard reads and updates
these tables; the public site only inserts.

## 1. New Tables

### orders (header)
- id (uuid, primary key)
- order_number (int, unique, auto-generated from sequence starting at 1001)
- lang (text: 'fr' or 'en') — language the order was placed in
- mode (text: 'delivery' or 'pickup')
- delivery_date (date) — requested delivery/pickup date
- delivery_time (time) — requested delivery/pickup time
- customer_name (text)
- customer_phone (text)
- customer_email (text, nullable)
- customer_address (text, nullable)
- notes (text, nullable)
- subtotal (numeric)
- discount (numeric, default 0)
- promo_code (text, nullable)
- tps (numeric)
- tvq (numeric)
- total (numeric)
- current_status (text: 'pending' | 'preparing' | 'done' | 'delivered' | 'cancelled', default 'pending')
- created_at (timestamptz, default now())
- closed_at (timestamptz, nullable) — set when status becomes delivered or cancelled

### order_items (detail — items ordered)
- id (uuid, primary key)
- order_id (uuid, FK to orders ON DELETE CASCADE)
- item_id (text)
- name_fr (text)
- name_en (text)
- size (text, nullable)
- price (numeric)
- qty (int)

### order_status_changes (detail — status history)
- id (uuid, primary key)
- order_id (uuid, FK to orders ON DELETE CASCADE)
- status (text: same enum as orders.current_status)
- created_at (timestamptz, default now())

## 2. Security (RLS)

### orders
- anon: INSERT only (public site creates orders), no SELECT/UPDATE/DELETE
- authenticated: SELECT, UPDATE, DELETE (admin manages orders)

### order_items
- anon: INSERT only (created alongside the order)
- authenticated: SELECT (admin reads items)

### order_status_changes
- anon: INSERT only (initial 'pending' row created with the order)
- authenticated: SELECT, INSERT (admin changes status, history recorded)

## 3. Indexes
- orders: current_status, delivery_date, delivery_time, closed_at
- order_items: order_id
- order_status_changes: order_id, created_at

## 4. Notes
- A SECURITY DEFINER function `change_order_status` atomically updates
  orders.current_status, sets/clears closed_at, and inserts a row into
  order_status_changes. Callable by authenticated only.
- A sequence `order_number_seq` starts at 1001 for human-readable order numbers.
*/

-- Sequence must exist before the table that references it
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1001;

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number int UNIQUE NOT NULL DEFAULT nextval('order_number_seq'),
  lang text NOT NULL CHECK (lang IN ('fr', 'en')),
  mode text NOT NULL CHECK (mode IN ('delivery', 'pickup')),
  delivery_date date NOT NULL,
  delivery_time time NOT NULL,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text,
  customer_address text,
  notes text,
  subtotal numeric(10,2) NOT NULL DEFAULT 0,
  discount numeric(10,2) NOT NULL DEFAULT 0,
  promo_code text,
  tps numeric(10,2) NOT NULL DEFAULT 0,
  tvq numeric(10,2) NOT NULL DEFAULT 0,
  total numeric(10,2) NOT NULL DEFAULT 0,
  current_status text NOT NULL DEFAULT 'pending' CHECK (current_status IN ('pending', 'preparing', 'done', 'delivered', 'cancelled')),
  created_at timestamptz NOT NULL DEFAULT now(),
  closed_at timestamptz
);

CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  item_id text NOT NULL,
  name_fr text NOT NULL,
  name_en text NOT NULL,
  size text,
  price numeric(10,2) NOT NULL,
  qty int NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS order_status_changes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('pending', 'preparing', 'done', 'delivered', 'cancelled')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(current_status);
CREATE INDEX IF NOT EXISTS idx_orders_delivery_date ON orders(delivery_date);
CREATE INDEX IF NOT EXISTS idx_orders_delivery_time ON orders(delivery_time);
CREATE INDEX IF NOT EXISTS idx_orders_closed_at ON orders(closed_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_status_order_id ON order_status_changes(order_id);
CREATE INDEX IF NOT EXISTS idx_order_status_created ON order_status_changes(created_at);

-- Enable RLS on all tables
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_changes ENABLE ROW LEVEL SECURITY;

-- orders: anon INSERT only, authenticated full CRUD
DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_select_orders" ON orders;
CREATE POLICY "auth_select_orders" ON orders FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_orders" ON orders;
CREATE POLICY "auth_update_orders" ON orders FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_orders" ON orders;
CREATE POLICY "auth_delete_orders" ON orders FOR DELETE
  TO authenticated USING (true);

-- order_items: anon INSERT only, authenticated SELECT
DROP POLICY IF EXISTS "anon_insert_order_items" ON order_items;
CREATE POLICY "anon_insert_order_items" ON order_items FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_select_order_items" ON order_items;
CREATE POLICY "auth_select_order_items" ON order_items FOR SELECT
  TO authenticated USING (true);

-- order_status_changes: anon INSERT only (initial pending), authenticated SELECT + INSERT
DROP POLICY IF EXISTS "anon_insert_status_changes" ON order_status_changes;
CREATE POLICY "anon_insert_status_changes" ON order_status_changes FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_select_status_changes" ON order_status_changes;
CREATE POLICY "auth_select_status_changes" ON order_status_changes FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_status_changes" ON order_status_changes;
CREATE POLICY "auth_insert_status_changes" ON order_status_changes FOR INSERT
  TO authenticated WITH CHECK (true);

-- SECURITY DEFINER function to atomically change order status
-- Updates orders.current_status, sets/clears closed_at, and inserts history row
CREATE OR REPLACE FUNCTION change_order_status(p_order_id uuid, p_status text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE orders
  SET current_status = p_status,
      closed_at = CASE
        WHEN p_status IN ('delivered', 'cancelled') THEN now()
        ELSE NULL
      END
  WHERE id = p_order_id;

  INSERT INTO order_status_changes (order_id, status)
  VALUES (p_order_id, p_status);
END;
$$;

-- Grant execute to authenticated only
REVOKE EXECUTE ON FUNCTION change_order_status(uuid, text) FROM anon;
GRANT EXECUTE ON FUNCTION change_order_status(uuid, text) TO authenticated;
