import { EightLimbs } from "../EightLimbs";
import { RoundTimer } from "../RoundTimer";
import { ChapterHeader } from "./ChapterHeader";

export function RingChapter() {
  return (
    <section className="chapter tone-ring" id="ring">
      <div className="wrap">
        <ChapterHeader
          numeral="III"
          kicker="Chapter III · Muay Thai"
          title="Ring"
          tagline="The art of eight limbs."
        />

        <div className="chapter-grid">
          <div className="prose" data-reveal>
            <p>
              Muay Thai uses fists, elbows, knees and shins — eight points of contact, hence the name.
              Training is humbling in the best way: conditioning you can&rsquo;t fake, technique that only
              shows up after the thousandth repetition, and a culture built on respect for your teachers.
            </p>
            <p>
              Before a fight, fighters perform the <em>wai kru ram muay</em>, a ritual dance that honors
              their teachers and the tradition they come from. I love that a sport this hard begins with
              an act of reverence.
            </p>
          </div>
          <div data-reveal>
            <EightLimbs />
          </div>
        </div>

        <div className="chapter-grid is-flipped" style={{ marginTop: "clamp(56px, 8vw, 96px)" }}>
          <div className="prose" data-reveal>
            <h3 style={{ marginTop: 0 }}>Pad work, anyone?</h3>
            <p>
              Here&rsquo;s the round timer I&rsquo;d want on the gym wall: five three-minute rounds, a
              minute of rest, a bell to start and finish, and a clap at ten seconds to empty the tank.
              Turn your sound on.
            </p>
          </div>
          <div data-reveal>
            <RoundTimer />
          </div>
        </div>
      </div>
    </section>
  );
}
