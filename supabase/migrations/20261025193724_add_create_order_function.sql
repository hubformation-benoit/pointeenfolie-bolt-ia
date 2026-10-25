/*
# Add create_order function for public order submission

## Purpose
The public site (anon role) needs to create orders, but INSERT...RETURNING
requires both INSERT and SELECT policies. Instead of granting SELECT on
orders to anon (which would expose all orders), this SECURITY DEFINER
function handles the entire order creation atomically and returns the
order id and order_number.

## 1. New Function
### create_order
- Parameters: all order header fields + items array (JSON)
- Inserts into orders (header), order_items (detail), order_status_changes (initial pending)
- Returns: json with id and order_number
- SECURITY DEFINER: runs with owner privileges, bypasses RLS
- EXECUTE granted to anon + authenticated (public site can call it)

## 2. Security
- The function is the ONLY way anon can create orders
- anon no longer needs direct INSERT on orders/order_items/order_status_changes
- The existing anon INSERT policies are kept (harmless, but the function is the primary path)
- REVOKE EXECUTE from anon is NOT done — anon needs to call this function

## 3. Notes
- Items are passed as a JSON array: [{item_id, name_fr, name_en, size, price, qty}, ...]
- The function creates the order row, all item rows, and the initial 'pending' status change in one atomic operation
*/

CREATE OR REPLACE FUNCTION create_order(
  p_lang text,
  p_mode text,
  p_delivery_date date,
  p_delivery_time time,
  p_customer_name text,
  p_customer_phone text,
  p_customer_email text,
  p_customer_address text,
  p_notes text,
  p_subtotal numeric,
  p_discount numeric,
  p_promo_code text,
  p_tps numeric,
  p_tvq numeric,
  p_total numeric,
  p_items json
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order_id uuid;
  v_order_number int;
  v_item json;
BEGIN
  INSERT INTO orders (
    lang, mode, delivery_date, delivery_time,
    customer_name, customer_phone, customer_email, customer_address, notes,
    subtotal, discount, promo_code, tps, tvq, total,
    current_status
  ) VALUES (
    p_lang, p_mode, p_delivery_date, p_delivery_time,
    p_customer_name, p_customer_phone, p_customer_email, p_customer_address, p_notes,
    p_subtotal, p_discount, p_promo_code, p_tps, p_tvq, p_total,
    'pending'
  )
  RETURNING id, order_number INTO v_order_id, v_order_number;

  FOR v_item IN SELECT * FROM json_array_elements(p_items)
  LOOP
    INSERT INTO order_items (
      order_id, item_id, name_fr, name_en, size, price, qty
    ) VALUES (
      v_order_id,
      (v_item->>'item_id'),
      (v_item->>'name_fr'),
      (v_item->>'name_en'),
      NULLIF(v_item->>'size', ''),
      (v_item->>'price')::numeric,
      (v_item->>'qty')::int
    );
  END LOOP;

  INSERT INTO order_status_changes (order_id, status)
  VALUES (v_order_id, 'pending');

  RETURN json_build_object(
    'id', v_order_id,
    'order_number', v_order_number
  );
END;
$$;

-- Grant execute to anon (public site) and authenticated (admin)
GRANT EXECUTE ON FUNCTION create_order(
  text, text, date, time, text, text, text, text, text,
  numeric, numeric, text, numeric, numeric, numeric, json
) TO anon, authenticated;
