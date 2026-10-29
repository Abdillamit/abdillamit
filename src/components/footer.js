import * as React from "react"
import { Link } from "gatsby"

import { Peaks } from "./header"
import { site, links } from "../data/site"
import { pageRoutes } from "../data/routes"

const sections = ["about", "resume", "blog"]

// Bottom of every page: name, pages, contacts and the colophon.
const Footer = ({ lang = "en", onOpenTerminal }) => {
  const text = site[lang].footer
  const nav = site[lang].nav

  return (
    <footer className="site-footer">
      <div className="frame site-footer__inner">
        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <Link to={pageRoutes.about[lang]} className="site-footer__name">
              <span className="brand-mark" aria-hidden="true">
                <Peaks />
              </span>
              Abdillamit Mamytov
            </Link>
            <p className="site-footer__role">{nav.role}</p>
          </div>

          <nav className="site-footer__column" aria-label={text.pages}>
            <h2 className="site-footer__heading">{text.pages}</h2>
            {sections.map(section => (
              <Link key={section} to={pageRoutes[section][lang]}>
                {nav[section]}
              </Link>
            ))}
          </nav>

          <div className="site-footer__column footer-contacts">
            <h2 className="site-footer__heading">{text.elsewhere}</h2>
            <a href={links.email}>{links.emailLabel}</a>
            <a href={links.linkedin}>linkedin.com/in/abdillamit-mamytov</a>
            <a href={links.github}>github.com/Abdillamit</a>
          </div>

          <div className="site-footer__column">
            <h2 className="site-footer__heading colophon-title">
              {text.colophonTitle}
            </h2>
            <p className="colophon">
              {text.colophonBefore} <a href={links.claudeCode}>Claude Code</a>
              {text.colophonMiddle} <a href={links.source}>GitHub</a>.
            </p>
          </div>
        </div>

        <div className="site-footer__bottom">
          <p className="footer-rights">
            © 2026 Abdillamit Mamytov, {text.rights}
          </p>
          {onOpenTerminal && (
            <p className="colophon--terminal">
              {text.terminalBefore}{" "}
              <button
                type="button"
                className="link-button"
                onClick={onOpenTerminal}
              >
                {text.terminalButton}
              </button>
            </p>
          )}
        </div>
      </div>
    </footer>
  )
}

export default Footer
