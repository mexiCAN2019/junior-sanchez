"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { clack, ringBell } from "@/lib/audio";
import styles from "./RoundTimer.module.css";

const ROUND_SECONDS = 180;
const REST_SECONDS = 60;
const ROUNDS = 5;

type Phase = "ready" | "fight" | "rest" | "done";
interface Clock {
  phase: Phase;
  round: number;
  remaining: number;
}

const READY: Clock = { phase: "ready", round: 1, remaining: ROUND_SECONDS };

const PHASE_LABEL: Record<Phase, string> = {
  ready: "Gloves on",
  fight: "Fight",
  rest: "Rest",
  done: "Touch gloves — that's a wrap",
};

function format(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function RoundTimer() {
  const [clock, setClock] = useState<Clock>(READY);
  const [running, setRunning] = useState(false);
  // Mirrors of state for the interval callback, written alongside every update.
  const clockRef = useRef<Clock>(READY);
  const endAt = useRef(0);
  const warned = useRef(false);

  const commit = useCallback((next: Clock) => {
    clockRef.current = next;
    setClock(next);
  }, []);

  const begin = useCallback(
    (phase: "fight" | "rest", round: number, seconds: number) => {
      endAt.current = Date.now() + seconds * 1000;
      warned.current = false;
      commit({ phase, round, remaining: seconds });
    },
    [commit],
  );

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      const c = clockRef.current;
      const left = Math.max(0, Math.ceil((endAt.current - Date.now()) / 1000));

      if (c.phase === "fight" && left <= 10 && left > 0 && !warned.current) {
        warned.current = true;
        clack();
      }
      if (left > 0) {
        if (left !== c.remaining) commit({ ...c, remaining: left });
        return;
      }

      if (c.phase === "fight") {
        ringBell(3);
        if (c.round >= ROUNDS) {
          commit({ phase: "done", round: c.round, remaining: 0 });
          setRunning(false);
        } else {
          begin("rest", c.round, REST_SECONDS);
        }
      } else if (c.phase === "rest") {
        ringBell(1);
        begin("fight", c.round + 1, ROUND_SECONDS);
      }
    }, 200);
    return () => window.clearInterval(id);
  }, [running, begin, commit]);

  function primary() {
    if (running) {
      setRunning(false);
      return;
    }
    if (clock.phase === "ready" || clock.phase === "done") {
      ringBell(1);
      begin("fight", 1, ROUND_SECONDS);
    } else {
      endAt.current = Date.now() + clock.remaining * 1000;
    }
    setRunning(true);
  }

  function reset() {
    setRunning(false);
    commit(READY);
  }

  const total = clock.phase === "rest" ? REST_SECONDS : ROUND_SECONDS;
  const progress = clock.phase === "ready" ? 0 : 1 - clock.remaining / total;
  const paused = !running && (clock.phase === "fight" || clock.phase === "rest");
  const label = running ? "Pause" : paused ? "Resume" : clock.phase === "done" ? "Again" : "Start";

  return (
    <div className={`${styles.timer} ${styles[clock.phase]}`}>
      <div className={styles.top}>
        <span className="label">Round timer · {ROUNDS} × 3:00 / 1:00 rest</span>
        <ol className={styles.pips} aria-label={`Round ${clock.round} of ${ROUNDS}`}>
          {Array.from({ length: ROUNDS }, (_, i) => (
            <li
              key={i}
              className={
                i + 1 < clock.round || clock.phase === "done"
                  ? styles.pipDone
                  : i + 1 === clock.round && clock.phase !== "ready"
                    ? styles.pipNow
                    : ""
              }
            />
          ))}
        </ol>
      </div>

      <p className={styles.phase}>
        {clock.phase === "fight" || clock.phase === "rest" ? `Round ${clock.round} — ` : ""}
        {PHASE_LABEL[clock.phase]}
        {paused ? " (paused)" : ""}
      </p>
      <p className={styles.clock} role="timer" aria-live="off">
        {format(clock.remaining)}
      </p>
      <div className={styles.track} aria-hidden="true">
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>

      <div className={styles.controls}>
        <button type="button" className="btn btn-solid" onClick={primary}>
          {label}
        </button>
        <button type="button" className="btn" onClick={reset} disabled={clock.phase === "ready" && !running}>
          Reset
        </button>
        <button type="button" className="btn" onClick={() => ringBell(1)} aria-label="Ring the bell">
          Bell
        </button>
      </div>
    </div>
  );
}
