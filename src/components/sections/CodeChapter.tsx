import { site } from "@/content/site";
import { Terminal } from "../Terminal";
import { ChapterHeader } from "./ChapterHeader";

export function CodeChapter() {
  return (
    <section className="chapter tone-code" id="code">
      <div className="wrap">
        <ChapterHeader
          numeral="I"
          kicker="Chapter I · Programming"
          title="Code"
          tagline="The craft of making things that think a little."
        />

        <div className="chapter-grid">
          <div className="prose" data-reveal>
            <p>
              Programming is the closest thing I have to a workshop. I love the moment a vague idea turns
              into something that actually runs — and the slower satisfaction of coming back months later
              and finding code that is still easy to read.
            </p>
            <p>
              It&rsquo;s also the most forgiving of my four disciplines: you can fail a hundred times an
              hour and nobody gets hit.
            </p>
            <h3>What I care about</h3>
            <ol className="ledger">
              <li>Simple over clever.</li>
              <li>Tools that do one job well.</li>
              <li>Reading other people&rsquo;s code — it&rsquo;s the fastest way to learn.</li>
              <li>Writing things down so future me isn&rsquo;t confused.</li>
            </ol>
          </div>

          <figure style={{ margin: 0 }} data-reveal>
            <Terminal />
            <figcaption className="widget-caption">
              <span className="label">Fig. I — a working shell. Try `help`, `date` or `cd court`.</span>
            </figcaption>
          </figure>
        </div>

        <div className="workbench" data-reveal>
          <div className="workbench-head">
            <h3>On the workbench</h3>
            <a className="label" href={site.links.github}>
              More on GitHub →
            </a>
          </div>
          <div className="projects">
            {site.projects.map((p) => {
              const Tag = p.href ? "a" : "article";
              return (
                <Tag key={p.name} className="project" {...(p.href ? { href: p.href } : {})}>
                  <ul className="tags">
                    {p.tags.map((t, i) => (
                      <li key={`${t}-${i}`}>{t}</li>
                    ))}
                  </ul>
                  <h4>{p.name}</h4>
                  <p>{p.description}</p>
                </Tag>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
