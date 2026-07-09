interface ResourceCardProps {
  title: string;
  url: string;
  description: string;
}

export default function ResourceCard({ title, url, description }: ResourceCardProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="pixel-card block group hover:border-retro-cyan transition-colors"
    >
      <div className="flex items-start gap-3">
        <span className="text-xl flex-shrink-0" aria-hidden="true">🔗</span>
        <div className="min-w-0">
          <h3 className="font-pixel text-[9px] text-retro-cyan group-hover:text-retro-green transition-colors mb-1">
            {title}
          </h3>
          <p className="text-xs text-retro-muted leading-relaxed mb-2">
            {description}
          </p>
          <p className="text-[10px] text-retro-green truncate font-mono">
            {url}
          </p>
        </div>
      </div>
    </a>
  );
}
