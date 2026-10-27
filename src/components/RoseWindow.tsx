import styles from "./RoseWindow.module.css";

/**
 * A stained-glass rose window drawn from rings of petals and roundels.
 * The panes marked "season" take the current liturgical color.
 */

const C = 200;
const round = (n: number) => Math.round(n * 100) / 100;

function polar(r: number, deg: number) {
  const a = ((deg - 90) * Math.PI) / 180;
  return { x: round(C + r * Math.cos(a)), y: round(C + r * Math.sin(a)) };
}

const ring = (count: number, offset = 0) =>
  Array.from({ length: count }, (_, i) => ({ i, deg: (360 / count) * i + offset }));

const outer = ring(16).map(({ i, deg }) => ({ i, ...polar(164, deg) }));
const petals = ring(16, 11.25).map(({ i, deg }) => ({ i, deg, ...polar(106, deg) }));
const inner = ring(8).map(({ i, deg }) => ({ i, deg, ...polar(60, deg) }));
const spokes = ring(16, 11.25).map(({ i, deg }) => ({ i, a: polar(34, deg), b: polar(186, deg) }));

export function RoseWindow({ className = "" }: { className?: string }) {
  return (
    <svg className={`${styles.rose} ${className}`} viewBox="0 0 400 400" role="img" aria-label="A stained-glass rose window">
      <defs>
        <radialGradient id="rose-light" cx="50%" cy="42%" r="60%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.45" />
          <stop offset="55%" stopColor="#fff" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx={C} cy={C} r={196} className={styles.frame} />
      <circle cx={C} cy={C} r={188} className={styles.lead} />

      <g className={styles.spinSlow}>
        {spokes.map(({ i, a, b }) => (
          <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className={styles.tracery} />
        ))}
        {outer.map(({ i, x, y }) => (
          <g key={i}>
            <circle cx={x} cy={y} r={21} className={i % 2 ? styles.blue : styles.season} />
            <circle cx={x} cy={y} r={8} className={i % 2 ? styles.gold : styles.red} />
          </g>
        ))}
      </g>

      <circle cx={C} cy={C} r={140} className={styles.ringLead} />

      <g className={styles.spinBack}>
        {petals.map(({ i, deg, x, y }) => (
          <ellipse
            key={i}
            cx={x}
            cy={y}
            rx={15}
            ry={36}
            transform={`rotate(${round(deg)} ${x} ${y})`}
            className={i % 2 ? styles.red : styles.gold}
          />
        ))}
        {inner.map(({ i, deg, x, y }) => (
          <ellipse
            key={i}
            cx={x}
            cy={y}
            rx={13}
            ry={25}
            transform={`rotate(${round(deg)} ${x} ${y})`}
            className={i % 2 ? styles.blue : styles.season}
          />
        ))}
      </g>

      <circle cx={C} cy={C} r={30} className={styles.gold} />
      <path d="M194 178h12v16h16v12h-16v16h-12v-16h-16v-12h16z" className={styles.cross} />
      <circle cx={C} cy={C} r={188} fill="url(#rose-light)" pointerEvents="none" />
    </svg>
  );
}
