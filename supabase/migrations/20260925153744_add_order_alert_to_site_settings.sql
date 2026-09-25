/*
# Add order alert columns to site_settings

Adds `order_alert_fr` and `order_alert_en` columns to the `site_settings` table.
These hold a message displayed at the top of the order confirmation screen,
with the same yellow background as the site alert banner.

The restaurateur can use this to inform customers of delays, special notices, etc.
A default message is set indicating this is a demo site and no orders will be delivered.
*/

ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS order_alert_fr text DEFAULT '',
  ADD COLUMN IF NOT EXISTS order_alert_en text DEFAULT '';

-- Set default order alert message
UPDATE site_settings
SET
  order_alert_fr = 'Attention! Ce site est un site démo créé par intelligence artificielle. Aucune commande ne sera livrée. Ce message peut être modifié par le restaurateur dans la section « Alerte de commande » de l''administration.',
  order_alert_en = 'Please note! This is a demo site created by artificial intelligence. No orders will be delivered. This message can be changed by the restaurateur in the "Order alert" section of the admin panel.'
WHERE id = 1;
