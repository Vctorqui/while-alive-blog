"use client";

import Link from "next/link";
import type { Story } from "@/src/types/story";
import { useTheme } from "@/src/components/theme-provider";

interface StoryCardProps {
  story: Story;
}

export function StoryCard({ story }: StoryCardProps) {
  const { experience } = useTheme();
  
  const formattedDate = new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(story.createdAt);

  return (
    <article className="group py-8 border-b border-border last:border-b-0">
      <Link href={`/cuento/${story.slug}`} className="block">
        <div className="flex flex-col gap-3">
          <header className="flex items-baseline justify-between gap-4">
            <h2 className="font-serif text-xl text-foreground group-hover:opacity-70 transition-opacity text-balance">
              {story.title}
            </h2>
            <span className={`text-xs text-muted-foreground shrink-0 ${
              experience === "terminal" ? "font-mono" : "font-sans text-[11px] uppercase tracking-wider"
            }`}>
              {story.readingTime} min
            </span>
          </header>

          <p className="font-serif text-muted-foreground text-base leading-relaxed">
            {story.excerpt}
          </p>

          <footer className={`flex items-center gap-4 text-xs text-muted-foreground/70 ${
            experience === "terminal" ? "font-mono" : "font-serif italic"
          }`}>
            <span className={experience === "terminal" ? "" : "not-italic"}>{story.author}</span>
            <span className="text-muted-foreground/30">·</span>
            <time dateTime={story.createdAt.toISOString()} className={experience === "terminal" ? "" : "font-sans not-italic text-[11px] uppercase tracking-wider text-muted-foreground/60"}>
              {formattedDate}
            </time>
          </footer>
        </div>
      </Link>
    </article>
  );
}
