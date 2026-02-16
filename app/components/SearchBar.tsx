"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { SearchResult } from "@/app/lib/types";

interface Props {
  onSelect: (player: SearchResult) => void;
  compact?: boolean;
}

export default function SearchBar({ onSelect, compact = false }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const doSearch = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`);
      const data = await res.json();
      setResults(data.results ?? []);
      setIsOpen(true);
      setHighlightIdx(-1);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(value), 250);
  };

  const handleSelect = (player: SearchResult) => {
    setQuery(player.full_name);
    setIsOpen(false);
    setResults([]);
    onSelect(player);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && highlightIdx >= 0) {
      e.preventDefault();
      handleSelect(results[highlightIdx]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={`relative w-full ${compact ? "max-w-xl" : "max-w-2xl"} mx-auto`}
    >
      <div className="relative">
        {/* Search icon */}
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="Search for a player..."
          className={`w-full pl-12 pr-4 bg-white border border-gray-200 rounded-xl shadow-sm
                     focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent
                     transition-shadow hover:shadow-md
                     ${compact ? "py-2 text-sm" : "py-3 text-base"}`}
        />
        {loading && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-gray-300 border-t-accent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && results.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 max-h-80 overflow-y-auto text-left">
          {results.map((player, idx) => (
            <li
              key={player.id}
              onClick={() => handleSelect(player)}
              onMouseEnter={() => setHighlightIdx(idx)}
              className={`px-4 py-3 cursor-pointer transition-colors
                ${idx === highlightIdx ? "bg-orange-50" : "hover:bg-gray-50"}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span className="text-base font-medium text-gray-900">
                    {player.full_name}
                  </span>
                  {player.is_graduated && (
                    <span className="text-xs bg-gray-100 text-gray-500 rounded-full px-2 py-0.5">
                      historical
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium bg-orange-100 text-orange-700 rounded-full px-2 py-1 shrink-0 ml-3">
                  {player.position_group}
                </span>
              </div>
              <div className="text-sm text-gray-500 mt-0.5">
                {player.team}
                {player.conference ? ` \u00b7 ${player.conference}` : ""}
                {player.class_year ? ` \u00b7 ${player.class_year}` : ""}
              </div>
            </li>
          ))}
        </ul>
      )}

      {isOpen && results.length === 0 && query.trim().length >= 2 && !loading && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 px-4 py-3 text-sm text-gray-500">
          No players found for &ldquo;{query}&rdquo;
        </div>
      )}
    </div>
  );
}
