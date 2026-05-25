"use client";

import type { MicroPost } from "@/src/types/story";
import { useTheme } from "@/src/components/theme-provider";
import { LikeButton } from "@/src/components/stories/like-button";

interface MicroPostCardProps {
  post: MicroPost;
}

export function MicroPostCard({ post }: MicroPostCardProps) {
  const { experience } = useTheme();

  const formattedDate = new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(post.createdAt);

  const renderContent = () => {
    switch (post.type) {
      case "question":
        return experience === "terminal" ? (
          <p className="font-mono text-foreground text-base leading-relaxed">
            <span className="text-muted-foreground/60 mr-2">?</span>
            {post.content}
          </p>
        ) : (
          <p className="font-serif text-foreground text-lg italic leading-relaxed">
            {post.content}
          </p>
        );
      case "phrase":
        return (
          <blockquote className="font-serif text-foreground text-lg italic leading-relaxed border-l-2 border-muted-foreground/20 pl-4">
            {"\u201C"}{post.content}{"\u201D"}
          </blockquote>
        );
      case "thought":
        return (
          <p className="font-serif text-foreground/90 text-base leading-relaxed">
            {post.content}
          </p>
        );
      default:
        return null;
    }
  };

  const getTypeLabel = () => {
    switch (post.type) {
      case "question":
        return "pregunta";
      case "phrase":
        return "frase";
      case "thought":
        return "pensamiento";
      default:
        return "log";
    }
  };

  return (
    <article className="py-6 border-b border-border last:border-b-0">
      <div className="flex flex-col gap-3">
        {/* Type indicator */}
        {experience === "terminal" ? (
          <div className="font-mono text-xs text-muted-foreground/50">
            <span className="text-muted-foreground/30">{"//"}</span> {getTypeLabel()}
          </div>
        ) : (
          <div className="font-sans text-[10px] tracking-wider uppercase text-muted-foreground/60">
            {getTypeLabel()}
          </div>
        )}

        {/* Content */}
        <div className="py-2">
          {renderContent()}
        </div>

        {/* Footer */}
        <footer className={`flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground/70 ${
          experience === "terminal" ? "font-mono" : "font-serif italic"
        }`}>
          <div className="flex items-center gap-4">
            <span className={experience === "terminal" ? "" : "not-italic"}>{post.author}</span>
            <span className="text-muted-foreground/30">·</span>
            <time dateTime={post.createdAt.toISOString()} className={experience === "terminal" ? "" : "font-sans not-italic text-[11px] uppercase tracking-wider text-muted-foreground/60"}>
              {formattedDate}
            </time>
          </div>
          <LikeButton postId={post.id} initialCount={post.likeCount} />
        </footer>
      </div>
    </article>
  );
}
