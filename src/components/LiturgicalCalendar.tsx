"use client";

import { useState, type CSSProperties } from "react";
import { COLOR_LABELS, dayTitle, yearProgress, type SeasonKey } from "@/lib/liturgical";
import { useLiturgy } from "./LiturgyProvider";
import styles from "./LiturgicalCalendar.module.css";

const short = (d: Date) => d.toLocaleDateString(undefined, { month: "short", day: "numeric" });

export function LiturgicalCalendar() {
  const { today, year, preview, setPreview } = useLiturgy();
  const [selected, setSelected] = useState<SeasonKey | null>(null);

  if (!today || !year) {
    return (
      <div className={styles.card} aria-busy="true">
        <p className="label">Today in the Church</p>
        <p className={styles.day}>Reading the calendar…</p>
      </div>
    );
  }

  const title = dayTitle(today);
  const progress = yearProgress(today.date, year);
  const previewing = preview && selected ? year.seasons.find((s) => s.key === selected) : null;

  function toggle(key: SeasonKey) {
    const season = year!.seasons.find((s) => s.key === key)!;
    if (selected === key) {
      setSelected(null);
      setPreview(null);
    } else {
      setSelected(key);
      setPreview(season.color);
    }
  }

  return (
    <div className={styles.card}>
      <p className="label">Today in the Church</p>
      <p className={styles.day}>
        {title.lead}
        <span>{title.joiner}</span>
        {title.rest}
      </p>
      {today.feast && <p className={styles.feast}>{today.feast}</p>}
      <p className={styles.color}>
        <span className={styles.swatch} style={{ background: `var(--lit-${today.color})` }} aria-hidden="true" />
        Liturgical color: <strong>{COLOR_LABELS[today.color]}</strong>
      </p>

      <div className={styles.stripWrap}>
        <div className={styles.strip} role="group" aria-label="Seasons of the liturgical year — select one to preview its color">
          {year.seasons.map((s) => (
            <button
              key={s.key}
              type="button"
              className={`${styles.segment} ${selected === s.key ? styles.selected : ""}`}
              style={{ flexGrow: s.days, "--seg": `var(--lit-${s.color})` } as CSSProperties}
              onClick={() => toggle(s.key)}
              aria-pressed={selected === s.key}
              title={`${s.name}: ${short(s.start)} – ${short(s.end)}`}
            >
              <span className={styles.segLabel}>{s.days >= 28 ? s.name : ""}</span>
              <span className="sr-only">
                {s.name}, {short(s.start)} to {short(s.end)}
              </span>
            </button>
          ))}
        </div>
        <span className={styles.marker} style={{ left: `${progress * 100}%` }} aria-hidden="true">
          <span>Today</span>
        </span>
      </div>
      <div className={styles.ends}>
        <span className="label">Advent · {short(year.start)}</span>
        <span className="label">{short(year.end)}</span>
      </div>

      <p className={styles.hint}>
        {previewing ? (
          <>
            Previewing <strong>{previewing.name}</strong> across the whole site.{" "}
            <button
              type="button"
              className={styles.reset}
              onClick={() => {
                setSelected(null);
                setPreview(null);
              }}
            >
              Back to today
            </button>
          </>
        ) : (
          "Tap a season to see the site in its color."
        )}
      </p>
    </div>
  );
}
