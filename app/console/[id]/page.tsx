"use client";

import { useMemo, useState } from "react";
import consoles from "@/data/consoles.json";
import { useParams, useRouter } from "next/navigation";

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: "bg-green-500 text-white",
  Intermediate: "bg-yellow-400 text-white",
  Advanced: "bg-red-500 text-white",
};

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "code", label: "Code Examples" },
  { key: "resources", label: "Resources" },
];

function getConsoleById(id: string) {
  return (consoles as any[]).find((c) => c.id === id);
}

function uniqueLanguages(examples: any[]): string[] {
  return [
    ...new Set(
      Array.isArray(examples)
        ? examples.map((e) => e.language).filter(Boolean)
        : []
    ),
  ];
}

function languageRealWorldUse(language: string) {
  // Simplified; in real app this could be richer
  switch (language.toLowerCase()) {
    case "assembly":
      return "Low-level console and hardware programming";
    case "python":
      return "Rapid prototyping, emulators, tooling";
    case "javascript":
      return "Web-based tools, scripts";
    case "typescript":
      return "Type-safe scripting and tools";
    case "c":
      return "Game engines, firmware";
    case "c++":
      return "Performance game code";
    case "c#":
      return "Emulators, desktop tools";
    case "rust":
      return "Modern, safe console tools";
    case "go":
      return "Concurrent utilities";
    case "java":
      return "Cross-platform tools";
    case "basic":
      return "Classic console programming";
    case "lua":
      return "Game scripting";
    case "kotlin":
      return "Modern JVM language";
    case "php":
      return "Web server tools";
    case "bash":
      return "Command-line scripts";
    default:
      return "Programming";
  }
}

function copyCode(code: string) {
  if (navigator?.clipboard?.writeText) {
    navigator.clipboard.writeText(code);
  }
}

export default function ConsoleDetailPage() {
  const params = useParams();
  const router = useRouter();

  const id = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";
  const consoleData = useMemo(() => getConsoleById(id), [id]);
  const [selectedTab, setSelectedTab] = useState<"overview" | "code" | "resources">("overview");

  // Tabs for code example filters
  const codeExamples = consoleData?.codingExamples || [];
  const languages = uniqueLanguages(codeExamples);
  const [activeLang, setActiveLang] = useState(languages[0] || "");
  const activeExamples = useMemo(
    () => codeExamples.filter((ex: any) => ex.language === activeLang),
    [codeExamples, activeLang]
  );
  const [showLineExpl, setShowLineExpl] = useState<{ [code: number]: boolean }>({});

  if (!id || !consoleData) {
    return (
      <div
        className="bg-zinc-50 dark:bg-black min-h-screen font-sans flex items-center justify-center"
        style={{
          minHeight: "100dvh",
          fontFamily: "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
        }}
      >
        <div className="mx-auto text-center">
          <p className="text-2xl font-bold text-zinc-900 dark:text-white">Console not found</p>
          <button
            className="mt-6 px-5 py-2 rounded-full font-bold bg-green-600 hover:bg-green-700 text-white transition"
            style={{
              fontFamily: "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
            }}
            onClick={() => router.push("/")}
          >
            Back to homepage
          </button>
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
        <div className="max-w-3xl mx-auto px-6 py-12">

          <button
            onClick={() => router.push("/")}
            className="mb-7 text-sm px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 font-semibold text-zinc-600 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition"
            style={{
              fontFamily: "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
            }}
          >
            &larr; Back to homepage
          </button>

          {consoleData.difficulty === "Beginner" && (
            <div className="w-full mb-7 bg-green-500 rounded-xl flex flex-col md:flex-row items-center justify-between px-8 py-7 gap-3 shadow">
              <span className="text-xl md:text-2xl font-bold text-white">
                Great starting point! This console is recommended for beginners.
              </span>
            </div>
          )}

          <div className="mb-8">
            <div className="flex flex-wrap gap-2 items-baseline mb-2">
              <span className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-white">
                {consoleData.name}
              </span>
              {consoleData.shortName && (
                <span className="rounded-full bg-zinc-100 dark:bg-zinc-900 px-3 py-1 ml-2 font-medium text-zinc-500 dark:text-zinc-400 text-base">
                  {consoleData.shortName}
                </span>
              )}
              <span
                className={`rounded-full px-3 py-1 ml-2 text-xs font-semibold ${DIFFICULTY_COLORS[consoleData.difficulty] || "bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"}`}
                title={`Difficulty: ${consoleData.difficulty}`}
              >
                {consoleData.difficulty}
              </span>
              {consoleData.type && (
                <span className="rounded-full bg-zinc-100 dark:bg-zinc-900 px-3 py-1 font-medium text-zinc-500 dark:text-zinc-400 text-base ml-2">
                  {consoleData.type}
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-zinc-600 dark:text-zinc-400 text-sm mb-1">
              <span>
                Year: <span className="font-semibold">{consoleData.year}</span>
              </span>
              {consoleData.manufacturer && (
                <span>
                  Manufacturer:{" "}
                  <span className="font-semibold">{consoleData.manufacturer}</span>
                </span>
              )}
              {consoleData.discontinued && (
                <span>
                  Discontinued: <span className="font-semibold">{consoleData.discontinued}</span>
                </span>
              )}
            </div>
          </div>

          {/* TAB SELECTOR */}
          <div className="border-b border-zinc-200 dark:border-zinc-800 mb-7">
            <nav className="flex gap-3">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  className={`px-4 py-2 font-semibold rounded-t-lg transition
                    ${
                      selectedTab === tab.key
                        ? "bg-white dark:bg-black border-x border-t border-zinc-200 dark:border-zinc-800 -mb-px text-green-700 dark:text-green-400"
                        : "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                    }`}
                  style={{
                    fontFamily: "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
                  }}
                  onClick={() => setSelectedTab(tab.key as "overview" | "code" | "resources")}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* TABS CONTENT */}
          {selectedTab === "overview" && (
            <section>
              <p className="mb-6 text-lg text-zinc-700 dark:text-zinc-300">{consoleData.description}</p>
              {consoleData.funFact && (
                <div className="mb-7 px-5 py-3 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm font-medium text-green-700 dark:text-green-400" style={{
                  fontFamily: "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
                }}>
                  Fun Fact: {consoleData.funFact}
                </div>
              )}
              <div className="mb-6">
                <span className="block font-bold text-zinc-900 dark:text-white mb-2 text-lg">Hardware Specs</span>
                <table className="w-full text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black overflow-hidden">
                  <tbody>
                    {consoleData.cpu && (
                      <tr className="border-b border-zinc-200 dark:border-zinc-800">
                        <td className="px-4 py-2 font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900 w-36">
                          CPU
                        </td>
                        <td className="px-4 py-2 text-zinc-900 dark:text-white">{consoleData.cpu}</td>
                      </tr>
                    )}
                    {consoleData.ram && (
                      <tr className="border-b border-zinc-200 dark:border-zinc-800">
                        <td className="px-4 py-2 font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900">RAM</td>
                        <td className="px-4 py-2 text-zinc-900 dark:text-white">{consoleData.ram}</td>
                      </tr>
                    )}
                    {consoleData.storage && (
                      <tr className="border-b border-zinc-200 dark:border-zinc-800">
                        <td className="px-4 py-2 font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900">Storage</td>
                        <td className="px-4 py-2 text-zinc-900 dark:text-white">{consoleData.storage}</td>
                      </tr>
                    )}
                    {consoleData.os && (
                      <tr>
                        <td className="px-4 py-2 font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900">OS</td>
                        <td className="px-4 py-2 text-zinc-900 dark:text-white">{consoleData.os}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {Array.isArray(consoleData.languages) && consoleData.languages.length > 0 && (
                <div>
                  <span className="block font-bold text-zinc-900 dark:text-white mb-1 text-lg">
                    You can learn these programming languages:
                  </span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {consoleData.languages.map((lang: string) => (
                      <span
                        key={lang}
                        className="rounded-full bg-zinc-100 dark:bg-zinc-900 px-4 py-1 font-semibold text-zinc-700 dark:text-zinc-300 text-sm"
                        style={{
                          fontFamily: "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
                        }}
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {selectedTab === "code" && (
            <section>
              <div className="mb-5">
                <span className="block font-bold mb-3 text-zinc-900 dark:text-white text-lg">Code Examples</span>

                {/* Language filter buttons */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setActiveLang(lang)}
                      className={`px-4 py-1 rounded-full font-semibold transition text-sm
                        ${
                          activeLang === lang
                            ? "bg-green-600 text-white"
                            : "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                        }`}
                      style={{
                        fontFamily: "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
                      }}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {activeExamples.length === 0 ? (
                <div className="py-6 text-zinc-500 dark:text-zinc-400 text-center">
                  No code examples for this language.
                </div>
              ) : (
                activeExamples.map((ex: any, idx: number) => (
                  <div key={idx} className="mb-8 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-6">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className="rounded-full px-4 py-1 font-bold bg-green-500 text-white text-sm">
                        {ex.language}
                      </span>
                      <span className="rounded-full px-3 py-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium">
                        {languageRealWorldUse(ex.language)}
                      </span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                        {ex.title}
                      </span>
                    </div>

                    <div className="relative group mt-5">
                      <pre
                        className="rounded-xl overflow-auto bg-zinc-900 text-zinc-100 text-sm font-mono p-5 border border-zinc-800"
                        style={{
                          fontFamily:
                            "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                        }}
                      >
                        <code>{ex.code}</code>
                      </pre>
                      <button
                        aria-label="Copy to clipboard"
                        onClick={() => copyCode(ex.code)}
                        className="absolute top-3 right-3 px-3 py-1 text-xs rounded-full font-semibold bg-green-600 hover:bg-green-700 text-white transition opacity-0 group-hover:opacity-100 focus:opacity-100"
                        style={{
                          fontFamily: "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
                        }}
                      >
                        Copy
                      </button>
                    </div>

                    {ex.beginnerExplanation && (
                      <div className="my-5 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-800 dark:text-zinc-200 text-sm">
                        <span className="font-bold text-green-700 dark:text-green-400">For complete beginners:</span>
                        <br />
                        {ex.beginnerExplanation}
                      </div>
                    )}

                    {Array.isArray(ex.explanation) && ex.explanation.length > 0 && (
                      <div>
                        <button
                          className="mt-2 mb-1 px-4 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs font-bold hover:bg-zinc-200 dark:hover:bg-zinc-800 transition"
                          style={{
                            fontFamily: "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
                          }}
                          onClick={() =>
                            setShowLineExpl((prev) => ({
                              ...prev,
                              [idx]: !prev[idx],
                            }))
                          }
                        >
                          {showLineExpl[idx] ? "Hide" : "Show"} line-by-line explanation
                        </button>
                        {showLineExpl[idx] && (
                          <ul className="mt-2 space-y-1 pl-5 text-zinc-700 dark:text-zinc-200 text-sm list-disc">
                            {ex.explanation.map((line: string, li: number) => (
                              <li key={li}>{line}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </section>
          )}

          {selectedTab === "resources" && (
            <section>
              <span className="block font-bold text-zinc-900 dark:text-white text-lg mb-3">Resources</span>
              <div className="mb-7">
                {consoleData.resources?.youtubeQuery && (
                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                      consoleData.resources.youtubeQuery
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-full bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 text-sm transition mb-3"
                    style={{
                      fontFamily: "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
                    }}
                  >
                    YouTube search for &quot;{consoleData.resources.youtubeQuery}&quot;
                  </a>
                )}
              </div>
              {Array.isArray(consoleData.resources?.websites) &&
                consoleData.resources.websites.length > 0 && (
                  <div className="grid gap-5">
                    {consoleData.resources.websites.map(
                      (site: any, wi: number) => (
                        <a
                          key={site.url || wi}
                          href={site.url}
                          rel="noopener noreferrer"
                          target="_blank"
                          className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black px-6 py-4 block hover:shadow-lg transition"
                          style={{
                            fontFamily: "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
                          }}
                        >
                          <div className="font-bold text-green-700 dark:text-green-400 text-base mb-1">
                            {site.title}
                          </div>
                          <span className="block text-zinc-600 dark:text-zinc-300 text-sm mb-1 break-all">
                            {site.url}
                          </span>
                          <span className="block text-zinc-800 dark:text-zinc-100 text-sm">
                            {site.description}
                          </span>
                        </a>
                      )
                    )}
                  </div>
                )}
              {!(consoleData.resources?.youtubeQuery || (Array.isArray(consoleData.resources?.websites) && consoleData.resources.websites.length > 0)) && (
                <div className="mt-4 text-zinc-500 dark:text-zinc-400 text-sm">
                  No external resources found for this console.
                </div>
              )}
            </section>
          )}

        </div>
      </main>
    </div>
  );
}