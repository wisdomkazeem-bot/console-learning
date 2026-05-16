"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import languages from "@/data/languages.json";

// UTILS
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

// Language-specific terminal commands and filenames
const RUN_COMMANDS: Record<string, { win: string; mac: string; linux: string; output: string }> = {
  python: {
    win: "python filename.py",
    mac: "python3 filename.py",
    linux: "python3 filename.py",
    output: 'Hello, world!\n42',
  },
  javascript: {
    win: "node filename.js",
    mac: "node filename.js",
    linux: "node filename.js",
    output: 'Hello, world!\n42',
  },
  typescript: {
    win: "tsc filename.ts && node filename.js",
    mac: "tsc filename.ts && node filename.js",
    linux: "tsc filename.ts && node filename.js",
    output: '5',
  },
  c: {
    win: "gcc filename.c && a.exe",
    mac: "gcc filename.c && ./a.out",
    linux: "gcc filename.c && ./a.out",
    output: 'Hello, world!',
  },
  "c++": {
    win: "g++ filename.cpp && a.exe",
    mac: "g++ filename.cpp && ./a.out",
    linux: "g++ filename.cpp && ./a.out",
    output: "Hello, world!",
  },
  "c#": {
    win: "dotnet run",
    mac: "dotnet run",
    linux: "dotnet run",
    output: "Hello, world!",
  },
  go: {
    win: "go run filename.go",
    mac: "go run filename.go",
    linux: "go run filename.go",
    output: "Hello, world!",
  },
  java: {
    win: "javac filename.java && java filename",
    mac: "javac filename.java && java filename",
    linux: "javac filename.java && java filename",
    output: "Hello, world!",
  },
  rust: {
    win: "cargo run",
    mac: "cargo run",
    linux: "cargo run",
    output: "Hello, world!",
  },
  assembly: {
    win: "nasm -f win32 filename.asm && filename.exe",
    mac: "nasm -f macho64 filename.asm && ./a.out",
    linux: "nasm -f elf64 filename.asm && ./a.out",
    output: "Hello, world!",
  },
  basic: {
    win: "run filename.bas",
    mac: "run filename.bas",
    linux: "run filename.bas",
    output: "Hello, world!",
  },
  lua: {
    win: "lua filename.lua",
    mac: "lua filename.lua",
    linux: "lua filename.lua",
    output: "Hello, world!",
  },
  ruby: {
    win: "ruby filename.rb",
    mac: "ruby filename.rb",
    linux: "ruby filename.rb",
    output: "Hello, world!",
  },
  swift: {
    win: "swift filename.swift",
    mac: "swift filename.swift",
    linux: "swift filename.swift",
    output: "Hello, world!",
  },
  kotlin: {
    win: "kotlinc filename.kt -include-runtime -d filename.jar && java -jar filename.jar",
    mac: "kotlinc filename.kt -include-runtime -d filename.jar && java -jar filename.jar",
    linux: "kotlinc filename.kt -include-runtime -d filename.jar && java -jar filename.jar",
    output: "Hello, world!",
  },
  php: {
    win: "php filename.php",
    mac: "php filename.php",
    linux: "php filename.php",
    output: "Hello, world!",
  },
  bash: {
    win: "bash filename.sh",
    mac: "bash filename.sh",
    linux: "bash filename.sh",
    output: "Hello, world!",
  },
  r: {
    win: "Rscript filename.R",
    mac: "Rscript filename.R",
    linux: "Rscript filename.R",
    output: "Hello, world!",
  },
  dart: {
    win: "dart filename.dart",
    mac: "dart filename.dart",
    linux: "dart filename.dart",
    output: "Hello, world!",
  },
  scala: {
    win: "scala filename.scala",
    mac: "scala filename.scala",
    linux: "scala filename.scala",
    output: "Hello, world!",
  },
};

// Returns the best default code if user hasn't typed in any code yet
function getStarterCode(topic: any) {
  return typeof topic.codeExample === "string" ? topic.codeExample : "";
}

function getDifficultyBadge(difficulty: string) {
  if (difficulty in DIFFICULTY_COLORS) {
    const c = DIFFICULTY_COLORS[difficulty as keyof typeof DIFFICULTY_COLORS];
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
  return null;
}

// Simplistic code checker: checks for exact match or normalizes whitespace (optionally improve for more languages)
function isSolutionCorrect(userCode: string, expected: string) {
  // Remove spaces and normalize newlines for comparison
  return (
    userCode.trim().replace(/\r\n/g, "\n") === expected.trim().replace(/\r\n/g, "\n")
  );
}

export default function LanguageLessonPage() {
  const router = useRouter();
  const params = useParams();
  const id =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
      ? params.id[0]
      : "";

  const language = languages.find((lang: any) => lang.id === id);

  const topics = language
    ? (language as any).curriculum ?? (language as any).topics ?? []
    : [];

  // For each topic, save current code, completion, and attempt status
  const [currentIdx, setCurrentIdx] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);
  const [codeInputs, setCodeInputs] = useState<string[]>(
    topics.map((topic: any) => getStarterCode(topic))
  );
  const [runStatus, setRunStatus] = useState<{
    correct: boolean | null;
    error: string;
    hasRun: boolean;
  }>({ correct: null, error: "", hasRun: false });

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

  const current = topics[currentIdx] ?? {};

  // Figure out if solved (solution must exist and match)
  const solution = typeof current.solution === "string" ? current.solution : "";
  const outputExample =
    typeof current.output === "string"
      ? current.output
      : typeof current.expectedOutput === "string"
      ? current.expectedOutput
      : current.codeExample
      ? current.codeExample.includes("print(") || current.codeExample.includes("console.log(")
        ? current.codeExample.split("\n").slice(-1)[0].replace(/.*print\((.*)\)|.*console\.log\((.*)\)/, "$1$2").replace(/['";]/g, "")
        : ""
      : "";

  // Actions
  function handleRun() {
    const val = codeInputs[currentIdx] || "";
    // For this prototype, only string compare with solution (as a learning code sandbox)
    if (!solution) {
      setRunStatus({
        correct: false,
        error: "No solution available for this lesson.",
        hasRun: true,
      });
    } else if (isSolutionCorrect(val, solution)) {
      const topicNum =
        typeof current.lessonNumber === "number"
          ? current.lessonNumber
          : currentIdx + 1;
      setCompleted((prev) =>
        prev.includes(topicNum) ? prev : [...prev, topicNum]
      );
      setRunStatus({ correct: true, error: "", hasRun: true });
    } else {
      setRunStatus({
        correct: false,
        error: current.hint || "Try again! Check your code.",
        hasRun: true,
      });
    }
  }

  // "Unlock" button for the next lesson if solved, otherwise disabled
  const isCurrentCompleted = (() => {
    const topicNum =
      typeof current.lessonNumber === "number"
        ? current.lessonNumber
        : currentIdx + 1;
    return completed.includes(topicNum);
  })();

  // Sidebar jump
  function handleSelect(idx: number) {
    setCurrentIdx(idx);
    setShowHint(false);
    setShowSolution(false);
    setRunStatus({ correct: null, error: "", hasRun: false });
  }
  // Code editor change handler
  function handleCodeInput(val: string) {
    setCodeInputs((prev) =>
      prev.map((v, i) => (i === currentIdx ? val : v))
    );
    setRunStatus({ correct: null, error: "", hasRun: false });
  }

  function handleCopySolution() {
    if (solution) {
      window.navigator.clipboard.writeText(solution);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 1500);
    }
  }

  // Terminal tips (language id fallback to "python" if missing)
  const runTips =
    RUN_COMMANDS[language.id?.toLowerCase?.()] ?? RUN_COMMANDS["python"];

  // Progress bar value
  const progress = topics.length
    ? Math.round((completed.length / topics.length) * 100)
    : 0;

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
              const isDone = completed.includes(topicNum);
              return (
                <li key={topicNum}>
                  <button
                    type="button"
                    onClick={() => handleSelect(idx)}
                    className={classNames(
                      "flex w-full items-center justify-between px-3 py-2 rounded-full text-left transition font-medium",
                      currentIdx === idx
                        ? "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-400 dark:border-blue-800"
                        : "bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700",
                      "border"
                    )}
                    style={{
                      fontFamily:
                        "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
                    }}
                    aria-current={currentIdx === idx ? "step" : undefined}
                  >
                    <span>
                      Lesson {topicNum}: {t.title}
                    </span>
                    <span className="flex items-center ml-2">
                      {isDone ? CHECKMARK : null}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
          {/* Sidebar Progress bar */}
          <div className="mt-6">
            <div className="flex justify-between mb-1 text-xs text-zinc-500 dark:text-zinc-400">
              <span>
                {completed.length} of {topics.length} completed
              </span>
              <span>{progress || 0}%</span>
            </div>
            <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full">
              <div
                className="h-2 bg-blue-500 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <section className="flex-1 max-w-3xl mx-auto bg-white dark:bg-black rounded-2xl shadow border border-zinc-100 dark:border-zinc-800 px-5 md:px-12 py-10 mt-0">
        {/* Top: title and badge */}
        <h2
          className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight mb-2 flex items-center"
          style={{
            fontFamily:
              "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
          }}
        >
          {current.title}
          {getDifficultyBadge(language.difficulty)}
        </h2>

        {/* Explanation */}
        <p className="text-lg md:text-xl mb-5 text-zinc-600 dark:text-zinc-400 font-medium">
          {current.explanation}
        </p>

        {/* Key Concepts */}
        <div className="mb-6">
          <h3 className="text-zinc-900 dark:text-white font-semibold mb-2 text-base">
            Key Concepts
          </h3>
          <dl className="border border-zinc-100 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 px-5 py-3">
            {Array.isArray(current.keyConcepts) && current.keyConcepts.length > 0 ? (
              current.keyConcepts.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="flex flex-col md:flex-row md:items-baseline mb-2"
                >
                  <dt className="font-bold text-zinc-800 dark:text-zinc-200 min-w-[120px]">
                    {item.term}
                  </dt>
                  <dd className="ml-0 md:ml-4 text-zinc-600 dark:text-zinc-400">
                    {item.definition}
                  </dd>
                </div>
              ))
            ) : (
              <div className="text-zinc-500 dark:text-zinc-400 text-sm">
                No key concepts for this lesson.
              </div>
            )}
          </dl>
        </div>

        {/* Interactive code editor */}
        <div className="mb-7">
          <h3 className="text-zinc-900 dark:text-white font-semibold mb-2 text-base">
            Try it Yourself
          </h3>
          <div className="relative group">
            {/* Textarea for code input, styled as a code editor */}
            <textarea
              className="w-full min-h-[120px] max-h-[240px] bg-zinc-900 text-white rounded-xl px-5 py-4 font-mono text-sm border border-zinc-800 focus:border-blue-500 mb-2 transition"
              spellCheck={false}
              value={codeInputs[currentIdx]}
              onChange={(e) => handleCodeInput(e.target.value)}
              style={{
                fontFamily:
                  "Geist Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
              }}
              aria-label="Type your code answer"
              autoCorrect="off"
              autoComplete="off"
              autoCapitalize="off"
            />
            {/* Copy solution */}
            <button
              type="button"
              onClick={handleCopySolution}
              className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-zinc-700 hover:bg-blue-600 text-white text-xs font-medium transition"
              aria-label="Copy full solution code"
            >
              {copySuccess ? "Copied" : "Copy Solution"}
            </button>
          </div>
          {/* Run/Check button */}
          <div className="flex gap-3 items-center mt-2 mb-2">
            <button
              type="button"
              onClick={handleRun}
              className="px-5 py-1.5 rounded-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-950 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold transition border border-blue-300 dark:border-blue-800"
              style={{
                fontFamily:
                  "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
              }}
            >
              Run
            </button>
            {runStatus.hasRun && runStatus.correct && (
              <span className="ml-2 text-green-700 dark:text-green-300 font-semibold">
                Success! You solved this lesson.
              </span>
            )}
            {runStatus.hasRun && runStatus.correct === false && (
              <span className="ml-2 text-red-700 dark:text-red-300 font-semibold">
                {runStatus.error}
              </span>
            )}
          </div>
        </div>

        {/* Expected output */}
        <div className="mb-7">
          <h3 className="text-zinc-900 dark:text-white font-semibold mb-2 text-base">
            Expected Output
          </h3>
          <div className="bg-black text-green-200 font-mono rounded-xl px-5 py-3 text-sm border border-green-900 whitespace-pre-line">
            {outputExample || "No output to display."}
          </div>
        </div>

        {/* Challenge Task */}
        <div className="mb-7 text-base text-zinc-800 dark:text-zinc-200">
          <h3 className="font-semibold mb-1">Challenge</h3>
          <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800 px-5 py-4 text-zinc-700 dark:text-zinc-300">
            {current.challenge}
          </div>
        </div>

        {/* Hints and Solution */}
        <div className="mb-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setShowHint((v) => !v)}
            className="px-4 py-1.5 rounded-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-950 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium transition border border-blue-300 dark:border-blue-800"
          >
            {showHint ? "Hide Hint" : "Show Hint"}
          </button>
          <button
            type="button"
            onClick={() => setShowSolution((v) => !v)}
            className="px-4 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 font-medium transition border border-zinc-300 dark:border-zinc-800"
          >
            {showSolution ? "Hide Solution" : "Show Solution"}
          </button>
        </div>
        {showHint && current.hint && (
          <div className="mt-2 mb-4 bg-blue-50 dark:bg-blue-900/50 rounded p-3 border border-blue-100 dark:border-blue-900 text-blue-700 dark:text-blue-300">
            <span className="font-semibold">Hint: </span>
            {current.hint}
          </div>
        )}
        {showSolution && solution && (
          <div className="mt-2 mb-4 bg-green-50 dark:bg-green-900/50 rounded p-3 border border-green-100 dark:border-green-900 text-green-700 dark:text-green-300 font-mono whitespace-pre-wrap">
            <span className="font-semibold">Solution: </span>
            {solution}
          </div>
        )}

        {/* Common mistakes */}
        {(current.commonMistakes || current.mistakes) && (
          <div className="mb-7">
            <h3 className="text-zinc-900 dark:text-white font-semibold mb-2 text-base">
              Common Mistakes
            </h3>
            <ul className="text-zinc-600 dark:text-zinc-400 list-disc pl-6">
              {(current.commonMistakes || current.mistakes || []).map(
                (item: string, idx: number) => (
                  <li key={idx}>{item}</li>
                )
              )}
            </ul>
          </div>
        )}

        {/* Beginner Tip */}
        {current.beginnerTip && (
          <div className="mb-8 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800 px-5 py-4 text-zinc-700 dark:text-zinc-300 text-sm">
            <span className="font-semibold">Beginner Tip:</span> {current.beginnerTip}
          </div>
        )}

        {/* Terminal Section */}
        <section className="mb-8">
          <h3 className="text-zinc-900 dark:text-white font-semibold mb-2 text-base">
            How to Run This Language
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <div className="font-semibold mb-1 text-xs text-zinc-700 dark:text-zinc-400">
                Windows
              </div>
              <div className="bg-zinc-900 text-green-200 rounded-lg px-4 py-2 font-mono text-sm border border-green-900 whitespace-nowrap">
                {runTips.win}
              </div>
            </div>
            <div>
              <div className="font-semibold mb-1 text-xs text-zinc-700 dark:text-zinc-400">
                Mac
              </div>
              <div className="bg-zinc-900 text-green-200 rounded-lg px-4 py-2 font-mono text-sm border border-green-900 whitespace-nowrap">
                {runTips.mac}
              </div>
            </div>
            <div>
              <div className="font-semibold mb-1 text-xs text-zinc-700 dark:text-zinc-400">
                Linux
              </div>
              <div className="bg-zinc-900 text-green-200 rounded-lg px-4 py-2 font-mono text-sm border border-green-900 whitespace-nowrap">
                {runTips.linux}
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="font-semibold mb-1 text-xs text-zinc-700 dark:text-zinc-400">
              What output will show:
            </div>
            <div className="bg-black text-green-200 font-mono rounded-xl px-5 py-3 text-sm border border-green-900 whitespace-pre-line">
              {runTips.output}
            </div>
          </div>
        </section>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            disabled={currentIdx === 0}
            onClick={() => {
              handleSelect(currentIdx - 1);
            }}
            className={classNames(
              "px-6 py-2 rounded-full font-medium transition border",
              currentIdx === 0
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
            disabled={
              currentIdx === topics.length - 1 || !isCurrentCompleted
            }
            onClick={() => {
              if (isCurrentCompleted && currentIdx < topics.length - 1) {
                handleSelect(currentIdx + 1);
              }
            }}
            className={classNames(
              "px-6 py-2 rounded-full font-medium transition border ml-2",
              currentIdx === topics.length - 1 || !isCurrentCompleted
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
        <div className="mt-10">
          <Link
            href="/"
            className="inline-block px-6 py-2 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-100 font-semibold transition"
            style={{
              fontFamily:
                "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
            }}
          >
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}