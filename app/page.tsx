"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import languages from "@/data/languages.json";

// Difficulty color utility (matching app/language/[id]/page.tsx)
const DIFFICULTY_COLORS: Record<
  string,
  { bg: string; text: string }
> = {
  Beginner: {
    bg: "bg-green-100 dark:bg-green-900",
    text: "text-green-700 dark:text-green-300",
  },
  Intermediate: {
    bg: "bg-yellow-100 dark:bg-yellow-900",
    text: "text-yellow-700 dark:text-yellow-300",
  },
  Advanced: {
    bg: "bg-red-100 dark:bg-red-900",
    text: "text-red-700 dark:text-red-300",
  },
};

function getDifficultyColor(difficulty: string) {
  return (
    DIFFICULTY_COLORS[difficulty] || {
      bg: "bg-zinc-200 dark:bg-zinc-800",
      text: "text-zinc-700 dark:text-zinc-200",
    }
  );
}

const FILTERS = [
  { label: "All", type: null },
  { label: "Web", type: "web" },
  { label: "Systems", type: "systems" },
  { label: "Scripting", type: "scripting" },
  { label: "Mobile", type: "mobile" },
  { label: "Data", type: "data" },
  { label: "Game", type: "game" },
];

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default function LanguageHomePage() {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const filteredLanguages = useMemo(() => {
    let result = languages;
    if (selectedType) {
      result = result.filter((lang: any) => lang.type === selectedType);
    }
    if (search.trim()) {
      result = result.filter((lang: any) =>
        lang.name.toLowerCase().includes(search.trim().toLowerCase())
      );
    }
    return result;
  }, [selectedType, search]);

  const beginnerLanguages = useMemo(() => {
    // Python, JavaScript, BASIC (filter, but BASIC may not exist in JSON)
    const keys = ["python", "javascript", "basic"];
    return keys
      .map((id) => (languages as any[]).find((l) => l.id === id))
      .filter(Boolean);
  }, []);

  return (
    <div className="font-sans bg-zinc-50 dark:bg-black min-h-screen">
      <main className="bg-white dark:bg-black max-w-3xl mx-auto min-h-screen py-32 px-16 text-zinc-600 dark:text-zinc-400">
        {/* Beginner Section */}
        <section className="mb-12">
          <div
            className="mb-4 text-3xl font-bold text-zinc-900 dark:text-white"
            style={{
              fontFamily:
                "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
            }}
          >
            Where should you start?
          </div>
          <div className="mb-4 text-base text-zinc-700 dark:text-zinc-300 max-w-xl">
            If you're new to coding, these languages provide a friendly introduction and have vast learning resources:
          </div>
          <div className="flex gap-4 flex-wrap">
            {beginnerLanguages.map((lang: any) => (
              <Link
                href={`/language/${lang.id}`}
                key={lang.id}
                className="rounded-full bg-zinc-100 dark:bg-zinc-900 px-6 py-2 font-semibold text-base text-zinc-900 dark:text-white transition hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-800"
                style={{
                  fontFamily:
                    "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
                }}
              >
                {lang.name}
              </Link>
            ))}
          </div>
        </section>

        {/* Search and filters */}
        <section className="mb-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <input
              type="text"
              placeholder="Search languages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-80 px-4 py-3 rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 text-base outline-none focus:ring-2 focus:ring-zinc-300 dark:focus:ring-zinc-600 transition"
              style={{
                fontFamily:
                  "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
              }}
            />
            <div className="flex gap-2 flex-wrap">
              {FILTERS.map((filter) => (
                <button
                  key={filter.label}
                  className={classNames(
                    "rounded-full px-6 py-2 text-base font-semibold transition border",
                    selectedType === filter.type
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black border-zinc-900 dark:border-zinc-100"
                      : "bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                  )}
                  style={{
                    fontFamily:
                      "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
                  }}
                  onClick={() =>
                    setSelectedType(filter.type ? filter.type : null)
                  }
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* List of languages */}
        <section>
          {filteredLanguages.length === 0 ? (
            <div className="text-zinc-500 text-center mt-20 text-lg">
              No languages found.
            </div>
          ) : (
            <div className="grid gap-7">
              {filteredLanguages.map((lang: any) => {
                const difficulty = getDifficultyColor(lang.difficulty);
                return (
                  <Link
                    href={`/language/${lang.id}`}
                    key={lang.id}
                    className="block rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-6 transition hover:shadow-md focus:outline-none group"
                    style={{
                      fontFamily:
                        "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="text-2xl font-bold text-zinc-900 dark:text-white leading-none"
                          style={{ minWidth: 48 }}
                        >
                          {lang.name}
                        </div>
                        <span
                          className={classNames(
                            "ml-2 rounded-full px-3 py-1 text-xs font-semibold",
                            difficulty.bg,
                            difficulty.text
                          )}
                        >
                          {lang.difficulty}
                        </span>
                      </div>
                      <div className="flex gap-3 items-center">
                        <span className="text-xs bg-zinc-200 dark:bg-zinc-800 rounded-full px-3 py-1 font-medium text-zinc-700 dark:text-zinc-300">
                          {lang.type}
                        </span>
                        <span className="text-xs bg-zinc-200 dark:bg-zinc-800 rounded-full px-3 py-1 font-medium text-zinc-700 dark:text-zinc-300">
                          {lang.year || lang.yearCreated}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center md:gap-5">
                      <div className="mb-1 text-sm text-zinc-700 dark:text-zinc-200">
                        <span className="font-medium">Creator: </span>
                        {lang.creator}
                      </div>
                      <div className="mb-1 text-sm text-zinc-600 dark:text-zinc-400 md:ml-6">
                        <span className="font-medium">Typical uses:</span> {lang.usedFor}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}