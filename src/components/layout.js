import * as React from "react"

import Header from "./header"
import { updated } from "../data/cv"
import { formatDay } from "./format-day"
import "../styles/site.css"

const Layout = ({ lang = "en", ui = {}, name = "Abdillamit Mamytov", children }) => (
  <div className="page">
    <a className="skip-link" href="#content">
      {ui.skipLink || "Skip to content"}
    </a>
    <Header lang={lang} label={ui.languageNav} />
    <main id="content" data-testid="content-wrapper">
      {children}
    </main>
    <footer className="site-footer">
      <span>{name}</span>
      <span>
        {ui.updated || "Updated"}{" "}
        <time dateTime={updated}>{formatDay(updated)}</time>
      </span>
    </footer>
  </div>
)

export default Layout
