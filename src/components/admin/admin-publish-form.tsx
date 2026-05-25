"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  adminPublishStoryAction,
  adminPublishMicroAction,
} from "@/app/actions/admin-actions";

export function AdminPublishForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"story" | "micro">("story");

  const handleSubmit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result =
        mode === "story"
          ? await adminPublishStoryAction(formData)
          : await adminPublishMicroAction(formData);

      if (result.error) {
        setError(result.error);
        return;
      }
      router.refresh();
      if ("slug" in result && result.slug) {
        router.push(`/cuento/${result.slug}`);
      } else {
        router.push("/admin");
      }
    });
  };

  return (
    <form action={handleSubmit} className="space-y-6 border border-border p-6 rounded">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode("story")}
          className={`font-mono text-xs px-3 py-1 border ${mode === "story" ? "bg-foreground text-background" : ""}`}
        >
          cuento
        </button>
        <button
          type="button"
          onClick={() => setMode("micro")}
          className={`font-mono text-xs px-3 py-1 border ${mode === "micro" ? "bg-foreground text-background" : ""}`}
        >
          micro
        </button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {mode === "story" ? (
        <>
          <input name="title" required placeholder="Título" className="w-full border-b py-2 font-serif" />
          <input name="author" placeholder="Autor" className="w-full border-b py-2 font-serif" />
          <textarea name="content" required rows={10} placeholder="Contenido" className="w-full border p-3 font-serif" />
        </>
      ) : (
        <>
          <select name="type" className="font-mono text-sm border p-2">
            <option value="thought">thought</option>
            <option value="phrase">phrase</option>
            <option value="question">question</option>
          </select>
          <input name="author" placeholder="Autor" className="w-full border-b py-2 font-serif" />
          <textarea name="content" required maxLength={280} rows={4} placeholder="Contenido" className="w-full border p-3 font-serif" />
        </>
      )}

      <button
        type="submit"
        disabled={pending}
        className="font-mono text-xs bg-foreground text-background px-4 py-2 disabled:opacity-50"
      >
        publicar directo
      </button>
    </form>
  );
}
