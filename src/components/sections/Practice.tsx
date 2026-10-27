const units = [
  {
    num: "I",
    tone: "code",
    chapter: "Code",
    unit: "the commit",
    text: "Small, honest changes. Ship it, read the diff, do it again tomorrow.",
  },
  {
    num: "II",
    tone: "court",
    chapter: "Court",
    unit: "the rep",
    text: "A basket of balls and the same forehand a hundred times, until it's boring. Then it's yours.",
  },
  {
    num: "III",
    tone: "ring",
    chapter: "Ring",
    unit: "the round",
    text: "Three minutes. Breathe, keep your hands up, and finish the round you're in.",
  },
  {
    num: "IV",
    tone: "altar",
    chapter: "Altar",
    unit: "the bead",
    text: "Fifty-three Hail Marys, one at a time. The repetition isn't a flaw in the prayer; it's the point.",
  },
];

export function Practice() {
  return (
    <section className="practice" id="practice">
      <div className="wrap">
        <div className="practice-head" data-reveal>
          <h2>
            Four practices, <em>one lesson.</em>
          </h2>
          <p>
            None of these can be learned by reading about them. You get better by repetition, by being
            corrected, and by showing up on the days you don&rsquo;t feel like it. Each one has its own
            unit of work:
          </p>
        </div>
        <ol className="units">
          {units.map((u, i) => (
            <li key={u.num} className={`unit tone-${u.tone}`} data-reveal style={{ "--delay": `${i * 0.08}s` } as React.CSSProperties}>
              <span className="unit-num">
                {u.num} — {u.chapter}
              </span>
              <h3>
                <span>{u.unit}</span>
              </h3>
              <p>{u.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
