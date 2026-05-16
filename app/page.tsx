"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import consoles from "@/data/consoles.json";

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Game", value: "game" },
  { label: "Handheld", value: "handheld" },
  { label: "Network", value: "network" },
  { label: "Computer", value: "computer" },
  { label: "Arcade", value: "arcade" },
];

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: "bg-green-500 text-white",
  Intermediate: "bg-yellow-400 text-white",
  Advanced: "bg-red-500 text-white",
};

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // Prepare the data
  const allConsoles: any[] = Array.isArray(consoles) ? consoles : [];
  const beginnerConsoles = useMemo(
    () =>
      allConsoles.filter(
        (c) =>
          (c.difficulty === "Beginner" || c.difficulty === "beginner") &&
          (!search || c.name.toLowerCase().includes(search.toLowerCase())) &&
          (filter === "all" || (c.type && c.type.toLowerCase() === filter))
      ),
    [search, filter, allConsoles]
  );

  const filteredConsoles = useMemo(
    () =>
      allConsoles.filter(
        (c) =>
          (filter === "all" || (c.type && c.type.toLowerCase() === filter)) &&
          (!search || c.name.toLowerCase().includes(search.toLowerCase()))
      ),
    [search, filter, allConsoles]
  );

  return (
    <div
      className="font-sans bg-zinc-50 dark:bg-black min-h-screen"
      style={{
        fontFamily: "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
      }}
    >
      <main className="bg-white dark:bg-black min-h-screen py-32 px-16">
        <div className="max-w-3xl mx-auto">
          <section className="mb-14">
            <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-white mb-2">
              Welcome to Console Learning
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 font-medium mb-8">
              Explore different consoles to learn coding, programming, and hardware concepts.
            </p>
            <div className="mb-8">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search consoles by name..."
                className="w-full rounded-full px-5 py-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-black text-zinc-900 dark:text-white text-base outline-none transition focus:ring-2 focus:ring-green-500"
                style={{
                  fontFamily: "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
                }}
                aria-label="Search consoles"
              />
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                    filter === f.value
                      ? "bg-green-600 text-white"
                      : "bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                  }`}
                  style={{
                    fontFamily: "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
                  }}
                  type="button"
                >
                  {f.label}
                </button>
              ))}
            </div>
          </section>

          {beginnerConsoles.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">
                Recommended for New Coders
              </h2>
              <div className="grid gap-5 md:grid-cols-2 sm:grid-cols-1 mb-6">
                {beginnerConsoles.map((c) => (
                  <Link
                    key={c.id}
                    href={`/console/${c.id}`}
                    className="block border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 bg-zinc-50 dark:bg-zinc-900 hover:shadow-md transition"
                    style={{
                      fontFamily: "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
                    }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xl font-bold text-zinc-900 dark:text-white">{c.name}</span>
                      <span
                        className={`ml-2 px-3 py-1 rounded-full text-xs font-bold ${DIFFICULTY_COLORS[c.difficulty] || "bg-zinc-400 text-white"}`}
                      >
                        {c.difficulty}
                      </span>
                    </div>
                    <div className="text-zinc-600 dark:text-zinc-400 text-sm">
                      <span className="mr-4">Year: {c.year}</span>
                      <span>Type: {c.type?.charAt(0).toUpperCase() + c.type?.slice(1)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">All Consoles</h2>
            {filteredConsoles.length === 0 ? (
              <div className="py-12 text-center text-zinc-600 dark:text-zinc-400 text-base">
                No consoles found matching your criteria.
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 sm:grid-cols-1">
                {filteredConsoles.map((c) => (
                  <Link
                    key={c.id}
                    href={`/console/${c.id}`}
                    className="block border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 bg-zinc-50 dark:bg-zinc-900 hover:shadow-md transition"
                    style={{
                      fontFamily: "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
                    }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg font-bold text-zinc-900 dark:text-white">{c.name}</span>
                      <span
                        className={`ml-2 px-3 py-1 rounded-full text-xs font-bold ${DIFFICULTY_COLORS[c.difficulty] || "bg-zinc-400 text-white"}`}
                      >
                        {c.difficulty}
                      </span>
                    </div>
                    <div className="text-zinc-600 dark:text-zinc-400 text-sm">
                      <span className="mr-4">Year: {c.year}</span>
                      <span>Type: {c.type?.charAt(0).toUpperCase() + c.type?.slice(1)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}