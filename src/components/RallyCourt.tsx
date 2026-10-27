"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type PointerEvent } from "react";
import styles from "./RallyCourt.module.css";

/* Court geometry, to scale: 28 SVG units per meter, seen from above. */
const S = 28;
const M = 40;
const COURT = { x: M, y: M, w: 23.77 * S, h: 10.97 * S };
const LEFT = COURT.x;
const RIGHT = COURT.x + COURT.w;
const NET = COURT.x + COURT.w / 2;
const MID_Y = COURT.y + COURT.h / 2;
const ALLEY = ((10.97 - 8.23) / 2) * S;
const TOP = COURT.y + ALLEY; // singles sidelines
const BOTTOM = COURT.y + COURT.h - ALLEY;
const SERVICE = 6.4 * S;
const VIEW_W = COURT.w + M * 2;
const VIEW_H = COURT.h + M * 2;
const TARGET_R = 26;

type Pt = { x: number; y: number };
interface Mark extends Pt {
  id: number;
  out: boolean;
}

const SERVE_SPOT: Pt = { x: LEFT - 12, y: MID_Y + 30 };
const YOU_START: Pt = { x: LEFT - 22, y: MID_Y + 30 };
const THEM_START: Pt = { x: RIGHT + 22, y: MID_Y };

const PRAISE = ["Good depth.", "Solid.", "Keep it going.", "Nice shape on that one.", "Patience…", "Great feet."];

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const dist = (a: Pt, b: Pt) => Math.hypot(a.x - b.x, a.y - b.y);
const easeOut = (t: number) => 1 - (1 - t) ** 3;
// Roughly normal noise: the more you rally, the more your shots wander.
const noise = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function randomTarget(): Pt {
  return { x: rand(NET + 70, RIGHT - 30), y: rand(TOP + 30, BOTTOM - 30) };
}

/* Personal best, kept in localStorage when the browser allows it. */
const BEST_KEY = "rally-best";
const bestListeners = new Set<() => void>();
let bestInMemory = 0;
function readBest() {
  try {
    return Math.max(bestInMemory, Number(localStorage.getItem(BEST_KEY)) || 0);
  } catch {
    return bestInMemory;
  }
}
function writeBest(n: number) {
  bestInMemory = n;
  try {
    localStorage.setItem(BEST_KEY, String(n));
  } catch {
    // Storage blocked: the in-memory best still works for this visit.
  }
  bestListeners.forEach((l) => l());
}
function subscribeBest(l: () => void) {
  bestListeners.add(l);
  return () => bestListeners.delete(l);
}

export function RallyCourt() {
  const svg = useRef<SVGSVGElement>(null);
  const ballEl = useRef<SVGCircleElement>(null);
  const shadowEl = useRef<SVGEllipseElement>(null);
  const youEl = useRef<SVGGElement>(null);
  const themEl = useRef<SVGGElement>(null);

  const ball = useRef<Pt>(SERVE_SPOT);
  const you = useRef<Pt>(YOU_START);
  const them = useRef<Pt>(THEM_START);
  const busy = useRef(false);
  const rallyRef = useRef(0);
  const alive = useRef(true);
  const markId = useRef(0);

  const [rally, setRally] = useState(0);
  const [targetsHit, setTargetsHit] = useState(0);
  const [target, setTarget] = useState<Pt>({ x: RIGHT - 80, y: TOP + 60 });
  const [marks, setMarks] = useState<Mark[]>([]);
  const [message, setMessage] = useState("Click the far side of the court to hit.");
  const best = useSyncExternalStore(subscribeBest, readBest, () => 0);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  function place(el: SVGGElement | null, p: Pt) {
    el?.setAttribute("transform", `translate(${p.x} ${p.y})`);
  }

  /** Fly the ball from → to with an arc of `apex`, moving a player alongside. */
  function fly(from: Pt, to: Pt, apex: number, mover?: [SVGGElement | null, Pt, Pt]) {
    const speedUp = Math.max(0.55, 1 - rallyRef.current * 0.03);
    const duration = (380 + dist(from, to) * 0.95) * speedUp;
    return new Promise<void>((resolve) => {
      const start = performance.now();
      const frame = (now: number) => {
        if (!alive.current) return resolve();
        const t = Math.min(1, (now - start) / duration);
        const x = from.x + (to.x - from.x) * t;
        const y = from.y + (to.y - from.y) * t;
        const h = Math.sin(Math.PI * t) * apex;
        shadowEl.current?.setAttribute("cx", String(x));
        shadowEl.current?.setAttribute("cy", String(y));
        ballEl.current?.setAttribute("cx", String(x - h * 0.12));
        ballEl.current?.setAttribute("cy", String(y - h * 0.55));
        ballEl.current?.setAttribute("r", String(6 + h * 0.045));
        if (mover) {
          const [el, a, b] = mover;
          const k = easeOut(t);
          place(el, { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k });
        }
        if (t < 1) requestAnimationFrame(frame);
        else resolve();
      };
      requestAnimationFrame(frame);
    });
  }

  function addMark(p: Pt, out: boolean) {
    const id = markId.current++;
    setMarks((m) => [...m.slice(-6), { ...p, id, out }]);
    window.setTimeout(() => {
      if (alive.current) setMarks((m) => m.filter((x) => x.id !== id));
    }, 1600);
  }

  async function hit(aim: Pt) {
    if (busy.current) return;
    if (aim.x <= NET) {
      setMessage("Over the net — aim for the right-hand side.");
      return;
    }
    busy.current = true;

    const spread = 5 + rallyRef.current * 2.4;
    const land = { x: aim.x + noise() * spread, y: aim.y + noise() * spread };
    const themTo = { x: clamp(land.x + 70, NET + 80, RIGHT + 34), y: clamp(land.y, M - 10, VIEW_H - M + 10) };

    await fly(ball.current, land, 70, [themEl.current, them.current, themTo]);
    them.current = themTo;
    ball.current = land;

    const inside = land.x > NET && land.x <= RIGHT && land.y >= TOP && land.y <= BOTTOM;
    addMark(land, !inside);

    if (!inside) {
      const lost = rallyRef.current;
      setMessage(lost ? `Out! Rally over at ${lost}. Click to start again.` : "Out! Click to try again.");
      rallyRef.current = 0;
      setRally(0);
      await wait(800);
      if (!alive.current) return;
      ball.current = SERVE_SPOT;
      you.current = YOU_START;
      them.current = THEM_START;
      await fly(land, SERVE_SPOT, 20);
      place(youEl.current, YOU_START);
      place(themEl.current, THEM_START);
      busy.current = false;
      return;
    }

    const n = rallyRef.current + 1;
    rallyRef.current = n;
    setRally(n);
    if (n > readBest()) writeBest(n);

    const onTarget = dist(land, target) <= TARGET_R;
    if (onTarget) setTargetsHit((t) => t + 1);
    setMessage(onTarget ? "Right on the target." : PRAISE[n % PRAISE.length]);

    // The bounce carries to the opponent, who sends it back somewhere on your side.
    await fly(land, themTo, 22);
    const back = { x: rand(LEFT + 30, NET - 80), y: rand(TOP + 14, BOTTOM - 14) };
    const youTo = { x: clamp(back.x - 60, LEFT - 34, NET - 120), y: back.y };
    await fly(themTo, back, 70, [youEl.current, you.current, youTo]);
    you.current = youTo;
    ball.current = back;
    addMark(back, false);
    setTarget(randomTarget());
    busy.current = false;
  }

  function onPointerDown(e: PointerEvent<SVGSVGElement>) {
    const matrix = svg.current?.getScreenCTM();
    if (!matrix) return;
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(matrix.inverse());
    void hit({ x: p.x, y: p.y });
  }

  return (
    <figure className={styles.figure}>
      <div className={styles.hud} aria-live="polite">
        <div>
          <span className="label">Rally</span>
          <strong>{rally}</strong>
        </div>
        <div>
          <span className="label">Best</span>
          <strong>{best}</strong>
        </div>
        <div>
          <span className="label">On target</span>
          <strong>{targetsHit}</strong>
        </div>
        <p className={styles.message}>{message}</p>
      </div>

      <svg
        ref={svg}
        className={styles.court}
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        onPointerDown={onPointerDown}
        role="img"
        aria-label="A clay tennis court seen from above. Click the right half to hit a shot."
      >
        <rect width={VIEW_W} height={VIEW_H} className={styles.surround} />
        <rect x={COURT.x} y={COURT.y} width={COURT.w} height={COURT.h} className={styles.surface} />

        <g className={styles.lines}>
          <rect x={COURT.x} y={COURT.y} width={COURT.w} height={COURT.h} />
          <line x1={LEFT} y1={TOP} x2={RIGHT} y2={TOP} />
          <line x1={LEFT} y1={BOTTOM} x2={RIGHT} y2={BOTTOM} />
          <line x1={NET - SERVICE} y1={TOP} x2={NET - SERVICE} y2={BOTTOM} />
          <line x1={NET + SERVICE} y1={TOP} x2={NET + SERVICE} y2={BOTTOM} />
          <line x1={NET - SERVICE} y1={MID_Y} x2={NET + SERVICE} y2={MID_Y} />
          <line x1={LEFT} y1={MID_Y} x2={LEFT + 10} y2={MID_Y} />
          <line x1={RIGHT - 10} y1={MID_Y} x2={RIGHT} y2={MID_Y} />
        </g>

        <g className={styles.net}>
          <line x1={NET} y1={COURT.y - 14} x2={NET} y2={COURT.y + COURT.h + 14} className={styles.netCord} />
          <line x1={NET + 3} y1={COURT.y - 14} x2={NET + 3} y2={COURT.y + COURT.h + 14} className={styles.netShadow} />
          <circle cx={NET} cy={COURT.y - 16} r={4} />
          <circle cx={NET} cy={COURT.y + COURT.h + 16} r={4} />
        </g>

        <circle key={`${target.x}-${target.y}`} cx={target.x} cy={target.y} r={TARGET_R} className={styles.target} />

        {marks.map((m) => (
          <g key={m.id} className={m.out ? styles.markOut : styles.mark} transform={`translate(${m.x} ${m.y})`}>
            {m.out ? <path d="M-6 -6 L6 6 M6 -6 L-6 6" /> : <ellipse rx={7} ry={4} />}
          </g>
        ))}

        <g ref={youEl} className={styles.you} transform={`translate(${YOU_START.x} ${YOU_START.y})`}>
          <circle r={10} />
          <text y={26}>YOU</text>
        </g>
        <g ref={themEl} className={styles.them} transform={`translate(${THEM_START.x} ${THEM_START.y})`}>
          <circle r={10} />
          <text y={26}>THEM</text>
        </g>

        <ellipse ref={shadowEl} cx={SERVE_SPOT.x} cy={SERVE_SPOT.y} rx={6} ry={3.5} className={styles.shadow} />
        <circle ref={ballEl} cx={SERVE_SPOT.x} cy={SERVE_SPOT.y} r={6} className={styles.ball} />
      </svg>

      <figcaption className="widget-caption">
        <span className="label">Fig. II — click to place your shot · stay inside the singles lines</span>
        <button type="button" className="btn" onClick={() => void hit(target)}>
          Hit to target
        </button>
      </figcaption>
    </figure>
  );
}
