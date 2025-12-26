"use client";

import { useToast } from "@/hooks/use-toast";

export function Toaster() {
  const { toasts } = useToast();

  if (!toasts.length) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`rounded-lg border bg-white px-4 py-3 shadow-lg ${
            t.variant === "destructive"
              ? "border-red-500 text-red-600"
              : "border-slate-200"
          }`}
        >
          {t.title && <p className="font-medium">{t.title}</p>}
          {t.description && (
            <p className="text-sm opacity-80">{t.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}
