/* ================================================================
   Worship Gift — Eyebrow
   Label signature en MAJUSCULES au-dessus des titres de section,
   précédé d'un trait doré. Utilise le rôle typographique `.t-eyebrow`.
   ================================================================ */

export default function Eyebrow({
  children,
  centered = false,
  className = "",
}: {
  children: React.ReactNode;
  centered?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`t-eyebrow mb-4 inline-flex items-center gap-3 text-[#C9A84C] ${
        centered ? "justify-center" : ""
      } ${className}`}
    >
      <span className="h-px w-8 bg-[#C9A84C]/60" aria-hidden />
      {children}
    </span>
  );
}
