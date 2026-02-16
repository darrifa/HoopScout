"use client";

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

const SEGMENT_COLORS_ACTIVE: Record<number, string> = {
  2: "bg-orange-300 border-orange-300",
  3: "bg-yellow-400 border-yellow-400",
  4: "bg-green-400 border-green-400",
  5: "bg-green-600 border-green-600",
};

const SEGMENT_TEXT_DARK: Set<number> = new Set([4, 5]);

const CONTEXTUAL_LABEL: Record<number, { text: string; color: string }> = {
  0: { text: "No minimum", color: "text-gray-400" },
  2: { text: "Top 90% at position", color: "text-orange-500" },
  3: { text: "Top 70% at position", color: "text-yellow-600" },
  4: { text: "Top 30% at position", color: "text-green-500" },
  5: { text: "Top 10% at position", color: "text-green-700" },
};

export default function DimensionScale({ label, tooltip, value, onChange }: Props) {
  const ctx = CONTEXTUAL_LABEL[value] ?? CONTEXTUAL_LABEL[0];

  return (
    <div className="py-4">
      {/* Header row: label + contextual text */}
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
          {label}
          {tooltip && (
            <span className="relative group">
              <svg
                className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 transition-colors cursor-help"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <path strokeWidth="2" strokeLinecap="round" d="M12 16v0m0-8a2.5 2.5 0 011.5 4.5c-.5.3-1.5.8-1.5 1.5" />
              </svg>
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 px-3 py-2 text-xs font-normal text-gray-600 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 pointer-events-none z-50 leading-relaxed">
                {tooltip}
              </span>
            </span>
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

      {/* Scale track */}
      <div className="relative">
        <div className="flex gap-1 items-center">
          {/* Any button */}
          <button
            onClick={() => onChange(0)}
            className={`h-9 w-14 rounded-l-lg text-xs font-medium transition-all border cursor-pointer ${
              value === 0
                ? "bg-gray-200 text-gray-600 border-gray-300"
                : "bg-white text-gray-300 border-gray-100 hover:border-gray-200"
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
                    ? `${color} ${SEGMENT_TEXT_DARK.has(t) ? "text-white" : "text-gray-700"}`
                    : "bg-white border-gray-100 text-gray-300 hover:bg-gray-50"
                }`}
                aria-label={`Set minimum ${label} to ${THRESHOLD_LABELS[t]}`}
              >
                {THRESHOLD_LABELS[t]}
                {isSelected && (
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
                    <div className="text-[9px] text-gray-400 whitespace-nowrap">
                      &#9650; floor
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Labels below segments */}
        <div className="flex mt-5 text-[10px] text-gray-400">
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
