"use client";

import Link from "next/link";
import { useTheme } from "@/src/components/theme-provider";
import { Notebook, Terminal } from "lucide-react";

export function Header() {
  const { theme, toggleTheme, experience, toggleExperience } = useTheme();

  return (
    <header className="border-b border-border transition-colors duration-300">
      <div className="max-w-4xl mx-auto p-6 flex items-center justify-between">
        {experience === "terminal" ? (
          <Link
            href="/"
            className="font-mono text-sm tracking-tight hover:opacity-70 transition-opacity"
          >
            <span className="text-muted-foreground">while</span>
            <span className="text-muted-foreground/50">(</span>
            <span className="text-foreground">alive</span>
            <span className="text-muted-foreground/50">)</span>
            <span className="text-muted-foreground/40 ml-1">{"{"}</span>
            <span className="cursor-blink text-muted-foreground/50 ml-0.5">▊</span>
          </Link>
        ) : (
          <Link
            href="/"
            className="font-serif text-lg italic tracking-wide text-foreground hover:opacity-70 transition-opacity"
          >
            while alive.
          </Link>
        )}

        <nav className="flex items-center gap-6">
          {experience === "terminal" ? (
            <Link
              href="/nuevo"
              className="font-mono text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="text-muted-foreground/50">{">"}</span>
              <span className="ml-1">nuevo</span>
            </Link>
          ) : (
            <Link
              href="/nuevo"
              className="font-sans text-xs tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              Escribir
            </Link>
          )}

          {experience === "terminal" ? (
            <button
            type="button"
              onClick={toggleTheme}
              className="font-mono text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              aria-label={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            >
              <span className="text-muted-foreground/50">{">"}</span>
              <span className="ml-1">{theme === "dark" ? "light" : "dark"}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={toggleTheme}
              className="font-sans text-xs tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              aria-label={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            >
              {theme === "dark" ? "Claro" : "Oscuro"}
            </button>
          )}

          {experience === "terminal" ? (
            <button
              type="button"
              onClick={toggleExperience}
              className="flex items-center gap-1 font-mono text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              aria-label="Cambiar a modo cuaderno"
            >
              <Notebook className="size-3.5 inline text-muted-foreground" />
              <span className="ml-0.5">Modo Cuaderno</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={toggleExperience}
              className="flex items-center gap-1 font-sans text-xs tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              aria-label="Cambiar a modo terminal"
            >
              <Terminal className="size-3.5 inline text-muted-foreground" />
              <span className="ml-1">Modo Terminal</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
