import Link from "next/link";
import languagesData from "@/data/languages.json";
import LanguageCard from "@/components/LanguageCard";
import type { Language } from "@/lib/language-types";

const languages = languagesData as Language[];

const DIFFICULTY_ORDER = ["Beginner", "Intermediate", "Advanced"] as const;

export default function LanguagesPage() {
  const totalLessons = languages.reduce((sum, lang) => sum + lang.topics.length, 0);
  const beginnerLangs = languages.filter((l) => l.difficulty === "Beginner").length;

  return (
    <div className="min-h-screen bg-retro-bg">
      <header className="border-b-[3px] border-retro-border bg-retro-surface">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <nav className="flex flex-wrap items-center gap-3 mb-6 text-xs">
            <Link
              href="/"
              className="font-pixel text-[8px] text-retro-muted hover:text-retro-cyan transition-colors"
            >
              ← HOME
            </Link>
            <span className="text-retro-border">/</span>
            <span className="font-pixel text-[8px] text-retro-cyan">LANGUAGES</span>
          </nav>

          <p className="font-pixel text-[8px] text-retro-green mb-3 tracking-wider">
            INTERACTIVE TUTORIALS
          </p>
          <h1 className="font-pixel text-lg sm:text-xl text-retro-cyan leading-relaxed mb-3">
            LANGUAGE LESSONS
          </h1>
          <p className="text-sm text-retro-muted max-w-2xl leading-relaxed">
            Step-by-step courses for {languages.length} programming languages. Each language has{" "}
            {languages[0]?.topics.length ?? 10} topics — from variables to advanced concepts —
            with explanations, examples, and coding challenges.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-wrap gap-4 mb-10">
          <div className="pixel-tag border-retro-cyan text-retro-cyan text-[8px] font-pixel px-3 py-2">
            {languages.length} LANGUAGES
          </div>
          <div className="pixel-tag border-retro-green text-retro-green text-[8px] font-pixel px-3 py-2">
            {totalLessons} LESSONS
          </div>
          <div className="pixel-tag border-retro-yellow text-retro-yellow text-[8px] font-pixel px-3 py-2">
            {beginnerLangs} BEGINNER FRIENDLY
          </div>
        </div>

        {DIFFICULTY_ORDER.map((difficulty) => {
          const group = languages.filter((l) => l.difficulty === difficulty);
          if (group.length === 0) return null;

          return (
            <section key={difficulty} className="mb-12">
              <h2 className="font-pixel text-[10px] text-retro-yellow mb-5">
                {difficulty.toUpperCase()} LANGUAGES
              </h2>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {group.map((lang) => (
                  <LanguageCard key={lang.id} language={lang} />
                ))}
              </div>
            </section>
          );
        })}
      </main>

      <footer className="border-t-[3px] border-retro-border mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center">
          <p className="font-pixel text-[7px] text-retro-muted">
            PRESS START TO CODE — CONSOLE LEARNING © 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
