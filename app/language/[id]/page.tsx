"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import languages from "@/data/languages.json";

// Type definitions for clarity/future upgrades
type Lesson = {
  lessonNumber: number;
  title: string;
  objective: string;
  explanation: string;
  keyConcepts: { term: string; definition: string }[];
  codeExample: string;
  challenge: string;
  hint: string;
  solution: string;
  beginnerTip?: string;
  lineExplanations?: Record<number, string>;
  expectedOutput?: string;
  commonMistakes?: string;
};
type Language = {
  id: string;
  name: string;
  type: string;
  year: number;
  creator: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  usedFor: string;
  funFact: string;
  color: string;
  curriculum: Lesson[];
  resources?: any;
};

function classNames(...classes: (string | false | undefined)[]) {
  // filter falsy (removes boolean) and join
  return classes.filter((v) => typeof v === "string" && v).join(" ");
}

const DIFFICULTY_COLORS: Record<
  "Beginner" | "Intermediate" | "Advanced",
  { bg: string; text: string }
> = {
  Beginner: {
    bg: "bg-green-100 dark:bg-green-900",
    text: "text-green-700 dark:text-green-300",
  },
  Intermediate: {
    bg: "bg-yellow-100 dark:bg-yellow-900",
    text: "text-yellow-700 dark:text-yellow-300",
  },
  Advanced: {
    bg: "bg-red-100 dark:bg-red-900",
    text: "text-red-700 dark:text-red-300",
  },
};

const CHECKMARK = (
  <svg
    viewBox="0 0 16 16"
    className="w-4 h-4 text-blue-500 ml-1 inline-block"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M5.7 12.3a1 1 0 0 1-1.4 0l-2.3-2.3a1 1 0 1 1 1.4-1.4l1.6 1.6 5.3-5.3a1 1 0 0 1 1.4 1.4l-6 6z" />
  </svg>
);

const LOCK_ICON = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
    className="inline mr-1"
    aria-hidden="true"
  >
    <rect x="3" y="7" width="10" height="6" rx="2" stroke="#A1A1AA" strokeWidth="1.2" />
    <path d="M5.5 7V5.5C5.5 4.11929 6.61929 3 8 3V3C9.38071 3 10.5 4.11929 10.5 5.5V7" stroke="#A1A1AA" strokeWidth="1.2" />
  </svg>
);

const TAB_NAMES = ["Windows", "Mac", "Linux"] as const;

const RUN_COMMANDS: Record<  string,

