import * as React from "react"
import { MotionConfig } from "motion/react"

import Header from "./header"
import Footer from "./footer"
import "../styles/site.css"

const skipLabel = { en: "Skip to content", ru: "Перейти к содержанию" }

// Frame around every page. It is mounted once (see wrap-page-element.js)
// and gets new props on each navigation.
const Layout = ({
  lang = "en",
  current,
  translations,
  isPost = false,
  pathname = "/",
  children,
}) => {
  const [menuOpen, setMenuOpen] = React.useState(false)
  const contentRef = React.useRef(null)

  // Close the menu after navigation
  React.useEffect(() => setMenuOpen(false), [pathname])

  // While the menu is open, the page behind it can't be scrolled or
  // reached with the keyboard.
  React.useEffect(() => {
    if (contentRef.current) contentRef.current.inert = menuOpen
    document.documentElement.classList.toggle("has-menu-open", menuOpen)
    return () => document.documentElement.classList.remove("has-menu-open")
  }, [menuOpen])

  return (
    // "user": skip movement for people who ask their system for less
    <MotionConfig reducedMotion="user">
      <div className="page">
        <a className="skip-link" href="#content">
          {skipLabel[lang] || skipLabel.en}
        </a>
        <Header
          lang={lang}
          current={current}
          translations={translations}
          isPost={isPost}
          pathname={pathname}
          menuOpen={menuOpen}
          onMenuChange={setMenuOpen}
        />
        <div className="page-content" ref={contentRef}>
          {/* The key restarts the page-in animation on every page */}
          <main
            id="content"
            key={pathname}
            className="page-main"
            data-testid="content-wrapper"
          >
            {children}
          </main>
          <Footer lang={lang} />
        </div>
      </div>
    </MotionConfig>
  )
}

export default Layout
