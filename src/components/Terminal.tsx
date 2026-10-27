"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { site } from "@/content/site";
import { ringBell } from "@/lib/audio";
import { COLOR_LABELS, dayTitle, describeDay } from "@/lib/liturgical";
import styles from "./Terminal.module.css";

interface Line {
  id: number;
  kind: "in" | "out" | "err" | "sys";
  text: string;
}

const CHAPTERS = ["code", "court", "ring", "altar"];

const HELP = [
  "help             this list",
  "whoami           who runs this place",
  "ls               list the chapters",
  "cd <chapter>     jump to code, court, ring or altar",
  "cat about.txt    the short version",
  "projects         what's on the workbench",
  "date             today, by two calendars",
  "serve            hit a first serve",
  "bell             ring the bell",
  "pray             ora et labora",
  "clear            wipe the screen",
];

const SERVES = [
  "ACE. Down the T, untouched.",
  "In. Rally on.",
  "Fault. Second serve…",
  "Let. Take two.",
  "Double fault. It happens to everyone.",
];

type Result = { kind: "out" | "err"; text: string[] } | "clear";

const out = (...text: string[]): Result => ({ kind: "out", text });
const err = (...text: string[]): Result => ({ kind: "err", text });

function exec(raw: string, history: string[]): Result {
  const [cmd = "", ...args] = raw.trim().split(/\s+/);

  switch (cmd.toLowerCase()) {
    case "":
      return out();
    case "help":
    case "?":
      return out(...HELP);
    case "whoami":
      return out(`${site.handle} — programmer, tennis player, nak muay, Catholic.`);
    case "ls":
      return out("code/    court/    ring/    altar/    about.txt");
    case "cd":
    case "open": {
      const target = (args[0] ?? "~").replace(/\/$/, "").toLowerCase();
      if (target === "~" || target === "..") {
        document.getElementById("top")?.scrollIntoView({ behavior: "smooth" });
        return out("→ ~");
      }
      if (CHAPTERS.includes(target)) {
        document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
        return out(`→ ${target}/`);
      }
      return err(`cd: no such chapter: ${target}`);
    }
    case "cat":
      if (args[0] === "about.txt") return out(site.intro);
      return err(`cat: ${args[0] ?? ""}: no such file`);
    case "projects":
      return out(...site.projects.map((p) => `• ${p.name} — ${p.description}`));
    case "date": {
      const now = new Date();
      const day = describeDay(now);
      const t = dayTitle(day);
      return out(
        now.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
        `${t.lead}${t.joiner}${t.rest}${day.feast ? ` — ${day.feast}` : ""}`,
        `liturgical color: ${COLOR_LABELS[day.color]}`,
      );
    }
    case "serve":
      return out(SERVES[Math.floor(Math.random() * SERVES.length)]);
    case "bell":
      ringBell(1);
      return out("*ding*");
    case "pray":
      return out(
        "In the name of the Father, and of the Son, and of the Holy Spirit. Amen.",
        "Ora et labora — now back to work.",
      );
    case "sudo":
      return err("Nice try. Humility is also a discipline.");
    case "echo":
      return out(args.join(" "));
    case "history":
      return out(...history.map((h, i) => `${String(i + 1).padStart(3)}  ${h}`));
    case "clear":
      return "clear";
    default:
      return err(`command not found: ${cmd}. Try \`help\`.`);
  }
}

export function Terminal() {
  const [lines, setLines] = useState<Line[]>([
    { id: 0, kind: "sys", text: "almanac shell v1.0 — type `help` to look around." },
  ]);
  const [input, setInput] = useState("");
  const nextId = useRef(1);
  const history = useRef<string[]>([]);
  const cursor = useRef(0);
  const screen = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = screen.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  function submit(e: FormEvent) {
    e.preventDefault();
    const raw = input;
    if (raw.trim()) history.current.push(raw.trim());
    cursor.current = history.current.length;
    setInput("");

    const result = exec(raw, history.current);
    if (result === "clear") {
      setLines([]);
      return;
    }
    const make = (kind: Line["kind"], text: string): Line => ({ id: nextId.current++, kind, text });
    setLines((prev) => [...prev, make("in", raw), ...result.text.map((t) => make(result.kind, t))]);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    const h = history.current;
    if (e.key === "ArrowUp" && h.length) {
      e.preventDefault();
      cursor.current = Math.max(0, cursor.current - 1);
      setInput(h[cursor.current] ?? "");
    } else if (e.key === "ArrowDown" && h.length) {
      e.preventDefault();
      cursor.current = Math.min(h.length, cursor.current + 1);
      setInput(h[cursor.current] ?? "");
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  }

  return (
    <div className={styles.terminal} onClick={() => field.current?.focus({ preventScroll: true })}>
      <div className={styles.bar}>
        <span className={styles.dots} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className={styles.title}>{site.handle}@almanac: ~/code</span>
      </div>
      <div ref={screen} className={styles.screen} role="log" aria-live="polite" aria-label="Terminal output">
        {lines.map((line) =>
          line.kind === "in" ? (
            <p key={line.id} className={styles.line}>
              <span className={styles.prompt}>~ $</span> {line.text}
            </p>
          ) : (
            <p key={line.id} className={`${styles.line} ${styles[line.kind]}`}>
              {line.text}
            </p>
          ),
        )}
        <form className={styles.inputRow} onSubmit={submit}>
          <label htmlFor="terminal-input" className={styles.prompt}>
            ~ $
          </label>
          <input
            ref={field}
            id="terminal-input"
            className={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="send"
            aria-label="Terminal command"
          />
        </form>
      </div>
    </div>
  );
}
