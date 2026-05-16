"use client";

import { useParams, useRouter } from "next/navigation";
import languagesData from "@/data/languages.json";
import { useState, useMemo } from "react";
import Link from "next/link";

// Util to get language data by id
function getLanguageById(id: string) {
  return (languagesData as any[]).find((lang) => lang.id === id);
}

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

const TABS = [
  { name: "Overview", key: "overview" },
  { name: "Code Examples", key: "examples" },
  { name: "Resources", key: "resources" },
];

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

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
      className="absolute top-2 right-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-100 px-3 py-1 transition text-xs font-medium"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function YouTubeButton({ query }: { query: string }) {
  const url =
    "https://www.youtube.com/results?search_query=" +
    encodeURIComponent(query);
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={classNames(
        "inline-block rounded-full bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 transition",
        "mb-4"
      )}
      style={{
        fontFamily:
          "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
      }}
    >
      YouTube: "{query}"
    </a>
  );
}

function WebsiteCard({
  title,
  url,
  description,
}: {
  title: string;
  url: string;
  description: string;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block mb-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-4 hover:shadow-md transition"
    >
      <div className="font-semibold text-zinc-800 dark:text-white text-lg mb-1">
        {title}
      </div>
      <div className="text-zinc-600 dark:text-zinc-400 mb-1 text-sm">
        {description}
      </div>
      <div className="text-xs text-blue-600 dark:text-blue-400">{url}</div>
    </a>
  );
}

export default function LanguagePage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params as { id: string };

  const language = useMemo(() => getLanguageById(id), [id]);

  const [tab, setTab] = useState<"overview" | "examples" | "resources">(
    "overview"
  );
  const [explanationOpen, setExplanationOpen] = useState<number | null>(null);

  if (!language) {
    return (
      <div className="font-sans bg-zinc-50 dark:bg-black min-h-screen flex items-center justify-center">
        <div className="bg-white dark:bg-black max-w-3xl mx-auto p-12 rounded-xl shadow text-zinc-600 dark:text-zinc-400 text-center">
          <div className="mb-6 font-bold text-xl">Language not found.</div>
          <Link
            href="/"
            className="rounded-full bg-zinc-100 dark:bg-zinc-900 px-6 py-2 font-semibold text-base text-zinc-900 dark:text-white transition hover:bg-zinc-200 dark:hover:bg-zinc-700"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const difficultyColors = getDifficultyColor(language.difficulty);

  return (
    <div className="font-sans bg-zinc-50 dark:bg-black min-h-screen">
      <main className="bg-white dark:bg-black max-w-3xl mx-auto py-20 px-6 md:px-16 text-zinc-600 dark:text-zinc-400">
        {/* Back Button */}
        <div className="mb-5">
          <button
            onClick={() => router.push("/")}
            className="rounded-full bg-zinc-100 dark:bg-zinc-900 px-6 py-2 font-semibold text-base text-zinc-900 dark:text-white transition hover:bg-zinc-200 dark:hover:bg-zinc-700"
            style={{
              fontFamily:
                "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
            }}
          >
            &larr; Back
          </button>
        </div>

        {/* Header */}
        <div className="flex items-center mb-6 gap-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold"
            style={{
              background: language.color || "#e4e4e7",
              color:
                language.color === "#f1e05a"
                  ? "#4e4a13"
                  : language.color === "#3572A5"
                  ? "#fff"
                  : undefined,
              minWidth: 48,
            }}
          >
            {language.name[0]}
          </div>
          <div>
            <div
              className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white"
              style={{
                fontFamily:
                  "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
              }}
            >
              {language.name}
            </div>
            <div className="flex gap-2 items-center mt-1">
              <span
                className={classNames(
                  "rounded-full px-3 py-1 text-xs font-semibold",
                  difficultyColors.bg,
                  difficultyColors.text
                )}
                style={{
                  fontFamily:
                    "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
                }}
              >
                {language.difficulty}
              </span>
              <span className="text-xs bg-zinc-100 dark:bg-zinc-800 rounded-full px-3 py-1 font-medium text-zinc-600 dark:text-zinc-300 capitalize">
                {language.type}
              </span>
              <span className="text-xs bg-zinc-100 dark:bg-zinc-800 rounded-full px-3 py-1 font-medium text-zinc-600 dark:text-zinc-300">
                {language.yearCreated}
              </span>
              <span className="text-xs bg-zinc-100 dark:bg-zinc-800 rounded-full px-3 py-1 font-medium text-zinc-600 dark:text-zinc-300 truncate max-w-[120px]">
                {language.creator}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex border-b border-zinc-200 dark:border-zinc-800 gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as any)}
              className={classNames(
                "px-6 py-2 font-semibold rounded-t-md bg-transparent transition border-b-2",
                tab === t.key
                  ? "border-zinc-600 dark:border-zinc-300 text-zinc-900 dark:text-zinc-100"
                  : "border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              )}
              style={{
                fontFamily:
                  "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
              }}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {tab === "overview" && (
            <div>
              <div className="mb-5 text-lg text-zinc-800 dark:text-zinc-200 font-medium">
                {language.description}
              </div>
              {language.funFact && (
                <div className="mb-4 text-sm italic text-zinc-500 dark:text-zinc-400">
                  Fun fact: {language.funFact}
                </div>
              )}
              <div className="mb-6">
                <div className="mb-2 font-semibold text-zinc-700 dark:text-zinc-100">
                  Typical uses
                </div>
                <div className="text-zinc-600 dark:text-zinc-400 text-base">
                  {language.usedFor}
                </div>
              </div>
              <div className="mb-6">
                <div className="mb-2 font-semibold text-zinc-700 dark:text-zinc-100">
                  What jobs use {language.name}?
                </div>
                <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 text-base">
                  {(() => {
                    // Simple mapping for jobs (could be more extensive)
                    if (language.type === "web") {
                      return (
                        <>
                          <li>Frontend Developer</li>
                          <li>Full Stack Developer</li>
                          <li>Web Engineer</li>
                        </>
                      );
                    }
                    if (language.type === "scripting") {
                      return (
                        <>
                          <li>Software Engineer</li>
                          <li>Data Scientist</li>
                          <li>DevOps Engineer</li>
                        </>
                      );
                    }
                    if (language.type === "systems") {
                      return (
                        <>
                          <li>Systems Programmer</li>
                          <li>Performance Engineer</li>
                          <li>Embedded Software Engineer</li>
                        </>
                      );
                    }
                    if (language.type === "data") {
                      return (
                        <>
                          <li>Data Engineer</li>
                          <li>Machine Learning Engineer</li>
                          <li>Research Scientist</li>
                        </>
                      );
                    }
                    if (language.type === "mobile") {
                      return (
                        <>
                          <li>Mobile Developer</li>
                          <li>App Engineer</li>
                        </>
                      );
                    }
                    if (language.type === "game") {
                      return (
                        <>
                          <li>Game Developer</li>
                          <li>Game Engine Programmer</li>
                        </>
                      );
                    }
                    // Default fallback
                    return <li>Software Developer</li>;
                  })()}
                </ul>
              </div>
              <div className="mb-6">
                <div className="mb-2 font-semibold text-zinc-700 dark:text-zinc-100">
                  Why should beginners learn {language.name}?
                </div>
                <div className="text-base text-zinc-600 dark:text-zinc-400">
                  {language.difficulty === "Beginner"
                    ? `It's considered beginner-friendly due to its approachable syntax, wide community support, and ample learning resources.`
                    : language.difficulty === "Intermediate"
                    ? `Learning ${language.name} builds on basic programming skills and teaches important concepts and practices for larger projects.`
                    : `This language is powerful but more challenging; mastering it will unlock advanced computing and job opportunities.`}
                </div>
              </div>
            </div>
          )}
          {tab === "examples" && (
            <div>
              {/* Code Example Blocks */}
              {language.examples && language.examples.length > 0 ? (
                <div className="space-y-8">
                  {language.examples.map((ex: any, i: number) => (
                    <div
                      className="bg-zinc-900 rounded-lg relative p-0 overflow-hidden"
                      key={ex.title + i}
                    >
                      <div className="p-4 pb-3">
                        <div className="font-semibold text-base text-zinc-100 mb-1">
                          {ex.title}
                        </div>
                        <div className="mb-3 text-sm text-zinc-300 opacity-80">
                          {ex.beginnerExplanation}
                        </div>
                        <pre className="relative">
                          <code
                            className="block text-sm md:text-base leading-relaxed text-zinc-100 bg-zinc-900 rounded-md px-4 py-3 overflow-x-auto font-mono"
                            style={{
                              fontFamily:
                                "ui-monospace, Menlo, Monaco, 'Cascadia Mono', 'Liberation Mono', 'Consolas', 'Fira Mono', 'Droid Sans Mono', 'Source Code Pro', monospace",
                              background: "none",
                            }}
                          >
                            {ex.code}
                          </code>
                          <CopyButton text={ex.code} />
                        </pre>
                        <div className="mt-4">
                          <button
                            className="text-xs rounded-full font-semibold px-4 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition focus:outline-none"
                            style={{
                              fontFamily:
                                "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
                            }}
                            onClick={() =>
                              setExplanationOpen(
                                explanationOpen === i ? null : i
                              )
                            }
                          >
                            {explanationOpen === i
                              ? "Hide line by line explanation"
                              : "Show line by line explanation"}
                          </button>
                          {explanationOpen === i && (
                            <div className="mt-3 bg-zinc-950/80 rounded p-3 text-zinc-100 text-sm">
                              <ul className="list-disc list-inside space-y-1">
                                {Array.isArray(ex.explanation) ? (
                                  ex.explanation.map((line: string, j: number) => (
                                    <li key={j} className="ml-1">
                                      {line}
                                    </li>
                                  ))
                                ) : (
                                  <li>{ex.explanation}</li>
                                )}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-zinc-500 dark:text-zinc-400 text-base italic">
                  No examples available for this language yet.
                </div>
              )}
            </div>
          )}
          {tab === "resources" && (
            <div>
              {language.resources?.youtubeQuery && (
                <YouTubeButton query={language.resources.youtubeQuery} />
              )}
              <div className="mt-2">
                {language.resources?.websites?.length > 0 ? (
                  language.resources.websites.map(
                    (
                      site: {
                        title: string;
                        url: string;
                        description: string;
                      },
                      i: number
                    ) => (
                      <WebsiteCard
                        key={site.url + i}
                        title={site.title}
                        url={site.url}
                        description={site.description}
                      />
                    )
                  )
                ) : (
                  <div className="text-zinc-500 dark:text-zinc-400 text-base italic">
                    No website resources available.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}