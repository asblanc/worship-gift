-- ============================================================
--  Worship Gift — Rappels email avant l'événement
--  Ajoute reminder_sent_at sur orders : empêche d'envoyer
--  plusieurs fois le rappel pour une même commande.
--  Le cron /api/cron/event-reminders s'appuie dessus.
-- ============================================================

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS reminder_sent_at TIMESTAMPTZ;
