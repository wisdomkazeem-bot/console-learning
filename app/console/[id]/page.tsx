"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import consoles from "@/data/languages.json";

// Color mapping for difficulty badge
const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: "bg-green-600 text-white",
  Intermediate: "bg-yellow-400 text-zinc-900",
  Advanced: "bg-red-600 text-white",
};

function getConsoleById(id: string) {
  return (consoles as any[]).find((c) => c.id === id);
}

function uniq(arr: any[]) {
  return Array.from(new Set(arr));
}

export default function ConsolePage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params as { id: string };

  const consoleData = getConsoleById(id);

  const [tab, setTab] = useState<"overview" | "examples" | "resources">("overview");
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [explanationExpanded, setExplanationExpanded] = useState(false);

  // Derive all languages available
  const languageList = useMemo(() => {
    if (!consoleData?.codingExamples) return [];
    return uniq(consoleData.codingExamples.map((e: any) => e.language).filter(Boolean));
  }, [consoleData]);

  // Find first language as default
  React.useEffect(() => {
    if (!selectedLang && languageList.length > 0) {
      setSelectedLang(languageList[0]);
    }
  }, [selectedLang, languageList]);

  const filteredExamples = useMemo(() => {
    if (!selectedLang) return [];
    return (
      consoleData?.codingExamples?.filter((e: any) => e.language === selectedLang) || []
    );
  }, [selectedLang, consoleData]);

  if (!consoleData) {
    return (
      <div
        className="bg-zinc-50 dark:bg-black min-h-screen font-sans"
        style={{
          minHeight: "100dvh",
          fontFamily: "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
        }}
      >
        <div className="max-w-3xl mx-auto px-6 py-14">
          <button
            onClick={() => router.push("/")}
            className="rounded-full px-5 py-2 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-50 font-semibold mb-8 transition hover:bg-zinc-300 dark:hover:bg-zinc-700"
            style={{
              fontFamily:
                "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
            }}
          >
            ← Back to Home
          </button>
          <div className="bg-white dark:bg-black rounded-xl shadow-xl px-6 py-10 w-full text-center">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-5">
              Console not found
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Sorry, we couldn&rsquo;t find that console.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-zinc-50 dark:bg-black min-h-screen font-sans"
      style={{
        minHeight: "100dvh",
        fontFamily: "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
      }}
    >
      <main className="w-full">
        <div className="max-w-3xl mx-auto px-6 py-14">
          <button
            onClick={() => router.push("/")}
            className="rounded-full px-5 py-2 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-50 font-semibold mb-8 transition hover:bg-zinc-300 dark:hover:bg-zinc-700"
            style={{
              fontFamily:
                "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
            }}
          >
            ← Back to Home
          </button>
          {/* Beginner banner if needed */}
          {consoleData.difficulty === "Beginner" && (
            <div className="w-full bg-green-500 rounded-xl flex flex-col md:flex-row items-center justify-between px-8 py-7 gap-3 shadow mb-8">
              <span className="text-xl md:text-2xl font-bold text-white">
                New to coding? This console is a great place to start.
              </span>
            </div>
          )}
          {/* Card */}
          <div className="bg-white dark:bg-black rounded-xl shadow-xl px-6 py-10 w-full">
            {/* Console Title & Specs */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                  {consoleData.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      DIFFICULTY_COLORS[consoleData.difficulty] ||
                      "bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                    }`}
                    title={`Difficulty: ${consoleData.difficulty}`}
                  >
                    {consoleData.difficulty}
                  </span>
                  {consoleData.year && (
                    <span className="rounded-full bg-zinc-100 dark:bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-700 dark:text-zinc-400">
                      {consoleData.year}
                    </span>
                  )}
                  {consoleData.type && (
                    <span className="rounded-full bg-zinc-100 dark:bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-700 dark:text-zinc-400">
                      {consoleData.type}
                    </span>
                  )}
                  {consoleData.manufacturer && (
                    <span className="rounded-full bg-zinc-100 dark:bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-700 dark:text-zinc-400">
                      {consoleData.manufacturer}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={() => setTab("overview")}
                className={`rounded-full px-5 py-2 font-semibold text-base transition ${
                  tab === "overview"
                    ? "bg-zinc-200 dark:bg-zinc-900 text-zinc-900 dark:text-white"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                }`}
                style={{
                  fontFamily:
                    "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
                }}
              >
                Overview
              </button>
              <button
                onClick={() => setTab("examples")}
                className={`rounded-full px-5 py-2 font-semibold text-base transition ${
                  tab === "examples"
                    ? "bg-zinc-200 dark:bg-zinc-900 text-zinc-900 dark:text-white"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                }`}
                style={{
                  fontFamily:
                    "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
                }}
              >
                Code Examples
              </button>
              <button
                onClick={() => setTab("resources")}
                className={`rounded-full px-5 py-2 font-semibold text-base transition ${
                  tab === "resources"
                    ? "bg-zinc-200 dark:bg-zinc-900 text-zinc-900 dark:text-white"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                }`}
                style={{
                  fontFamily:
                    "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
                }}
              >
                Resources
              </button>
            </div>

            {/* Tab content */}
            {tab === "overview" && (
              <div>
                {/* Description */}
                <p className="text-zinc-700 dark:text-zinc-300 mb-4">{consoleData.description}</p>
                {consoleData.funFact && (
                  <div className="py-2 px-4 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 mb-6 font-medium">
                    <span className="font-bold text-zinc-800 dark:text-white">Fun Fact:</span>{" "}
                    {consoleData.funFact}
                  </div>
                )}
                {/* Specs Table */}
                <div className="overflow-x-auto mb-6">
                  <table className="w-full text-sm text-zinc-600 dark:text-zinc-400">
                    <tbody>
                      {consoleData.cpu && (
                        <tr>
                          <td className="py-2 pr-6 font-bold text-zinc-900 dark:text-white">
                            CPU
                          </td>
                          <td className="py-2">{consoleData.cpu}</td>
                        </tr>
                      )}
                      {consoleData.ram && (
                        <tr>
                          <td className="py-2 pr-6 font-bold text-zinc-900 dark:text-white">
                            RAM
                          </td>
                          <td className="py-2">{consoleData.ram}</td>
                        </tr>
                      )}
                      {consoleData.storage && (
                        <tr>
                          <td className="py-2 pr-6 font-bold text-zinc-900 dark:text-white">
                            Storage
                          </td>
                          <td className="py-2">{consoleData.storage}</td>
                        </tr>
                      )}
                      {consoleData.os && (
                        <tr>
                          <td className="py-2 pr-6 font-bold text-zinc-900 dark:text-white">
                            OS
                          </td>
                          <td className="py-2">{consoleData.os}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {/* Coding Languages */}
                <div className="mb-2 font-semibold text-zinc-800 dark:text-white">
                  Coding Languages:
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {Array.isArray(consoleData.languages) &&
                    consoleData.languages.map((l: string) => (
                      <span
                        key={l}
                        className="rounded-full bg-zinc-100 dark:bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-700 dark:text-zinc-400"
                      >
                        {l}
                      </span>
                    ))}
                </div>
              </div>
            )}

            {tab === "examples" && (
              <div>
                {/* Language Filter Buttons */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {languageList.map((language) => (
                    <button
                      key={language}
                      onClick={() => setSelectedLang(language)}
                      className={`rounded-full px-5 py-2 font-semibold text-base transition ${
                        selectedLang === language
                          ? "bg-zinc-200 dark:bg-zinc-900 text-zinc-900 dark:text-white"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                      }`}
                      style={{
                        fontFamily:
                          "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
                      }}
                    >
                      {language}
                    </button>
                  ))}
                </div>
                {/* Example(s) for current language */}
                {filteredExamples.length > 0 ? (
                  filteredExamples.map((ex: any, idx: number) => (
                    <div
                      key={idx}
                      className="mb-8 last:mb-0 px-0"
                    >
                      {/* Badge and Use */}
                      <div className="mb-3 flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-green-100 dark:bg-green-900 px-3 py-1 text-xs font-semibold text-green-700 dark:text-green-300">
                          {ex.language}
                        </span>
                        {ex.realWorldUse && (
                          <span className="rounded-full bg-zinc-100 dark:bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-700 dark:text-zinc-400">
                            {ex.realWorldUse}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col gap-4 md:flex-row md:gap-10">
                        <div className="flex-1 min-w-0">
                          {/* Code Block */}
                          <div className="relative group mb-2">
                            <pre
                              className="bg-zinc-900 text-white rounded-xl p-4 overflow-x-auto text-sm font-mono"
                              style={{
                                fontFamily: "var(--font-geist-mono, Menlo, monospace)",
                              }}
                            >
                              <code>{ex.code}</code>
                            </pre>
                            <button
                              aria-label="Copy code"
                              className="absolute top-2 right-2 bg-zinc-800 text-zinc-100 hover:bg-zinc-700 rounded-full px-4 py-1 text-xs font-semibold transition"
                              style={{
                                fontFamily:
                                  "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
                              }}
                              onClick={async () => {
                                if (navigator?.clipboard) {
                                  try {
                                    await navigator.clipboard.writeText(ex.code);
                                  } catch {}
                                }
                              }}
                            >
                              Copy
                            </button>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          {/* Beginner plain explanation */}
                          {ex.beginnerExplanation && (
                            <div className="mb-3">
                              <div className="text-zinc-800 dark:text-white font-bold mb-1">
                                For Complete Beginners
                              </div>
                              <div className="text-zinc-600 dark:text-zinc-400 text-sm">
                                {ex.beginnerExplanation}
                              </div>
                            </div>
                          )}
                          {/* Line by line explanation toggle */}
                          {ex.explanation && Array.isArray(ex.explanation) && (
                            <div>
                              <button
                                onClick={() => setExplanationExpanded((prev) => !prev)}
                                className="rounded-full px-5 py-2 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-50 font-semibold mb-2 text-sm transition hover:bg-zinc-300 dark:hover:bg-zinc-700"
                                style={{
                                  fontFamily:
                                    "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
                                }}
                              >
                                {explanationExpanded ? "Hide Line Explanations" : "Show Line-by-Line"}
                              </button>
                              {explanationExpanded && (
                                <ul className="mt-2 pl-5 text-zinc-600 dark:text-zinc-400 list-disc text-sm">
                                  {ex.explanation.map((line: string, i: number) => (
                                    <li key={i}>{line}</li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-zinc-600 dark:text-zinc-400">
                    No code examples available for this language.
                  </div>
                )}
              </div>
            )}

            {tab === "resources" && (
              <div>
                {/* YouTube search button */}
                {consoleData.resources?.youtubeQuery && (
                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                      consoleData.resources.youtubeQuery
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-full px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold mb-6 transition"
                    style={{
                      fontFamily:
                        "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
                    }}
                  >
                    Search YouTube Tutorials
                  </a>
                )}
                {/* Website resources */}
                <div className="flex flex-col gap-4">
                  {consoleData.resources?.websites && Array.isArray(consoleData.resources.websites) ? (
                    consoleData.resources.websites.map((site: any, idx: number) => (
                      <a
                        key={site.url + idx}
                        href={site.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-6 hover:bg-zinc-100 dark:hover:bg-black/70 transition"
                        style={{
                          fontFamily:
                            "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
                        }}
                      >
                        <div className="font-bold text-zinc-900 dark:text-white mb-1">
                          {site.title}
                        </div>
                        <div className="text-zinc-600 dark:text-zinc-400 text-sm">
                          {site.description}
                        </div>
                        <div className="text-green-700 dark:text-green-400 text-xs mt-1">
                          {site.url}
                        </div>
                      </a>
                    ))
                  ) : (
                    <div className="text-zinc-600 dark:text-zinc-400">
                      No websites or resources available.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}