"use client";

import type { FilterType } from "@/src/types/story";
import { useTheme } from "@/src/components/theme-provider";

interface TerminalFilterProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export function TerminalFilter({ activeFilter, onFilterChange }: TerminalFilterProps) {
  const { experience } = useTheme();

  const filters: { type: FilterType; command: string; label: string }[] = [
    { type: "all", command: "ls --all", label: "Todo" },
    { type: "stories", command: "ls --stories", label: "Cuentos" },
    { type: "logs", command: "cat logs/", label: "Pensamientos" },
  ];

  return (
    <div className={`flex flex-wrap gap-2 ${
      experience === "terminal" ? "font-mono text-sm" : "font-serif text-sm"
    }`}>
      {filters.map((filter) => (
        <button
          key={filter.type}
          onClick={() => onFilterChange(filter.type)}
          className={`
            px-3 py-1.5 transition-colors rounded-sm border cursor-pointer
            ${activeFilter === filter.type
              ? "bg-foreground text-background border-foreground"
              : "bg-transparent text-muted-foreground border-border hover:border-muted-foreground hover:text-foreground"
            }
          `}
        >
          {experience === "terminal" ? (
            <span>{filter.command}</span>
          ) : (
            <span>{filter.label}</span>
          )}
        </button>
      ))}
    </div>
  );
}
