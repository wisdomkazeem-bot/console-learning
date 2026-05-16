"use client";

import { useState, useMemo } from "react";
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
  Beginner: "bg-green-100 text-green-700 dark:bg-green-700 dark:text-white",
  Intermediate: "bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-white",
  Advanced: "bg-red-100 text-red-700 dark:bg-red-700 dark:text-white",
};

export default function Home() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredConsoles = useMemo(() => {
    return consoles.filter((c: any) => {
      const matchesName = c.name.toLowerCase().includes(search.toLowerCase());
      const matchesType = filter === "all" ? true : c.type === filter;
      return matchesName && matchesType;
    });
  }, [search, filter]);

  return (
    <div
      className="bg-zinc-50 dark:bg-black min-h-screen"
      style={{
        minHeight: "100dvh",
        fontFamily:
          "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
      }}
    >
      <main className="flex flex-col items-center justify-start min-h-screen w-full min-w-0">
        {/* Content Container */}
        <section
          className="relative w-full max-w-5xl px-6 lg:px-8 py-10 flex flex-col items-center"
        >
          {/* Beginner Banner */}
          <div className="w-full mb-8">
            <div className="flex flex-col md:flex-row items-center gap-4 bg-green-500 rounded-xl px-10 py-7 shadow-lg justify-between">
              <span className="text-2xl md:text-2xl font-bold text-white">
                🍀 New to coding? Start here!
              </span>
              <span className="flex flex-wrap gap-3">
                <a
                  href="https://www.raspberrypi.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full px-5 py-2 font-medium bg-white hover:bg-zinc-100 text-green-700 transition dark:bg-black/30 dark:hover:bg-black/60 dark:text-white"
                >
                  Raspberry Pi
                </a>
                <a
                  href="https://en.wikipedia.org/wiki/Commodore_64"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full px-5 py-2 font-medium bg-white hover:bg-zinc-100 text-green-700 transition dark:bg-black/30 dark:hover:bg-black/60 dark:text-white"
                >
                  Commodore 64
                </a>
              </span>
            </div>
          </div>

          {/* White Panel (matches 'main' content bg) */}
          <div className="bg-white/80 dark:bg-black/80 w-full rounded-2xl shadow-xl px-8 py-10 flex flex-col items-center">
            {/* Search Bar */}
            <div className="w-full max-w-2xl mb-4">
              <input
                type="search"
                placeholder="🔎 Search for a console..."
                className="w-full rounded-xl px-5 py-3 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-green-400 text-base font-sans"
                style={{
                  fontFamily:
                    "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
                }}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {/* Filter Buttons */}
            <div className="w-full flex flex-wrap gap-2 justify-center mb-8">
              {FILTERS.map(f => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`rounded-full px-4 py-2 font-medium text-sm border transition 
                    ${
                      filter === f.value
                        ? "bg-green-600 text-white border-green-500 shadow"
                        : "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                    }
                  `}
                  style={{
                    fontFamily:
                      "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
                  }}
                  type="button"
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Console Cards Grid */}
            <div className="w-full grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredConsoles.length === 0 ? (
                <div className="col-span-full text-center text-zinc-400 dark:text-zinc-600 text-base mt-6">
                  No consoles found. Try adjusting your search or filters.
                </div>
              ) : (
                filteredConsoles.map((c: any) => (
                  <div
                    key={c.id}
                    className="bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col items-center shadow-md transition hover:shadow-lg"
                  >
                    <span className="text-4xl mb-2">{c.emoji}</span>
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-1 text-center">
                      {c.name}
                    </h2>
                    <div className="mb-2 flex flex-col items-center text-zinc-600 dark:text-zinc-400 text-xs font-sans">
                      <span className="inline-flex gap-2">
                        <span className="rounded-full bg-zinc-100 dark:bg-zinc-900 px-3 py-1">
                          🗓 {c.year}
                        </span>
                        <span className="rounded-full bg-zinc-100 dark:bg-zinc-900 px-3 py-1">
                          🖥 CPU: {c.cpu}
                        </span>
                        <span className="rounded-full bg-zinc-100 dark:bg-zinc-900 px-3 py-1">
                          🧠 RAM: {c.ram}
                        </span>
                      </span>
                    </div>
                    <div className="mb-3">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${DIFFICULTY_COLORS[c.difficulty] || "bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"}`}
                        title={"Difficulty: " + c.difficulty}
                      >
                        {c.difficulty}
                      </span>
                    </div>
                    <a
                      href={`/consoles/${c.id}`}
                      className="mt-auto w-full rounded-full bg-green-600 hover:bg-green-700 text-white font-bold text-center py-2 px-4 transition"
                      style={{
                        fontFamily:
                          "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
                      }}
                    >
                      Learn <span aria-hidden>→</span>
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}