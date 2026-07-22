-- ============================================================
--  Worship Gift — Commandes multi-canal + paiement externe
--  Le paiement est géré hors-site (prestataire externe). On garde
--  une TRACE de chaque commande (canal WhatsApp ou site) au statut
--  "pending", puis l'admin marque "paid" -> génération des billets.
--
--  Statuts orders : pending -> paid | reserved | cancelled | failed | refunded
-- ============================================================

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS channel TEXT NOT NULL DEFAULT 'site',      -- 'site' | 'whatsapp'
  ADD COLUMN IF NOT EXISTS customer_phone TEXT,
  ADD COLUMN IF NOT EXISTS quantity INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS event_id TEXT,
  ADD COLUMN IF NOT EXISTS event_title TEXT,
  ADD COLUMN IF NOT EXISTS event_date TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS event_time TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS event_location TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS ticket_type TEXT DEFAULT 'Entrée libre';

-- L'email devient optionnel : une commande WhatsApp peut n'avoir qu'un
-- téléphone. (Le nom reste obligatoire.)
ALTER TABLE public.orders ALTER COLUMN customer_email DROP NOT NULL;

-- Idem côté billets : email non obligatoire (généré depuis la commande).
ALTER TABLE public.tickets ALTER COLUMN customer_email DROP NOT NULL;

CREATE INDEX IF NOT EXISTS idx_orders_channel ON public.orders(channel);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
