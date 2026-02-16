"use client";

import { BUCKET_LABEL_MAP } from "@/app/lib/types";

interface Props {
  label: string;
  /** Short label for compact mode (e.g. "3PT", "ORB") */
  compactLabel?: string;
  bucketValue: number | null;
  rawStatText?: string;
  /** If true, show a red diff ring around the bar */
  isDiff?: boolean;
  /** If true, show a green highlight ring (for build results) */
  isHighlight?: boolean;
  /** Compact mode for match cards */
  compact?: boolean;
}

const BAR_COLORS: Record<number, string> = {
  1: "bg-red-500",
  2: "bg-orange-400",
  3: "bg-yellow-400",
  4: "bg-green-400",
  5: "bg-green-600",
};

const DOT_COLORS: Record<number, string> = {
  1: "bg-red-500",
  2: "bg-orange-400",
  3: "bg-yellow-400",
  4: "bg-green-400",
  5: "bg-green-600",
};

export default function BucketBar({
  label,
  compactLabel,
  bucketValue,
  rawStatText,
  isDiff = false,
  isHighlight = false,
  compact = false,
}: Props) {
  if (compact) {
    return (
      <CompactBucket
        label={label}
        compactLabel={compactLabel ?? label}
        bucketValue={bucketValue}
        isDiff={isDiff}
        isHighlight={isHighlight}
      />
    );
  }

  const widthPct = bucketValue != null ? (bucketValue / 5) * 100 : 0;
  const bucketLabel = bucketValue != null ? BUCKET_LABEL_MAP[bucketValue] ?? "" : "N/A";
  const barColor = bucketValue != null ? BAR_COLORS[bucketValue] ?? "bg-gray-300" : "bg-gray-200";

  return (
    <div className="flex items-center gap-3">
      {/* Label — fixed width so all bars align */}
      <div className="w-36 shrink-0 text-sm text-gray-600 text-right pr-4">
        {label}
      </div>

      {/* Bar track */}
      <div className="flex-1 flex items-center gap-2">
        <div
          className={`relative h-5 flex-1 bg-gray-100 rounded-full overflow-hidden
            ${isDiff ? "ring-2 ring-red-400 ring-offset-1" : ""}`}
        >
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

        {/* Bucket label */}
        <span
          className={`w-24 text-sm font-medium shrink-0
            ${bucketValue === 5 ? "text-green-700" : ""}
            ${bucketValue === 4 ? "text-green-600" : ""}
            ${bucketValue === 3 ? "text-yellow-600" : ""}
            ${bucketValue === 2 ? "text-orange-500" : ""}
            ${bucketValue === 1 ? "text-red-500" : ""}
            ${bucketValue == null ? "text-gray-400" : ""}
          `}
        >
          {bucketLabel}
        </span>
      </div>

      {/* Raw stat */}
      {rawStatText && (
        <div className="hidden sm:block w-44 text-xs text-gray-400 shrink-0 truncate">
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
  isDiff,
  isHighlight,
}: {
  label: string;
  compactLabel: string;
  bucketValue: number | null;
  isDiff?: boolean;
  isHighlight?: boolean;
}) {
  const dotColor = bucketValue != null ? DOT_COLORS[bucketValue] ?? "bg-gray-300" : "bg-gray-200";
  const bucketLabel = bucketValue != null ? BUCKET_LABEL_MAP[bucketValue] ?? "" : "N/A";

  const ringClass = isHighlight
    ? "ring-2 ring-green-500 ring-offset-1"
    : isDiff
      ? "ring-2 ring-red-400 ring-offset-1"
      : "";

  return (
    <div className="flex flex-col items-center gap-0.5" title={`${label}: ${bucketLabel}`}>
      <div
        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white text-xs font-bold
          ${dotColor} ${ringClass}
        `}
      >
        {bucketValue ?? "\u2014"}
      </div>
      <span className="text-xs text-gray-400 leading-tight text-center mt-1">
        {compactLabel}
      </span>
    </div>
  );
}
