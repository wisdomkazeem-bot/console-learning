"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import languages from "@/data/languages.json";

// Difficulty color utility (matching home page)
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
function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

// MAIN COMPONENT
export default function LanguageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const language: any = useMemo(() => {
    return languages.find((l: any) => l.id === id);
  }, [id]);

  const [tab, setTab] = useState<"overview" | "steps" | "resources">("overview");
  const [explanationOpen, setExplanationOpen] = useState<{ [n: number]: boolean }>({});

  if (!language) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans">
        <div className="max-w-3xl mx-auto py-12 px-4 text-center">
          <div className="text-zinc-600 dark:text-zinc-400 text-lg">Language not found.</div>
          <Link
            href="/"
            className="inline-block mt-8 rounded-full bg-zinc-200 dark:bg-zinc-800 px-6 py-2 font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition"
            style={{
              fontFamily:
                "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
            }}
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const difficulty = getDifficultyColor(language.difficulty);

  // TABS UI
  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "steps", label: "Learn Step by Step" },
    { key: "resources", label: "Resources" },
  ];

  // -- STEP CARD COMPONENT
  function StepCard({ step }: { step: any }) {
    const isOpen = explanationOpen[step.stepNumber] || false;

    function handleToggle() {
      setExplanationOpen((prev) => ({
        ...prev,
        [step.stepNumber]: !isOpen,
      }));
    }

    return (
      <div className="bg-white dark:bg-black rounded-xl border border-zinc-100 dark:border-zinc-800 mb-8 shadow-sm">
        <div className="p-6 md:p-7">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-zinc-400 text-xs font-semibold tracking-wide">
              STEP {step.stepNumber}
            </div>
            <div className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
              {step.title}
            </div>
          </div>
          <div className="text-zinc-600 dark:text-zinc-400 mb-3">{step.description}</div>
          <ul className="mb-3 flex flex-wrap gap-2">
            {step.keyFactors?.map((factor: string) => (
              <li
                key={factor}
                className="inline-flex items-center bg-zinc-100 dark:bg-zinc-900 rounded-full px-3 py-1 text-xs font-medium text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
              >
                <span className="inline-block w-2 h-2 mr-2 rounded-full bg-zinc-400 opacity-60" />
                {factor}
              </li>
            ))}
          </ul>
          {/* CODE BLOCK */}
          <div className="mb-3">
            <CodeBlock code={step.example} />
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              <span className="font-medium">Beginner Tip:</span> {step.beginnerTip}
            </div>
            <button
              type="button"
              onClick={handleToggle}
              className={classNames(
                "rounded-full px-4 py-1 text-xs font-semibold border bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 transition focus:outline-none",
                "hover:bg-zinc-200 dark:hover:bg-zinc-800"
              )}
              style={{
                fontFamily:
                  "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
              }}
            >
              {isOpen ? "Hide" : "Show"} Line-by-line Explanation
            </button>
          </div>
          {/* Explanation */}
          {isOpen && step.explanation && (
            <div className="mt-4 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-100 dark:border-zinc-800 text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-line">
              {step.explanation}
            </div>
          )}
        </div>
      </div>
    );
  }

  // -- CODE BLOCK WITH COPY BUTTON
  function CodeBlock({ code }: { code: string }) {
    const [copied, setCopied] = useState(false);

    async function copyToClipboard() {
      try {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      } catch {}
    }

    return (
      <div className="relative group">
        <pre
          className="bg-zinc-900 text-zinc-100 rounded-lg p-4 overflow-auto text-sm font-mono"
          style={{
            fontFamily:
              "var(--font-geist-mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace)",
          }}
        >
          {code}
        </pre>
        <button
          onClick={copyToClipboard}
          className="absolute top-3 right-3 rounded-full px-3 py-1 bg-zinc-800 text-zinc-200 hover:bg-zinc-700 focus:outline-none text-xs font-medium transition border border-zinc-700"
          aria-label="Copy code"
          style={{
            fontFamily:
              "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
          }}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    );
  }

  // -- RESOURCE CARD
  function ResourceCard({ resource }: { resource: any }) {
    return (
      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 mb-4 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition"
        style={{
          fontFamily:
            "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
        }}
      >
        <div className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-1">
          {resource.title}
        </div>
        <div className="text-zinc-600 dark:text-zinc-400 text-sm">{resource.description}</div>
        <div className="mt-1 text-xs text-blue-700 dark:text-blue-400 underline">
          {resource.url}
        </div>
      </a>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans">
      <main className="max-w-3xl mx-auto px-4 pt-8 pb-16">
        {/* BACK BUTTON */}
        <Link
          href="/"
          className={classNames(
            "inline-block mb-8 rounded-full px-5 py-2 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 font-medium border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition",
          )}
          style={{
            fontFamily:
              "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
          }}
        >
          ← Back to Home
        </Link>
        <div className="bg-white dark:bg-black rounded-2xl shadow-md border border-zinc-100 dark:border-zinc-800 px-0 md:px-8 pb-4">
          {/* LANGUAGE HEADER */}
          <div className="pt-7 px-4 md:px-0">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-y-3">
              <div>
                <h1
                  className="text-2xl font-bold text-zinc-900 dark:text-white leading-tight"
                  style={{
                    fontFamily:
                      "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
                  }}
                >
                  {language.name}
                </h1>
                <div className="flex items-center gap-3 mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <span>
                    <span className="font-medium">Creator: </span>
                    {language.creator}
                  </span>
                  <span>
                    <span className="font-medium">Year: </span>
                    {language.year || language.yearCreated}
                  </span>
                  <span>
                    <span className="font-medium">Type: </span>
                    {language.type}
                  </span>
                </div>
              </div>
              <span
                className={classNames(
                  "rounded-full px-4 py-1 text-sm font-semibold",
                  difficulty.bg,
                  difficulty.text,
                  "border border-zinc-200 dark:border-zinc-700"
                )}
              >
                {language.difficulty}
              </span>
            </div>
            {/* TABS NAVIGATION */}
            <div className="flex mt-4 gap-3 border-b border-zinc-100 dark:border-zinc-800">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  className={classNames(
                    "px-4 py-2 rounded-full font-medium text-sm focus:outline-none transition",
                    tab === t.key
                      ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                      : "bg-transparent text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900",
                  )}
                  style={{
                    fontFamily:
                      "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
                  }}
                  onClick={() => setTab(t.key as typeof tab)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* TABS CONTENT */}
          <div className="px-4 md:px-0 pt-7">
            {tab === "overview" && (
              <section>
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-1">
                    Language Description
                  </h2>
                  <div className="text-zinc-600 dark:text-zinc-400">
                    {language.description}
                  </div>
                </div>
                {language.funFact && (
                  <div className="mb-6">
                    <span className="block text-sm text-zinc-400 font-medium mb-1">Fun Fact</span>
                    <div className="text-zinc-700 dark:text-zinc-300 italic">
                      {language.funFact}
                    </div>
                  </div>
                )}
                {language.usedFor && (
                  <div className="mb-6">
                    <span className="block text-sm text-zinc-400 font-medium mb-1">
                      What is {language.name} used for?
                    </span>
                    <div className="text-zinc-700 dark:text-zinc-300">{language.usedFor}</div>
                  </div>
                )}
                <div className="mb-6">
                  <span className="block text-sm text-zinc-400 font-medium mb-1">
                    Why should beginners start with {language.name}?
                  </span>
                  <div className="text-zinc-700 dark:text-zinc-300">
                    {language.beginnerReason ||
                      (language.difficulty === "Beginner"
                        ? `This language features simple syntax and is widely used in education, making it approachable for those starting to code.`
                        : language.difficulty === "Intermediate"
                        ? `While more complex than beginner languages, ${language.name} introduces type systems and software engineering principles helpful in real projects.`
                        : `Learning ${language.name} is challenging but builds a solid foundation in programming concepts and system-level understanding.`)}
                  </div>
                </div>
              </section>
            )}

            {tab === "steps" && (
              <section>
                {language.steps && language.steps.length > 0 ? (
                  language.steps.map((step: any) => (
                    <StepCard key={step.stepNumber} step={step} />
                  ))
                ) : (
                  <div className="text-zinc-500 text-center mt-12">
                    No step-by-step guide available for this language.
                  </div>
                )}
              </section>
            )}

            {tab === "resources" && (
              <section>
                <div className="mb-5">
                  <span className="block text-sm text-zinc-500 mb-1 font-medium">
                    Tip for beginners:
                  </span>
                  <div className="text-zinc-700 dark:text-zinc-300">
                    Watching videos can help you grasp the basics faster—start with these.
                  </div>
                </div>
                {/* YouTube button */}
                {language.resources?.youtubeQuery && (
                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                      language.resources.youtubeQuery,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-full bg-blue-600 text-white px-6 py-2 font-medium text-sm mb-7 hover:bg-blue-700 transition focus:outline-none"
                    style={{
                      fontFamily:
                        "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
                    }}
                  >
                    Search YouTube: {language.resources.youtubeQuery}
                  </a>
                )}
                {language.resources?.websites?.length > 0 && (
                  <div className="mt-4">
                    {language.resources.websites.map((resource: any, idx: number) => (
                      <ResourceCard key={idx} resource={resource} />
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}