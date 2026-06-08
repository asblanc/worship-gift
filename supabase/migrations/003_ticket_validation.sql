-- ============================================================
--  Worship Gift — Validation des billets à l'entrée
--  Ajoute used_at (horodatage du scan) sur tickets.
--  Le passage valid -> used se fait côté serveur (service_role)
--  via /api/admin/tickets/validate (réservé aux admins).
-- ============================================================

ALTER TABLE public.tickets
  ADD COLUMN IF NOT EXISTS used_at TIMESTAMPTZ;
