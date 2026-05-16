"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import languages from "@/data/languages.json";

// Remove curriculum error by using topics if curriculum is not defined
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const DIFFICULTY_COLORS: Record<
  "Beginner" | "Intermediate" | "Advanced",
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

const CHECKMARK = (
  <svg
    viewBox="0 0 16 16"
    className="w-4 h-4 text-blue-500 ml-1 inline-block"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M5.7 12.3a1 1 0 0 1-1.4 0l-2.3-2.3a1 1 0 1 1 1.4-1.4l1.6 1.6 5.3-5.3a1 1 0 0 1 1.4 1.4l-6 6z" />
  </svg>
);

export default function LanguageDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : ""; // More robust

  // Find language by id
  const language = languages.find((lang: any) => lang.id === id);

  // Prefer curriculum if available; otherwise, use topics
  const topics = language
    ? (language as any).curriculum ?? (language as any).topics ?? []
    : [];

  const [selectedTopic, setSelectedTopic] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  if (!language || topics.length === 0) {
    return (
      <main className="min-h-screen bg-zinc-50 dark:bg-black font-sans px-4 py-10">
        <div className="max-w-3xl mx-auto bg-white dark:bg-black rounded-2xl shadow border border-zinc-100 dark:border-zinc-800 px-5 md:px-12 py-10 text-center">
          <p className="text-zinc-600 dark:text-zinc-400 text-lg font-medium">
            Language not found.
          </p>
          <Link
            href="/"
            className="inline-block mt-6 px-6 py-2 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-100 font-semibold transition"
            style={{
              fontFamily:
                "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
            }}
          >
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  // Defensive for empty topic arr
  const current = topics[selectedTopic] ?? {};
  const progress = topics.length
    ? Math.round((completed.length / topics.length) * 100)
    : 0;

  function handlePrev() {
    setShowHint(false);
    setShowSolution(false);
    if (selectedTopic > 0) setSelectedTopic(selectedTopic - 1);
  }

  function handleNext() {
    setShowHint(false);
    setShowSolution(false);
    // Defensive: lessonNumber fallback to index+1
    const currLessonNumber =
      typeof current.lessonNumber === "number"
        ? current.lessonNumber
        : selectedTopic + 1;
    if (!completed.includes(currLessonNumber)) {
      setCompleted([...completed, currLessonNumber]);
    }
    if (selectedTopic < topics.length - 1) setSelectedTopic(selectedTopic + 1);
  }

  function handleSelectTopic(idx: number) {
    setShowHint(false);
    setShowSolution(false);
    setSelectedTopic(idx);
  }

  function handleCopy() {
    if (current.codeExample) {
      window.navigator.clipboard.writeText(current.codeExample);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 1500);
    }
  }

  function getDifficultyBadge(difficulty: string) {
    // Ensure only known difficulties are used for TS
    if (
      difficulty === "Beginner" ||
      difficulty === "Intermediate" ||
      difficulty === "Advanced"
    ) {
      const c = DIFFICULTY_COLORS[difficulty];
      return (
        <span
          className={classNames(
            "px-3 py-0.5 rounded-full text-xs font-bold ml-2 align-middle select-none",
            c.bg,
            c.text
          )}
          style={{
            fontFamily:
              "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
          }}
        >
          {difficulty}
        </span>
      );
    }
    // fallback
    return null;
  }

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black font-sans flex flex-col md:flex-row px-0 md:px-6 py-8">
      {/* Sidebar */}
      <aside
        className="w-full md:w-64 md:mr-10 mb-8 md:mb-0 flex-shrink-0"
        aria-label="Lesson topics"
      >
        <div
          className="bg-white dark:bg-black rounded-2xl border border-zinc-100 dark:border-zinc-800 px-5 md:px-6 py-6"
          style={{
            fontFamily:
              "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
          }}
        >
          <div className="mb-4 flex items-center">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="mr-2 px-4 py-1.5 rounded-full bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium transition"
            >
              Back
            </button>
            <span className="font-bold text-zinc-900 dark:text-white text-lg tracking-tight">
              {language.name}
            </span>
            {getDifficultyBadge(language.difficulty)}
          </div>
          <ol className="space-y-1 mt-4">
            {topics.map((t: any, idx: number) => {
              const topicNum =
                typeof t.lessonNumber === "number" ? t.lessonNumber : idx + 1;
              return (
                <li key={topicNum}>
                  <button
                    type="button"
                    onClick={() => handleSelectTopic(idx)}
                    className={classNames(
                      "flex w-full items-center justify-between px-3 py-2 rounded-full text-left transition font-medium",
                      selectedTopic === idx
                        ? "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-400 dark:border-blue-800"
                        : "bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700",
                      "border"
                    )}
                    style={{
                      fontFamily:
                        "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
                    }}
                    aria-current={selectedTopic === idx ? "step" : undefined}
                  >
                    <span>
                      Lesson {topicNum}: {t.title}
                    </span>
                    <span className="flex items-center ml-2">
                      {getDifficultyBadge(language.difficulty)}
                      {completed.includes(topicNum) ? CHECKMARK : null}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </aside>

      {/* Main Content */}
      <section className="flex-1 max-w-3xl mx-auto bg-white dark:bg-black rounded-2xl shadow border border-zinc-100 dark:border-zinc-800 px-5 md:px-12 py-10 mt-0">
        {/* Progress bar & top info */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight" style={{
              fontFamily:
                "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
            }}>
              Lesson{" "}
              {typeof current.lessonNumber === "number"
                ? current.lessonNumber
                : selectedTopic + 1}
              : {current.title}
              {getDifficultyBadge(language.difficulty)}
            </h2>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              {completed.length} of {topics.length} completed
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full mb-2">
            <div
              className="h-2 bg-blue-500 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Explanation */}
        <p className="text-lg md:text-xl mb-5 text-zinc-600 dark:text-zinc-400 font-medium">
          {current.explanation}
        </p>

        {/* Key Concepts */}
        <div className="mb-7">
          <h3 className="text-zinc-900 dark:text-white font-semibold mb-2 text-base">Key Concepts</h3>
          <dl className="border border-zinc-100 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 px-5 py-3">
            {Array.isArray(current.keyConcepts) && current.keyConcepts.length > 0
              ? current.keyConcepts.map((item: any, idx: number) => (
                  <div key={idx} className="flex flex-col md:flex-row md:items-baseline mb-2">
                    <dt className="font-bold text-zinc-800 dark:text-zinc-200 min-w-[120px]">{item.term}</dt>
                    <dd className="ml-0 md:ml-4 text-zinc-600 dark:text-zinc-400">{item.definition}</dd>
                  </div>
                ))
              : (
                <div className="text-zinc-500 dark:text-zinc-400 text-sm">No key concepts for this lesson.</div>
              )}
          </dl>
        </div>

        {/* Code Example with copy button */}
        <div className="mb-7">
          <h3 className="text-zinc-900 dark:text-white font-semibold mb-2 text-base">Example</h3>
          <div className="relative group">
            <pre
              className="bg-zinc-900 text-white overflow-x-auto rounded-xl px-5 py-4 font-mono text-sm"
              style={{ fontFamily: "Geist Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" }}
            >
              {current.codeExample}
            </pre>
            <button
              type="button"
              onClick={handleCopy}
              className="absolute top-2 right-3 px-3 py-1.5 rounded-full bg-zinc-700 hover:bg-blue-600 text-white text-xs font-medium transition"
              aria-label="Copy code example"
            >
              {copySuccess ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

        {/* Challenge */}
        <div className="mb-7">
          <h3 className="text-zinc-900 dark:text-white font-semibold mb-2 text-base">Challenge</h3>
          <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800 px-5 py-4 text-zinc-700 dark:text-zinc-300">
            {current.challenge}
          </div>
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className="px-4 py-1.5 rounded-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-950 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium transition border border-blue-300 dark:border-blue-800"
            >
              {showHint ? "Hide Hint" : "Show Hint"}
            </button>
            <button
              type="button"
              onClick={() => setShowSolution(!showSolution)}
              className="px-4 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 font-medium transition border border-zinc-300 dark:border-zinc-800"
            >
              {showSolution ? "Hide Solution" : "Show Solution"}
            </button>
          </div>
          {showHint && current.hint && (
            <div className="mt-3 bg-blue-50 dark:bg-blue-900/50 rounded p-3 border border-blue-100 dark:border-blue-900 text-blue-700 dark:text-blue-300">
              <span className="font-semibold">Hint: </span>
              {current.hint}
            </div>
          )}
          {showSolution && current.solution && (
            <div className="mt-3 bg-green-50 dark:bg-green-900/50 rounded p-3 border border-green-100 dark:border-green-900 text-green-700 dark:text-green-300 font-mono whitespace-pre-wrap">
              <span className="font-semibold">Solution: </span>
              {current.solution}
            </div>
          )}
        </div>

        {/* Beginner Tip */}
        {current.beginnerTip && (
          <div className="mb-6 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800 px-5 py-4 text-zinc-700 dark:text-zinc-300 text-sm">
            <span className="font-semibold">Beginner Tip:</span> {current.beginnerTip}
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-10">
          <button
            type="button"
            disabled={selectedTopic === 0}
            onClick={handlePrev}
            className={classNames(
              "px-6 py-2 rounded-full font-medium transition border",
              selectedTopic === 0
                ? "bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-600 border-zinc-200 dark:border-zinc-800 cursor-not-allowed"
                : "bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700"
            )}
            style={{
              fontFamily:
                "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
            }}
          >
            Previous
          </button>
          <button
            type="button"
            disabled={selectedTopic === topics.length - 1}
            onClick={handleNext}
            className={classNames(
              "px-6 py-2 rounded-full font-medium transition border ml-2",
              selectedTopic === topics.length - 1
                ? "bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-600 border-zinc-200 dark:border-zinc-800 cursor-not-allowed"
                : "bg-blue-100 hover:bg-blue-200 dark:bg-blue-950 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800"
            )}
            style={{
              fontFamily:
                "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
            }}
          >
            Next
          </button>
        </div>
      </section>
    </main>
  );
}