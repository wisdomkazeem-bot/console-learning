export type ConsoleType = "game" | "handheld" | "network/wifi" | "computer" | "arcade";

export interface CodingExample {
  title: string;
  language: string;
  realWorldUse?: string;
  code: string;
  beginnerExplanation?: string;
  explanation?: string[];
}

export interface WebsiteResource {
  title: string;
  url: string;
  description: string;
}

export interface ConsoleResources {
  youtubeQuery: string;
  websites: WebsiteResource[];
}

export interface Console {
  id: string;
  name: string;
  type: ConsoleType;
  year: number;
  cpu: string;
  ram: string;
  description: string;
  funFact: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  languages?: string[];
  codingExamples: CodingExample[];
  resources: ConsoleResources;
}

export const CONSOLE_TYPES: { value: ConsoleType | "all"; label: string; icon: string }[] = [
  { value: "all", label: "All", icon: "★" },
  { value: "game", label: "Game", icon: "🎮" },
  { value: "handheld", label: "Handheld", icon: "📱" },
  { value: "network/wifi", label: "Network/WiFi", icon: "📡" },
  { value: "computer", label: "Computer", icon: "💻" },
  { value: "arcade", label: "Arcade", icon: "🕹️" },
];

export const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: "bg-retro-green text-retro-bg",
  Intermediate: "bg-retro-yellow text-retro-bg",
  Advanced: "bg-retro-red text-white",
};

export const TYPE_COLORS: Record<ConsoleType, string> = {
  game: "border-retro-cyan text-retro-cyan",
  handheld: "border-retro-purple text-retro-purple",
  "network/wifi": "border-retro-green text-retro-green",
  computer: "border-retro-yellow text-retro-yellow",
  arcade: "border-retro-red text-retro-red",
};
