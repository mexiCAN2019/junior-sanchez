"use client";

import { useEffect, useState } from "react";
import styles from "./Typer.module.css";

export function Typer({ phrases }: { phrases: string[] }) {
  const [text, setText] = useState("");

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let phrase = 0;
    let chars = 0;
    let deleting = false;
    let timer: number;

    const schedule = (ms: number) => {
      timer = window.setTimeout(tick, ms);
    };

    function tick() {
      const current = phrases[phrase];

      if (reduceMotion) {
        setText(current);
        phrase = (phrase + 1) % phrases.length;
        return schedule(2800);
      }

      if (!deleting) {
        chars += 1;
        setText(current.slice(0, chars));
        if (chars === current.length) {
          deleting = true;
          return schedule(1900);
        }
        return schedule(40 + Math.random() * 70);
      }

      chars -= 1;
      setText(current.slice(0, chars));
      if (chars === 0) {
        deleting = false;
        phrase = (phrase + 1) % phrases.length;
        return schedule(380);
      }
      schedule(20);
    }

    schedule(700);
    return () => window.clearTimeout(timer);
  }, [phrases]);

  return (
    <span className={styles.typer}>
      <span aria-hidden="true">{text}</span>
      <span className={styles.caret} aria-hidden="true" />
      <span className="sr-only">{phrases.join(" ")}</span>
    </span>
  );
}
