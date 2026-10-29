import * as React from "react"
import { Link } from "gatsby"
import { motion } from "motion/react"

import Reveal, { ease } from "./reveal"
import Backdrop from "./backdrop"
import HeroTerminal from "./hero-terminal"
import CodeWindow from "./code-window"
import { useTerminal } from "./terminal-context"
import { site, links } from "../data/site"
import { heroBackground, contactBackground } from "../data/theme"
import { pageRoutes, postPath, formatLongDate } from "../data/routes"

const sectionCount = "04"

const Eyebrow = ({ index, children }) => (
  <p className="eyebrow">
    [ <span className="accent">{index}</span> / {sectionCount} ] · {children}
  </p>
)

const Arrow = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

const Check = () => (
  <svg
    className="work__check"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12l5 5 9-10" />
  </svg>
)

// Ridges of the Turkestan Range over Baul, for the blog teaser
const Ridges = () => (
  <svg
    className="post-teaser__ridges"
    viewBox="0 0 520 260"
    preserveAspectRatio="xMidYMax slice"
    aria-hidden="true"
  >
    <path
      className="ridge is-far"
      d="M0 200 L70 120 L118 160 L190 62 L250 140 L300 104 L372 176 L430 118 L520 190"
    />
    <path
      className="ridge is-mid"
      d="M0 224 L60 170 L130 206 L210 128 L280 196 L350 150 L430 210 L520 168"
    />
    <path
      className="ridge is-near"
      d="M0 260 L0 236 L90 196 L160 226 L240 172 L320 220 L400 184 L520 230 L520 260 Z"
    />
    <circle className="ridge-dot" cx="240" cy="172" r="4" />
  </svg>
)

// Products: a tab per product, what I did there, and its layers from
// the interface down to the data.
const Work = ({ text, product, onSelect }) => (
  <div className="work">
    <div className="work__tabs" role="group" aria-label={text.workTabs}>
      {text.products.map(item => (
        <button
          key={item.id}
          type="button"
          className="work__tab"
          aria-pressed={item.id === product.id}
          onClick={() => onSelect(item.id)}
        >
          <span className="work__dot" aria-hidden="true" />
          {item.name}
        </button>
      ))}
    </div>

    <motion.div
      key={product.id}
      className="work__detail"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease }}
    >
      <p className="work__kind">{product.kind}</p>
      <h3 className="work__title">{product.title}</h3>
      <p className="work__text">{product.text}</p>
      <ul className="work__items">
        {product.items.map(item => (
          <li key={item.label}>
            <Check />
            <p>
              <strong>{item.label}.</strong> {item.text}
            </p>
          </li>
        ))}
      </ul>
      <ul className="chips">
        {product.stack.map(name => (
          <li key={name} className="chip">
            {name}
          </li>
        ))}
      </ul>
    </motion.div>

    <figure className="layers">
      <figcaption className="visually-hidden">{text.diagramLabel}</figcaption>
      <span className="layers__line" aria-hidden="true">
        <span className="layers__pulse" />
      </span>
      <ol className="layers__list">
        {product.layers.map((layer, index) => (
          <motion.li
            key={`${product.id}-${layer.tag}`}
            className="layer"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease, delay: index * 0.06 }}
          >
            <span className="layer__tag">{layer.tag}</span>
            <span className="layer__body">
              <span className="layer__title">{layer.title}</span>
              <span className="layer__sub">{layer.sub}</span>
            </span>
          </motion.li>
        ))}
      </ol>
    </figure>
  </div>
)

// Home page: the first screen with a live terminal, products, stack,
// journey, the latest post and contacts.
const AboutPage = ({ lang = "en", latestPost }) => {
  const text = site[lang].about
  const { open } = useTerminal()
  const [productId, setProductId] = React.useState(text.products[0].id)
  const product =
    text.products.find(item => item.id === productId) || text.products[0]

  return (
    <>
      {latestPost && (
        <Link className="announce" to={postPath(lang, latestPost.slug)}>
          <span className="announce__dot" aria-hidden="true" />
          <span>
            {text.announce}: {latestPost.title}
          </span>
          <span className="announce__read" aria-hidden="true">
            {text.announceRead} →
          </span>
        </Link>
      )}

      <section className="hero" aria-labelledby="hero-title">
        <Backdrop
          name={heroBackground.name}
          className="hero__backdrop"
          {...heroBackground.props}
        />
        <div className="frame hero__inner">
          <div className="hero__copy">
            <p className="hero__eyebrow">
              <span className="accent">[ {text.eyebrow} ]</span>
              <span>{text.role}</span>
            </p>
            <h1 id="hero-title" className="hero__title">
              <span className="visually-hidden">Abdillamit Mamytov. </span>
              {text.title.before}{" "}
              <span className="accent">{text.title.accent}</span>
            </h1>
            <p className="hero__lede">{text.lede}</p>
            <div className="hero__actions">
              <Link
                className="button button--accent"
                to={pageRoutes.resume[lang]}
              >
                {text.openResume}
                <Arrow />
              </Link>
              <a className="button button--ghost" href={links.github}>
                {text.github}
              </a>
              <button
                type="button"
                className="hero__hint"
                onClick={() => open()}
              >
                {text.terminalHint.before} <kbd>~</kbd>{" "}
                {text.terminalHint.after}
              </button>
            </div>
          </div>
          <HeroTerminal lang={lang} />
        </div>
      </section>

      <section
        className="products"
        aria-label={`${text.productsLabel.before} ${text.productsLabel.accent}`}
      >
        <div className="frame products__grid">
          <p className="products__label">
            {text.productsLabel.before}{" "}
            <span className="accent">{text.productsLabel.accent}</span>
          </p>
          {text.products.map(item => (
            <a
              key={item.id}
              className="products__cell"
              href="#work"
              onClick={() => setProductId(item.id)}
            >
              <span className="products__name">{item.name}</span>
              <span className="products__kind">{item.kind}</span>
            </a>
          ))}
        </div>
      </section>

      <section id="work" className="section" aria-labelledby="work-title">
        <div className="frame section__inner">
          <Reveal as="header" className="section__head">
            <Eyebrow index="01">{text.workEyebrow}</Eyebrow>
            <h2 id="work-title" className="section__title">
              {text.workTitle}
            </h2>
            <p className="section__text">{text.workText}</p>
          </Reveal>
          <Work text={text} product={product} onSelect={setProductId} />
        </div>
      </section>

      <section id="stack" className="section" aria-labelledby="stack-title">
        <div className="frame section__inner">
          <Reveal as="header" className="section__head">
            <Eyebrow index="02">{text.stackEyebrow}</Eyebrow>
            <h2 id="stack-title" className="section__title">
              {text.stackTitle}
            </h2>
          </Reveal>
          <Reveal className="stack">
            <CodeWindow label={text.stackFiles} />
            <ul className="stack__notes">
              {text.stackNotes.map(note => (
                <li key={note.label}>
                  <span className="stack__label">{note.label}</span>
                  <p>{note.text}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section id="journey" className="section" aria-labelledby="journey-title">
        <div className="frame section__inner">
          <Reveal as="header" className="section__head">
            <Eyebrow index="03">{text.journeyEyebrow}</Eyebrow>
            <h2 id="journey-title" className="section__title">
              {text.journeyTitle}
            </h2>
          </Reveal>
          <ol className="journey">
            {text.journey.map((step, index) => (
              <Reveal
                as="li"
                key={step.mark}
                delay={index * 0.06}
                className={
                  index === text.journey.length - 1
                    ? "journey__step is-now"
                    : "journey__step"
                }
              >
                <span className="journey__dot" aria-hidden="true" />
                <span
                  className={
                    step.isWord ? "journey__mark is-word" : "journey__mark"
                  }
                >
                  {step.mark}
                </span>
                <h3 className="journey__title">{step.title}</h3>
                <p className="journey__text">{step.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section id="blog" className="section" aria-labelledby="blog-title">
        <div className="frame section__inner">
          <Reveal as="header" className="section__head section__head--row">
            <div>
              <Eyebrow index="04">{text.blogEyebrow}</Eyebrow>
              <h2 id="blog-title" className="section__title">
                {text.blogTitle}
              </h2>
            </div>
            <Link className="more-link" to={pageRoutes.blog[lang]}>
              {text.allPosts} →
            </Link>
          </Reveal>
          {latestPost && (
            <Reveal as="article" className="post-teaser">
              <div className="post-teaser__body">
                <p className="post-teaser__meta">
                  <time dateTime={latestPost.date}>
                    {formatLongDate(latestPost.date, lang)}
                  </time>
                  {latestPost.timeToRead
                    ? ` · ${latestPost.timeToRead} ${site[lang].blog.minRead}`
                    : ""}
                </p>
                <h3 className="post-teaser__title">
                  <Link to={postPath(lang, latestPost.slug)}>
                    {latestPost.title}
                  </Link>
                </h3>
                <p className="post-teaser__text">{latestPost.description}</p>
                <span className="post-teaser__read" aria-hidden="true">
                  {text.readPost} →
                </span>
              </div>
              <div className="post-teaser__art" aria-hidden="true">
                <Ridges />
                <span className="post-teaser__place">{text.place}</span>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      <section className="contact" aria-labelledby="contact-title">
        <Backdrop
          name={contactBackground.name}
          className="contact__backdrop"
          {...contactBackground.props}
        />
        <div className="frame contact__inner">
          <p className="eyebrow">
            <span className="accent">[ {text.contactEyebrow} ]</span>
          </p>
          <h2 id="contact-title" className="contact__title">
            {text.contactTitle}
          </h2>
          <p className="contact__text">{text.contactText}</p>
          <div className="contact__actions">
            <a className="button button--accent" href={links.email}>
              {links.emailLabel}
            </a>
            <a className="button button--ghost" href={links.linkedin}>
              LinkedIn
            </a>
            <a className="button button--ghost" href={links.github}>
              GitHub
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

export default AboutPage
