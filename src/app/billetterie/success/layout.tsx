import { Suspense } from "react";

export default function SuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-black pt-20">
          <div className="flex flex-col items-center gap-4">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-[#C9A84C] border-t-transparent" />
            <span className="text-sm text-gray-300">Chargement...</span>
          </div>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}