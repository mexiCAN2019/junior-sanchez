import { site } from "@/content/site";
import { RoseWindow } from "../RoseWindow";
import { Typer } from "../Typer";

const words = [
  { href: "#code", word: "Code,", num: "I", tone: "code", outline: false },
  { href: "#court", word: "Court,", num: "II", tone: "court", outline: true },
  { href: "#ring", word: "Ring", num: "III", tone: "ring", outline: false, amp: true },
  { href: "#altar", word: "Altar.", num: "IV", tone: "altar", outline: true },
];

export function Hero() {
  return (
    <section className="hero" id="top">
      <RoseWindow className="hero-seal" />
      <div className="wrap hero-grid">
        <p className="hero-eyebrow label">A personal almanac · Vol. I</p>

        <h1 className="hero-title">
          <span className="sr-only">{site.name}: </span>
          {words.map((w) => (
            <span key={w.href} className="hero-line">
              <a href={w.href} className={`hero-word tone-${w.tone} ${w.outline ? "is-outline" : ""}`}>
                {w.word}
                <sup aria-hidden="true">{w.num}</sup>
              </a>
              {w.amp && <span className="hero-amp"> &amp;</span>}
            </span>
          ))}
        </h1>

        <div className="hero-aside">
          <p className="hero-hello">Hi — I&rsquo;m {site.firstName}.</p>
          <p>{site.intro}</p>
          <p className="hero-typer">
            I <Typer phrases={site.typer} />
          </p>
        </div>
      </div>
    </section>
  );
}
