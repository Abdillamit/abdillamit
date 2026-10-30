import * as React from "react"
import { Link } from "gatsby"
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "motion/react"

import { languages } from "../data/cv"
import { site, links } from "../data/site"
import { pageRoutes } from "../data/routes"
import { ease } from "./reveal"

const sections = ["about", "resume", "blog"]

// Two peaks of the Turkestan Range, the mark next to the name
export const Peaks = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path
      d="M2 19 L9 6.5 L13 13 L16 8.5 L22 19 Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  </svg>
)

const GitHubIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
  </svg>
)

// Spring for the section underline and the language pill.
const slide = { type: "spring", stiffness: 420, damping: 36 }

// Hides the header while the reader scrolls down and brings it back as
// soon as they scroll up. Always visible near the top of the page.
const useHideOnScroll = pathname => {
  const { scrollY } = useScroll()
  const [hidden, setHidden] = React.useState(false)

  useMotionValueEvent(scrollY, "change", latest => {
    const previous = scrollY.getPrevious() ?? 0
    if (latest < 120 || latest < previous) setHidden(false)
    else if (latest > previous) setHidden(true)
  })

  // A new page starts with the header in view
  React.useEffect(() => setHidden(false), [pathname])

  return [hidden, setHidden]
}

// Section links. A thick piece of the header rule sits under the current
// section, follows the mouse or keyboard focus, and slides to the new
// section after navigation (the layout stays mounted between pages).
const SectionLinks = ({ lang, current, text }) => {
  const [pointed, setPointed] = React.useState(null)
  const marked = pointed || current

  return (
    // The list only listens for the pointer and focus leaving it, to put
    // the underline back; the links inside stay the interactive elements.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <ul
      className="nav-links"
      onMouseLeave={() => setPointed(null)}
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPointed(null)
      }}
    >
      {sections.map(section => (
        <li key={section}>
          <Link
            to={pageRoutes[section][lang]}
            aria-current={current === section ? "page" : undefined}
            onMouseEnter={() => setPointed(section)}
            onFocus={() => setPointed(section)}
          >
            {text[section]}
          </Link>
          {marked === section && (
            <motion.span
              layoutId="nav-underline"
              className="nav-underline"
              transition={slide}
              aria-hidden="true"
            />
          )}
        </li>
      ))}
    </ul>
  )
}

// EN | RU. A pill marks the current language and slides across when the
// reader switches.
const LanguageSwitch = ({ lang, translations, label }) => (
  <ul className="lang-switch" aria-label={label}>
    {languages.map(item => {
      const code = <span className="lang-code">{item.lang.toUpperCase()}</span>

      return (
        <li key={item.lang}>
          {item.lang === lang ? (
            <span className="lang-option" aria-current="true" lang={item.lang}>
              <motion.span
                layoutId="lang-pill"
                className="lang-pill"
                transition={slide}
                aria-hidden="true"
              />
              {code}
            </span>
          ) : (
            <Link
              className="lang-option"
              to={translations[item.lang] || item.path}
              hrefLang={item.lang}
              lang={item.lang}
              title={item.name}
            >
              {code}
            </Link>
          )}
        </li>
      )
    })}
  </ul>
)

const menuList = {
  closed: {},
  open: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
}

const menuLine = {
  closed: { y: "110%" },
  open: { y: "0%", transition: { duration: 0.7, ease } },
}

// Full-screen menu for small screens.
const MobileMenu = ({ lang, current, text, onClose }) => {
  const menuRef = React.useRef(null)

  // Move focus into the menu when it opens
  React.useEffect(() => {
    menuRef.current?.querySelector("a")?.focus()
  }, [])

  return (
    <motion.div
      ref={menuRef}
      id="site-menu"
      className="site-menu"
      initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
      animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
      exit={{
        clipPath: "inset(0% 0% 100% 0%)",
        transition: { duration: 0.35, ease },
      }}
      transition={{ duration: 0.55, ease }}
    >
      <nav aria-label={text.label}>
        <motion.ul
          className="site-menu__links"
          variants={menuList}
          initial="closed"
          animate="open"
        >
          {sections.map((section, index) => (
            <li key={section} className="site-menu__item">
              <motion.span className="site-menu__line" variants={menuLine}>
                <Link
                  to={pageRoutes[section][lang]}
                  aria-current={current === section ? "page" : undefined}
                  className="site-menu__link"
                  onClick={onClose}
                >
                  <span className="site-menu__index" aria-hidden="true">
                    0{index + 1}
                  </span>
                  <span className="site-menu__text">{text[section]}</span>
                </Link>
              </motion.span>
            </li>
          ))}
        </motion.ul>
      </nav>
      <motion.div
        className="site-menu__contacts"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.45, duration: 0.5 } }}
      >
        <p className="site-menu__label">{text.contacts}</p>
        <a href={links.email}>{links.emailLabel}</a>
        <a href={links.linkedin}>LinkedIn</a>
        <a href={links.github}>GitHub</a>
      </motion.div>
    </motion.div>
  )
}

// Thin bar at the top of the window that fills as a post is read.
const ReadProgress = () => {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      className="read-progress"
      style={{ scaleX }}
      aria-hidden="true"
    />
  )
}

// Site header: mark and name, section links, language switch, GitHub
// and, on small screens, a menu button.
// `translations` maps each language to the same page in that language.
const Header = ({
  lang = "en",
  current,
  translations,
  isPost = false,
  pathname = "/",
  menuOpen = false,
  onMenuChange = () => {},
}) => {
  const text = site[lang].nav
  const other = translations || pageRoutes.about
  const [hidden, setHidden] = useHideOnScroll(pathname)
  const buttonRef = React.useRef(null)

  // Escape closes the menu; widening the window past the mobile
  // breakpoint closes it too, so the page never stays locked.
  React.useEffect(() => {
    if (!menuOpen) return undefined

    const onKeyDown = event => {
      if (event.key !== "Escape") return
      onMenuChange(false)
      buttonRef.current?.focus()
    }
    const wide = window.matchMedia?.("(min-width: 46.0625rem)")
    const onWide = event => event.matches && onMenuChange(false)

    document.addEventListener("keydown", onKeyDown)
    wide?.addEventListener?.("change", onWide)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      wide?.removeEventListener?.("change", onWide)
    }
  }, [menuOpen, onMenuChange])

  return (
    <>
      <motion.header
        className="site-header"
        initial={false}
        animate={{ y: hidden && !menuOpen ? "-100%" : "0%" }}
        transition={{ duration: 0.35, ease }}
        onFocus={() => setHidden(false)}
      >
        <div className="wrap">
          <div className="site-header__bar">
            <Link to={pageRoutes.about[lang]} className="brand">
              <span className="brand-mark" aria-hidden="true">
                <Peaks />
              </span>
              <span className="brand-text">
                <span className="brand-name">Abdillamit Mamytov</span>
                <span className="brand-role">{text.role}</span>
              </span>
            </Link>

            <nav aria-label={text.label} className="site-nav">
              <SectionLinks lang={lang} current={current} text={text} />
            </nav>

            <LanguageSwitch
              lang={lang}
              translations={other}
              label={text.language}
            />

            <a
              className="header-icon"
              href={links.github}
              aria-label={text.github}
              title={text.github}
            >
              <GitHubIcon />
            </a>

            <button
              ref={buttonRef}
              type="button"
              className="menu-button"
              aria-expanded={menuOpen}
              aria-controls={menuOpen ? "site-menu" : undefined}
              onClick={() => onMenuChange(!menuOpen)}
            >
              <span className="menu-icon" aria-hidden="true">
                <span />
                <span />
              </span>
              <span className="visually-hidden">
                {menuOpen ? text.close : text.menu}
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      {isPost && <ReadProgress />}

      <AnimatePresence>
        {menuOpen && (
          <MobileMenu
            lang={lang}
            current={current}
            text={text}
            onClose={() => onMenuChange(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default Header
