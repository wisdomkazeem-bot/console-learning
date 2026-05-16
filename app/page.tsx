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
  Intermediate: "bg-yellow-100 text-yellow-700 dark:bg-yellow-600 dark:text-white",
  Advanced: "bg-red-100 text-red-700 dark:bg-red-600 dark:text-white",
};

export default function Home() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredConsoles = useMemo(() => {
    const lcSearch = search.trim().toLowerCase();
    return consoles.filter((c: any) => {
      const matchesName = c.name.toLowerCase().includes(lcSearch);
      const matchesType = filter === "all" ? true : c.type === filter;
      return matchesName && matchesType;
    });
  }, [search, filter]);

  return (
    <div
      className="bg-zinc-50 dark:bg-black min-h-screen font-sans"
      style={{
        minHeight: "100dvh",
        fontFamily: "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
      }}
    >
      <main className="w-full">
        <div className="max-w-3xl mx-auto px-6 py-12">
          {/* Beginner Banner */}
          <div className="mb-8">
            <div className="w-full bg-green-500 rounded-xl flex flex-col md:flex-row items-center justify-between px-8 py-7 gap-3 shadow">
              <span className="text-xl md:text-2xl font-bold text-white">
                🍀 New to coding? Start here!
              </span>
              <div className="flex gap-3">
                <a
                  href="https://www.raspberrypi.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full px-5 py-2 bg-white text-green-700 font-semibold transition hover:bg-zinc-100 dark:bg-black/30 dark:text-white dark:hover:bg-black/60"
                  style={{ fontFamily: "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)" }}
                >
                  Raspberry Pi
                </a>
                <a
                  href="https://en.wikipedia.org/wiki/Commodore_64"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full px-5 py-2 bg-white text-green-700 font-semibold transition hover:bg-zinc-100 dark:bg-black/30 dark:text-white dark:hover:bg-black/60"
                  style={{ fontFamily: "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)" }}
                >
                  Commodore 64
                </a>
              </div>
            </div>
          </div>
          {/* Card Container */}
          <div className="bg-white dark:bg-black rounded-xl shadow-xl px-6 py-10 w-full">
            {/* Search Bar */}
            <div className="mb-5 max-w-md mx-auto">
              <input
                type="search"
                placeholder="Search consoles..."
                className="w-full rounded-xl px-4 py-3 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 font-sans focus:outline-none focus:ring-2 focus:ring-green-300 text-base"
                style={{
                  fontFamily: "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
                }}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            {/* Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {FILTERS.map(f => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`rounded-full px-4 py-2 font-semibold text-sm border transition
                    ${
                      filter === f.value
                        ? "bg-green-600 text-white border-green-500 shadow"
                        : "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                    }
                  `}
                  type="button"
                  style={{
                    fontFamily: "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Console Cards */}
            <div className="grid sm:grid-cols-2 gap-6">
              {filteredConsoles.length === 0 ? (
                <div className="col-span-full text-center py-12 text-zinc-400 dark:text-zinc-600">No consoles found.</div>
              ) : (
                filteredConsoles.map((c: any) => (
                  <a
                    key={c.id}
                    href={`/console/${c.id}`}
                    className="group bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 flex flex-col items-center shadow hover:shadow-lg transition"
                    style={{
                      fontFamily: "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
                    }}
                  >
                    <div className="mb-2 text-4xl">{c.emoji}</div>
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-white text-center mb-2 group-hover:underline">{c.name}</h2>
                    <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-sans mb-2 text-zinc-600 dark:text-zinc-400">
                      <span className="rounded-full bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5">
                        🗓 {c.year}
                      </span>
                      <span className="rounded-full bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5">
                        🖥 CPU: {c.cpu}
                      </span>
                      <span className="rounded-full bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5">
                        🧠 RAM: {c.ram}
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
                    <div className="mt-auto w-full">
                      <span
                        className="block text-center w-full rounded-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 transition"
                        style={{
                          fontFamily: "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
                        }}
                      >
                        Learn →
                      </span>
                    </div>
                  </a>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}