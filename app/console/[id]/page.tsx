'use client';

import React, { useState } from 'react';
import consoles from '@/data/consoles.json';

// Lint: some next/navigation exports must be used as hooks, not as props
import { useParams } from 'next/navigation';

const TAB_OVERVIEW = 'Overview';
const TAB_CODE = 'Code Examples';
const TAB_RESOURCES = 'Resources';

const TABS = [TAB_OVERVIEW, TAB_CODE, TAB_RESOURCES];

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: 'bg-green-100 text-green-700 border-green-300',
  Intermediate: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  Advanced: 'bg-red-100 text-red-700 border-red-300',
};

const DIFFICULTY_DARK_COLORS: Record<string, string> = {
  Beginner: 'bg-green-900 text-green-200 border-green-800',
  Intermediate: 'bg-yellow-700 text-yellow-50 border-yellow-700',
  Advanced: 'bg-red-900 text-red-200 border-red-900',
};

function getDifficultyColor(difficulty: string, dark: boolean) {
  if (dark) {
    return DIFFICULTY_DARK_COLORS[difficulty] || DIFFICULTY_DARK_COLORS['Intermediate'];
  }
  return DIFFICULTY_COLORS[difficulty] || DIFFICULTY_COLORS['Intermediate'];
}

function getConsoleById(id: string) {
  return consoles.find((c: any) => c.id === id);
}

function HardwareTable({ specs }: { specs: Record<string, string> }) {
  return (
    <table className="w-full mt-2 border-separate border-spacing-y-1 text-left">
      <tbody>
        {Object.entries(specs).map(([k, v]) => (
          <tr key={k}>
            <th className="pr-4 text-zinc-900 dark:text-zinc-100 font-medium">{k}</th>
            <td className="text-zinc-600 dark:text-zinc-400">{v}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Simple syntax highlight for code (demo purposes)
function SimpleCodeBlock({ code }: { code: string }) {
  return (
    <pre className="rounded-xl mb-2 bg-zinc-900 text-zinc-50 text-sm px-4 py-3 font-mono overflow-x-auto">
      <code>{code}</code>
    </pre>
  );
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="ml-2 inline-flex items-center px-2.5 py-1 text-xs rounded-full bg-zinc-700 text-zinc-100 hover:bg-zinc-800 transition-colors"
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

function ExplanationToggle({
  explanation,
  code,
}: {
  explanation: string[];
  code: string;
}) {
  const [show, setShow] = React.useState(false);
  const lines = code.split('\n');
  return (
    <div>
      <button
        onClick={() => setShow((v) => !v)}
        className="mb-2 text-xs px-2.5 py-1 hover:bg-zinc-700 rounded-full transition-colors bg-zinc-800 text-zinc-100"
      >
        {show ? 'Hide Explanation' : 'Show Line-by-Line Explanation'}
      </button>
      {show && (
        <div className="mt-1 bg-zinc-800/70 rounded-xl text-zinc-300 text-sm divide-y divide-zinc-700">
          {lines.map((line, idx) => (
            <div key={idx} className="flex items-start px-4 py-1.5 gap-3">
              <div className="font-mono text-zinc-100 min-w-[36px]">{line}</div>
              <div className="flex-1">{explanation[idx] ?? ''}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ResourcesTab({ consoleObj }: { consoleObj: any }) {
  return (
    <div className="flex flex-col gap-7 w-full">
      <div className="mb-2">
        <span className="block mb-3 py-2 px-3 rounded-xl bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-200 font-medium text-sm">
          💡 Tip: Start with the YouTube videos before reading the docs!
        </span>
      </div>
      <div>
        <a
          href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
            consoleObj.youtubeQuery || consoleObj.name
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-medium shadow transition-colors"
        >
          <svg
            width={22}
            height={22}
            className="mr-2"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M21.8 8.001s-.2-1.398-.801-2.018c-.748-.802-1.587-.807-1.972-.854C16.202 5 12 5 12 5h-.014s-4.202 0-7.027.129c-.386.047-1.224.052-1.972.854C2.386 6.603 2.2 8.001 2.2 8.001S2 9.61 2 11.222v1.556C2 14.39 2.2 16 2.2 16s.2 1.398.801 2.018c.748.802 1.73.776 2.173.861C8.007 19 12 19 12 19s4.202 0 7.027-.121c.386-.047 1.224-.052 1.972-.854C21.614 17.397 21.8 16 21.8 16s.2-1.611.2-3.222v-1.556C22 9.61 21.8 8.001 21.8 8.001zM9.754 15.017v-6.034L15.273 12l-5.519 3.017z" />
          </svg>
          Search on YouTube
        </a>
      </div>
      <div className="flex flex-col gap-6">
        {(consoleObj.websites ?? []).map((site: any) => (
          <div
            key={site.url}
            className="rounded-xl bg-zinc-100 dark:bg-zinc-900 p-5 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col gap-3"
          >
            <div className="text-lg font-semibold text-zinc-800 dark:text-zinc-50">
              {site.title}
            </div>
            <div className="text-zinc-600 dark:text-zinc-400">{site.description}</div>
            <a
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-zinc-800 dark:text-zinc-100 underline font-medium hover:text-blue-600 transition"
            >
              Visit &rarr;
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  // Use system color scheme (dark/light)
  const [isDark, setIsDark] = React.useState(false);
  React.useEffect(() => {
    // SSR safe
    if (typeof window !== 'undefined') {
      setIsDark(window.matchMedia?.('(prefers-color-scheme: dark)').matches);
    }
  }, []);
  const bg =
    getDifficultyColor(
      difficulty,
      isDark
    ) +
    ' px-2.5 py-1 rounded-full text-xs border font-semibold inline-block ml-3 shadow-sm select-none';
  let label: string = difficulty;
  if (difficulty.toLowerCase() === 'beginner') label = 'Beginner';
  else if (difficulty.toLowerCase() === 'intermediate') label = 'Intermediate';
  else if (difficulty.toLowerCase() === 'advanced') label = 'Advanced';
  return <span className={bg}>{label}</span>;
}

function Page() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const consoleObj = getConsoleById(id || '');

  // Fallback UI if not found: just a blank page – no error.
  if (!consoleObj) {
    return (
      <div className="font-sans min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center" />
    );
  }

  const [tab, setTab] = useState<typeof TABS[number]>(TABS[0]);

  const showBeginnerBanner =
    (consoleObj.difficulty || '').toLowerCase() === 'beginner';

  return (
    <div className="font-sans min-h-screen bg-zinc-50 dark:bg-zinc-900 py-10 flex flex-col items-center">
      <div className="w-full max-w-2xl rounded-xl bg-white dark:bg-zinc-950 shadow p-8">

        {/* Beginner banner */}
        {showBeginnerBanner && (
          <div className="mb-4 rounded-xl bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-800 text-green-800 dark:text-green-100 px-4 py-2 font-semibold text-center shadow">
            <span role="img" aria-label="sparkles" className="mr-1">✨</span>
            This is a great starting point for new coders!
          </div>
        )}

        {/* Header */}
        <div className="flex gap-4 items-center mb-3">
          <span className="text-4xl">{consoleObj.emoji}</span>
          <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {consoleObj.name}
          </span>
          <DifficultyBadge difficulty={consoleObj.difficulty || 'Intermediate'} />
        </div>
        {/* Tab navigation */}
        <div className="flex gap-4 mb-6 border-b border-zinc-200 dark:border-zinc-800">
          {TABS.map((cur) => (
            <button
              key={cur}
              onClick={() => setTab(cur)}
              className={`text-base px-3 py-2 transition font-medium border-b-2 ${
                tab === cur
                  ? 'border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100'
                  : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              {cur}
            </button>
          ))}
        </div>

        {/* Tab Panels */}
        <div className="mt-4">
          {tab === TAB_OVERVIEW && (
            <div>
              <div className="mb-4">
                <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                  {consoleObj.description}
                </div>
                {consoleObj.funFact && (
                  <div className="italic text-zinc-600 dark:text-zinc-400 mb-2">
                    Fun Fact: {consoleObj.funFact}
                  </div>
                )}

                {/* Best For section */}
                {consoleObj.type && (
                  <div className="my-4">
                    <div className="font-medium text-zinc-900 dark:text-zinc-100 mb-1">
                      Best For
                    </div>
                    <div className="text-zinc-700 dark:text-zinc-300">
                      If you're a beginner, you'll learn <span className="font-semibold">{consoleObj.type}</span> programming with this console.
                    </div>
                  </div>
                )}

                {consoleObj.cpu && (
                  <div>
                    <span className="block font-semibold mt-4 text-zinc-900 dark:text-zinc-50">
                      Hardware Specs
                    </span>
                    {/* If cpu is a string, display as simple text. If it's an object, show hardware table. */}
                    {typeof consoleObj.cpu === 'string' || !consoleObj.cpu ? (
                      <div className="mt-2 text-zinc-700 dark:text-zinc-300">{consoleObj.cpu}</div>
                    ) : (
               
                      <HardwareTable specs={consoleObj.cpu} />
                    )}
                  </div>
                )}
           
              </div>
            </div>
          )}

          {tab === TAB_CODE && (
            <div className="flex flex-col gap-6">
              {(consoleObj.codingExamples ?? []).map(
                (ex: any, idx: number) => (
                  <div key={idx} className="rounded-xl bg-zinc-950 border border-zinc-800 p-5">
                    {/* Friendly intro message */}
                    <div className="mb-2">
                      <div className="flex items-center">
                        <span className="font-semibold text-zinc-100">
                          {ex.title || `Example ${idx + 1}`}
                        </span>
                        <CopyButton value={ex.code || ''} />
                      </div>
                      {ex.friendly ?? (
                        <div className="mt-1 text-zinc-300 dark:text-zinc-300 text-sm">
                          {ex.friendlyDescription ||
                            'Here is a simple example that shows what this code does, explained in everyday language.'}
                        </div>
                      )}
                      {/* Prefer ex.friendlyDescription if present; fallback to ex.friendly */}
                      {ex.friendlyDescription ? (
                        <div className="mt-1 text-zinc-300 dark:text-zinc-300 text-sm">
                          {ex.friendlyDescription}
                        </div>
                      ) : ex.friendly && (
                        <div className="mt-1 text-zinc-300 dark:text-zinc-300 text-sm">
                          {ex.friendly}
                        </div>
                      )}
                    </div>
                    <SimpleCodeBlock code={ex.code} />
                    {ex.explanation && ex.explanation.length > 0 && (
                      <ExplanationToggle
                        explanation={ex.explanation}
                        code={ex.code || ''}
                      />
                    )}
                  </div>
                )
              )}
            </div>
          )}

          {tab === TAB_RESOURCES && (
            <ResourcesTab consoleObj={consoleObj} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Page;