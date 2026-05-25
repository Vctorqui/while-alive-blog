"use client";

import {
  createContext,
  useContext,
  useEffect,
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

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [experience, setExperience] = useState<Experience>("notebook");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }

    const savedExperience = localStorage.getItem("experience") as Experience | null;
    if (savedExperience) {
      setExperience(savedExperience);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      const root = document.documentElement;
      if (theme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
      localStorage.setItem("theme", theme);
    }
  }, [theme, mounted]);

  useEffect(() => {
    if (mounted) {
      const root = document.documentElement;
      root.setAttribute("data-experience", experience);
      localStorage.setItem("experience", experience);
    }
  }, [experience, mounted]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const toggleExperience = () => {
    setExperience((prev) => (prev === "terminal" ? "notebook" : "terminal"));
  };

  if (!mounted) {
    return (
      <ThemeContext.Provider value={{ theme: "light", toggleTheme, experience: "notebook", toggleExperience }}>
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, experience, toggleExperience }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
