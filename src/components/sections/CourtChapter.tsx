import { RallyCourt } from "../RallyCourt";
import { ChapterHeader } from "./ChapterHeader";

export function CourtChapter() {
  return (
    <section className="chapter tone-court" id="court">
      <div className="wrap">
        <ChapterHeader
          numeral="II"
          kicker="Chapter II · Tennis"
          title="Court"
          tagline="There's no clock. You have to win the last point."
        />

        <div className="chapter-grid is-flipped">
          <div className="prose" data-reveal>
            <p>
              Tennis is a thousand small decisions made at speed: where to stand, when to take the ball
              early, when to stop going for the winner and just put one more ball back. It&rsquo;s also
              brutally honest — nobody can play the point for you.
            </p>
            <p>
              I love that the scoring makes no sense to outsiders, and that you can be down a set and a
              break and still come back. There&rsquo;s always one more point.
            </p>
            <h3>What I&rsquo;m working on</h3>
            <ol className="ledger">
              <li>A first serve I trust when it matters.</li>
              <li>Moving my feet before I swing, not during.</li>
              <li>Patience in long rallies.</li>
            </ol>
            <p className="score-strip" aria-label="Love, fifteen, thirty, forty, game">
              <span>Love</span>
              <span>15</span>
              <span>30</span>
              <span>40</span>
              <span>game.</span>
            </p>
          </div>

          <div data-reveal>
            <RallyCourt />
          </div>
        </div>
      </div>
    </section>
  );
}
