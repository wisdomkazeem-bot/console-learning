"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import languagesData from "@/data/languages.json";
import type { Language, Topic } from "@/lib/language-types";

const ALL_LANGUAGES = languagesData as Language[];

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: "bg-green-600 text-white",
  Intermediate: "bg-yellow-500 text-zinc-900",
  Advanced: "bg-red-600 text-white",
};

function normalizeCode(code: string): string {
  return code
    .replace(/\/\/.*$/gm, "")
    .replace(/#.*$/gm, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function checkChallenge(userCode: string, solution: string[]): {
  pass: boolean;
  message: string;
} {
  if (!userCode.trim()) {
    return { pass: false, message: "Write some code before running." };
  }

  const userNorm = normalizeCode(userCode);
  const significantLines = solution.filter(
    (line) =>
      line.trim() &&
      !line.trim().startsWith("#") &&
      !line.trim().startsWith("//") &&
      !line.trim().startsWith("/*")
  );

  if (significantLines.length === 0) {
    const solNorm = normalizeCode(solution.join("\n"));
    if (userNorm === solNorm || userNorm.includes(solNorm)) {
      return { pass: true, message: "Correct! Your code matches the expected solution." };
    }
    return { pass: false, message: "Not quite right. Compare your code with the solution." };
  }

  const matched = significantLines.filter((line) =>
    userNorm.includes(normalizeCode(line))
  );
  const ratio = matched.length / significantLines.length;

  if (ratio >= 0.7) {
    return {
      pass: true,
      message: `Correct! ${matched.length}/${significantLines.length} key lines matched.`,
    };
  }

  return {
    pass: false,
    message: `Keep trying. ${matched.length}/${significantLines.length} key lines matched so far.`,
  };
}

function topicIndexFromParam(language: Language | undefined, topicId: string | null): number {
  if (!language || !topicId) return 0;
  const idx = language.topics.findIndex((t) => t.id === topicId);
  return idx >= 0 ? idx : 0;
}

function progressKey(langId: string) {
  return `language-progress-${langId}`;
}

function loadCompleted(langId: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(progressKey(langId));
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function saveCompleted(langId: string, ids: string[]) {
  localStorage.setItem(progressKey(langId), JSON.stringify(ids));
}

function CodeBlock({
  codeLines,
  language,
  label,
}: {
  codeLines: string[];
  language?: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(codeLines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="rounded-xl bg-zinc-900 text-zinc-50 text-sm font-mono overflow-hidden border border-zinc-800 mb-4">
      <div className="flex justify-between items-center px-4 py-2 border-b border-zinc-800 bg-zinc-950">
        <span className="text-xs uppercase tracking-wider text-zinc-400">
          {label ?? language ?? "Code"}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-full px-3 py-1 text-xs font-semibold bg-zinc-700 hover:bg-zinc-600 text-white transition"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="px-4 py-4 overflow-x-auto">
        <code className="flex flex-col">
          {codeLines.map((line, idx) => (
            <span key={idx} className="flex leading-6">
              <span className="select-none text-zinc-600 pr-4 text-right w-8 shrink-0">
                {idx + 1}
              </span>
              <span>{line || " "}</span>
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}

function TerminalSection({ commands }: { commands: Language["terminalCommands"] }) {
  const rows = [
    { label: "Windows", cmd: commands.windows },
    { label: "macOS", cmd: commands.mac },
    { label: "Linux", cmd: commands.linux },
  ];

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-5">
      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
        How to Run
      </h3>
      <dl className="space-y-3">
        {rows.map(({ label, cmd }) => (
          <div key={label}>
            <dt className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
              {label}
            </dt>
            <dd className="font-mono text-sm text-zinc-800 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-900 px-3 py-2 rounded-lg">
              {cmd}
            </dd>
          </div>
        ))}
      </dl>
      <p className="text-xs text-zinc-500 mt-4">
        <span className="font-semibold">Install: </span>
        {commands.install}
      </p>
    </div>
  );
}

function LanguagePicker({ currentId }: { currentId: string }) {
  const router = useRouter();
  return (
    <div className="mb-6 flex items-center gap-3">
      <label htmlFor="lang-picker" className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">
        Language
      </label>
      <select
        id="lang-picker"
        value={currentId}
        onChange={(e) => router.push(`/language/${e.target.value}`)}
        className="rounded-lg px-3 py-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-sm"
      >
        {ALL_LANGUAGES.map((l) => (
          <option key={l.id} value={l.id}>
            {l.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function LanguagePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const rawId =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
        ? params.id[0]
        : "";
  const id = rawId.toLowerCase();

  const language = ALL_LANGUAGES.find((l) => l.id === id);
  const topicParam = searchParams.get("topic");

  const [topicIndex, setTopicIndex] = useState(() =>
    topicIndexFromParam(language, topicParam)
  );
  const [completed, setCompleted] = useState<string[]>(() =>
    language ? loadCompleted(language.id) : []
  );
  const [loadedLangId, setLoadedLangId] = useState(language?.id ?? "");
  const [challengeCode, setChallengeCode] = useState("");
  const [runResult, setRunResult] = useState<{ pass: boolean; message: string } | null>(null);
  const [runOutput, setRunOutput] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  if (language && language.id !== loadedLangId) {
    setLoadedLangId(language.id);
    setCompleted(loadCompleted(language.id));
    setTopicIndex(topicIndexFromParam(language, topicParam));
    setChallengeCode("");
    setRunResult(null);
    setRunOutput(null);
    setShowHint(false);
    setShowSolution(false);
  }

  const markComplete = useCallback(
    (topicId: string) => {
      if (!language) return;
      setCompleted((prev) => {
        if (prev.includes(topicId)) return prev;
        const next = [...prev, topicId];
        saveCompleted(language.id, next);
        return next;
      });
    },
    [language]
  );

  function selectTopic(index: number) {
    setTopicIndex(index);
    setChallengeCode("");
    setRunResult(null);
    setRunOutput(null);
    setShowHint(false);
    setShowSolution(false);
  }

  function goTopic(delta: number) {
    if (!language) return;
    const next = Math.min(language.topics.length - 1, Math.max(0, topicIndex + delta));
    selectTopic(next);
  }

  if (!language) {
    return (
      <div className="font-sans bg-zinc-50 dark:bg-black min-h-screen px-4 py-32 flex flex-col items-center">
        <div className="max-w-3xl w-full rounded-xl bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 p-8 md:p-12">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            Language not found
          </h1>
          <p className="text-sm text-zinc-500 mb-4">
            No lesson path exists for{" "}
            <code className="bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded">{id}</code>.
          </p>
          <LanguagePicker currentId="" />
          <Link
            href="/"
            className="mt-6 inline-block rounded-full px-5 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black text-sm font-semibold"
          >
            Back to homepage
          </Link>
        </div>
      </div>
    );
  }

  const topic: Topic = language.topics[topicIndex];
  const progressPct =
    language.topics.length > 0
      ? Math.round((completed.length / language.topics.length) * 100)
      : 0;

  function handleRun() {
    const result = checkChallenge(challengeCode, topic.challengeSolution);
    setRunResult(result);
    const output = topic.expectedOutput?.trim();
    setRunOutput(output ? output : "(No expected output for this lesson.)");
    if (result.pass) {
      markComplete(topic.id);
    }
  }

  const starterLines =
    topic.starterCode.length > 0 ? topic.starterCode : topic.challengeSolution.slice(0, 2);

  return (
    <div className="font-sans bg-zinc-50 dark:bg-black min-h-screen flex flex-col">
      {/* Top nav */}
      <nav className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3 flex-wrap">
          <Link
            href="/"
            className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 underline"
          >
            Home
          </Link>
          <span className="text-zinc-300 dark:text-zinc-700">/</span>
          <Link
            href="/languages"
            className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 underline"
          >
            Languages
          </Link>
          <span className="text-zinc-300 dark:text-zinc-700">/</span>
          <span
            className="text-base font-bold"
            style={{ color: language.color }}
          >
            {language.name}
          </span>
          <span className="ml-auto text-xs text-zinc-400">
            {completed.length} of {language.topics.length} completed
          </span>
        </div>
      </nav>

      {/* Progress bar */}
      <div className="bg-white dark:bg-black border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Course Progress
            </span>
            <span className="text-xs text-zinc-400">{progressPct}%</span>
          </div>
          <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-zinc-900 dark:bg-zinc-100 transition-all duration-300 rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 flex gap-8">
        {/* Sidebar */}
        <aside className="w-56 shrink-0 hidden lg:block">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
            Topics
          </p>
          <ul className="space-y-1">
            {language.topics.map((t, idx) => {
              const isActive = idx === topicIndex;
              const isDone = completed.includes(t.id);
              return (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => selectTopic(idx)}
                    className={`w-full text-left px-3 py-2 rounded-full text-sm font-medium transition flex items-center gap-2 ${
                      isActive
                        ? "text-white"
                        : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                    }`}
                    style={
                      isActive ? { backgroundColor: language.color } : undefined
                    }
                  >
                    <span
                      className={`shrink-0 w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                        isDone
                          ? "bg-green-600 border-green-600 text-white"
                          : "border-zinc-300 dark:border-zinc-600"
                      }`}
                      aria-hidden="true"
                    >
                      {isDone ? "\u2713" : ""}
                    </span>
                    <span className="truncate">
                      {idx + 1}. {t.title}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm p-6 sm:p-8">
            <LanguagePicker currentId={language.id} />
            <section className="mb-8">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                All Lessons
              </p>
              <div className="flex flex-wrap gap-2">
                {language.topics.map((t, idx) => {
                  const isActive = idx === topicIndex;
                  const isDone = completed.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => selectTopic(idx)}
                      className={`rounded-full px-3 py-1.5 text-xs border transition ${
                        isActive
                          ? "text-white border-transparent"
                          : "text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                      }`}
                      style={isActive ? { backgroundColor: language.color } : undefined}
                    >
                      {idx + 1}. {t.title} {isDone ? "\u2713" : ""}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Header */}
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                {topic.title}
              </h1>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  DIFFICULTY_COLORS[topic.difficulty] ?? "bg-zinc-400 text-white"
                }`}
              >
                {topic.difficulty}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mb-6">
              Topic {topicIndex + 1} of {language.topics.length}
            </p>

            {/* Explanation */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
                Concept
              </h2>
              <p className="text-zinc-700 dark:text-zinc-300 leading-7 mb-3">
                {topic.explanation}
              </p>
              {topic.beginnerExplanation && (
                <div className="rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4">
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                    For beginners
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {topic.beginnerExplanation}
                  </p>
                </div>
              )}
            </section>

            {/* Key terms */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
                Key Terms
              </h2>
              <dl className="space-y-4">
                {topic.keyTerms.map((kt) => (
                  <div
                    key={kt.term}
                    className="border-l-2 border-zinc-200 dark:border-zinc-700 pl-4"
                  >
                    <dt className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {kt.term}
                    </dt>
                    <dd className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                      {kt.definition}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
                Video Resources
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {topic.videoResources.map((video) => (
                  <a
                    key={video.url}
                    href={video.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-4 hover:border-zinc-400 dark:hover:border-zinc-600 transition"
                  >
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                      {video.title}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {video.source ? `Recommended source: ${video.source}. ` : ""}
                      {video.note ?? "Open YouTube search results for this lesson."}
                    </p>
                  </a>
                ))}
              </div>
            </section>

            {/* Code example */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
                Example
              </h2>
              <CodeBlock
                codeLines={topic.codeExample}
                language={language.name}
                label="Example"
              />
              {topic.expectedOutput && (
                <p className="text-sm text-zinc-500">
                  Expected output:{" "}
                  <code className="font-mono bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded text-xs">
                    {topic.expectedOutput}
                  </code>
                </p>
              )}
              <div className="mt-4">
                <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-200 mb-2">
                  Common mistakes
                </p>
                <ul className="list-disc list-inside space-y-1">
                  {topic.commonMistakes.map((m) => (
                    <li key={m} className="text-sm text-zinc-500 dark:text-zinc-400">
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Challenge */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
                Challenge
              </h2>
              <p className="text-zinc-700 dark:text-zinc-300 mb-4 leading-relaxed">
                {topic.challenge}
              </p>
              <textarea
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 text-zinc-50 border border-zinc-700 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-zinc-500 resize-y min-h-[160px]"
                rows={8}
                value={challengeCode}
                onChange={(e) => {
                  setChallengeCode(e.target.value);
                  setRunResult(null);
                  setRunOutput(null);
                }}
                placeholder={starterLines.join("\n")}
                spellCheck={false}
              />
              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  type="button"
                  onClick={handleRun}
                  className="rounded-full px-5 py-2 text-sm font-semibold bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black hover:bg-zinc-700 dark:hover:bg-zinc-300 transition"
                >
                  Run
                </button>
                <button
                  type="button"
                  onClick={() => setShowHint((v) => !v)}
                  className="rounded-full px-5 py-2 text-sm font-semibold bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition"
                >
                  {showHint ? "Hide Hint" : "Show Hint"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowSolution((v) => !v)}
                  className="rounded-full px-5 py-2 text-sm font-semibold bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition"
                >
                  {showSolution ? "Hide Solution" : "Show Solution"}
                </button>
              </div>
              {showHint && (
                <div className="mt-4 p-4 rounded-xl bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900">
                  <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
                    Hint
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{topic.challengeHint}</p>
                </div>
              )}
              {showSolution && (
                <div className="mt-4">
                  <CodeBlock
                    codeLines={topic.challengeSolution}
                    language={language.name}
                    label="Solution"
                  />
                </div>
              )}
              {runResult && (
                <div
                  className={`mt-4 p-4 rounded-xl border ${
                    runResult.pass
                      ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900"
                      : "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900"
                  }`}
                >
                  <p
                    className={`text-sm font-semibold ${
                      runResult.pass
                        ? "text-green-800 dark:text-green-300"
                        : "text-red-800 dark:text-red-300"
                    }`}
                  >
                    {runResult.pass ? "Passed" : "Not yet"}
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                    {runResult.message}
                  </p>
                </div>
              )}
              {runOutput !== null && (
                <div className="mt-4 rounded-xl bg-zinc-900 text-zinc-100 border border-zinc-800 overflow-hidden">
                  <div className="px-4 py-2 text-xs uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
                    Output
                  </div>
                  <pre className="px-4 py-3 text-sm font-mono whitespace-pre-wrap break-words">
                    {runOutput}
                  </pre>
                </div>
              )}
            </section>

            {/* Reference solution */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
                Reference Solution
              </h2>
              <CodeBlock
                codeLines={topic.solution}
                language={language.name}
                label="Reference"
              />
            </section>

            {/* Terminal */}
            <section className="mb-8">
              <TerminalSection commands={language.terminalCommands} />
            </section>

            {/* Topic navigation */}
            <div className="flex flex-wrap gap-2 pt-6 border-t border-zinc-200 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => goTopic(-1)}
                disabled={topicIndex === 0}
                className="rounded-full px-4 py-2 text-sm font-semibold bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800 disabled:opacity-40 transition"
              >
                Previous Topic
              </button>
              <button
                type="button"
                onClick={() => goTopic(1)}
                disabled={topicIndex === language.topics.length - 1}
                className="rounded-full px-4 py-2 text-sm font-semibold bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black hover:bg-zinc-700 dark:hover:bg-zinc-300 disabled:opacity-40 transition"
              >
                Next Topic
              </button>
              {completed.includes(topic.id) && (
                <span className="ml-auto self-center text-xs font-semibold text-green-600 dark:text-green-400">
                  Completed
                </span>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
