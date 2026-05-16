"use client";

import React, { useState, useMemo } from "react";
import consoles from "@/data/consoles.json";
import { useParams } from "next/navigation";

// --- Tab Names ---
const TAB_OVERVIEW = "Overview";
const TAB_CODE = "Code Examples";
const TAB_RESOURCES = "Resources";
const TABS = [TAB_OVERVIEW, TAB_CODE, TAB_RESOURCES];

// --- Difficulty Styling ---
const DIFFICULTY_BADGES: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  Beginner: {
    bg: "bg-green-500",
    text: "text-white",
    border: "border-green-400",
  },
  Intermediate: {
    bg: "bg-yellow-400",
    text: "text-black",
    border: "border-yellow-500",
  },
  Advanced: {
    bg: "bg-red-500",
    text: "text-white",
    border: "border-red-400",
  },
};

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const { bg, text, border } =
    DIFFICULTY_BADGES[difficulty] ||
    DIFFICULTY_BADGES["Intermediate"];
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-bold shadow border ${bg} ${text} ${border}`}
      title={"Difficulty: " + difficulty}
    >
      {difficulty}
    </span>
  );
}

// --- Copy Button ---
function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  }

  return (
    <button
      className="ml-2 px-2 py-0.5 rounded text-zinc-400 bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-xs transition"
      onClick={handleCopy}
      title="Copy code"
      type="button"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

// --- Simple Code Block ---
function SimpleCodeBlock({ code }: { code: string }) {
  return (
    <pre className="bg-zinc-100 dark:bg-black text-zinc-800 dark:text-zinc-100 rounded-xl p-4 text-sm overflow-x-auto font-mono border border-zinc-200 dark:border-zinc-800 mt-2 mb-2 whitespace-pre">
      <code>{code}</code>
    </pre>
  );
}

// --- Explanation Toggle ---
function ExplanationToggle({
  explanation,
  code,
}: {
  explanation: string[] | undefined;
  code: string;
}) {
  const [show, setShow] = useState(false);
  if (!explanation) return null;
  return (
    <div className="mt-2">
      <button
        className="text-green-600 dark:text-green-400 hover:underline text-sm font-medium"
        onClick={() => setShow((s) => !s)}
        type="button"
      >
        {show ? "Hide explanation" : "Show line by line explanation"}
      </button>
      {show && (
        <ul className="bg-zinc-50 dark:bg-black text-zinc-800 dark:text-zinc-200 rounded-lg mt-2 p-3 text-sm list-disc list-inside border border-zinc-200 dark:border-zinc-800">
          {explanation.map((line, idx) => (
            <li key={idx} className="mb-1 last:mb-0">{line}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

// --- Hardware Table ---
function HardwareTable({ specs }: { specs: Record<string, string> }) {
  return (
    <table className="w-full mt-2 border-separate border-spacing-y-1 text-left">
      <tbody>
        {Object.entries(specs).map(([k, v]) => (
          <tr key={k}>
            <th className="pr-4 text-zinc-900 dark:text-zinc-100 font-medium">
              {k}
            </th>
            <td className="text-zinc-700 dark:text-zinc-400">{v}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// --- Best Language For Beginners Helper ---
function BestLanguageTips({ consoleObj }: { consoleObj: any }) {
  if (!consoleObj.language) return null;
  return (
    <div className="my-4">
      <div className="font-medium text-zinc-900 dark:text-zinc-100 mb-1">
        Beginner Tip
      </div>
      <div className="text-zinc-700 dark:text-zinc-300 text-sm">
        You will learn{" "}
        <span className="font-semibold">{consoleObj.language}</span>{" "}
        programming with this console!
      </div>
    </div>
  );
}

// --- Website Cards ---
function ResourceCard({
  title,
  url,
  desc,
}: {
  title: string;
  url: string;
  desc?: string;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-zinc-50 dark:bg-black rounded-xl px-5 py-4 transition hover:shadow-md border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium mb-3"
    >
      <div className="font-semibold">{title}</div>
      {desc && <div className="text-zinc-400 text-sm mt-1">{desc}</div>}
      <div className="mt-2 text-green-700 dark:text-green-400 text-xs">Visit Website</div>
    </a>
  );
}

// --- Resources Tab ---
function ResourcesTab({ consoleObj }: { consoleObj: any }) {
  // guess best terms for search
  const ytQuery = encodeURIComponent(
    [consoleObj.name, consoleObj.language, "tutorial"].filter(Boolean).join(" ")
  );
  const ytUrl = `https://www.youtube.com/results?search_query=${ytQuery}`;

  const websites: Array<{ title: string; url: string; desc?: string }> =
    (consoleObj.resources && Array.isArray(consoleObj.resources)
      ? consoleObj.resources
      : []) as any;

  return (
    <div className="flex flex-col gap-5">
      <a
        href={ytUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-fit items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg px-5 py-2 text-base transition mb-4"
      >
        <svg
          height="1.25em"
          viewBox="0 0 24 24"
          fill="none"
          className="inline -ml-1"
        >
          <circle cx="12" cy="12" r="12" fill="currentColor" />
          <polygon
            fill="#fff"
            points="10,8 16,12 10,16"
          />
        </svg>
        YouTube Tutorials
      </a>
      <div>
        {websites && websites.length > 0 ? (
          websites.map((r, idx) => (
            <ResourceCard
              key={idx}
              title={r.title}
              url={r.url}
              desc={r.desc}
            />
          ))
        ) : (
          <div className="text-zinc-400 text-sm mt-4">No official resources available.</div>
        )}
      </div>
    </div>
  );
}

// --- Main Page ---
export default function ConsoleDetailPage() {
  const params = useParams();
  const id = typeof params?.id === "string"
    ? params.id
    : Array.isArray(params?.id) && params.id.length > 0
    ? params.id[0]
    : "";

  const consoleObj = useMemo(
    () =>
      (consoles as any[]).find(
        (c) => String(c.id).toLowerCase() === String(id).toLowerCase()
      ) ?? ({}),
    [id]
  );

  const [tab, setTab] = useState(TAB_OVERVIEW);

  // No 404 errors, just blank if not found
  if (!consoleObj || !consoleObj.id) {
    return <main className="min-h-screen bg-zinc-50 dark:bg-black" />;
  }

  return (
    <main
      className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 font-sans"
      style={{
        fontFamily: "var(--font-geist, Geist, Inter, ui-sans-serif, sans-serif)",
      }}
    >
      <div className="flex flex-col items-center pt-8">
        {/* Banner for Beginner */}
        {consoleObj.difficulty === "Beginner" && (
          <div className="mb-8 w-full max-w-2xl">
            <div className="flex items-center justify-between bg-green-600 rounded-xl px-6 py-5 shadow-md">
              <span className="text-lg font-bold text-white flex items-center gap-2">
                🍀 Great starting point for beginners!
              </span>
              <DifficultyBadge difficulty={consoleObj.difficulty} />
            </div>
          </div>
        )}
        {/* Title Row */}
        <div className="w-full max-w-2xl mb-2 flex items-center gap-4">
          <span className="text-4xl mr-2">{consoleObj.emoji}</span>
          <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100 font-sans mr-4" style={{ fontFamily: "var(--font-geist, Geist, Inter, ui-sans-serif, sans-serif)" }}>{consoleObj.name}</h1>
          {consoleObj.difficulty && (
            <DifficultyBadge difficulty={consoleObj.difficulty} />
          )}
        </div>
        {/* Metadata row */}
        <div className="w-full max-w-2xl flex flex-wrap gap-4 items-center mb-6 text-zinc-500 dark:text-zinc-400 text-sm">
          <span>
            <span className="font-medium text-zinc-700 dark:text-zinc-300">Type:</span> {consoleObj.type}
          </span>
          <span>
            <span className="font-medium text-zinc-700 dark:text-zinc-300">Year:</span> {consoleObj.year}
          </span>
          <span>
            <span className="font-medium text-zinc-700 dark:text-zinc-300">CPU:</span> {typeof consoleObj.cpu === "string" ? consoleObj.cpu : Object.values(consoleObj.cpu ?? {}).join(", ")}
          </span>
          <span>
            <span className="font-medium text-zinc-700 dark:text-zinc-300">RAM:</span> {consoleObj.ram}
          </span>
        </div>
        {/* Tabs */}
        <div className="w-full max-w-2xl mb-2">
          <div className="flex space-x-1 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900">
            {TABS.map((t) => (
              <button
                key={t}
                className={`flex-1 px-4 py-2 md:px-5 rounded-none font-semibold text-base transition ${
                  tab === t
                    ? "bg-white dark:bg-black text-green-600 dark:text-green-400 shadow-sm"
                    : "bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                }`}
                onClick={() => setTab(t)}
                type="button"
                style={{ fontFamily: "inherit" }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        {/* Panel Content */}
        <section className="w-full max-w-2xl bg-white dark:bg-black rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-md p-7 min-h-[340px] mb-16 mt-2">
          {tab === TAB_OVERVIEW && (
            <div>
              <div className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {consoleObj.description}
              </div>
              {consoleObj.funFact && (
                <div className="italic text-zinc-500 dark:text-zinc-400 mb-3">
                  Fun Fact: {consoleObj.funFact}
                </div>
              )}
              <BestLanguageTips consoleObj={consoleObj} />
              {consoleObj.cpu && (
                <div>
                  <span className="block font-semibold mt-4 text-zinc-900 dark:text-zinc-50">
                    Hardware Specs
                  </span>
                  {typeof consoleObj.cpu === "string" || !consoleObj.cpu ? (
                    <div className="mt-2 text-zinc-700 dark:text-zinc-300">
                      {consoleObj.cpu}
                    </div>
                  ) : (
                    <HardwareTable specs={consoleObj.cpu} />
                  )}
                </div>
              )}
            </div>
          )}
          {tab === TAB_CODE && (
            <div className="flex flex-col gap-6">
              {(consoleObj.codingExamples ?? []).length === 0 && (
                <div className="text-zinc-500 text-base">
                  No beginner coding examples available.
                </div>
              )}
              {(consoleObj.codingExamples ?? []).map((ex: any, idx: number) => (
                <div
                  key={idx}
                  className="rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 p-5 mb-2"
                >
                  <div className="mb-2">
                    <div className="flex items-center">
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {ex.title || `Example ${idx + 1}`}
                      </span>
                      <CopyButton value={ex.code || ""} />
                    </div>
                    <div className="mt-1 text-zinc-700 dark:text-zinc-300 text-sm">
                      {ex.friendlyDescription
                        ? ex.friendlyDescription
                        : ex.friendly
                        ? ex.friendly
                        : "This code shows an example of what you can make as a beginner with this console."}
                    </div>
                  </div>
                  <SimpleCodeBlock code={ex.code} />
                  {ex.explanation && ex.explanation.length > 0 && (
                    <ExplanationToggle
                      explanation={ex.explanation}
                      code={ex.code || ""}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
          {tab === TAB_RESOURCES && (
            <ResourcesTab consoleObj={consoleObj} />
          )}
        </section>
      </div>
    </main>
  );
}