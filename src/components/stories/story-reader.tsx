"use client";

import Link from "next/link";
import type { Story } from "@/src/types/story";
import { useTheme } from "@/src/components/theme-provider";
import { LikeButton } from "@/src/components/stories/like-button";

interface StoryReaderProps {
  story: Story;
}

export function StoryReader({ story }: StoryReaderProps) {
  const { experience } = useTheme();

  const formattedDate = new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(story.createdAt);

  return (
    <article className="py-12 md:py-20">
      {/* Back navigation */}
      <nav className="mb-12">
        {experience === "terminal" ? (
          <Link
            href="/"
            className="font-mono text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
          >
            <span className="text-muted-foreground/50">{">"}</span>
            <span> cd ..</span>
          </Link>
        ) : (
          <Link
            href="/"
            className="font-serif text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
          >
            <span>← volver al índice</span>
          </Link>
        )}
      </nav>

      {/* Story header */}
      <header className="mb-12 border-b border-border pb-8">
        <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-6 text-balance leading-tight">
          {story.title}
        </h1>
        <div className={`flex flex-wrap items-center gap-4 text-xs text-muted-foreground ${
          experience === "terminal" ? "font-mono text-sm" : "font-serif italic"
        }`}>
          <span className={experience === "terminal" ? "" : "not-italic"}>{story.author}</span>
          <span className="text-muted-foreground/30">·</span>
          <time dateTime={story.createdAt.toISOString()} className={experience === "terminal" ? "" : "font-sans not-italic text-[11px] uppercase tracking-wider text-muted-foreground/60"}>
            {formattedDate}
          </time>
          <span className="text-muted-foreground/30">·</span>
          <span className={experience === "terminal" ? "" : "font-sans not-italic text-[11px] uppercase tracking-wider text-muted-foreground/60"}>
            {story.readingTime} min lectura
          </span>
        </div>
      </header>

      {/* Story content */}
      <div className="prose-story font-serif text-foreground/90 max-w-none">
        {story.content.split("\n\n").map((paragraph) => (
          <p key={`${story.id}-${paragraph.slice(0, 32)}`}>{paragraph}</p>
        ))}
      </div>

      <div className="mt-10">
        <LikeButton postId={story.id} initialCount={story.likeCount} />
      </div>

      {/* End marker */}
      <footer className="mt-16 pt-8 border-t border-border">
        {experience === "terminal" ? (
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm text-muted-foreground/50">
              EOF
            </span>
            <Link
              href="/"
              className="font-mono text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← volver al índice
            </Link>
          </div>
        ) : (
          <div className="flex items-center">
            <Link
              href="/"
              className="font-serif text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← volver al índice
            </Link>
          </div>
        )}
      </footer>
    </article>
  );
}
