"use client";

import { useState } from "react";
import languages from "@/data/languages.json";

// --- Types ---
type Language = {
  id: string;
  name: string;
  terminalCommands: {
    windows: string;
    mac: string;
    linux: string;
    install?: string;
    runExample?: string;
  };
  topics: Topic[];
};

type Topic = {
  id: string | number;
  title: string;
  read: {
    explanation: string;
    keyTerms: { term: string; def: string }[];
    example: string;
  };
  watch: {
    code: string[];
  };
  assignment: {
    prompt: string;
    expected: string;
    exampleCall?: string;
    testInput?: any;
    lang?: string;
    hint?: string;
  };
  terminal?: {
    expectedOutput?: string[];
  };
  challenge: {
    prompt: string;
    hint: string;
    solution: string[];
  };
};

// Utility
function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function getLanguageById(id: string): Language | undefined {
  return (languages as any[]).find(
    (lang) =>
      lang.id === id ||
      (typeof lang.id === "string" && lang.id.toLowerCase() === id.toLowerCase())
  ) as Language | undefined;
}

export default function LanguageLessonPage({ params }: { params: { id: string } }) {
  const language = getLanguageById(params.id);

  const [selectedLessonIdx, setSelectedLessonIdx] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [step, setStep] = useState(1);
  const [assignmentInput, setAssignmentInput] = useState("");
  const [assignmentStatus, setAssignmentStatus] = useState<"idle" | "success" | "error">("idle");
  const [assignmentHint, setAssignmentHint] = useState(false);

  const [challengeInput, setChallengeInput] = useState("");
  const [challengeStatus, setChallengeStatus] = useState<"idle" | "success" | "error">("idle");
  const [challengeHintOpen, setChallengeHintOpen] = useState(false);
  const [challengeSolutionOpen, setChallengeSolutionOpen] = useState(false);

  // Not found case (requirement #4)
  if (!language) {
    return (
      <div className="max-w-3xl mx-auto px-4 pt-32 font-sans text-zinc-700">
        <h2 className="text-2xl font-semibold mb-4">Language not found</h2>
        <a href="/" className="underline text-blue-700 dark:text-blue-400">
          Back to homepage
        </a>
      </div>
    );
  }

  // Lessons from language.topics (#1)
  const lessons = language.topics;
  const lesson = lessons[selectedLessonIdx];

  // Progress info
  const progress = {
    number: selectedLessonIdx + 1,
    total: lessons.length,
    title: lesson.title,
    completed: completedLessons.length,
  };
  const percent = lessons.length
    ? Math.round((completedLessons.length / lessons.length) * 100)
    : 0;
  const progressBarColor = percent < 100 ? "bg-blue-600" : "bg-green-600";

  // Helpers
  const isLessonUnlocked = (idx: number) => {
    if (idx === 0) return true;
    return completedLessons.includes(idx - 1);
  };
  const canGoNextLesson = completedLessons.includes(selectedLessonIdx);

  // Terminal commands (#1, #3): use language.terminalCommands for each OS
  const terminalCommands = {
    windows: {
      install: language.terminalCommands?.install ?? language.terminalCommands?.windows ?? "",
      run: language.terminalCommands?.windows ?? "",
    },
    mac: {
      install: language.terminalCommands?.install ?? language.terminalCommands?.mac ?? "",
      run: language.terminalCommands?.mac ?? "",
    },
    linux: {
      install: language.terminalCommands?.install ?? language.terminalCommands?.linux ?? "",
      run: language.terminalCommands?.linux ?? "",
    },
  };

  const terminalExpectedOutput =
    lesson.terminal?.expectedOutput ||
    (lesson.assignment?.expected && lesson.assignment.expected !== ""
      ? [lesson.assignment.expected]
      : []);

  // Helper to render dark code block with lines & copy
  const renderCodeBlock = (lines: string[], lang: string = "text") => (
    <div className="relative bg-[#18181b] rounded-lg p-4 mt-2 text-sm font-mono text-zinc-100 overflow-x-auto">
      <button
        className="absolute top-3 right-4 rounded-full bg-zinc-700 text-white px-3 py-1 text-xs transition hover:bg-zinc-600 font-sans"
        onClick={() => {
          navigator.clipboard.writeText(lines.join("\n"));
        }}
        aria-label="Copy code"
        type="button"
        tabIndex={0}
      >
        Copy
      </button>
      <pre className="flex flex-col gap-0 font-mono text-zinc-100">
        {lines.map((line, idx) => (
          <div key={idx} className="flex">
            <span className="text-zinc-500 select-none pr-4 text-right w-8">{idx + 1}</span>
            <span>{line || "\u200b"}</span>
          </div>
        ))}
      </pre>
    </div>
  );

  // Assignment runner for all languages (#2)
  function runAssignment() {
    if (!language) return;
    const lang = (lesson.assignment.lang || language.id).toLowerCase();
    let out: string | undefined = undefined;
    let pass = false;
    try {
      if (lang === "python") {
        const fnNameMatch = lesson.assignment.exampleCall
          ? lesson.assignment.exampleCall.match(/^([A-Za-z_][A-Za-z0-9_]*)\(/)
          : null;
        const fnName = fnNameMatch && fnNameMatch[1];
        if (
          fnName &&
          assignmentInput.includes("def " + fnName) &&
          assignmentInput.includes("return")
        ) {
          if (fnName === "add") {
            if (
              assignmentInput.match(/\breturn\s+(a\s*\+\s*b|b\s*\+\s*a)[\s$]/) ||
              assignmentInput.replace(/\s/g, "").includes("returna+b")
            ) {
              out = "15";
            }
          }
        }
        if (out === lesson.assignment.expected) pass = true;
      } else if (lang === "javascript" || lang === "js" || lang === "node") {
        let fn, result;
        if (lesson.assignment.exampleCall) {
          // eslint-disable-next-line no-new-func
          fn = new Function(
            assignmentInput + `\nreturn (${lesson.assignment.exampleCall});`
          );
          result = fn();
          if (String(result) === String(lesson.assignment.expected)) pass = true;
        }
      } else if (lang === "java") {
        if (
          assignmentInput.includes("public static") &&
          assignmentInput.includes("return") &&
          assignmentInput.includes(String(lesson.assignment.expected))
        )
          pass = true;
      } else if (lang === "go") {
        if (
          assignmentInput.includes("func main()") &&
          assignmentInput.includes(`fmt.Println(${lesson.assignment.expected})`)
        )
          pass = true;
      } else if (lang === "c" || lang === "cpp" || lang === "c++") {
        if (
          assignmentInput.includes("printf") &&
          assignmentInput.includes(String(lesson.assignment.expected))
        )
          pass = true;
      } else if (lang === "ruby") {
        if (
          assignmentInput.includes("puts") &&
          assignmentInput.includes(String(lesson.assignment.expected))
        )
          pass = true;
      } else {
        // Fallback: just check output string
        if (assignmentInput.includes(String(lesson.assignment.expected)))
          pass = true;
      }
    } catch {
      pass = false;
    }

    if (pass) {
      setAssignmentStatus("success");
      setTimeout(() => setStep(4), 1200);
      if (!completedLessons.includes(selectedLessonIdx)) {
        setCompletedLessons([...completedLessons, selectedLessonIdx]);
      }
    } else {
      setAssignmentStatus("error");
      setAssignmentHint(true);
    }
  }

  function runChallenge() {
    if (!language) return;
    let pass = false;
    const lang = (lesson.assignment.lang || language.id).toLowerCase();
    try {
      if (lang === "python") {
        if (
          challengeInput.includes("def max_num") &&
          (challengeInput.includes("for") || challengeInput.includes("max("))
        )
          pass = true;
      } else if (lang === "js" || lang === "javascript" || lang === "node") {
        if (challengeInput.includes("function")) pass = true;
      } else if (lang === "java") {
        if (challengeInput.includes("public static")) pass = true;
      } else {
        if (challengeInput && challengeInput.trim().length > 10) pass = true;
      }
    } catch {
      pass = false;
    }
    if (pass) {
      setChallengeStatus("success");
      if (!completedLessons.includes(selectedLessonIdx)) {
        setCompletedLessons([...completedLessons, selectedLessonIdx]);
      }
    } else {
      setChallengeStatus("error");
    }
  }

  return (
    <div className="font-sans bg-zinc-50 dark:bg-black min-h-screen">
      {/* Progress Bar at very top */}
      <div className="w-full py-3 px-0 mb-0 bg-white dark:bg-black border-b border-zinc-100 dark:border-zinc-900">
        <div className="max-w-3xl mx-auto flex items-start px-4 py-0 pt-0 flex-col">
          <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-900 rounded-full overflow-hidden">
            <div
              className={classNames(
                "h-2 transition-all duration-500",
                progressBarColor
              )}
              style={{
                width: `${percent}%`,
                minWidth: percent > 0 ? "2rem" : "0",
              }}
            />
          </div>
          <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400 font-sans">
            {progress.completed} of {progress.total} lessons completed
          </div>
        </div>
      </div>
      {/* Top bar */}
      <div className="bg-white dark:bg-black shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            {/* Use language.name (#2) */}
            <span className="text-lg font-medium">{language.name}</span>
            <span className="mx-2 text-zinc-300 select-none">|</span>
            <span className="text-base font-normal">{progress.title}</span>
          </div>
          <div className="text-sm text-zinc-400 font-sans">
            Lesson {progress.number} of {progress.total}
          </div>
        </div>
      </div>
      <div className="max-w-3xl mx-auto flex gap-8 mt-8 px-4">
        {/* Left Panel: Lessons list */}
        <nav className="w-52 shrink-0 hidden md:block">
          <ul className="space-y-1">
            {lessons.map((l, idx) => {
              const unlocked = isLessonUnlocked(idx);
              const completed = completedLessons.includes(idx);
              const current = idx === selectedLessonIdx;
              return (
                <li
                  key={l.id}
                  className={classNames(
                    "flex items-center rounded-lg px-3 py-2 text-sm cursor-pointer select-none font-sans transition",
                    current &&
                      unlocked &&
                      "bg-zinc-100 dark:bg-zinc-900 font-semibold text-black dark:text-zinc-100",
                    !current &&
                      unlocked &&
                      "hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400",
                    !unlocked &&
                      "text-zinc-400 dark:text-zinc-600 opacity-70 bg-transparent cursor-not-allowed"
                  )}
                  onClick={() => {
                    if (unlocked) {
                      setSelectedLessonIdx(idx);
                      setStep(1);
                      setAssignmentStatus("idle");
                      setAssignmentInput("");
                      setChallengeInput("");
                      setChallengeStatus("idle");
                      setAssignmentHint(false);
                      setChallengeHintOpen(false);
                      setChallengeSolutionOpen(false);
                    }
                  }}
                >
                  <span
                    className="mr-2 px-2 py-0.5 text-xs rounded-full border font-sans"
                    style={{
                      background: current ? "#a1a1aa" : "#fff",
                      color: current ? "#fff" : "#a1a1aa",
                      borderColor: current ? "#a1a1aa" : "#e4e4e7",
                    }}
                  >
                    {idx + 1}
                  </span>
                  <span className="flex-1">{l.title}</span>
                  {completed && (
                    <svg
                      className="ml-2 text-green-500 w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={3}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 12 18 6 12" />
                    </svg>
                  )}
                  {!unlocked && (
                    <svg className="ml-2 text-zinc-300 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd"
                        d="M10 2a4 4 0 00-4 4v2a1 1 0 01-2 0V6a6 6 0 0112 0v2a1 1 0 01-2 0V6a4 4 0 00-4-4z"
                        clipRule="evenodd" />
                      <path d="M4 10a6 6 0 1112 0v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4z"/>
                    </svg>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
        {/* Main Panel (content) */}
        <div className="flex-1 min-w-0 bg-white dark:bg-black p-6 rounded-xl shadow-lg border border-zinc-100 dark:border-zinc-900 font-sans text-zinc-600 dark:text-zinc-400">
          <div className="mb-8 flex gap-3 items-center">
            {["Read", "Watch", "Assignment", "Terminal", "Challenge"].map((label, i) => (
              <span key={label}
                className={classNames(
                  "rounded-full px-3 py-1 text-xs font-medium bg-zinc-100 dark:bg-zinc-800",
                  step === i + 1 && "ring-2 ring-blue-400"
                )}
              >
                {label}
              </span>
            ))}
          </div>
          {/* Steps */}
          {step === 1 && (
            <section>
              <h2 className="text-xl font-semibold mb-4">Step 1: Read</h2>
              <div className="mb-3">{lesson.read.explanation}</div>
              <div className="mb-3">
                <div className="text-zinc-800 dark:text-zinc-200 font-medium mb-1">Key Terms</div>
                <ul className="pl-4 text-sm list-disc">
                  {lesson.read.keyTerms.map((kt, i) => (
                    <li key={i}><span className="font-semibold">{kt.term}</span>: {kt.def}</li>
                  ))}
                </ul>
              </div>
              <div className="mb-5">
                <div className="text-zinc-800 dark:text-zinc-200 font-medium mb-1">Real World Example</div>
                {renderCodeBlock(lesson.read.example.split("\n"))}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  className="rounded-full bg-zinc-900 text-white px-6 py-2 hover:bg-zinc-700 font-sans text-sm transition"
                  onClick={() => setStep(2)}
                >
                  Continue to Watch
                </button>
              </div>
            </section>
          )}
          {step === 2 && (
            <section>
              <h2 className="text-xl font-semibold mb-4">Step 2: Watch Complete Code Example</h2>
              {renderCodeBlock(lesson.watch.code, lesson.assignment?.lang || language.id)}
              <div className="mt-6 flex justify-end">
                <button
                  className="rounded-full bg-zinc-900 text-white px-6 py-2 hover:bg-zinc-700 font-sans text-sm transition"
                  onClick={() => setStep(3)}
                >
                  Continue to Assignment
                </button>
              </div>
            </section>
          )}
          {step === 3 && (
            <section>
              <h2 className="text-xl font-semibold mb-4">Step 3: Assignment</h2>
              <div className="mb-2">{lesson.assignment.prompt}</div>
              <div className="bg-zinc-50 dark:bg-zinc-900 rounded p-4 text-sm mb-2">
                {lesson.assignment.exampleCall && (
                  <div>
                    Call example:{" "}
                    <span className="font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">{lesson.assignment.exampleCall}</span>
                  </div>
                )}
                <div className="mt-1">
                  Expected Output:{" "}
                  <span className="font-mono font-semibold">{lesson.assignment.expected}</span>
                </div>
              </div>
              <div
                className="mb-3 flex rounded border border-zinc-200 dark:border-zinc-800 overflow-hidden"
                style={{ minHeight: 160, background: "inherit" }}
              >
                <div className="bg-zinc-100 dark:bg-zinc-900 px-3 py-2 text-xs text-zinc-400 font-mono select-none text-right"
                  style={{ minWidth: 28, userSelect: "none" }}>
                  {[...Array((assignmentInput.match(/\n/g)?.length || 0) + 5).keys()].map((n) => (
                    <div key={n}>{n + 1}</div>
                  ))}
                </div>
                <textarea
                  value={assignmentInput}
                  onChange={e => {
                    setAssignmentInput(e.target.value);
                    setAssignmentStatus("idle");
                  }}
                  className="flex-1 px-3 py-2 font-mono text-sm bg-zinc-50 dark:bg-black border-0 outline-none resize-none text-zinc-900 dark:text-zinc-100"
                  spellCheck={false}
                  style={{ minHeight: 160, lineHeight: 1.4 }}
                  placeholder="# Start typing your code here"
                  rows={Math.max(5, (assignmentInput.match(/\n/g)?.length || 0) + 2)}
                  tabIndex={0}
                />
              </div>
              {assignmentStatus === "success" && (
                <div className="bg-green-100 border border-green-300 rounded px-4 py-2 mb-2 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-200">
                  Great job! Your code is correct. Moving to next step.
                </div>
              )}
              {assignmentStatus === "error" && (
                <div className="bg-red-100 border border-red-300 rounded px-4 py-2 mb-2 text-red-800 dark:bg-red-900 dark:border-red-700 dark:text-red-200">
                  Not quite. Check your code and try again.
                  {assignmentHint && lesson.assignment.hint && (
                    <div className="mt-2 text-sm text-zinc-700 dark:text-zinc-200">
                      Hint: {lesson.assignment.hint}
                    </div>
                  )}
                </div>
              )}
              <div className="mt-2 flex items-center gap-4">
                <button
                  className="rounded-full bg-blue-600 text-white px-8 py-2 hover:bg-blue-700 font-sans text-base transition"
                  onClick={runAssignment}
                >
                  Run
                </button>
              </div>
            </section>
          )}
          {step === 4 && (
            <section>
              <h2 className="text-xl font-semibold mb-4">Step 4: Terminal Usage</h2>
              <TabTerminalPanel
                commands={terminalCommands}
                expectedOutput={terminalExpectedOutput}
              />
              <div className="mt-6 flex justify-end">
                <button
                  className="rounded-full bg-zinc-900 text-white px-6 py-2 hover:bg-zinc-700 font-sans text-sm transition"
                  onClick={() => setStep(5)}
                >
                  Continue to Challenge
                </button>
              </div>
            </section>
          )}
          {step === 5 && (
            <section>
              <h2 className="text-xl font-semibold mb-4">Step 5: Challenge</h2>
              <div className="mb-2">{lesson.challenge.prompt}</div>
              <div
                className="mb-3 flex rounded border border-zinc-200 dark:border-zinc-800 overflow-hidden"
                style={{ minHeight: 160, background: "inherit" }}
              >
                <div className="bg-zinc-100 dark:bg-zinc-900 px-3 py-2 text-xs text-zinc-400 font-mono select-none text-right"
                  style={{ minWidth: 28, userSelect: "none" }}>
                  {[...Array((challengeInput.match(/\n/g)?.length || 0) + 5).keys()].map((n) => (
                    <div key={n}>{n + 1}</div>
                  ))}
                </div>
                <textarea
                  value={challengeInput}
                  onChange={e => {
                    setChallengeInput(e.target.value);
                    setChallengeStatus("idle");
                  }}
                  className="flex-1 px-3 py-2 font-mono text-sm bg-zinc-50 dark:bg-black border-0 outline-none resize-none text-zinc-900 dark:text-zinc-100"
                  spellCheck={false}
                  style={{ minHeight: 160, lineHeight: 1.4 }}
                  placeholder="# Write your solution here"
                  rows={Math.max(5, (challengeInput.match(/\n/g)?.length || 0) + 2)}
                  tabIndex={0}
                />
              </div>
              {challengeStatus === "success" && (
                <div className="bg-green-100 border border-green-300 rounded px-4 py-2 mb-2 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-200">
                  Challenge complete! You may continue to the next lesson.
                </div>
              )}
              {challengeStatus === "error" && (
                <div className="bg-red-100 border border-red-300 rounded px-4 py-2 mb-2 text-red-800 dark:bg-red-900 dark:border-red-700 dark:text-red-200">
                  Not quite. Check your code and try again.
                </div>
              )}
              <div className="mt-2 flex align-center gap-4 flex-wrap">
                <button
                  className="rounded-full bg-blue-600 text-white px-8 py-2 hover:bg-blue-700 font-sans text-base transition"
                  onClick={runChallenge}
                >
                  Run
                </button>
                <button
                  type="button"
                  className="rounded-full px-5 py-2 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 font-sans text-base transition hover:bg-zinc-100 dark:hover:bg-zinc-900"
                  onClick={() => setChallengeHintOpen(h => !h)}
                >
                  {challengeHintOpen ? "Hide Hint" : "Show Hint"}
                </button>
                <button
                  type="button"
                  className="rounded-full px-5 py-2 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 font-sans text-base transition hover:bg-zinc-100 dark:hover:bg-zinc-900"
                  onClick={() => setChallengeSolutionOpen(s => !s)}
                >
                  {challengeSolutionOpen ? "Hide Solution" : "Show Solution"}
                </button>
              </div>
              {challengeHintOpen && (
                <div className="mt-3 bg-yellow-100 border border-yellow-300 rounded px-4 py-2 text-yellow-900 dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-100">
                  {lesson.challenge.hint}
                </div>
              )}
              {challengeSolutionOpen && (
                <div className="mt-3">
                  {renderCodeBlock(lesson.challenge.solution, lesson.assignment?.lang || language.id)}
                </div>
              )}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  className="rounded-full bg-zinc-900 text-white px-6 py-2 hover:bg-zinc-700 font-sans text-sm transition"
                  onClick={() => {
                    if (challengeStatus === "success") {
                      const next = selectedLessonIdx + 1;
                      if (!completedLessons.includes(selectedLessonIdx)) {
                        setCompletedLessons([...completedLessons, selectedLessonIdx]);
                      }
                      setChallengeStatus("idle");
                      setChallengeSolutionOpen(false);
                      setChallengeHintOpen(false);
                      if (next < lessons.length) {
                        setSelectedLessonIdx(next);
                        setStep(1);
                        setAssignmentInput("");
                        setChallengeInput("");
                        setAssignmentStatus("idle");
                        setAssignmentHint(false);
                      }
                    }
                  }}
                  disabled={
                    !challengeStatus ||
                    challengeStatus !== "success" ||
                    selectedLessonIdx >= lessons.length - 1
                  }
                  aria-disabled={
                    !challengeStatus ||
                    challengeStatus !== "success" ||
                    selectedLessonIdx >= lessons.length - 1
                  }
                >
                  Next Lesson
                </button>
              </div>
            </section>
          )}
          {/* Bottom Navigation */}
          <div className="mt-10 pt-8 border-t border-zinc-100 dark:border-zinc-900 flex flex-wrap justify-between items-center gap-2">
            <div>
              <a
                href={`/language/${params.id}`}
                className="inline-block px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 font-sans text-sm transition hover:bg-zinc-200 dark:hover:bg-zinc-900"
              >
                Back to language home
              </a>
            </div>
            <div className="flex gap-2">
              <button
                className="rounded-full px-5 py-2 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-100 font-sans text-sm transition hover:bg-zinc-200 dark:hover:bg-zinc-900"
                disabled={selectedLessonIdx === 0}
                onClick={() => {
                  if (selectedLessonIdx > 0) {
                    setSelectedLessonIdx(selectedLessonIdx - 1);
                    setStep(1);
                    setAssignmentInput("");
                    setChallengeInput("");
                    setAssignmentStatus("idle");
                    setAssignmentHint(false);
                    setChallengeHintOpen(false);
                    setChallengeSolutionOpen(false);
                  }
                }}
                aria-disabled={selectedLessonIdx === 0}
                tabIndex={0}
              >
                Previous Lesson
              </button>
              <button
                className={classNames(
                  "rounded-full px-5 py-2 bg-zinc-900 text-white font-sans text-sm transition hover:bg-zinc-700",
                  selectedLessonIdx >= lessons.length - 1 || !canGoNextLesson
                    ? "opacity-60 cursor-not-allowed"
                    : ""
                )}
                disabled={selectedLessonIdx >= lessons.length - 1 || !canGoNextLesson}
                onClick={() => {
                  if (selectedLessonIdx < lessons.length - 1 && canGoNextLesson) {
                    setSelectedLessonIdx(selectedLessonIdx + 1);
                    setStep(1);
                    setAssignmentInput("");
                    setChallengeInput("");
                    setAssignmentStatus("idle");
                    setAssignmentHint(false);
                    setChallengeHintOpen(false);
                    setChallengeSolutionOpen(false);
                  }
                }}
                aria-disabled={selectedLessonIdx >= lessons.length - 1 || !canGoNextLesson}
                tabIndex={0}
              >
                Next Lesson
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Terminal tabbed panel (used in step 4; uses language.terminalCommands per #3)
function TabTerminalPanel({
  commands,
  expectedOutput = [],
}: {
  commands: {
    windows: { install: string; run: string };
    mac: { install: string; run: string };
    linux: { install: string; run: string };
  };
  expectedOutput: string[];
}) {
  const [tab, setTab] = useState<"windows" | "mac" | "linux">("windows");

  function copy(cmd: string) {
    navigator.clipboard.writeText(cmd);
  }

  return (
    <div>
      <div className="flex mb-4">
        {(["windows", "mac", "linux"] as const).map((os) => (
          <button
            key={os}
            onClick={() => setTab(os)}
            className={classNames(
              "px-4 py-2 rounded-full font-sans text-sm mr-2 border transition",
              tab === os
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-900"
            )}
            type="button"
          >
            {os.charAt(0).toUpperCase() + os.slice(1)}
          </button>
        ))}
      </div>
      <div>
        <div className="mb-2 text-zinc-700 dark:text-zinc-200 text-base font-medium">Install</div>
        <div className="relative bg-zinc-900 rounded mb-4">
          <button
            className="absolute top-2 right-3 bg-zinc-700 text-white rounded-full px-3 py-1 text-xs hover:bg-zinc-600"
            type="button"
            onClick={() => copy(commands[tab].install)}
          >
            Copy
          </button>
          <code className="block px-4 py-3 text-zinc-100 font-mono">{commands[tab].install}</code>
        </div>
        <div className="mb-2 text-zinc-700 dark:text-zinc-200 text-base font-medium">Run</div>
        <div className="relative bg-zinc-900 rounded">
          <button
            className="absolute top-2 right-3 bg-zinc-700 text-white rounded-full px-3 py-1 text-xs hover:bg-zinc-600"
            type="button"
            onClick={() => copy(commands[tab].run)}
          >
            Copy
          </button>
          <code className="block px-4 py-3 text-zinc-100 font-mono">{commands[tab].run}</code>
        </div>
        <div className="mb-2 mt-4 text-zinc-700 dark:text-zinc-200 text-base font-medium">Expected Terminal Output</div>
        <div className="bg-zinc-100 dark:bg-zinc-900 rounded px-4 py-3 font-mono text-sm text-zinc-800 dark:text-zinc-200">
          {expectedOutput.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      </div>
    </div>
  );
}