import * as React from "react"
import { Link } from "gatsby"

import { languages } from "../data/cv"
import { site } from "../data/site"
import { pageRoutes } from "../data/routes"

const sections = ["about", "resume", "blog"]

// Site header: name, section links and the language switch.
// `translations` maps each language to the same page in that language.
const Header = ({ lang = "en", current, translations }) => {
  const text = site[lang].nav
  const other = translations || {
    en: pageRoutes.about.en,
    ru: pageRoutes.about.ru,
  }

  return (
    <header className="site-header">
      <Link to={pageRoutes.about[lang]} className="brand">
        Abdillamit Mamytov
      </Link>
      <nav aria-label={text.label} className="site-nav">
        <ul className="nav-links">
          {sections.map(section => (
            <li key={section}>
              <Link
                to={pageRoutes[section][lang]}
                aria-current={current === section ? "page" : undefined}
              >
                {text[section]}
              </Link>
            </li>
          ))}
        </ul>
        <ul className="language-switch" aria-label={text.language}>
          {languages.map(item => (
            <li key={item.lang}>
              {item.lang === lang ? (
                <span aria-current="true" lang={item.lang}>
                  {item.lang.toUpperCase()}
                </span>
              ) : (
                <Link
                  to={other[item.lang]}
                  hrefLang={item.lang}
                  lang={item.lang}
                  title={item.name}
                >
                  {item.lang.toUpperCase()}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

export default Header
