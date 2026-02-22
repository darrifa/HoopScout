"use client";

import { BUCKET_LABEL_MAP } from "@/app/lib/types";

interface Props {
  label: string;
  /** Short label for compact mode (e.g. "3PT", "ORB") */
  compactLabel?: string;
  bucketValue: number | null;
  rawStatText?: string;
  /** Compact mode for match cards */
  compact?: boolean;
}

/* === Data-meaning colors: DO NOT convert to theme tokens === */
const BAR_COLORS: Record<number, string> = {
  1: "bg-red-500",
  2: "bg-orange-400",
  3: "bg-yellow-400",
  4: "bg-green-400",
  5: "bg-green-600",
};

const DOT_COLORS: Record<number, { bg: string; text: string }> = {
  1: { bg: "bg-red-500", text: "text-white" },
  2: { bg: "bg-orange-400", text: "text-white" },
  3: { bg: "bg-yellow-400", text: "text-foreground" },
  4: { bg: "bg-green-400", text: "text-white" },
  5: { bg: "bg-green-600", text: "text-white" },
};
/* ========================================================== */

export default function BucketBar({
  label,
  compactLabel,
  bucketValue,
  rawStatText,
  compact = false,
}: Props) {
  if (compact) {
    return (
      <CompactBucket
        label={label}
        compactLabel={compactLabel ?? label}
        bucketValue={bucketValue}
      />
    );
  }

  const widthPct = bucketValue != null ? (bucketValue / 5) * 100 : 0;
  const bucketLabel = bucketValue != null ? BUCKET_LABEL_MAP[bucketValue] ?? "" : "N/A";
  const barColor = bucketValue != null ? BAR_COLORS[bucketValue] ?? "bg-secondary" : "bg-muted";

  return (
    <div className="flex items-center gap-3">
      {/* Label — fixed width so all bars align */}
      <div className="w-36 shrink-0 text-sm text-muted-foreground text-right pr-4">
        {label}
      </div>

      {/* Bar track */}
      <div className="flex-1 flex items-center gap-2">
        <div className="relative h-5 flex-1 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${barColor}`}
            style={{ width: `${widthPct}%` }}
          />
          {/* Tick marks at 20%, 40%, 60%, 80% */}
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="absolute top-0 bottom-0 w-px bg-white/50"
              style={{ left: `${i * 20}%` }}
            />
          ))}
        </div>

        {/* Bucket label — data-meaning colors preserved */}
        <span
          className={`w-24 text-sm font-medium shrink-0
            ${bucketValue === 5 ? "text-green-700" : ""}
            ${bucketValue === 4 ? "text-green-600" : ""}
            ${bucketValue === 3 ? "text-yellow-600" : ""}
            ${bucketValue === 2 ? "text-orange-500" : ""}
            ${bucketValue === 1 ? "text-red-500" : ""}
            ${bucketValue == null ? "text-muted-foreground" : ""}
          `}
        >
          {bucketLabel}
        </span>
      </div>

      {/* Raw stat */}
      {rawStatText && (
        <div className="hidden sm:block w-44 text-xs text-muted-foreground shrink-0 truncate">
          {rawStatText}
        </div>
      )}
    </div>
  );
}

/* ── Compact version for match cards ── */

function CompactBucket({
  label,
  compactLabel,
  bucketValue,
}: {
  label: string;
  compactLabel: string;
  bucketValue: number | null;
}) {
  const color = bucketValue != null
    ? DOT_COLORS[bucketValue] ?? { bg: "bg-secondary", text: "text-card" }
    : { bg: "bg-muted", text: "text-muted-foreground" };
  const bucketLabel = bucketValue != null ? BUCKET_LABEL_MAP[bucketValue] ?? "" : "N/A";

  return (
    <div className="flex flex-col items-center" title={`${label}: ${bucketLabel}`}>
      <div
        className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-[10px] md:text-xs font-bold ${color.bg} ${color.text}`}
      >
        {bucketValue ?? "\u2014"}
      </div>
      <span className="text-[9px] md:text-[10px] text-muted-foreground mt-0.5">
        {compactLabel}
      </span>
    </div>
  );
}
