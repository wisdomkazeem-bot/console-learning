import Link from "next/link";
import type { Language } from "@/lib/language-types";
import { DIFFICULTY_COLORS } from "@/lib/types";

interface LanguageCardProps {
  language: Language;
}

export default function LanguageCard({ language }: LanguageCardProps) {
  return (
    <article className="pixel-card h-full flex flex-col">
      <div className="flex items-start justify-between gap-2 mb-3">
        <span
          className="font-pixel text-[10px] leading-relaxed"
          style={{ color: language.color }}
        >
          {language.name.toUpperCase()}
        </span>
        <span
          className={`font-pixel text-[7px] px-2 py-1 shrink-0 ${
            DIFFICULTY_COLORS[language.difficulty] ?? "bg-retro-muted text-retro-bg"
          }`}
        >
          {language.difficulty.toUpperCase()}
        </span>
      </div>

      <p className="text-xs text-retro-muted leading-relaxed mb-4 line-clamp-2">
        {language.description}
      </p>

      <p className="font-pixel text-[8px] text-retro-yellow mb-3">
        {language.topics.length} LESSONS
      </p>

      <ol className="space-y-1.5 mb-5 flex-1">
        {language.topics.map((topic, index) => (
          <li key={topic.id}>
            <Link
              href={`/language/${language.id}?topic=${topic.id}`}
              className="flex items-start gap-2 text-xs text-retro-text hover:text-retro-cyan transition-colors group"
            >
              <span className="font-pixel text-[7px] text-retro-muted group-hover:text-retro-green shrink-0 mt-0.5">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="leading-relaxed">{topic.title}</span>
              <span
                className={`ml-auto shrink-0 text-[6px] font-pixel px-1.5 py-0.5 ${
                  DIFFICULTY_COLORS[topic.difficulty] ?? "bg-retro-muted text-retro-bg"
                }`}
              >
                {topic.difficulty === "Beginner"
                  ? "BEG"
                  : topic.difficulty === "Intermediate"
                    ? "INT"
                    : "ADV"}
              </span>
            </Link>
          </li>
        ))}
      </ol>

      <Link
        href={`/language/${language.id}`}
        className="pixel-btn-sm text-[8px] font-pixel text-center w-full"
      >
        START COURSE
      </Link>
    </article>
  );
}
