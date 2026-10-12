import * as React from "react"
import { Link } from "gatsby"

import { languages } from "../data/cv"

// Top bar with the language switch. The current language is plain text,
// the other one is a link to the same page in that language.
const Header = ({ lang = "en", label = "Language" }) => (
  <header className="site-header">
    <nav aria-label={label}>
      <ul className="language-switch">
        {languages.map(item => (
          <li key={item.lang}>
            {item.lang === lang ? (
              <span aria-current="page" lang={item.lang}>
                {item.name}
              </span>
            ) : (
              <Link to={item.path} hrefLang={item.lang} lang={item.lang}>
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  </header>
)

export default Header
