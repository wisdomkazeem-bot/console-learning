"use client";

import { useState } from "react";

const lessons = [
  {
    id: 1,
    title: "Variables and Data Types",
    read: {
      explanation:
        "In Python, variables are used to store information that can be referenced and manipulated in a program. Data types specify the kind of value a variable holds.",
      keyTerms: [
        { term: "Variable", def: "A named storage for a value." },
        { term: "Data Type", def: "The classification of a value (e.g., int, str)." },
      ],
      example:
        `# Assigning a value to a variable
age = 25
name = "Alice"`
    },
    watch: {
      code: [
        'age = 25',
        'name = "Alice"',
        'print("My name is", name)',
        'print("I am", age, "years old")',
      ]
    },
    assignment: {
      prompt:
        "Write a Python function that takes two numbers and returns their sum.",
      expected: "15",
      exampleCall: "add(7, 8)"
    },
    terminal: {
      windows: {
        install: "py -m pip install python",
        run: "py lesson1.py"
      },
      mac: {
        install: "brew install python",
        run: "python3 lesson1.py"
      },
      linux: {
        install: "sudo apt-get install python3",
        run: "python3 lesson1.py"
      },
      expectedOutput: [
        "My name is Alice",
        "I am 25 years old"
      ]
    },
    challenge: {
      prompt:
        "Write a Python function that takes a list of numbers and returns the largest number.",
      hint: "Loop through the list and keep track of the max.",
      solution: [
        "def max_num(nums):",
        "    m = nums[0]",
        "    for n in nums[1:]:",
        "        if n > m:",
        "            m = n",
        "    return m"
      ]
    }
  },
  // You can add more lessons as needed...
];

function getLessonProgress(idx: number) {
  return {
    number: idx + 1,
    total: lessons.length,
    title: lessons[idx].title
  };
}

function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function LanguageLessonPage({
  params,
}: {
  params: { id: string }
}) {
  const [selectedLessonIdx, setSelectedLessonIdx] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [step, setStep] = useState(1); // 1=Read, 2=Watch, 3=Assignment, 4=Terminal, 5=Challenge
  const [assignmentInput, setAssignmentInput] = useState("");
  const [assignmentStatus, setAssignmentStatus] = useState<"idle" | "success" | "error">("idle");
  const [assignmentHint, setAssignmentHint] = useState(false);

  const [challengeInput, setChallengeInput] = useState("");
  const [challengeStatus, setChallengeStatus] = useState<"idle" | "success" | "error">("idle");
  const [challengeHintOpen, setChallengeHintOpen] = useState(false);
  const [challengeSolutionOpen, setChallengeSolutionOpen] = useState(false);

  const lesson = lessons[selectedLessonIdx];
  const progress = getLessonProgress(selectedLessonIdx);
  const languageName = params.id.charAt(0).toUpperCase() + params.id.slice(1);

  // Helper for code line numbers
  const renderCodeBlock = (lines: string[], lang: string = "python") => (
    <div className="relative bg-[#18181b] rounded-lg p-4 mt-2 text-sm font-mono text-zinc-100 overflow-x-auto">
      {/* Copy button */}
      <button
        className="absolute top-3 right-4 rounded-full bg-zinc-700 text-white px-3 py-1 text-xs transition hover:bg-zinc-600 font-sans"
        onClick={() => {
          navigator.clipboard.writeText(lines.join("\n"));
        }}
        aria-label="Copy code"
        tabIndex={0}
        type="button"
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

  // Assignment run logic (simulate)
  function runAssignment() {
    // For demo, just check if the code contains a def returning sum and add(7,8) returns 15
    let pass = false;
    try {
      // eslint-disable-next-line no-new-func
      const fn = new Function(assignmentInput + "\nreturn add(7,8);");
      const result = fn();
      pass = (String(result) === lesson.assignment.expected);
    } catch (err) {
      pass = false;
    }
    if (pass) {
      setAssignmentStatus("success");
      // Progress to next step after short delay
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
    // For demo, just check code includes return max, crude check for max_num
    let pass = false;
    if (
      challengeInput.includes("def max_num") &&
      (challengeInput.includes("for") || challengeInput.includes("max("))
    ) {
      pass = true;
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

  // Access management
  const isLessonUnlocked = (idx: number) => {
    // First lesson always unlocked; others only if all before are completed
    if (idx === 0) return true;
    return completedLessons.includes(idx - 1);
  };
  const canGoNextLesson = completedLessons.includes(selectedLessonIdx);

  return (
    <div className="font-sans bg-zinc-50 dark:bg-black min-h-screen">
      <div className="bg-white dark:bg-black shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
          {/* Top Bar */}
          <div>
            <span className="text-lg font-medium">{languageName}</span>
            <span className="mx-2 text-zinc-300 select-none">|</span>
            <span className="text-base font-normal">{progress.title}</span>
          </div>
          <div className="text-sm text-zinc-400 font-sans">
            Lesson {progress.number} of {progress.total}
          </div>
        </div>
      </div>
      <div className="max-w-3xl mx-auto flex gap-8 mt-8 px-4">
        {/* Left Panel (lessons list) */}
        <nav
          className="w-52 shrink-0 hidden md:block"
        >
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
                    current && unlocked && "bg-zinc-100 dark:bg-zinc-900 font-semibold text-black dark:text-zinc-100",
                    !current && unlocked && "hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400",
                    !unlocked && "text-zinc-400 dark:text-zinc-600 opacity-70 bg-transparent cursor-not-allowed"
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
                  <span className="mr-2 px-2 py-0.5 text-xs rounded-full border font-sans"
                        style={{
                          background: current ? "#a1a1aa" : "#fff",
                          color: current ? "#fff" : "#a1a1aa",
                          borderColor: current ? "#a1a1aa" : "#e4e4e7"
                        }}
                  >
                    {idx + 1}
                  </span>
                  <span className="flex-1">{l.title}</span>
                  {completed && (
                    <svg className="ml-2 text-green-500 w-4 h-4" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
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
        {/* Main Panel */}
        <div className="flex-1 min-w-0 bg-white dark:bg-black p-6 rounded-xl shadow-lg border border-zinc-100 dark:border-zinc-900 font-sans text-zinc-600 dark:text-zinc-400">
          {/* Step Progress Header */}
          <div className="mb-8 flex gap-3 items-center">
            <span className={classNames(
              "rounded-full px-3 py-1 text-xs font-medium bg-zinc-100 dark:bg-zinc-800",
              step === 1 && "ring-2 ring-blue-400"
            )}>Read</span>
            <span className={classNames(
              "rounded-full px-3 py-1 text-xs font-medium bg-zinc-100 dark:bg-zinc-800",
              step === 2 && "ring-2 ring-blue-400"
            )}>Watch</span>
            <span className={classNames(
              "rounded-full px-3 py-1 text-xs font-medium bg-zinc-100 dark:bg-zinc-800",
              step === 3 && "ring-2 ring-blue-400"
            )}>Assignment</span>
            <span className={classNames(
              "rounded-full px-3 py-1 text-xs font-medium bg-zinc-100 dark:bg-zinc-800",
              step === 4 && "ring-2 ring-blue-400"
            )}>Terminal</span>
            <span className={classNames(
              "rounded-full px-3 py-1 text-xs font-medium bg-zinc-100 dark:bg-zinc-800",
              step === 5 && "ring-2 ring-blue-400"
            )}>Challenge</span>
          </div>
          {/* Step panels */}
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
              {renderCodeBlock(lesson.watch.code)}
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
                Call example: <span className="font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">{lesson.assignment.exampleCall}</span>
                <div className="mt-1">Expected Output: <span className="font-mono font-semibold">{lesson.assignment.expected}</span></div>
              </div>
              {/* Code Editor with line numbers */}
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
                  placeholder="# Start typing your Python code here"
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
                  {assignmentHint && (
                    <div className="mt-2 text-sm text-zinc-700 dark:text-zinc-200">
                      Hint: Make sure your function is named <b>add</b>, and that it returns the sum of two inputs.
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
              <TabTerminalPanel lesson={lesson.terminal} />
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
              {/* Code Editor with line numbers */}
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
                  {renderCodeBlock(lesson.challenge.solution)}
                </div>
              )}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  className="rounded-full bg-zinc-900 text-white px-6 py-2 hover:bg-zinc-700 font-sans text-sm transition"
                  onClick={() => {
                    if (challengeStatus === "success") {
                      // Mark next lesson as unlocked
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
                      }
                    }
                  }}
                  disabled={!challengeStatus || challengeStatus !== "success" || selectedLessonIdx >= lessons.length - 1}
                  aria-disabled={!challengeStatus || challengeStatus !== "success" || selectedLessonIdx >= lessons.length - 1}
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
                  selectedLessonIdx >= lessons.length - 1 || !canGoNextLesson ? "opacity-60 cursor-not-allowed" : ""
                )}
                disabled={selectedLessonIdx >= lessons.length - 1 || !canGoNextLesson}
                onClick={() => {
                  if (selectedLessonIdx < lessons.length - 1 && canGoNextLesson) {
                    setSelectedLessonIdx(selectedLessonIdx + 1);
                    setStep(1);
                    setAssignmentInput("");
                    setChallengeInput("");
                    setAssignmentStatus("idle");
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

// Terminal panel component
function TabTerminalPanel({
  lesson,
}: {
  lesson: {
    windows: { install: string; run: string };
    mac: { install: string; run: string };
    linux: { install: string; run: string };
    expectedOutput: string[]
  }
}) {
  const [tab, setTab] = useState<"windows" | "mac" | "linux">("windows");
  const data = lesson[tab];
  const osName = { windows: "Windows", mac: "Mac", linux: "Linux" }[tab];

  // Utility
  function copy(cmd: string) {
    navigator.clipboard.writeText(cmd);
  }

  return (
    <div className="">
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
            {osName === "Mac" && os === tab
              ? "Mac"
              : os.charAt(0).toUpperCase() + os.slice(1)}
          </button>
        ))}
      </div>
      <div>
        <div className="mb-2 text-zinc-700 dark:text-zinc-200 text-base font-medium">Install Python</div>
        <div className="relative bg-zinc-900 rounded mb-4">
          <button
            className="absolute top-2 right-3 bg-zinc-700 text-white rounded-full px-3 py-1 text-xs hover:bg-zinc-600"
            type="button"
            onClick={() => copy(data.install)}
          >
            Copy
          </button>
          <code className="block px-4 py-3 text-zinc-100 font-mono">{data.install}</code>
        </div>
        <div className="mb-2 text-zinc-700 dark:text-zinc-200 text-base font-medium">Run Lesson</div>
        <div className="relative bg-zinc-900 rounded">
          <button
            className="absolute top-2 right-3 bg-zinc-700 text-white rounded-full px-3 py-1 text-xs hover:bg-zinc-600"
            type="button"
            onClick={() => copy(data.run)}
          >
            Copy
          </button>
          <code className="block px-4 py-3 text-zinc-100 font-mono">{data.run}</code>
        </div>
        <div className="mb-2 mt-4 text-zinc-700 dark:text-zinc-200 text-base font-medium">Expected Terminal Output</div>
        <div className="bg-zinc-100 dark:bg-zinc-900 rounded px-4 py-3 font-mono text-sm text-zinc-800 dark:text-zinc-200">
          {lesson.expectedOutput.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      </div>
    </div>
  );
}