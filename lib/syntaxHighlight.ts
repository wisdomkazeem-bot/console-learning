export interface Token {
  text: string;
  type: "keyword" | "string" | "comment" | "number" | "function" | "directive" | "default";
}

const KEYWORDS = new Set([
  "if", "else", "elif", "for", "while", "do", "return", "break", "continue",
  "def", "class", "import", "from", "try", "except", "finally", "with", "as",
  "void", "int", "float", "char", "const", "static", "struct", "enum",
  "include", "define", "ifdef", "endif", "ifndef", "segment", "section",
  "function", "var", "let", "const", "new", "true", "false", "null", "None",
  "print", "printf", "input", "len", "range", "pass", "in", "not", "and", "or",
  "void", "main", "setup", "loop", "app", "route", "GPIO", "HIGH", "LOW",
  "LDA", "STA", "LD", "CALL", "RTS", "RTL", "HALT", "JR", "BEQ", "BRA",
  "MOVE", "CMP", "BLT", "ADDQ", "SEI", "CLC", "XCE", "REP", "AND", "POKE",
  "PRINT", "INPUT", "GOTO", "NEXT", "FOR", "END", "THEN", "RUN", "REM",
  "SEC", "LET", "READ", "DATA", "RESTORE", "DIM", "STEP", "ON", "GOSUB",
]);

const TOKEN_COLORS: Record<Token["type"], string> = {
  keyword: "text-retro-cyan",
  string: "text-retro-green",
  comment: "text-retro-muted italic",
  number: "text-retro-yellow",
  function: "text-retro-purple",
  directive: "text-retro-red",
  default: "text-retro-text",
};

export function getTokenColor(type: Token["type"]): string {
  return TOKEN_COLORS[type];
}

export function tokenize(code: string): Token[][] {
  const lines = code.split("\n");
  return lines.map((line) => tokenizeLine(line));
}

function tokenizeLine(line: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < line.length) {
    // Comments
    if (line[i] === "#" || (line[i] === "/" && line[i + 1] === "/") || line[i] === ";") {
      tokens.push({ text: line.slice(i), type: "comment" });
      break;
    }

    // Strings
    if (line[i] === '"' || line[i] === "'") {
      const quote = line[i];
      let j = i + 1;
      while (j < line.length && line[j] !== quote) {
        if (line[j] === "\\") j++;
        j++;
      }
      j++;
      tokens.push({ text: line.slice(i, j), type: "string" });
      i = j;
      continue;
    }

    // Numbers (hex and decimal)
    if (/[0-9$#]/.test(line[i])) {
      let j = i;
      if (line[j] === "$") j++;
      while (j < line.length && /[0-9a-fA-F.x]/.test(line[j])) j++;
      tokens.push({ text: line.slice(i, j), type: "number" });
      i = j;
      continue;
    }

    // Preprocessor directives
    if (line[i] === "#" || (line[i] === "." && /[a-z]/.test(line[i + 1] ?? ""))) {
      let j = i + 1;
      while (j < line.length && /[a-zA-Z_]/.test(line[j])) j++;
      tokens.push({ text: line.slice(i, j), type: "directive" });
      i = j;
      continue;
    }

    // Words (keywords, functions)
    if (/[a-zA-Z_@]/.test(line[i])) {
      let j = i;
      while (j < line.length && /[a-zA-Z0-9_@]/.test(line[j])) j++;
      const word = line.slice(i, j);
      const upperWord = word.toUpperCase();

      if (KEYWORDS.has(word) || KEYWORDS.has(upperWord) || KEYWORDS.has(word.toLowerCase())) {
        tokens.push({ text: word, type: "keyword" });
      } else if (j < line.length && line[j] === "(") {
        tokens.push({ text: word, type: "function" });
      } else {
        tokens.push({ text: word, type: "default" });
      }
      i = j;
      continue;
    }

    // Whitespace and operators
    tokens.push({ text: line[i], type: "default" });
    i++;
  }

  return tokens;
}
