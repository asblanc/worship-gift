-- ============================================================
--  Worship Gift — Mode de paiement de la commande
--  'online'   = paiement en ligne (lien prestataire externe)
--  'delivery' = paiement à la livraison (organisé via WhatsApp)
-- ============================================================

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS payment_method TEXT NOT NULL DEFAULT 'online';

CREATE INDEX IF NOT EXISTS idx_orders_payment_method ON public.orders(payment_method);
