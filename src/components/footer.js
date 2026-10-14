import * as React from "react"

import { site, links } from "../data/site"

// Black "colophon" block at the bottom of every page.
const Footer = ({ lang = "en" }) => {
  const text = site[lang].footer

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div>
          <h2 className="colophon-title">{text.colophonTitle}</h2>
          <p className="colophon">
            {text.colophonBefore} <a href={links.claudeCode}>Claude Code</a>
            {text.colophonMiddle} <a href={links.source}>GitHub</a>.
          </p>
        </div>
        <div className="footer-contacts">
          <a href={links.email}>{links.emailLabel}</a>
          <a href={links.linkedin}>linkedin.com/in/abdillamit-mamytov</a>
          <a href={links.github}>github.com/Abdillamit</a>
          <p className="footer-rights">
            © 2026 Abdillamit Mamytov, {text.rights}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
