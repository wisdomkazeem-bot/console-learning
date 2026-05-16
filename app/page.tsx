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
  Beginner: "bg-green-500 text-white",
  Intermediate: "bg-yellow-400 text-black",
  Advanced: "bg-red-500 text-white",
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
    <main className="min-h-screen bg-zinc-900 px-4 py-10 font-sans text-zinc-100 flex flex-col items-center">
      {/* Beginner Banner */}
      <div className="w-full max-w-3xl mb-10">
        <div className="flex flex-col md:flex-row items-center gap-4 bg-green-600 rounded-xl px-8 py-7 shadow-lg justify-between">
          <span className="text-2xl font-bold text-white">
            🍀 New to coding? Start here!
          </span>
          <span className="flex flex-wrap gap-3">
            <a
              href="https://www.raspberrypi.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg px-5 py-2 transition"
            >
              Raspberry Pi
            </a>
            <a
              href="https://en.wikipedia.org/wiki/Commodore_64"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg px-5 py-2 transition"
            >
              Commodore 64
            </a>
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="w-full max-w-2xl flex flex-col items-center mb-6 gap-2">
        <input
          type="search"
          placeholder="🔎 Search for a console..."
          className="w-full rounded-xl px-4 py-3 bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-inner focus:outline-none focus:ring-2 focus:ring-green-400 font-medium"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mt-2 justify-center w-full">
          {FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`rounded-full px-4 py-1.5 font-medium text-sm transition
                ${
                  filter === f.value
                    ? "bg-green-500 text-white shadow"
                    : "bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
                }
              `}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Console Cards */}
      <div className="max-w-5xl grid gap-7 w-full sm:grid-cols-2 lg:grid-cols-3">
        {filteredConsoles.length === 0 ? (
          <div className="col-span-full text-center text-lg text-zinc-400 mt-6">
            No consoles found. Try adjusting your search or filters.
          </div>
        ) : (
          filteredConsoles.map((c: any) => (
            <div
              key={c.id}
              className="bg-zinc-800 rounded-xl p-6 shadow-md flex flex-col items-center gap-3 border border-zinc-700 hover:shadow-lg transition"
            >
              <span className="text-4xl mb-1">{c.emoji}</span>
              <h2 className="text-2xl font-semibold text-zinc-100 mb-1">{c.name}</h2>
              <div className="mb-1 flex items-center gap-2 text-zinc-300 text-xs">
                <span className="rounded-lg bg-zinc-900/60 px-2 py-0.5">
                  🗓 {c.year}
                </span>
                <span className="rounded-lg bg-zinc-900/60 px-2 py-0.5">
                  🖥 CPU: {c.cpu}
                </span>
                <span className="rounded-lg bg-zinc-900/60 px-2 py-0.5">
                  🧠 RAM: {c.ram}
                </span>
              </div>
              <div className="mb-2">
                <span
                  className={`px-3 py-1 text-xs font-bold rounded-full ${DIFFICULTY_COLORS[c.difficulty] || "bg-zinc-600 text-white"}`}
                  title={"Difficulty: " + c.difficulty}
                >
                  {c.difficulty}
                </span>
              </div>
              <a
                href={`/consoles/${c.id}`}
                className="w-full bg-green-600 hover:bg-green-500 text-white rounded-lg px-4 py-2 font-bold transition mt-auto flex items-center justify-center gap-2"
              >
                Learn <span aria-hidden>→</span>
              </a>
            </div>
          ))
        )}
      </div>
    </main>
  );
}