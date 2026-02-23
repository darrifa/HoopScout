"use client";

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface Props {
  label: string;
  tooltip?: string;
  value: number; // 0 = Any, 2 = 2+, 3 = 3+, 4 = 4+, 5 = 5
  onChange: (value: number) => void;
}

const THRESHOLDS = [2, 3, 4, 5] as const;

const THRESHOLD_LABELS: Record<number, string> = {
  2: "2+",
  3: "3+",
  4: "4+",
  5: "5",
};

const BUCKET_NAMES_DISPLAY: Record<number, string> = {
  2: "Below Avg",
  3: "Average",
  4: "Above Avg",
  5: "Elite",
};

/* === Data-meaning colors: DO NOT convert to theme tokens === */
const SEGMENT_COLORS_ACTIVE: Record<number, string> = {
  2: "bg-orange-300 border-orange-300",
  3: "bg-yellow-400 border-yellow-400",
  4: "bg-green-400 border-green-400",
  5: "bg-green-600 border-green-600",
};

const SEGMENT_TEXT_DARK: Set<number> = new Set([4, 5]);

const CONTEXTUAL_LABEL: Record<number, { text: string; color: string }> = {
  0: { text: "No minimum", color: "text-muted-foreground" },
  2: { text: "Top 90% at position", color: "text-orange-500" },
  3: { text: "Top 70% at position", color: "text-yellow-600" },
  4: { text: "Top 30% at position", color: "text-green-500" },
  5: { text: "Top 10% at position", color: "text-green-700" },
};
/* ========================================================== */

export default function DimensionScale({ label, tooltip, value, onChange }: Props) {
  const ctx = CONTEXTUAL_LABEL[value] ?? CONTEXTUAL_LABEL[0];

  return (
    <div className="py-4">
      {/* Header row: label + contextual text */}
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-sm font-semibold text-foreground flex items-center gap-1.5">
          {label}
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="cursor-help">
                  <Info className="size-3.5 text-muted-foreground/40 hover:text-muted-foreground transition-colors" />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-56 leading-relaxed">
                  {tooltip}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </span>
        <span className={`text-xs font-medium ${ctx.color}`}>
          {value === 0 ? (
            "No minimum"
          ) : (
            ctx.text
          )}
        </span>
      </div>

      {/* Scale track — custom segment buttons preserved as-is */}
      <div className="relative">
        <div className="flex gap-1 items-center">
          {/* Any button */}
          <button
            onClick={() => onChange(0)}
            className={`h-9 w-14 rounded-l-lg text-xs font-medium transition-all border cursor-pointer ${
              value === 0
                ? "bg-secondary text-muted-foreground border-border"
                : "bg-card text-muted-foreground/40 border-border/50 hover:border-border"
            }`}
            aria-label={`Set ${label} to Any (no minimum)`}
          >
            Any
          </button>

          {/* Segmented bar */}
          {THRESHOLDS.map((t, i) => {
            const isActive = value >= t;
            const isSelected = value === t;
            const isLast = i === THRESHOLDS.length - 1;
            const color = SEGMENT_COLORS_ACTIVE[t];

            return (
              <button
                key={t}
                onClick={() => onChange(value === t ? 0 : t)}
                className={`h-9 flex-1 text-xs font-medium transition-all border relative cursor-pointer ${
                  isLast ? "rounded-r-lg" : ""
                } ${
                  isActive
                    ? `${color} ${SEGMENT_TEXT_DARK.has(t) ? "text-white" : "text-foreground"}`
                    : "bg-card border-border/50 text-muted-foreground/40 hover:bg-muted"
                }`}
                aria-label={`Set minimum ${label} to ${THRESHOLD_LABELS[t]}`}
              >
                {THRESHOLD_LABELS[t]}
                {isSelected && (
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
                    <div className="text-[9px] text-muted-foreground whitespace-nowrap">
                      &#9650; floor
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Labels below segments */}
        <div className="flex mt-5 text-[10px] text-muted-foreground">
          <div className="w-14 text-center" />
          {THRESHOLDS.map((t) => (
            <div key={t} className="flex-1 text-center">
              {BUCKET_NAMES_DISPLAY[t]}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
