"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import languages from "@/data/languages.json";

// Language Types (normalize and dedupe)
const LANGUAGE_TYPES = [
  { label: "All", value: "All" },
  { label: "Web", value: "web" },
  { label: "Systems", value: "systems" },
  { label: "Scripting", value: "scripting" },
  { label: "Mobile", value: "mobile" },
  { label: "Data", value: "data" },
  { label: "Game", value: "game" },
];

const BEGINNER_IDS = new Set(["python", "javascript", "basic"]);

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case "Beginner":
      return "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300";
    case "Intermediate":
      return "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300";
    case "Advanced":
      return "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300";
    default:
      return "bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200";
  }
}

function classNames(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

function normalizeType(type: string | undefined): string {
  if (!type) return "";
  return type.trim().toLowerCase();
}

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  // For search and filter
  const filteredLanguages = useMemo(() => {
    return languages.filter((lang: any) => {
      // Type Filter
      if (
        selectedType !== "All" &&
        normalizeType(lang.type) !== selectedType
      ) {
        return false;
      }
      // Search filter
      if (search.trim().length > 0) {
        const q = search.trim().toLowerCase();
        if (
          !lang.name.toLowerCase().includes(q) &&
          !lang.usedFor?.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [search, selectedType]);

  // Recommended for beginners (Python, JavaScript, and BASIC if present)
  const recommended = useMemo(() => {
    return languages.filter((lang: any) => BEGINNER_IDS.has(lang.id));
  }, []);

  return (
    <div className="min-h-screen font-sans bg-zinc-50 dark:bg-black">
      <main className="bg-white dark:bg-black min-h-screen">
        <div className="max-w-3xl mx-auto py-32 px-4 md:px-16">
          {/* Hero Section */}
          <section className="mb-12 text-center">
            <h1
              className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-4"
              style={{
                fontFamily:
                  "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
              }}
            >
              Learn to Code for Free
            </h1>
            <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 mb-2">
              Start with the basics and work your way up step by step
            </p>
          </section>

          {/* Search + Filter */}
          <section className="mb-10">
            <div className="flex flex-col md:flex-row items-center gap-3 mb-6">
              <input
                type="text"
                className="w-full md:w-auto rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 py-2 px-6 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 transition"
                style={{
                  fontFamily:
                    "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
                  minWidth: "200px",
                  maxWidth: "380px",
                }}
                placeholder="Search for a language..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search languages"
              />
              <div className="flex flex-wrap gap-2">
                {LANGUAGE_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setSelectedType(type.value)}
                    className={classNames(
                      "rounded-full px-4 py-1 text-sm font-semibold border transition focus:outline-none",
                      selectedType === type.value
                        ? "bg-blue-600 text-white border-blue-700"
                        : "bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                    )}
                    style={{
                      fontFamily:
                        "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
                    }}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Recommended for Beginners */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-6">
              Recommended for Beginners
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {recommended.map((lang: any) => (
                <LanguageCard key={lang.id} language={lang} />
              ))}
            </div>
          </section>

          {/* All Languages */}
          <section>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-6">
              Explore Programming Languages
            </h2>
            {filteredLanguages.length === 0 ? (
              <div className="text-zinc-500 text-center mt-12">
                No languages found.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredLanguages.map((lang: any) => (
                  <LanguageCard key={lang.id} language={lang} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

function LanguageCard({ language }: { language: any }) {
  return (
    <Link
      href={`/language/${language.id}`}
      className="block bg-white dark:bg-black rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-lg transition p-6 group focus:outline-none"
      style={{
        fontFamily:
          "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
        minHeight: "210px",
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div
          className={classNames(
            "inline-block rounded-full px-3 py-1 text-xs font-semibold mr-1",
            getDifficultyColor(language.difficulty)
          )}
        >
          {language.difficulty}
        </div>
        <span className={classNames(
          "inline-block rounded-full px-3 py-1 text-xs font-medium ml-auto",
          "bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
        )}>
          {capitalizeFirstLetter(language.type)}
        </span>
      </div>
      <h3
        className="text-lg font-semibold text-zinc-900 dark:text-white mb-1"
        style={{
          fontFamily:
            "var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)",
        }}
      >
        {language.name}
      </h3>
      <div className="text-zinc-600 dark:text-zinc-400 text-sm mb-2 min-h-[36px]">
        {language.usedFor || language.description}
      </div>
      <div className="flex items-center text-xs text-zinc-500 dark:text-zinc-400 mt-2">
        <span>
          {language.curriculum?.length || 0} Lesson
          {language.curriculum?.length === 1 ? "" : "s"}
        </span>
      </div>
    </Link>
  );
}

function capitalizeFirstLetter(str: string | undefined) {
  if (!str || str.length === 0) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}