"use client";

import { useState, useMemo, use } from "react";
import Link from "next/link";
import consoles from "@/data/consoles.json";
import CodeViewer from "@/components/CodeViewer";
import ResourceCard from "@/components/ResourceCard";
import { DIFFICULTY_COLORS, TYPE_COLORS } from "@/lib/types";
import type { Console } from "@/lib/types";

const allConsoles = consoles as Console[];

type Tab = "overview" | "examples" | "resources";

export default function ConsoleDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const { id } = params;

  const consoleData = allConsoles.find((c) => c.id.toLowerCase() === id.toLowerCase());

  const [tab, setTab] = useState<Tab>("overview");
  const [selectedLang, setSelectedLang] = useState<string>("");
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const languageList = useMemo(() => {
    if (!consoleData?.codingExamples) return [];
    return [...new Set(consoleData.codingExamples.map((e) => e.language))];
  }, [consoleData]);

  const activeLang =
    selectedLang && languageList.includes(selectedLang)
      ? selectedLang
      : (languageList[0] ?? "");

  const filteredExamples = useMemo(() => {
    if (!activeLang || !consoleData) return [];
    return consoleData.codingExamples.filter((e) => e.language === activeLang);
  }, [activeLang, consoleData]);

  if (!consoleData) {
    return (
      <div className="min-h-screen bg-retro-bg flex items-center justify-center px-4">
        <div className="pixel-card max-w-md w-full text-center">
          <h1 className="font-pixel text-sm text-retro-red mb-4">NOT FOUND</h1>
          <p className="text-sm text-retro-muted mb-6">
            Console &ldquo;{id}&rdquo; doesn&apos;t exist in our database.
          </p>
          <Link href="/" className="pixel-btn inline-block">
            BACK HOME
          </Link>
        </div>
      </div>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: "OVERVIEW" },
    { key: "examples", label: "CODE" },
    { key: "resources", label: "RESOURCES" },
  ];

  return (
    <div className="min-h-screen bg-retro-bg">
      {/* Nav */}
      <nav className="border-b-[3px] border-retro-border bg-retro-surface">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link
            href="/"
            className="pixel-btn-sm text-[7px] font-pixel text-retro-muted hover:text-retro-cyan"
          >
            ← HOME
          </Link>
          <span className="text-retro-border">|</span>
          <Link
            href="/languages"
            className="pixel-btn-sm text-[7px] font-pixel text-retro-muted hover:text-retro-green"
          >
            LESSONS
          </Link>
          <span className="text-retro-border">|</span>
          <span className="font-pixel text-[8px] text-retro-cyan truncate">
            {consoleData.name}
          </span>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Beginner banner */}
        {consoleData.difficulty === "Beginner" && (
          <div className="pixel-border bg-retro-green/10 border-retro-green p-4 mb-6 flex items-center gap-3">
            <span className="text-2xl" aria-hidden="true">🌱</span>
            <p className="font-pixel text-[8px] text-retro-green leading-relaxed">
              GREAT FOR BEGINNERS — START HERE IF YOU&apos;RE NEW TO CODING
            </p>
          </div>
        )}

        {/* Header card */}
        <div className="pixel-card mb-6">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="font-pixel text-sm sm:text-base text-retro-cyan leading-relaxed mb-3">
                {consoleData.name}
              </h1>
              <div className="flex flex-wrap gap-2">
                <span
                  className={`font-pixel text-[7px] px-2 py-1 ${
                    DIFFICULTY_COLORS[consoleData.difficulty] ?? ""
                  }`}
                >
                  {consoleData.difficulty.toUpperCase()}
                </span>
                <span className={`pixel-tag text-[7px] ${TYPE_COLORS[consoleData.type]}`}>
                  {consoleData.type.toUpperCase()}
                </span>
                <span className="pixel-tag text-[7px] border-retro-muted text-retro-muted">
                  {consoleData.year}
                </span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 border-t-2 border-retro-border pt-4">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`pixel-btn-sm text-[8px] font-pixel ${
                  tab === t.key ? "pixel-btn-active" : ""
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        {tab === "overview" && (
          <div className="space-y-6">
            <div className="pixel-card">
              <h2 className="font-pixel text-[9px] text-retro-yellow mb-3">ABOUT</h2>
              <p className="text-sm text-retro-text leading-relaxed">{consoleData.description}</p>
            </div>

            {consoleData.funFact && (
              <div className="pixel-border border-retro-purple bg-retro-purple/5 p-4">
                <p className="font-pixel text-[8px] text-retro-purple mb-2">FUN FACT</p>
                <p className="text-sm text-retro-muted leading-relaxed">{consoleData.funFact}</p>
              </div>
            )}

            <div className="pixel-card">
              <h2 className="font-pixel text-[9px] text-retro-yellow mb-4">SPECS</h2>
              <dl className="space-y-3 text-sm">
                <div className="flex gap-4">
                  <dt className="font-pixel text-[7px] text-retro-cyan w-16 flex-shrink-0">CPU</dt>
                  <dd className="text-retro-muted">{consoleData.cpu}</dd>
                </div>
                <div className="flex gap-4">
                  <dt className="font-pixel text-[7px] text-retro-cyan w-16 flex-shrink-0">RAM</dt>
                  <dd className="text-retro-muted">{consoleData.ram}</dd>
                </div>
              </dl>
            </div>

            {consoleData.languages && consoleData.languages.length > 0 && (
              <div className="pixel-card">
                <h2 className="font-pixel text-[9px] text-retro-yellow mb-3">LANGUAGES</h2>
                <div className="flex flex-wrap gap-2">
                  {consoleData.languages.map((lang) => (
                    <span
                      key={lang}
                      className="pixel-tag text-[7px] border-retro-green text-retro-green"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "examples" && (
          <div className="space-y-6">
            {/* Language filter */}
            {languageList.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {languageList.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLang(lang)}
                    className={`pixel-btn-sm text-[8px] font-pixel ${
                      activeLang === lang ? "pixel-btn-active" : ""
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
            )}

            {filteredExamples.length > 0 ? (
              filteredExamples.map((ex, idx) => (
                <div key={idx} className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-pixel text-[9px] text-retro-cyan">{ex.title}</h3>
                    {ex.realWorldUse && (
                      <span className="pixel-tag text-[7px] border-retro-muted text-retro-muted">
                        {ex.realWorldUse}
                      </span>
                    )}
                  </div>

                  <CodeViewer code={ex.code} language={ex.language} title={ex.title} />

                  {ex.beginnerExplanation && (
                    <div className="pixel-border border-retro-green bg-retro-green/5 p-4">
                      <p className="font-pixel text-[8px] text-retro-green mb-2">
                        FOR BEGINNERS
                      </p>
                      <p className="text-sm text-retro-muted leading-relaxed">
                        {ex.beginnerExplanation}
                      </p>
                    </div>
                  )}

                  {ex.explanation && ex.explanation.length > 0 && (
                    <div>
                      <button
                        onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
                        className="pixel-btn-sm text-[7px] font-pixel mb-3"
                      >
                        {expandedIdx === idx ? "HIDE LINE-BY-LINE ▲" : "SHOW LINE-BY-LINE ▼"}
                      </button>
                      {expandedIdx === idx && (
                        <ol className="space-y-2 pl-1">
                          {ex.explanation.map((line, i) => (
                            <li key={i} className="flex gap-3 text-xs text-retro-muted">
                              <span className="font-pixel text-[7px] text-retro-yellow flex-shrink-0">
                                {String(i + 1).padStart(2, "0")}
                              </span>
                              <span className="leading-relaxed">{line}</span>
                            </li>
                          ))}
                        </ol>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="pixel-card text-center py-8">
                <p className="text-sm text-retro-muted">No code examples for this language.</p>
              </div>
            )}
          </div>
        )}

        {tab === "resources" && (
          <div className="space-y-6">
            {consoleData.resources?.youtubeQuery && (
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                  consoleData.resources.youtubeQuery
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="pixel-card flex items-center gap-4 group hover:border-retro-red transition-colors block"
              >
                <span className="text-3xl" aria-hidden="true">▶️</span>
                <div>
                  <h3 className="font-pixel text-[9px] text-retro-red group-hover:text-retro-yellow transition-colors mb-1">
                    YOUTUBE TUTORIALS
                  </h3>
                  <p className="text-xs text-retro-muted">
                    Search: &ldquo;{consoleData.resources.youtubeQuery}&rdquo;
                  </p>
                </div>
              </a>
            )}

            {consoleData.resources?.websites && consoleData.resources.websites.length > 0 && (
              <div>
                <h2 className="font-pixel text-[9px] text-retro-yellow mb-4">WEBSITES</h2>
                <div className="grid gap-4">
                  {consoleData.resources.websites.map((site, idx) => (
                    <ResourceCard
                      key={site.url + idx}
                      title={site.title}
                      url={site.url}
                      description={site.description}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
