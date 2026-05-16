"use client";

import { useState, useMemo } from "react";
import languages from "@/data/languages.json";
import Link from "next/link";

const TYPE_FILTERS = [
  { label: "All", value: "all" },
  { label: "Web", value: "web" },
  { label: "Systems", value: "systems" },
  { label: "Scripting", value: "scripting" },
  { label: "Mobile", value: "mobile" },
  { label: "Data", value: "data" },
  { label: "Game", value: "game" },
];

type Language = {
  id: string;
  name: string;
  type: string;
  yearCreated: number;
  creator: string;
  difficulty: string;
  usedFor: string;
};

const BEGINNER_LANGUAGES = [
  { id: "python", name: "Python" },
  { id: "javascript", name: "JavaScript" },
  { id: "basic", name: "BASIC" },
];

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  // Only include languages with correct info for display
  const filteredLanguages = useMemo(() => {
    return (languages as Language[])
      .filter((lang) => {
        const matchName =
          lang.name.toLowerCase().includes(search.toLowerCase());
        const matchType =
          typeFilter === "all"
            ? true
            : lang.type.toLowerCase() === typeFilter;
        return matchName && matchType;
      });
  }, [search, typeFilter]);

  return (
    <div className="font-sans bg-zinc-50 dark:bg-black min-h-screen">
      <main className="bg-white dark:bg-black max-w-3xl mx-auto py-32 px-16 text-zinc-600 dark:text-zinc-400">
        {/* Beginner Section */}
        <section className="mb-16">
          <h1
            className="font-bold text-3xl md:text-4xl text-zinc-900 dark:text-white mb-2"
            style={{ fontFamily: "var(--font-geist-sans, Inter, sans-serif)" }}
          >
            Learn to Code, Starting Simple
          </h1>
          <p className="mb-4 text-lg text-zinc-600 dark:text-zinc-400">
            New to programming? Try these beginner-friendly languages:
          </p>
          <div className="flex gap-4 mb-2">
            {BEGINNER_LANGUAGES.map((lang) => (
              <Link
                key={lang.id}
                href={`/language/${lang.id}`}
                className="rounded-full bg-zinc-100 dark:bg-zinc-900 px-6 py-2 font-semibold text-base text-zinc-900 dark:text-white transition hover:bg-zinc-200 dark:hover:bg-zinc-700"
                style={{
                  fontFamily:
                    "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
                }}
              >
                {lang.name}
              </Link>
            ))}
          </div>
          <div className="text-sm text-zinc-500 dark:text-zinc-500">
            <span>
              Python, JavaScript, and BASIC are great starting points for absolute beginners.
            </span>
          </div>
        </section>

        {/* Search/filter */}
        <section className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search languages…"
              className="w-full sm:w-72 rounded-full bg-zinc-100 dark:bg-zinc-900 px-5 py-2 text-base outline-none focus:bg-zinc-200 dark:focus:bg-zinc-800 transition shadow border-none"
              style={{
                fontFamily:
                  "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
              }}
              aria-label="Search for a programming language"
            />
            <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
              {TYPE_FILTERS.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setTypeFilter(filter.value)}
                  className={`rounded-full px-4 py-1 font-medium text-sm transition ${
                    typeFilter === filter.value
                      ? "bg-zinc-200 dark:bg-zinc-900 text-zinc-900 dark:text-white"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  }`}
                  style={{
                    fontFamily:
                      "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
                  }}
                  type="button"
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Languages grid */}
        <section>
          {filteredLanguages.length === 0 ? (
            <div className="text-center py-12 text-zinc-400">
              No languages found.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredLanguages.map((lang) => (
                <Link
                  key={lang.id}
                  href={`/language/${lang.id}`}
                  className="block rounded-2xl border border-zinc-100 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition p-6"
                  style={{
                    fontFamily:
                      "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
                  }}
                >
                  <div className="flex justify-between items-baseline mb-2">
                    <h2 className="font-bold text-xl text-zinc-900 dark:text-white truncate">
                      {lang.name}
                    </h2>
                    <span
                      className={`rounded-full px-3 py-0.5 text-xs font-medium ${
                        lang.difficulty === "Beginner"
                          ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                          : lang.difficulty === "Intermediate"
                          ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"
                          : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                      }`}
                      style={{
                        fontFamily:
                          "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
                      }}
                    >
                      {lang.difficulty}
                    </span>
                  </div>
                  <div className="mb-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {lang.usedFor}
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <div>
                      <div className="text-xs text-zinc-400">
                        Year
                      </div>
                      <div className="font-medium text-zinc-700 dark:text-zinc-200">
                        {lang.yearCreated}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-zinc-400">
                        Creator
                      </div>
                      <div className="font-medium text-zinc-700 dark:text-zinc-200 truncate max-w-[120px]">
                        {lang.creator}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-zinc-400">
                        Type
                      </div>
                      <div className="font-medium text-zinc-700 dark:text-zinc-200 capitalize">
                        {lang.type}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}