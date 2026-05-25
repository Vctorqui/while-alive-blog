"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { useTheme } from "@/src/components/theme-provider";

interface LikeButtonProps {
  postId: string;
  initialCount?: number;
}

export function LikeButton({ postId, initialCount = 0 }: LikeButtonProps) {
  const { experience } = useTheme();
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/posts/${postId}/likes`)
      .then((r) => r.json())
      .then((data: { liked?: boolean; likeCount?: number }) => {
        if (typeof data.liked === "boolean") setLiked(data.liked);
        if (typeof data.likeCount === "number") setCount(data.likeCount);
      })
      .catch(() => {});
  }, [postId]);

  const toggle = useCallback(() => {
    setError(null);
    startTransition(async () => {
      const res = await fetch(`/api/posts/${postId}/likes`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "No se pudo registrar el like");
        return;
      }
      setLiked(Boolean(data.liked));
      setCount(Number(data.likeCount ?? count));
    });
  }, [postId, count]);

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={toggle}
        disabled={pending}
        aria-pressed={liked}
        className={`
          text-xs transition-colors disabled:opacity-50
          ${experience === "terminal" ? "font-mono" : "font-sans"}
          ${liked ? "text-foreground" : "text-muted-foreground hover:text-foreground"}
        `}
      >
        {experience === "terminal" ? (
          <span>{liked ? "♥ liked" : "♡ like"}</span>
        ) : (
          <span>{liked ? "♥ Me gusta" : "♡ Me gusta"}</span>
        )}
      </button>
      <span
        className={`text-xs text-muted-foreground/70 ${
          experience === "terminal" ? "font-mono" : "font-sans"
        }`}
      >
        {count}
      </span>
      {error && (
        <span className="text-xs text-destructive">{error}</span>
      )}
    </div>
  );
}
