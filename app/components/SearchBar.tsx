"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { SearchResult } from "@/app/lib/types";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

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
      <InputGroup className={`rounded-xl shadow-sm hover:shadow-md transition-shadow ${compact ? "h-10" : "h-12"}`}>
        <InputGroupAddon align="inline-start">
          <Search className="size-5 text-muted-foreground" />
        </InputGroupAddon>
        <InputGroupInput
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="Search for a player..."
          className={compact ? "text-sm" : "text-base"}
        />
        {loading && (
          <InputGroupAddon align="inline-end">
            <Spinner className="size-5 text-accent" />
          </InputGroupAddon>
        )}
      </InputGroup>

      {/* Dropdown — custom logic preserved as-is */}
      {isOpen && results.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-1 bg-card rounded-xl shadow-lg border border-border overflow-hidden z-50 max-h-80 overflow-y-auto text-left">
          {results.map((player, idx) => (
            <li
              key={player.id}
              onClick={() => handleSelect(player)}
              onMouseEnter={() => setHighlightIdx(idx)}
              className={`px-4 py-3 cursor-pointer transition-colors
                ${idx === highlightIdx ? "bg-primary/10" : "hover:bg-muted"}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span className="text-base font-medium text-foreground">
                    {player.full_name}
                  </span>
                  {player.is_graduated && (
                    <Badge variant="secondary">historical</Badge>
                  )}
                </div>
                <Badge variant="outline" className="bg-primary/15 text-primary border-transparent shrink-0 ml-3">
                  {player.position_group}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground mt-0.5">
                {player.team}
                {player.conference ? ` \u00b7 ${player.conference}` : ""}
                {player.class_year ? ` \u00b7 ${player.class_year}` : ""}
              </div>
            </li>
          ))}
        </ul>
      )}

      {isOpen && results.length === 0 && query.trim().length >= 2 && !loading && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card rounded-xl shadow-lg border border-border overflow-hidden z-50 px-4 py-3 text-sm text-muted-foreground">
          No players found for &ldquo;{query}&rdquo;
        </div>
      )}
    </div>
  );
}
