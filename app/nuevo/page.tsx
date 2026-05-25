"use client";

import { useEffect } from "react";
import Link from "next/link";
import { StoryForm } from "@/src/components/stories/story-form";
import { useTheme } from "@/src/components/theme-provider";

export default function NewStoryPage() {
  const { experience } = useTheme();

  useEffect(() => {
    document.title = experience === "terminal" 
      ? "Nuevo | while(alive)" 
      : "Escribir | while alive";
  }, [experience]);

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 md:py-20">
      {/* Page header */}
      <header className="mb-12">
        <nav className="mb-8">
          {experience === "terminal" ? (
            <Link
              href="/"
              className="font-mono text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
            >
              <span className="text-muted-foreground/50">{">"}</span>
              <span>cd ..</span>
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
        
        <h1 className="font-serif text-2xl md:text-3xl text-foreground mb-3">
          Escribir una historia
        </h1>
        
        <p className="font-serif text-muted-foreground text-base leading-relaxed">
          Comparte tu cuento con el mundo. Sin registro, sin perfiles. 
          Solo tú y tus palabras.
        </p>
      </header>

      {/* Story form */}
      <StoryForm />

      {/* Helper text */}
      <aside className="mt-16 pt-8 border-t border-border">
        {experience === "terminal" ? (
          <h2 className="font-mono text-xs text-muted-foreground/60 mb-4">
            // consejos de escritura
          </h2>
        ) : (
          <h2 className="font-serif text-sm font-semibold text-muted-foreground mb-4">
            Consejos de escritura
          </h2>
        )}
        <ul className="font-serif text-sm text-muted-foreground/70 space-y-2">
          <li>• Separa los párrafos con una línea en blanco</li>
          <li>• El pseudónimo es opcional — puedes permanecer anónimo</li>
          <li>• No hay límite de extensión, pero recuerda: la brevedad es el alma del ingenio</li>
        </ul>
      </aside>
    </div>
  );
}
