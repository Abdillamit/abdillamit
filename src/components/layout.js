import * as React from "react"

import Header from "./header"
import Footer from "./footer"
import "../styles/site.css"

const skipLabel = { en: "Skip to content", ru: "Перейти к содержанию" }

const Layout = ({ lang = "en", current, translations, children }) => (
  <div className="page">
    <a className="skip-link" href="#content">
      {skipLabel[lang] || skipLabel.en}
    </a>
    <Header lang={lang} current={current} translations={translations} />
    <main id="content" data-testid="content-wrapper">
      {children}
    </main>
    <Footer lang={lang} />
  </div>
)

export default Layout
