"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import consoles from "@/data/consoles.json";
import languagesData from "@/data/languages.json";
import ConsoleCard from "@/components/ConsoleCard";
import BeginnerGuide from "@/components/BeginnerGuide";
import { CONSOLE_TYPES } from "@/lib/types";
import type { Console, ConsoleType } from "@/lib/types";
import type { Language } from "@/lib/language-types";

const allLanguages = languagesData as Language[];

const allConsoles = consoles as Console[];

export default function Home() {
  const [filter, setFilter] = useState<ConsoleType | "all">("all");

  const filtered = useMemo(() => {
    if (filter === "all") return allConsoles;
    return allConsoles.filter((c) => c.type === filter);
  }, [filter]);

  const beginnerCount = allConsoles.filter((c) => c.difficulty === "Beginner").length;

  return (
    <div className="min-h-screen bg-retro-bg">
      {/* Header */}
      <header className="border-b-[3px] border-retro-border bg-retro-surface">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <nav className="flex flex-wrap items-center gap-3 mb-6 text-xs">
            <span className="font-pixel text-[8px] text-retro-cyan">HOME</span>
            <span className="text-retro-border">|</span>
            <Link
              href="/languages"
              className="font-pixel text-[8px] text-retro-muted hover:text-retro-green transition-colors"
            >
              LANGUAGE LESSONS
            </Link>
          </nav>
          <p className="font-pixel text-[8px] text-retro-green mb-3 tracking-wider">
            CONSOLE LEARNING v1.0
          </p>
          <h1 className="font-pixel text-lg sm:text-xl text-retro-cyan leading-relaxed mb-3">
            LEARN TO CODE
          </h1>
          <p className="text-sm text-retro-muted max-w-2xl leading-relaxed">
            <span className="cursor-blink">Explore retro consoles and modern devices</span>
            {" "}— from Game Boy to Raspberry Pi. Real code, beginner explanations, and hands-on examples.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <BeginnerGuide />

        <Link
          href="/languages"
          className="pixel-card block mb-12 group hover:border-retro-green transition-colors"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-pixel text-[8px] text-retro-green mb-2">NEW — INTERACTIVE COURSES</p>
              <h2 className="font-pixel text-sm text-retro-cyan group-hover:text-retro-yellow transition-colors mb-2">
                LANGUAGE LESSONS
              </h2>
              <p className="text-xs text-retro-muted max-w-xl leading-relaxed">
                {allLanguages.length} languages, {allLanguages[0]?.topics.length ?? 10} lessons each —
                variables, loops, functions, challenges, and more.
              </p>
            </div>
            <span className="pixel-btn-sm text-[8px] font-pixel shrink-0">VIEW ALL LESSONS →</span>
          </div>
        </Link>

        {/* Quick stats */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="pixel-tag border-retro-cyan text-retro-cyan text-[8px] font-pixel px-3 py-2">
            {allConsoles.length} CONSOLES
          </div>
          <div className="pixel-tag border-retro-green text-retro-green text-[8px] font-pixel px-3 py-2">
            {beginnerCount} BEGINNER FRIENDLY
          </div>
          <div className="pixel-tag border-retro-yellow text-retro-yellow text-[8px] font-pixel px-3 py-2">
            5 CATEGORIES
          </div>
        </div>

        {/* Type filters */}
        <div className="mb-8">
          <h2 className="font-pixel text-[10px] text-retro-yellow mb-4">FILTER BY TYPE</h2>
          <div className="flex flex-wrap gap-2">
            {CONSOLE_TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => setFilter(t.value)}
                className={`pixel-btn-sm text-[8px] font-pixel flex items-center gap-2 ${
                  filter === t.value ? "pixel-btn-active" : ""
                }`}
              >
                <span aria-hidden="true">{t.icon}</span>
                {t.label.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Console grid */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-pixel text-[10px] text-retro-cyan">
            {filter === "all" ? "ALL CONSOLES" : filter.toUpperCase()}
          </h2>
          <span className="text-xs text-retro-muted">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((c) => (
              <ConsoleCard key={c.id} console={c} />
            ))}
          </div>
        ) : (
          <div className="pixel-card text-center py-12">
            <p className="font-pixel text-[10px] text-retro-muted">NO CONSOLES FOUND</p>
          </div>
        )}
      </main>

      <footer className="border-t-[3px] border-retro-border mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center">
          <p className="font-pixel text-[7px] text-retro-muted">
            PRESS START TO CODE — CONSOLE LEARNING © 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
