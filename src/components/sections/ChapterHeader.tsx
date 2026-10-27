export function ChapterHeader({
  numeral,
  kicker,
  title,
  tagline,
}: {
  numeral: string;
  kicker: string;
  title: string;
  tagline: string;
}) {
  return (
    <header className="chapter-head" data-reveal>
      <span className="chapter-numeral" aria-hidden="true">
        {numeral}
      </span>
      <p className="chapter-kicker label">{kicker}</p>
      <h2 className="chapter-title">{title}</h2>
      <p className="chapter-tagline">{tagline}</p>
    </header>
  );
}
