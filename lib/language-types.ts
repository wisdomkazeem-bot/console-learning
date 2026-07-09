export interface KeyTerm {
  term: string;
  definition: string;
}

export interface VideoResource {
  title: string;
  url: string;
  source?: string;
  note?: string;
}

export interface Topic {
  id: string;
  title: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  explanation: string;
  beginnerExplanation?: string;
  keyTerms: KeyTerm[];
  codeExample: string[];
  expectedOutput: string;
  starterCode: string[];
  solution: string[];
  commonMistakes: string[];
  challenge: string;
  challengeHint: string;
  challengeSolution: string[];
  videoResources: VideoResource[];
}

export interface TerminalCommands {
  windows: string;
  mac: string;
  linux: string;
  install: string;
}

export interface Language {
  id: string;
  name: string;
  type: string;
  year: number;
  creator: string;
  difficulty: string;
  description: string;
  usedFor: string;
  funFact: string;
  color: string;
  terminalCommands: TerminalCommands;
  topics: Topic[];
}
