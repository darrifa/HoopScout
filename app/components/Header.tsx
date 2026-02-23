"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-40">
      <div className="px-6 py-3 flex items-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <svg
            className="w-8 h-8 text-accent shrink-0"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12 2C12 2 12 22 12 22" stroke="currentColor" strokeWidth="1.2" fill="none" />
            <path d="M2 12C2 12 22 12 22 12" stroke="currentColor" strokeWidth="1.2" fill="none" />
            <path d="M4.93 4.93C8 8 12 10 12 12C12 14 8 16 4.93 19.07" stroke="currentColor" strokeWidth="1.2" fill="none" />
            <path d="M19.07 4.93C16 8 12 10 12 12C12 14 16 16 19.07 19.07" stroke="currentColor" strokeWidth="1.2" fill="none" />
          </svg>
          <h1 className="text-xl font-bold text-foreground leading-tight">
            Hoop<span className="text-accent">Scout</span>
          </h1>
        </Link>
      </div>
    </header>
  );
}
