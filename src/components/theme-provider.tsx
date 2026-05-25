"use client";

import {
  createContext,
  use,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";
type Experience = "notebook" | "terminal";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  experience: Experience;
  toggleExperience: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function applyThemeToDom(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

function applyExperienceToDom(experience: Experience) {
  document.documentElement.setAttribute("data-experience", experience);
}

function readInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const savedTheme = localStorage.getItem("theme") as Theme | null;
  return savedTheme ?? "dark";
}

function readInitialExperience(): Experience {
  if (typeof window === "undefined") return "notebook";
  const savedExperience = localStorage.getItem("experience") as Experience | null;
  return savedExperience ?? "notebook";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const initial = readInitialTheme();
    if (typeof window !== "undefined") {
      applyThemeToDom(initial);
    }
    return initial;
  });

  const [experience, setExperience] = useState<Experience>(() => {
    const initial = readInitialExperience();
    if (typeof window !== "undefined") {
      applyExperienceToDom(initial);
    }
    return initial;
  });

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      applyThemeToDom(next);
      localStorage.setItem("theme", next);
      return next;
    });
  }, []);

  const toggleExperience = useCallback(() => {
    setExperience((prev) => {
      const next: Experience = prev === "terminal" ? "notebook" : "terminal";
      applyExperienceToDom(next);
      localStorage.setItem("experience", next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ theme, toggleTheme, experience, toggleExperience }),
    [theme, experience, toggleTheme, toggleExperience],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = use(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
