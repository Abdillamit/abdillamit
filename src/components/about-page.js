import * as React from "react"
import { Link } from "gatsby"
import { motion, useScroll } from "motion/react"

import Reveal from "./reveal"
import { site, links } from "../data/site"
import { pageRoutes, postPath, formatLongDate } from "../data/routes"

// Journey steps with a line that draws down the timeline as the reader
// scrolls through it.
const Timeline = ({ steps }) => {
  const ref = React.useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 60%"],
  })

  return (
    <div className="timeline-wrap" ref={ref}>
      <span className="timeline-track" aria-hidden="true">
        <motion.span
          className="timeline-line"
          style={{ scaleY: scrollYProgress }}
        />
      </span>
      <ol className="timeline">
        {steps.map(step => (
          <Reveal as="li" key={step.mark} className="timeline-step">
            <span
              className={
                step.isWord ? "timeline-mark is-word" : "timeline-mark"
              }
            >
              {step.mark}
            </span>
            <div>
              <h3 className="timeline-title">{step.title}</h3>
              <p className="timeline-text">{step.text}</p>
            </div>
          </Reveal>
        ))}
      </ol>
    </div>
  )
}

// Home page: name, short intro, journey timeline, current work and
// the latest blog post.
const AboutPage = ({ lang = "en", latestPost }) => {
  const text = site[lang].about
  const [firstName, lastName] = ["Abdillamit", "Mamytov"]

  return (
    <>
      <section className="hero wrap">
        {/* Each line rises from behind a mask on load (CSS in site.css) */}
        <h1 className="hero-name">
          <span className="reveal-line">
            <span>{firstName}</span>
          </span>{" "}
          <span className="reveal-line">
            <span>{lastName}</span>
          </span>
        </h1>
        <p className="hero-lede">{text.lede}</p>
        <ul className="hero-links">
          <li>
            <a href={links.github}>{text.links.github}</a>
          </li>
          <li>
            <a href={links.linkedin}>{text.links.linkedin}</a>
          </li>
          <li>
            <a href={links.email}>{text.links.email}</a>
          </li>
          <li>
            <Link to={pageRoutes.resume[lang]}>{text.links.resume}</Link>
          </li>
        </ul>
      </section>

      <section className="wrap" aria-labelledby="journey">
        <div className="split">
          <Reveal as="h2" id="journey" className="section-title">
            {text.journeyTitle}
          </Reveal>
          <Timeline steps={text.journey} />
        </div>
      </section>

      <section className="wrap">
        <div className="two-col">
          <Reveal as="section" aria-labelledby="work">
            <h2 id="work" className="section-title">
              {text.workTitle}
            </h2>
            <ul className="items">
              {text.work.map(item => (
                <li key={item.name}>
                  <strong>{item.name}:</strong> {item.text}
                </li>
              ))}
            </ul>
            <p className="more-link">
              <Link to={pageRoutes.resume[lang]}>{text.openResume}</Link>
            </p>
          </Reveal>

          <Reveal as="section" aria-labelledby="latest" delay={0.12}>
            <h2 id="latest" className="section-title">
              {text.blogTitle}
            </h2>
            {latestPost && (
              <article className="teaser">
                <p className="post-date">
                  <time dateTime={latestPost.date}>
                    {formatLongDate(latestPost.date, lang)}
                  </time>
                </p>
                <h3 className="teaser-title">
                  <Link to={postPath(lang, latestPost.slug)}>
                    {latestPost.title}
                  </Link>
                </h3>
                <p className="teaser-text">{latestPost.description}</p>
              </article>
            )}
            <p className="more-link">
              <Link to={pageRoutes.blog[lang]}>{text.allPosts}</Link>
            </p>
          </Reveal>
        </div>
      </section>
    </>
  )
}

export default AboutPage
