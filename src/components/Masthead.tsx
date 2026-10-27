"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { useLiturgy } from "./LiturgyProvider";
import { ThemeToggle } from "./ThemeToggle";
import styles from "./Masthead.module.css";

const chapters = [
  { id: "code", num: "I", label: "Code", tone: "code" },
  { id: "court", num: "II", label: "Court", tone: "court" },
  { id: "ring", num: "III", label: "Ring", tone: "ring" },
  { id: "altar", num: "IV", label: "Altar", tone: "altar" },
];

// Sections that, when centered on screen, mean "no chapter is active".
const otherSections = ["top", "practice"];

export function Masthead() {
  const { today, hour } = useLiturgy();
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const ids = [...otherSections, ...chapters.map((c) => c.id)];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <header className={styles.bar}>
      <div className={`wrap ${styles.inner}`}>
        <a href="#top" className={styles.mark} aria-label={`${site.name}, back to top`}>
          {site.monogram}
        </a>

        <p className={styles.almanac} aria-live="polite">
          <span className={styles.dot} aria-hidden="true" />
          {today ? (
            <span>
              {today.season.name}
              <span className={styles.hour}> · {hour}</span>
            </span>
          ) : (
            <span className={styles.placeholder}>Anno Domini</span>
          )}
        </p>

        <nav aria-label="Chapters">
          <ol className={styles.nav}>
            {chapters.map((c) => (
              <li key={c.id}>
                <a
                  href={`#${c.id}`}
                  className={`tone-${c.tone} ${active === c.id ? styles.active : ""}`}
                  aria-current={active === c.id ? "location" : undefined}
                >
                  <span className={styles.num}>{c.num}</span>
                  <span className={styles.navLabel}>{c.label}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
}
