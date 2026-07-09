"use client";

import { useState } from "react";
import { tokenize, getTokenColor } from "@/lib/syntaxHighlight";

interface CodeViewerProps {
  code: string;
  language?: string;
  title?: string;
}

export default function CodeViewer({ code, language, title }: CodeViewerProps) {
  const [copied, setCopied] = useState(false);
  const lines = tokenize(code);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="pixel-border bg-retro-surface overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b-2 border-retro-border bg-retro-bg">
        <div className="flex items-center gap-3">
          <span className="font-pixel text-[8px] text-retro-cyan uppercase tracking-wider">
            {language ?? "code"}
          </span>
          {title && (
            <span className="text-xs text-retro-muted hidden sm:inline">— {title}</span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="pixel-btn-sm text-[8px] font-pixel"
          aria-label="Copy code"
        >
          {copied ? "COPIED!" : "COPY"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed font-mono">
        <code>
          {lines.map((tokens, lineIdx) => (
            <span key={lineIdx} className="flex">
              <span className="select-none text-retro-muted pr-4 text-right w-10 flex-shrink-0 text-xs">
                {lineIdx + 1}
              </span>
              <span>
                {tokens.map((token, tokenIdx) => (
                  <span key={tokenIdx} className={getTokenColor(token.type)}>
                    {token.text}
                  </span>
                ))}
              </span>
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
