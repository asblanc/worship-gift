/* ================================================================
   Worship Gift — Skeleton de chargement
   Bloc gris animé (pulse) pour les états de chargement, plus
   agréable qu'un simple spinner.
   ================================================================ */

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-white/[0.06] ${className}`} />;
}
