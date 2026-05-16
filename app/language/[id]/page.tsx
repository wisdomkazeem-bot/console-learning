"use client";

import { useState } from "react";
import languages from "../../../data/languages.json";

interface Term {
  term: string;
  definition: string;
}
interface Lesson {
  id: string;
  title: string;
  difficulty: string;
  explanation: string;
  keyTerms: Term[];
  codeExample: string[];
  expectedOutput: string;
  starterCode?: string;
  solution: string[];
  commonMistakes?: string[];
  challenge: string;
  challengeHint?: string;
  challengeSolution?: string[];
  terminalNote?: string;
}
interface Language {
  id: string;
  name: string;
  description: string;
  color: string;
  topics: Lesson[];
  difficulty?: string;
  creator?: string;
  usedFor?: string;
  funFact?: string;
  year?: number;
}

function getLanguageById(id: string): Language | undefined {
  return (languages as Language[]).find((l) => l.id === id);
}

const difficultyColor: Record<string, string> = {
  Beginner: "bg-green-500",
  Intermediate: "bg-yellow-500",
  Advanced: "bg-red-500",
};

function stepTitle(step: number) {
  switch (step) {
    case 1:
      return "Concept Overview";
    case 2:
      return "Key Terms";
    case 3:
      return "Example";
    case 4:
      return "Challenge";
    case 5:
      return "Solution";
    default:
      return "";
  }
}

function ProgressBar({ step }: { step: number }) {
  const percent = (step / 5) * 100;
  return (
    <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full my-8">
      <div
        className="h-full bg-zinc-900 dark:bg-zinc-50 rounded-full transition-all duration-200"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

function CodeBlockWithToolbar({
  codeLines,
  language,
}: {
  codeLines: string[];
  language?: string;
}) {
  const codeString = codeLines.join("\n");
  const [copied, setCopied] = useState(false);
  async function handleCopy() {
    await navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div className="relative rounded-xl bg-zinc-900 text-zinc-50 text-sm font-mono overflow-x-auto mb-4 border border-zinc-800">
      <div className="flex justify-between items-center px-4 pt-3 pb-1">
        <span className="uppercase text-xs tracking-wider text-zinc-400 select-none">
          {language ?? "Code"}
        </span>
        <button
          className="rounded-full px-3 py-1 text-xs bg-zinc-700 hover:bg-zinc-600 text-white focus:outline-none"
          onClick={handleCopy}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="flex w-full px-4 pb-4 overflow-x-auto">
        <code className="w-full flex flex-col">
          {codeLines.map((line, i) => (
            <span key={i} className="flex">
              <span className="select-none text-zinc-500 pr-4 text-right w-10">{i + 1}</span>
              <span>{line}</span>
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}

export default function Page({ params }: { params: { id: string } }) {
  const language = getLanguageById(params.id);

  const [step, setStep] = useState(1);
  const [topicIndex, setTopicIndex] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [userAnswer, setUserAnswer] = useState<string>("");

  if (!language) {
    return (
      <div className="font-sans bg-zinc-50 dark:bg-black min-h-screen px-4 py-32 flex flex-col items-center">
        <div className="max-w-3xl w-full mx-auto rounded-xl bg-white dark:bg-black border border-zinc-100 dark:border-zinc-900 p-16">
          <h1 className="text-3xl font-bold text-black dark:text-zinc-50 mb-4 font-sans">Language not found</h1>
          <a
            href="/"
            className="inline-block mt-6 text-zinc-700 dark:text-zinc-200 underline"
          >
            Return to homepage
          </a>
        </div>
      </div>
    );
  }

  const lesson = language.topics[topicIndex];
  const totalSteps = 5;

  function nextStep() {
    if (step < totalSteps) {
      setStep(step + 1);
      setShowSolution(false);
    }
  }
  function prevStep() {
    if (step > 1) {
      setStep(step - 1);
      setShowSolution(false);
    }
  }
  function nextTopic() {
    if (language && topicIndex < language.topics.length - 1) {
      setTopicIndex(topicIndex + 1);
      setStep(1);
      setShowSolution(false);
      setUserAnswer("");
    }
  }
  function prevTopic() {
    if (language && topicIndex > 0) {
      setTopicIndex(topicIndex - 1);
      setStep(1);
      setShowSolution(false);
      setUserAnswer("");
    }
  }

  function gotoTopic(idx: number) {
    setTopicIndex(idx);
    setStep(1);
    setShowSolution(false);
    setUserAnswer("");
  }

  return (
    <div className="font-sans bg-zinc-50 dark:bg-black min-h-screen min-w-full">
      <div className="flex flex-row max-w-3xl mx-auto px-4 py-32 gap-10">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-56 mr-5 pr-4 border-r border-zinc-100 dark:border-zinc-900">
          <div className="mb-7">
            <h2 className="text-lg font-bold mb-2 text-black dark:text-zinc-50 font-sans tracking-tight">
              Topics
            </h2>
            <ul>
              {language.topics.map((topic, idx) => (
                <li key={topic.id} className="mb-1">
                  <button
                    onClick={() => gotoTopic(idx)}
                    className={`w-full text-left px-4 py-2 rounded-full font-medium transition-colors
                      ${idx === topicIndex
                        ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-black"
                        : "hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400"}
                    `}
                  >
                    {topic.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="w-full max-w-2xl mx-auto">
          <div className="mb-6">
            <span
              className="inline-block w-3 h-3 rounded-full mr-2 align-middle"
              style={{ backgroundColor: language.color }}
            />
            <span className="text-lg font-sans font-bold text-black dark:text-zinc-50">{language.name}</span>
            <span className="mx-2 text-zinc-400">/</span>
            <span className="text-lg font-sans font-semibold text-zinc-900 dark:text-zinc-50">
              {lesson.title}
            </span>
            <span className={`ml-3 align-middle px-2 py-1 text-xs font-bold rounded-full ${difficultyColor[lesson.difficulty] || "bg-zinc-400"} text-white`}
              >
              {lesson.difficulty}
            </span>
          </div>

          <ProgressBar step={step} />
          <div className="flex items-center mb-8">
            <button
              onClick={prevTopic}
              disabled={topicIndex === 0}
              className={`rounded-full px-6 py-2 font-medium mr-2 ${
                topicIndex === 0
                  ? "bg-zinc-200 text-zinc-400 cursor-not-allowed"
                  : "bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
              }`}
            >
              Previous Topic
            </button>
            <span className="mx-2 text-sm text-zinc-500">
              {topicIndex + 1} of {language.topics.length}
            </span>
            <button
              onClick={nextTopic}
              disabled={topicIndex === language.topics.length - 1}
              className={`rounded-full px-6 py-2 font-medium ml-2 ${
                topicIndex === language.topics.length - 1
                  ? "bg-zinc-200 text-zinc-400 cursor-not-allowed"
                  : "bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
              }`}
            >
              Next Topic
            </button>
          </div>

          <div className="bg-white dark:bg-black border border-zinc-100 dark:border-zinc-900 rounded-xl px-8 py-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-2 text-black dark:text-zinc-50 font-sans">
              {stepTitle(step)}
            </h2>
            {lesson.terminalNote && (
              <div className="mb-2 text-sm text-zinc-500 dark:text-zinc-400 font-mono">
                <span className="font-semibold">Terminal:</span>{" "}
                {lesson.terminalNote}
              </div>
            )}

            {/* STEP 1: Concept Overview */}
            {step === 1 && (
              <div className="text-base text-zinc-600 dark:text-zinc-400 mt-4">
                {lesson.explanation}
              </div>
            )}

            {/* STEP 2: Key Terms */}
            {step === 2 && lesson.keyTerms && (
              <ul className="list-disc ml-6 mt-4 space-y-2 text-zinc-600 dark:text-zinc-400">
                {lesson.keyTerms.map((kt) => (
                  <li key={kt.term}>
                    <span className="font-semibold text-black dark:text-zinc-50">{kt.term}</span>: {kt.definition}
                  </li>
                ))}
              </ul>
            )}

            {/* STEP 3: Example */}
            {step === 3 && (
              <div className="mt-4">
                {lesson.codeExample.length > 0 && (
                  <>
                    <div className="mb-2 text-zinc-600 dark:text-zinc-400 font-medium">
                      Example:
                    </div>
                    <CodeBlockWithToolbar
                      codeLines={lesson.codeExample}
                      language={language.name}
                    />
                  </>
                )}
                {lesson.expectedOutput && (
                  <div className="mb-1 mt-3">
                    <span className="font-semibold text-zinc-700 dark:text-zinc-200">
                      Output:
                    </span>
                    <pre className="inline-block bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-900 px-2 py-1 rounded-md ml-2 text-sm text-zinc-800 dark:text-zinc-200 font-mono">
                      {lesson.expectedOutput}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* STEP 4: Challenge */}
            {step === 4 && (
              <div className="mt-4">
                <div className="mb-2">
                  <span className="font-semibold text-black dark:text-zinc-50">
                    Challenge:
                  </span>{" "}
                  {lesson.challenge}
                </div>
                {lesson.challengeHint && (
                  <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">
                    <span className="font-semibold">Hint:</span> {lesson.challengeHint}
                  </div>
                )}
                <div className="mt-6">
                  <label className="block font-medium mb-1 text-zinc-800 dark:text-zinc-100">
                    Your Answer:
                  </label>
                  <textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    rows={4}
                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-800 dark:focus:ring-zinc-200 px-4 py-2 font-mono text-sm resize-y text-black dark:text-zinc-100"
                    placeholder="Type your code here..."
                  />
                </div>
              </div>
            )}

            {/* STEP 5: Solution */}
            {step === 5 && (
              <div className="mt-4">
                <button
                  onClick={() => setShowSolution(!showSolution)}
                  className="rounded-full px-5 py-2 font-semibold bg-zinc-900 text-white dark:bg-zinc-50 dark:text-black hover:bg-zinc-700 dark:hover:bg-zinc-200 mb-6"
                >
                  {showSolution ? "Hide Solution" : "Show Solution"}
                </button>
                {showSolution && lesson.challengeSolution && lesson.challengeSolution.length > 0 && (
                  <CodeBlockWithToolbar
                    codeLines={lesson.challengeSolution}
                    language={language.name}
                  />
                )}
                {!lesson.challengeSolution && (
                  <div className="text-zinc-500 dark:text-zinc-400">
                    No solution available for this challenge.
                  </div>
                )}
              </div>
            )}

            {/* Step Navigation */}
            <div className="mt-12 flex flex-row items-center justify-between">
              <button
                onClick={prevStep}
                disabled={step === 1}
                className={`rounded-full px-7 py-2 font-semibold transition-colors
                  ${step === 1
                    ? "bg-zinc-200 text-zinc-400 cursor-not-allowed"
                    : "bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"}`}
              >
                Previous
              </button>
              <span className="text-sm text-zinc-400">Step {step} of {totalSteps}</span>
              <button
                onClick={nextStep}
                disabled={step === totalSteps}
                className={`rounded-full px-7 py-2 font-semibold transition-colors
                  ${step === totalSteps
                    ? "bg-zinc-200 text-zinc-400 cursor-not-allowed"
                    : "bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"}`}
              >
                Next
              </button>
            </div>
          </div>

          {/* Common Mistakes */}
          {lesson.commonMistakes && lesson.commonMistakes.length > 0 && (
            <div className="mt-8 bg-yellow-50 dark:bg-zinc-900 border border-yellow-200 dark:border-zinc-800 rounded-xl px-6 py-5">
              <div className="font-bold text-yellow-900 dark:text-yellow-300 mb-2">
                Common Mistakes:
              </div>
              <ul className="list-disc ml-6 text-yellow-800 dark:text-yellow-300 space-y-1 text-[15px]">
                {lesson.commonMistakes.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}