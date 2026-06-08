-- ============================================================
--  Worship Gift — Tables orders + tickets
--  Statuts : pending -> paid | failed | expired | refunded
--  Liees a la table reservations existante
-- ============================================================

-- Reset : supprime les anciennes tables (ancien schema incompatible)
-- tickets d'abord car il reference orders via FK
DROP TABLE IF EXISTS public.tickets CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;

-- Table des commandes (paiements)
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,                                -- ex: "WG-20260528-001"
  reservation_id UUID REFERENCES public.reservations(id) ON DELETE SET NULL,
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  amount INTEGER NOT NULL,                            -- centimes (MAD)
  currency TEXT NOT NULL DEFAULT 'MAD',
  description TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending',             -- pending, paid, failed, expired, refunded
  payment_provider TEXT NOT NULL DEFAULT 'cmi',       -- cmi, stripe (futur)
  transaction_id TEXT,                                -- ID retourne par CMI
  error_code TEXT,
  error_message TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table des billets (generee apres paiement)
CREATE TABLE IF NOT EXISTS public.tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  reservation_id UUID REFERENCES public.reservations(id) ON DELETE SET NULL,
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  event_id TEXT NOT NULL,
  event_title TEXT NOT NULL,
  event_date TEXT DEFAULT '',
  event_time TEXT DEFAULT '',
  event_location TEXT DEFAULT '',
  ticket_type TEXT NOT NULL DEFAULT 'Entree libre',   -- Entree libre, VIP
  ticket_code TEXT NOT NULL UNIQUE,                   -- Code unique (QR)
  status TEXT NOT NULL DEFAULT 'valid',               -- valid, used, cancelled
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Activation RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- ============================================================
--  Policies RLS
--  Lecture seule cote client (anon/authenticated).
--  Les INSERT/UPDATE passent UNIQUEMENT par le serveur via la
--  cle service_role (qui contourne RLS) — aucune policy d'ecriture
--  n'est exposee aux clients.
--  Le role admin est lu depuis le claim JWT app_metadata.role
--  (non modifiable par l'utilisateur), jamais user_metadata.
-- ============================================================

-- Fonction helper : true si le JWT courant a app_metadata.role = 'admin'
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    false
  );
$$;

-- Policies orders : l'utilisateur voit ses commandes, l'admin voit tout
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders"
  ON public.orders
  FOR SELECT
  USING (auth.role() = 'authenticated' AND customer_email = auth.email());

DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
CREATE POLICY "Admins can view all orders"
  ON public.orders
  FOR SELECT
  USING (public.is_admin());

-- Policies tickets : idem
DROP POLICY IF EXISTS "Users can view own tickets" ON public.tickets;
CREATE POLICY "Users can view own tickets"
  ON public.tickets
  FOR SELECT
  USING (auth.role() = 'authenticated' AND customer_email = auth.email());

DROP POLICY IF EXISTS "Admins can view all tickets" ON public.tickets;
CREATE POLICY "Admins can view all tickets"
  ON public.tickets
  FOR SELECT
  USING (public.is_admin());

-- Index
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_tickets_order_id ON public.tickets(order_id);
CREATE INDEX IF NOT EXISTS idx_tickets_customer_email ON public.tickets(customer_email);
CREATE INDEX IF NOT EXISTS idx_tickets_ticket_code ON public.tickets(ticket_code);

-- Trigger pour updated_at sur orders
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_orders_updated_at ON public.orders;
CREATE TRIGGER set_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();