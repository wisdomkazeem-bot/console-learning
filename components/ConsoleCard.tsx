import Link from "next/link";
import type { Console } from "@/lib/types";
import { DIFFICULTY_COLORS, TYPE_COLORS } from "@/lib/types";

interface ConsoleCardProps {
  console: Console;
}

const TYPE_ICONS: Record<string, string> = {
  game: "🎮",
  handheld: "📱",
  "network/wifi": "📡",
  computer: "💻",
  arcade: "🕹️",
};

export default function ConsoleCard({ console: c }: ConsoleCardProps) {
  return (
    <Link href={`/console/${c.id}`} className="group block">
      <article className="pixel-card h-full transition-transform group-hover:-translate-y-1 group-hover:shadow-pixel-glow">
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className="text-2xl" aria-hidden="true">
            {TYPE_ICONS[c.type] ?? "🖥️"}
          </span>
          <span
            className={`font-pixel text-[7px] px-2 py-1 ${
              DIFFICULTY_COLORS[c.difficulty] ?? "bg-retro-muted text-retro-bg"
            }`}
          >
            {c.difficulty.toUpperCase()}
          </span>
        </div>

        <h2 className="font-pixel text-[10px] text-retro-cyan leading-relaxed mb-2 group-hover:text-retro-green transition-colors">
          {c.name}
        </h2>

        <p className="text-xs text-retro-muted leading-relaxed mb-4 line-clamp-2">
          {c.description}
        </p>

        <div className="flex flex-wrap gap-2 mt-auto">
          <span className={`pixel-tag text-[7px] ${TYPE_COLORS[c.type]}`}>
            {c.type.toUpperCase()}
          </span>
          <span className="pixel-tag text-[7px] border-retro-muted text-retro-muted">
            {c.year}
          </span>
        </div>
      </article>
    </Link>
  );
}
