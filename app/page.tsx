"use client";

import { useState, useMemo } from "react";
import consoles from "@/data/consoles.json";

const TYPE_FILTERS = [
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
  Advanced: "bg-red-100 text-red-700 dark:bg-red-700 dark:text-white",
};

function getAllLanguages(list: Array<any>): string[] {
  const set = new Set<string>();
  for (const c of list) {
    if (Array.isArray(c.languages)) {
      for (const lang of c.languages) set.add(lang);
    }
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

const LANG_FILTERS = getAllLanguages(consoles as Array<any>);

function filterByType(list: any[], type: string) {
  if (type === "all") return list;
  return list.filter(
    (c) => typeof c.type === "string" && c.type.toLowerCase() === type
  );
}

function filterByLang(list: any[], lang: string) {
  if (!lang) return list;
  return list.filter(
    (c) =>
      Array.isArray(c.languages) &&
      c.languages.some(
        (l: string) => typeof l === "string" && l.toLowerCase() === lang.toLowerCase()
      )
  );
}

function filterBySearch(list: any[], query: string) {
  if (!query) return list;
  const q = query.trim().toLowerCase();
  return list.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      (Array.isArray(c.languages) &&
        c.languages.some(
          (l: string) => typeof l === "string" && l.toLowerCase().includes(q)
        )
      )
  );
}

function beginnerConsoles(list: any[]) {
  // Raspberry Pi and Commodore 64 as priority
  const out: any[] = [];
  const pi = list.find(
    (c) => c.name.toLowerCase().includes("raspberry pi") && c.difficulty === "Beginner"
  );
  if (pi) out.push(pi);
  const c64 = list.find(
    (c) => c.name.toLowerCase().includes("commodore 64") && c.difficulty === "Beginner"
  );
  if (c64) out.push(c64);
  for (const c of list) {
    if (out.length >= 2) break;
    if (c.difficulty === "Beginner" && !out.includes(c)) out.push(c);
  }
  return out.slice(0, 2);
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [language, setLanguage] = useState("");

  const filteredConsoles = useMemo(() => {
    let list = filterByType(consoles as any[], filter);
    list = filterByLang(list, language);
    list = filterBySearch(list, search);
    return list;
  }, [filter, language, search]);

  const beginnerList = beginnerConsoles(consoles as any[]);

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
          <section className="mb-8">
            <div className="w-full bg-green-500 rounded-xl flex flex-col md:flex-row items-center justify-between px-8 py-7 gap-3 shadow">
              <span className="text-xl md:text-2xl font-bold text-white">
                New to coding? Start here!
              </span>
              <div className="flex gap-3 flex-wrap justify-center">
                {beginnerList.map((c) => (
                  <a
                    key={c.id}
                    href={`/console/${c.id}`}
                    className="rounded-full px-5 py-2 bg-white text-green-700 font-semibold transition hover:bg-zinc-100 dark:bg-black/30 dark:text-white dark:hover:bg-black/60"
                    style={{
                      fontFamily:
                        "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
                    }}
                  >
                    {c.name}
                  </a>
                ))}
              </div>
            </div>
          </section>
          {/* Main Card Section */}
          <div className="bg-white dark:bg-black rounded-xl shadow-xl px-6 py-10 w-full">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row md:items-center md:gap-4 mb-5">
              {/* Search Bar */}
              <div className="flex-1 mb-2 md:mb-0">
                <input
                  type="search"
                  placeholder="Search by name or language…"
                  aria-label="Search consoles"
                  className="w-full rounded-xl px-4 py-3 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 font-sans focus:outline-none focus:ring-2 focus:ring-green-300 text-base"
                  style={{
                    fontFamily: "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
                  }}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  autoComplete="off"
                />
              </div>
              {/* Coding Language Filter Dropdown */}
              <div className="flex-none min-w-[160px] ml-0 md:ml-3">
                <select
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  className="rounded-xl px-4 py-3 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-sans focus:outline-none focus:ring-2 focus:ring-green-300 text-base w-full"
                  style={{
                    fontFamily: "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
                  }}
                  aria-label="Filter by coding language"
                >
                  <option value="">All Languages</option>
                  {LANG_FILTERS.map((lang: string) => (
                    <option value={lang} key={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* Console Type Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {TYPE_FILTERS.map(f => (
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
                <div className="col-span-full text-center py-12 text-zinc-400 dark:text-zinc-600">
                  No consoles found.
                </div>
              ) : (
                filteredConsoles.map((c: any) => (
                  <a
                    key={c.id}
                    href={`/console/${c.id}`}
                    className="group bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 flex flex-col items-start shadow hover:shadow-lg transition font-sans"
                    style={{
                      fontFamily: "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
                    }}
                  >
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-1 group-hover:underline">
                      {c.name}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2 text-xs mb-4 text-zinc-600 dark:text-zinc-400">
                      <span className="rounded-full bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 font-medium">
                        {c.year}
                      </span>
                      {c.type && (
                        <span className="rounded-full bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 font-medium">
                          {c.type}
                        </span>
                      )}
                      {Array.isArray(c.languages) && c.languages.length > 0 && (
                        <span className="rounded-full bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 font-medium">
                          {c.languages.map((l: string, i: number) =>
                            i === 0 ? l : `, ${l}`
                          )}
                        </span>
                      )}
                    </div>
                    <div className="mb-3">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          DIFFICULTY_COLORS[c.difficulty] ||
                          "bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                        }`}
                        title={`Difficulty: ${c.difficulty}`}
                      >
                        {c.difficulty}
                      </span>
                    </div>
                    <span
                      className="inline-block rounded-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-5 transition mt-auto"
                      style={{
                        fontFamily: "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
                      }}
                    >
                      Learn →
                    </span>
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