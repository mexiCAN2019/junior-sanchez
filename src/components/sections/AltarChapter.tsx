import { LiturgicalCalendar } from "../LiturgicalCalendar";
import { RoseWindow } from "../RoseWindow";
import { ChapterHeader } from "./ChapterHeader";

const patrons = [
  {
    tone: "code",
    chapter: "For Chapter I",
    name: "St. Isidore of Seville",
    text: "Tried to write down everything known in the 7th century. Often proposed as patron of the internet.",
  },
  {
    tone: "court",
    chapter: "For Chapter II",
    name: "St. Sebastian",
    text: "Patron saint of athletes — a soldier who was shot full of arrows and got back up.",
  },
  {
    tone: "ring",
    chapter: "For Chapter III",
    name: "St. Michael the Archangel",
    text: "Patron of soldiers and of everyone who fights. “Defend us in battle.”",
  },
  {
    tone: "altar",
    chapter: "For all of it",
    name: "St. Benedict",
    text: "Ora et labora — pray and work. The monastic rule that ties this whole site together.",
  },
];

export function AltarChapter() {
  return (
    <section className="chapter tone-altar" id="altar">
      <div className="wrap">
        <ChapterHeader
          numeral="IV"
          kicker="Chapter IV · Catholicism"
          title="Altar"
          tagline="The thread that runs through everything else."
        />

        <div className="chapter-grid">
          <div className="prose" data-reveal>
            <p>
              My faith isn&rsquo;t a separate hobby so much as the frame around the other three. The Church
              keeps time differently — by seasons and feasts instead of quarters and sprints — and I find
              that rhythm grounding.
            </p>
            <p>
              This site follows along. The accent color you&rsquo;ve been seeing comes from today&rsquo;s
              liturgical calendar: green in Ordinary Time, violet in Advent and Lent, white and gold at
              Christmas and Easter, red for the Passion, Pentecost and the martyrs.
            </p>
            <div style={{ maxWidth: 340, margin: "40px auto 0" }}>
              <RoseWindow />
            </div>
          </div>
          <div data-reveal>
            <LiturgicalCalendar />
          </div>
        </div>

        <figure className="quote" data-reveal>
          <blockquote>
            You have made us for yourself, O Lord, and our heart is restless until it rests in you.
          </blockquote>
          <figcaption className="label">St. Augustine · Confessions, I.1</figcaption>
        </figure>

        <div className="patrons">
          <div className="patrons-head" data-reveal>
            <h3>A patron for every chapter</h3>
            <p>Every discipline could use someone in its corner.</p>
          </div>
          <ul className="patron-list">
            {patrons.map((p, i) => (
              <li
                key={p.name}
                className={`patron tone-${p.tone}`}
                data-reveal
                style={{ "--delay": `${i * 0.08}s` } as React.CSSProperties}
              >
                <span className="label">{p.chapter}</span>
                <h4>{p.name}</h4>
                <p>{p.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
