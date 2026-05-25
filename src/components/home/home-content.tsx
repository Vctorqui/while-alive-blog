"use client";

import type { Post } from "@/src/types/story";
import { PostFeed } from "@/src/components/stories/post-feed";
import { useTheme } from "@/src/components/theme-provider";

interface HomeContentProps {
  posts: Post[];
}

export function HomeContent({ posts }: HomeContentProps) {
  const { experience } = useTheme();

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 md:py-20">
      <div>
        <h1
          className={`text-6xl font-bold ${experience === "terminal" ? "font-mono" : "font-serif"}`}
        >
          While Alive
        </h1>
      </div>
      <aside className="mb-12">
        {experience === "terminal" ? (
          <p className="font-mono text-xs text-muted-foreground/60 leading-relaxed">
            <span className="text-muted-foreground/40">{"// "}</span>
            Compilando ideas en prosa.
            <br />
            <span className="text-muted-foreground/40">{"// "}</span>
            Un espacio para cuando la lógica cede su lugar a la escritura.
          </p>
        ) : (
          <p className="font-serif text-sm text-muted-foreground/80 italic leading-relaxed border-l-2 border-border pl-4 py-1">
            &ldquo;Entre la precisión de las ideas y la imperfección de la palabra escrita. Un refugio minimalista para compartir cuentos cortos, pensamientos y preguntas en texto plano.&rdquo;
          </p>
        )}
      </aside>

      <PostFeed posts={posts} />

      <footer className="mt-20 pt-8 border-t border-border">
        {experience === "terminal" ? (
          <p className="font-mono text-xs text-muted-foreground/50 text-center">
            while(alive) // running
          </p>
        ) : (
          <p className="font-serif text-sm text-muted-foreground/50 text-center italic">
            while alive: del pensamiento a la palabra
          </p>
        )}
      </footer>
    </div>
  );
}
