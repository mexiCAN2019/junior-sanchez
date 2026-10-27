"use client";

import { useState, type KeyboardEvent } from "react";
import styles from "./EightLimbs.module.css";

type Weapon = "mat" | "sok" | "khao" | "te";

const WEAPONS: Record<Weapon, { thai: string; roman: string; english: string; one: string; body: string }> = {
  mat: {
    thai: "หมัด",
    roman: "Mat",
    english: "Punches",
    one: "fist",
    body: "Jab, cross, hook, uppercut. The hands measure distance and set up everything else.",
  },
  sok: {
    thai: "ศอก",
    roman: "Sok",
    english: "Elbows",
    one: "elbow",
    body: "Short, sharp and close. Elbows are the reason everyone respects the clinch — they cut.",
  },
  khao: {
    thai: "เข่า",
    roman: "Khao",
    english: "Knees",
    one: "knee",
    body: "Thrown from the clinch or stepping in. Hips forward, up on the toes, drive through the target.",
  },
  te: {
    thai: "เตะ",
    roman: "Te",
    english: "Kicks",
    one: "shin",
    body: "The roundhouse turns the whole body over and lands with the shin, not the foot. Then you learn to check them.",
  },
};

interface Limb {
  id: string;
  weapon: Weapon;
  side: "Lead" | "Rear";
  x: number;
  y: number;
}

// Orthodox stance, facing you: the lead side is on your right.
const LIMBS: Limb[] = [
  { id: "rear-fist", weapon: "mat", side: "Rear", x: 128, y: 84 },
  { id: "lead-fist", weapon: "mat", side: "Lead", x: 194, y: 70 },
  { id: "rear-elbow", weapon: "sok", side: "Rear", x: 108, y: 154 },
  { id: "lead-elbow", weapon: "sok", side: "Lead", x: 212, y: 150 },
  { id: "rear-knee", weapon: "khao", side: "Rear", x: 128, y: 306 },
  { id: "lead-knee", weapon: "khao", side: "Lead", x: 198, y: 300 },
  { id: "rear-shin", weapon: "te", side: "Rear", x: 121, y: 352 },
  { id: "lead-shin", weapon: "te", side: "Lead", x: 202, y: 346 },
];

const BONES = [
  "M160 86 L160 222", // spine
  "M124 102 L196 102", // shoulders
  "M124 102 L108 154 L128 84", // rear arm
  "M196 102 L212 150 L194 70", // lead arm
  "M142 224 L178 224", // hips
  "M142 224 L128 306 L114 398 L94 404", // rear leg
  "M178 224 L198 300 L206 392 L228 398", // lead leg
];

export function EightLimbs() {
  const [selected, setSelected] = useState<Limb | null>(null);
  const [found, setFound] = useState<Set<string>>(() => new Set());

  function choose(limb: Limb) {
    setSelected(limb);
    setFound((prev) => (prev.has(limb.id) ? prev : new Set(prev).add(limb.id)));
  }

  function onKey(e: KeyboardEvent, limb: Limb) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      choose(limb);
    }
  }

  const info = selected ? WEAPONS[selected.weapon] : null;

  return (
    <div className={styles.wrap}>
      <svg className={styles.figure} viewBox="0 0 320 440" aria-label="A fighter in guard. Each of the eight weapons can be selected.">
        <circle cx={160} cy={220} r={190} className={styles.halo} />
        <g className={styles.bones}>
          {BONES.map((d) => (
            <path key={d} d={d} />
          ))}
          <circle cx={160} cy={58} r={24} />
        </g>
        {/* Mongkol (headband) and prajioud (armbands) */}
        <path d="M137 50 Q160 40 183 50" className={styles.mongkol} />
        <path d="M183 50 q14 -6 22 -22" className={styles.mongkolTail} />
        <path d="M118 120 L114 132" className={styles.prajioud} />
        <path d="M202 120 L206 132" className={styles.prajioud} />

        {LIMBS.map((limb) => {
          const isOn = selected?.id === limb.id;
          return (
            <g
              key={limb.id}
              className={`${styles.limb} ${isOn ? styles.on : ""} ${found.has(limb.id) ? styles.found : ""}`}
              transform={`translate(${limb.x} ${limb.y})`}
              tabIndex={0}
              role="button"
              aria-pressed={isOn}
              aria-label={`${limb.side} ${WEAPONS[limb.weapon].one}`}
              onClick={() => choose(limb)}
              onMouseEnter={() => choose(limb)}
              onFocus={() => choose(limb)}
              onKeyDown={(e) => onKey(e, limb)}
            >
              <circle r={18} className={styles.hit} />
              <circle r={13} className={styles.pulse} />
              <circle r={8} className={styles.node} />
            </g>
          );
        })}
      </svg>

      <div className={styles.panel} aria-live="polite">
        <p className="label">
          {found.size}/8 found{found.size === 8 ? " — that's Muay Thai" : ""}
        </p>
        {info && selected ? (
          <>
            <p className={styles.thai} lang="th">
              {info.thai}
            </p>
            <h3 className={styles.name}>
              {info.roman} <span>· {info.english.toLowerCase()}, {selected.side.toLowerCase()} {info.one}</span>
            </h3>
            <p className={styles.body}>{info.body}</p>
          </>
        ) : (
          <>
            <p className={styles.thai} lang="th" aria-hidden="true">
              แปด
            </p>
            <h3 className={styles.name}>Eight weapons</h3>
            <p className={styles.body}>Hover or tap the glowing points — fists, elbows, knees and shins.</p>
          </>
        )}
      </div>
    </div>
  );
}
