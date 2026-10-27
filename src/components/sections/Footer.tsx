import { site } from "@/content/site";
import { CurrentYear } from "../CurrentYear";

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <p className="footer-motto" data-reveal>
          Ora <em>et</em> labora.
        </p>
        <p className="footer-sub">Pray and work. Thanks for stopping by.</p>

        <div className="footer-row">
          <ul className="footer-links">
            <li>
              <a href={site.links.github}>GitHub</a>
            </li>
            <li>
              <a href={`mailto:${site.links.email}`}>Email</a>
            </li>
            <li>
              <a href="#top">Back to top ↑</a>
            </li>
          </ul>
          <p className="label">
            © <CurrentYear /> {site.name} · Set in Fraunces, Newsreader &amp; JetBrains Mono ·
            Built with Next.js · Colors follow the liturgical calendar · AMDG
          </p>
        </div>
      </div>
    </footer>
  );
}
