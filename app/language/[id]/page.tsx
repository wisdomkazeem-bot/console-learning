"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import languagesData from "@/data/languages.json";

// Difficulty badge colors (copied exactly from main page)
const DIFFICULTY_COLORS: Record<string, { bg: string; text: string }> = {
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

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

function getTypeTitle(type: string) {
  switch (type) {
    case "web":
      return "Web";
    case "systems":
      return "Systems";
    case "scripting":
      return "Scripting";
    case "mobile":
      return "Mobile";
    case "data":
      return "Data";
    case "game":
      return "Game";
    default:
      return type.charAt(0).toUpperCase() + type.slice(1);
  }
}

function formatLessonCount(curriculum: any[] | undefined) {
  if (!curriculum || curriculum.length === 0) return "0 Lessons";
  return `${curriculum.length} Lesson${curriculum.length > 1 ? "s" : ""}`;
}

function copyToClipboard(text: string) {
  if (typeof window !== "undefined") {
    navigator.clipboard.writeText(text);
  }
}

export default function LanguagePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const language = useMemo(
    () =>
      Array.isArray(languagesData)
        ? languagesData.find((item: any) => item.id === id)
        : undefined,
    [id]
  );
  const lessons = language?.curriculum ?? [];
  const totalLessons = lessons.length;

  // Track which lessons are completed
  const [completed, setCompleted] = useState<boolean[]>(
    Array(totalLessons).fill(false)
  );
  // Current lesson index
  const [lessonIdx, setLessonIdx] = useState(0);

  // Show/hide hint and solution
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [justCopied, setJustCopied] = useState(false);

  // If user jumps to another lesson
  function handleSelectLesson(idx: number) {
    setLessonIdx(idx);
    setShowHint(false);
    setShowSolution(false);
  }

  // Mark a lesson as completed
  function handleCompleteLesson(idx: number) {
    setCompleted((arr) => {
      if (arr[idx]) return arr; // already completed
      const newArr = arr.slice();
      newArr[idx] = true;
      return newArr;
    });
  }

  if (!language) {
    return (
      <div className="bg-zinc-50 dark:bg-black min-h-screen font-sans text-zinc-600 dark:text-zinc-400 flex flex-col justify-center items-center">
        <div className="max-w-3xl mx-auto bg-white dark:bg-black p-10 rounded-2xl shadow font-sans">
          <h1 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-white tracking-tight">
            Language Not Found
          </h1>
          <p className="mb-4">We couldn't find that language.</p>
          <Link
            href="/"
            className="inline-block rounded-full bg-zinc-100 dark:bg-zinc-800 px-6 py-3 font-medium text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 hover:border-blue-400 dark:hover:border-blue-600 transition"
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

  const lesson = lessons[lessonIdx];

  return (
    <div className="bg-zinc-50 dark:bg-black min-h-screen font-sans">
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-8 font-sans">
        {/* TOP BAR */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-4 py-2 font-medium text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 hover:border-blue-400 dark:hover:border-blue-600 transition"
              style={{
                fontFamily:
                  "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
              }}
              aria-label="Back to Homepage"
            >
              Back
            </Link>
            <h1
              className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white"
              style={{
                fontFamily:
                  "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
              }}
            >
              {language.name}
            </h1>
            <span
              className={classNames(
                "rounded-full px-3 py-0.5 text-xs font-bold",
                DIFFICULTY_COLORS[language.difficulty]?.bg ??
                  "bg-zinc-200 dark:bg-zinc-800",
                DIFFICULTY_COLORS[language.difficulty]?.text ??
                  "text-zinc-700 dark:text-zinc-200"
              )}
              style={{
                fontFamily:
                  "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
              }}
            >
              {language.difficulty}
            </span>
          </div>
          {/* Progress Bar */}
          <div className="flex flex-col items-start min-w-[180px] mt-3 md:mt-0 w-full">
            <span className="text-xs text-zinc-700 dark:text-zinc-300 mb-1 font-medium">
              Progress: {completed.filter(Boolean).length}/{totalLessons}
            </span>
            <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{
                  width: `${
                    totalLessons === 0
                      ? 0
                      : (completed.filter(Boolean).length / totalLessons) * 100
                  }%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* SIDEBAR/TOP: Lessons List */}
          <div className="md:min-w-[220px] md:w-1/3 mb-3 md:mb-0">
            <div className="bg-white dark:bg-black rounded-xl border border-zinc-100 dark:border-zinc-900 p-4 font-sans">
              <h2 className="text-xs font-semibold mb-2 text-zinc-500 dark:text-zinc-400 tracking-wide uppercase">
                Lessons
              </h2>
              <ul>
                {lessons.map((l: any, idx: number) => (
                  <li key={l.lessonNumber} className="mb-1">
                    <button
                      type="button"
                      onClick={() => handleSelectLesson(idx)}
                      className={classNames(
                        "flex items-center w-full rounded-full px-3 py-2 transition font-medium text-sm",
                        idx === lessonIdx
                          ? "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800"
                          : "bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50/70 dark:hover:bg-blue-950/30",
                        "justify-between"
                      )}
                      style={{
                        fontFamily:
                          "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
                      }}
                      aria-current={idx === lessonIdx}
                    >
                      <span>
                        {l.lessonNumber}. {l.title}
                      </span>
                      <span>
                        {completed[idx] ? (
                          <span className="inline-block align-middle w-2.5 h-2.5 rounded-full bg-green-400" />
                        ) : null}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* LESSON CARD */}
          <div className="flex-1">
            <div className="bg-white dark:bg-black rounded-2xl border border-zinc-100 dark:border-zinc-900 shadow p-6 font-sans">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-xs font-semibold tracking-wider uppercase text-zinc-500 dark:text-zinc-400">
                  Lesson {lesson.lessonNumber} of {totalLessons}
                </span>
                {!completed[lessonIdx] && (
                  <button
                    className="rounded-full bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-1 font-semibold text-xs transition hover:border-green-400 dark:hover:border-green-600"
                    onClick={() => handleCompleteLesson(lessonIdx)}
                    style={{
                      fontFamily:
                        "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
                    }}
                  >
                    Mark as Completed
                  </button>
                )}
                {completed[lessonIdx] && (
                  <span className="text-xs text-green-700 dark:text-green-300 font-bold">
                    Completed
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mb-2 text-zinc-900 dark:text-white tracking-tight">
                {lesson.title}
              </h2>
              <div className="mb-4 text-zinc-600 dark:text-zinc-400 text-base">
                <p>{lesson.explanation}</p>
              </div>

              {/* KEY CONCEPTS */}
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                  Key Concepts
                </h3>
                <ul className="list-disc text-zinc-600 dark:text-zinc-400 ml-5 space-y-1 text-sm">
                  {(lesson.keyConcepts || []).map((c: any) => (
                    <li key={c.term}>
                      <span className="font-semibold">{c.term}:</span>{" "}
                      <span>{c.definition}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CODE EXAMPLE */}
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-2 mb-2">
                  Code Example
                  <button
                    className="rounded-full border px-2 py-0.5 text-xs font-medium bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 ml-2 transition"
                    style={{
                      fontFamily:
                        "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
                    }}
                    onClick={() => {
                      copyToClipboard(lesson.codeExample);
                      setJustCopied(true);
                      setTimeout(() => setJustCopied(false), 1200);
                    }}
                  >
                    {justCopied ? "Copied!" : "Copy"}
                  </button>
                </h3>
                <pre className="rounded-lg bg-zinc-900 text-white text-sm p-4 overflow-x-auto font-mono border border-zinc-800 dark:border-zinc-700 mb-0">
                  <code>{lesson.codeExample}</code>
                </pre>
              </div>

              {/* CHALLENGE */}
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Challenge
                </h3>
                <div className="mb-2 text-zinc-600 dark:text-zinc-400 text-base">
                  {lesson.challenge}
                </div>
                {/* Hint and solution buttons */}
                <div className="flex gap-3 mb-1">
                  <button
                    className={classNames(
                      "rounded-full px-4 py-1 text-xs font-medium border transition",
                      "bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:border-blue-400 dark:hover:border-blue-600"
                    )}
                    style={{
                      fontFamily:
                        "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
                    }}
                    onClick={() => setShowHint((v) => !v)}
                  >
                    {showHint ? "Hide Hint" : "Show Hint"}
                  </button>
                  <button
                    className={classNames(
                      "rounded-full px-4 py-1 text-xs font-medium border transition",
                      "bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:border-blue-400 dark:hover:border-blue-600"
                    )}
                    style={{
                      fontFamily:
                        "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
                    }}
                    onClick={() => setShowSolution((v) => !v)}
                  >
                    {showSolution ? "Hide Solution" : "Show Solution"}
                  </button>
                </div>
                {showHint && (
                  <div className="mb-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-950 text-sm">
                    {lesson.hint}
                  </div>
                )}
                {showSolution && (
                  <div className="mb-2 p-3 rounded-lg bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 border border-green-100 dark:border-green-900 text-sm font-mono whitespace-pre-line">
                    {lesson.solution}
                  </div>
                )}
              </div>

              {/* BEGINNER TIP */}
              <div className="mb-5">
                <div className="px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 text-sm border border-zinc-200 dark:border-zinc-800">
                  <span className="font-semibold">Beginner Tip:</span> {lesson.beginnerTip}
                </div>
              </div>

              {/* NAVIGATION */}
              <div className="flex justify-between mt-6">
                <button
                  className={classNames(
                    "rounded-full px-6 py-2 text-sm font-medium border transition",
                    lessonIdx === 0
                      ? "bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-700 border-zinc-100 dark:border-zinc-900 cursor-not-allowed"
                      : "bg-zinc-50 dark:bg-black text-zinc-700 dark:text-white border-zinc-200 dark:border-zinc-800 hover:border-blue-400 dark:hover:border-blue-600"
                  )}
                  onClick={() => lessonIdx > 0 && handleSelectLesson(lessonIdx - 1)}
                  disabled={lessonIdx === 0}
                  style={{
                    fontFamily:
                      "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
                  }}
                >
                  Previous
                </button>
                <button
                  className={classNames(
                    "rounded-full px-6 py-2 text-sm font-medium border transition",
                    lessonIdx === totalLessons - 1
                      ? "bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-700 border-zinc-100 dark:border-zinc-900 cursor-not-allowed"
                      : "bg-zinc-50 dark:bg-black text-zinc-700 dark:text-white border-zinc-200 dark:border-zinc-800 hover:border-blue-400 dark:hover:border-blue-600"
                  )}
                  onClick={() =>
                    lessonIdx < totalLessons - 1 && handleSelectLesson(lessonIdx + 1)
                  }
                  disabled={lessonIdx === totalLessons - 1}
                  style={{
                    fontFamily:
                      "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}