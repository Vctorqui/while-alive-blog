"use client";

import { useState } from "react";
import type { Post, FilterType } from "@/src/types/story";
import { isStory } from "@/src/types/story";
import { StoryCard } from "./story-card";
import { MicroPostCard } from "./micro-post-card";
import { TerminalFilter } from "./terminal-filter";
import { useTheme } from "@/src/components/theme-provider";

interface PostFeedProps {
  posts: Post[];
}

export function PostFeed({ posts }: PostFeedProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const { experience } = useTheme();

  const filteredPosts = posts.filter((post) => {
    switch (activeFilter) {
      case "stories":
        return isStory(post);
      case "logs":
        return !isStory(post);
      case "all":
      default:
        return true;
    }
  });

  const getCountLabel = () => {
    const storyCount = posts.filter(isStory).length;
    const logCount = posts.filter(p => !isStory(p)).length;
    
    if (experience === "terminal") {
      switch (activeFilter) {
        case "stories":
          return `${storyCount} ${storyCount === 1 ? "archivo" : "archivos"}`;
        case "logs":
          return `${logCount} ${logCount === 1 ? "línea" : "líneas"}`;
        case "all":
        default:
          return `${storyCount} ${storyCount === 1 ? "archivo" : "archivos"}, ${logCount} ${logCount === 1 ? "línea" : "líneas"}`;
      }
    } else {
      switch (activeFilter) {
        case "stories":
          return `${storyCount} ${storyCount === 1 ? "cuento" : "cuentos"}`;
        case "logs":
          return `${logCount} ${logCount === 1 ? "pensamiento" : "pensamientos"}`;
        case "all":
        default:
          return `${storyCount} ${storyCount === 1 ? "cuento" : "cuentos"}, ${logCount} ${logCount === 1 ? "pensamiento" : "pensamientos"}`;
      }
    }
  };

  if (posts.length === 0) {
    return (
      <div className="py-20 text-center">
        {experience === "terminal" ? (
          <>
            <p className="font-mono text-sm text-muted-foreground">
              <span className="text-muted-foreground/50">{"// "}</span>vacío
            </p>
            <p className="font-serif text-muted-foreground mt-8 text-base">
              Aún no hay contenido. Sé el primero en escribir.
            </p>
          </>
        ) : (
          <p className="font-serif text-muted-foreground text-base">
            Aún no hay contenido. Sé el primero en escribir.
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* Terminal filter */}
      <div className="mb-8">
        <TerminalFilter
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </div>

      {/* Count label */}
      <div className={`mb-8 pb-4 border-b border-border ${
        experience === "terminal"
          ? "font-mono text-xs text-muted-foreground/60"
          : "font-serif text-sm text-muted-foreground/75 italic"
      }`}>
        {getCountLabel()} {experience === "terminal" ? (activeFilter === "all" ? "en total" : "encontrados") : "en total"}
      </div>

      {/* Posts list */}
      {filteredPosts.length === 0 ? (
        <div className="py-12 text-center">
          {experience === "terminal" ? (
            <>
            <p className="font-mono text-sm text-muted-foreground">
              <span className="text-muted-foreground/50">{"// "}</span>
              {activeFilter === "stories" ? "ls --stories" : "cat logs/"}
            </p>
            <p className="font-mono text-sm text-muted-foreground/60 mt-2">
              (sin resultados)
            </p>
          </>
          ) : (
            <p className="font-serif text-muted-foreground text-base">
              No se encontraron resultados para esta sección.
            </p>
          )}
        </div>
      ) : (
        <div>
          {filteredPosts.map((post) =>
            isStory(post) ? (
              <StoryCard key={post.id} story={post} />
            ) : (
              <MicroPostCard key={post.id} post={post} />
            )
          )}
        </div>
      )}
    </div>
  );
}
