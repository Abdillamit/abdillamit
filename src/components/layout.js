import * as React from "react"
import { AnimatePresence, MotionConfig } from "motion/react"

import Header from "./header"
import Footer from "./footer"
import Terminal from "./terminal"
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
  const [terminalOpen, setTerminalOpen] = React.useState(false)
  const contentRef = React.useRef(null)
  const focusBeforeTerminal = React.useRef(null)

  const openTerminal = React.useCallback(() => {
    focusBeforeTerminal.current = document.activeElement
    setMenuOpen(false)
    setTerminalOpen(true)
  }, [])

  const closeTerminal = React.useCallback(() => {
    setTerminalOpen(false)
    focusBeforeTerminal.current?.focus?.()
  }, [])

  // ~ (the key left of 1, in any layout) or Ctrl/Cmd+K opens the terminal
  React.useEffect(() => {
    const onKeyDown = event => {
      if (event.key === "Escape" && terminalOpen) {
        closeTerminal()
        return
      }
      const typing = event.target.closest?.(
        "input, textarea, select, [contenteditable='true']"
      )
      const backquote =
        event.code === "Backquote" &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey &&
        !typing
      const commandK = (event.ctrlKey || event.metaKey) && event.code === "KeyK"
      if (!backquote && !commandK) return
      event.preventDefault()
      if (terminalOpen) closeTerminal()
      else openTerminal()
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [terminalOpen, openTerminal, closeTerminal])

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
          <Footer lang={lang} onOpenTerminal={openTerminal} />
        </div>
        <AnimatePresence>
          {terminalOpen && (
            <Terminal
              lang={lang}
              current={current}
              translations={translations}
              pathname={pathname}
              onClose={closeTerminal}
            />
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  )
}

export default Layout
