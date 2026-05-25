"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { DbContentSubmission } from "@/src/types/database";

interface ModerationPanelProps {
  submissions: DbContentSubmission[];
}

export function ModerationPanel({ submissions }: ModerationPanelProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleApprove = (id: string) => {
    setError(null);
    startTransition(async () => {
      const res = await fetch(`/api/admin/submissions/${id}/approve`, {
        method: "POST",
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? "Error al aprobar");
        return;
      }
      router.refresh();
    });
  };

  const handleReject = (id: string) => {
    const reason = window.prompt("Motivo del rechazo (opcional):") ?? "";
    setError(null);
    startTransition(async () => {
      const res = await fetch(`/api/admin/submissions/${id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? "Error al rechazar");
        return;
      }
      router.refresh();
    });
  };

  if (submissions.length === 0) {
    return (
      <p className="font-mono text-sm text-muted-foreground">// cola vacía</p>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <p className="text-sm text-destructive bg-destructive/10 p-3 rounded">
          {error}
        </p>
      )}
      {submissions.map((sub) => (
        <article
          key={sub.id}
          className="border border-border rounded p-6 space-y-4"
        >
          <header className="flex flex-wrap items-center gap-2 font-mono text-xs text-muted-foreground">
            <span className="text-foreground">{sub.post_type}</span>
            <span>·</span>
            <span>{sub.author}</span>
            <span>·</span>
            <time>{new Date(sub.created_at).toLocaleString("es-ES")}</time>
          </header>

          {sub.title && (
            <h2 className="font-serif text-xl text-foreground">{sub.title}</h2>
          )}

          <p className="font-serif text-sm text-foreground/90 whitespace-pre-wrap line-clamp-6">
            {sub.content}
          </p>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              disabled={pending}
              onClick={() => handleApprove(sub.id)}
              className="font-mono text-xs bg-foreground text-background px-4 py-2 hover:opacity-80 disabled:opacity-50"
            >
              aprobar
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => handleReject(sub.id)}
              className="font-mono text-xs border border-border px-4 py-2 hover:border-foreground disabled:opacity-50"
            >
              rechazar
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
