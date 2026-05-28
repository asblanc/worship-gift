-- ============================================================
--  Worship Gift — Table reservations
--  Colonnes : id, nom, email, telephone, evenement_id,
--             nombre_places, type_billet, statut, created_at
--  RLS activé : tout le monde peut insérer,
--                les utilisateurs connectés voient leurs réservations
-- ============================================================

-- Création de la table
CREATE TABLE IF NOT EXISTS public.reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT DEFAULT '',
  evenement_id TEXT NOT NULL,
  nombre_places INTEGER NOT NULL DEFAULT 1,
  type_billet TEXT NOT NULL DEFAULT 'Entrée libre',
  statut TEXT NOT NULL DEFAULT 'confirmé',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Activation RLS
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Policy : tout le monde (même non connecté) peut insérer
CREATE POLICY "Anon can insert reservations"
  ON public.reservations
  FOR INSERT
  WITH CHECK (true);

-- Policy : les utilisateurs connectés peuvent lire les réservations
--          correspondant à leur email
CREATE POLICY "Users can view own reservations"
  ON public.reservations
  FOR SELECT
  USING (auth.role() = 'authenticated' AND email = auth.email());

-- Index pour recherche rapide
CREATE INDEX IF NOT EXISTS idx_reservations_email
  ON public.reservations(email);

CREATE INDEX IF NOT EXISTS idx_reservations_evenement
  ON public.reservations(evenement_id);