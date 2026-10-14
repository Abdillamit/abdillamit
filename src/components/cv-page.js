import * as React from "react"

import Period from "./period"
import { formatDay } from "./format-day"
import { updated } from "../data/cv"
import { site } from "../data/site"

const Items = ({ items }) => (
  <ul className="items">
    {items.map(item => (
      <li key={item.label}>
        <strong>{item.label}:</strong> {item.text}
      </li>
    ))}
  </ul>
)

// One resume section: title in the left column, content on the right.
const Section = ({ id, title, children }) => (
  <section className="split cv-section" aria-labelledby={id}>
    <h2 id={id} className="section-title">
      {title}
    </h2>
    <div className="cv-section__body">{children}</div>
  </section>
)

const CvPage = ({ content }) => {
  const { headings, ui } = content
  const text = site[content.lang].resume

  return (
    <article className="cv wrap">
      <header className="page-head">
        <div className="page-head__row">
          <h1 className="page-title">{text.title}</h1>
          <p className="page-meta">
            <span className="is-italic">
              {text.updated}{" "}
              <time dateTime={updated}>{formatDay(updated)}</time>
            </span>
            <a href={text.pdf} download>
              {text.download}
            </a>
          </p>
        </div>
        <p className="page-lede">{content.profile}</p>
        <ul className="cv-contacts">
          {content.contacts.map(contact => (
            <li key={contact.id}>
              <a href={contact.href}>{contact.label}</a>
            </li>
          ))}
        </ul>
      </header>

      <Section id="experience" title={headings.experience}>
        <ol className="entries">
          {content.experience.map(job => (
            <li className="entry" key={`${job.org}-${job.from}`}>
              <div className="entry-head">
                <h3 className="entry-name">{job.org}</h3>
                <span className="entry-place">{job.place}</span>
                <p className="entry-sub">{job.title}</p>
                <span className="entry-date">
                  <Period
                    from={job.from}
                    to={job.to}
                    presentLabel={ui.present}
                  />
                </span>
              </div>
              <Items items={job.items} />
            </li>
          ))}
        </ol>
      </Section>

      <Section id="projects" title={headings.projects}>
        <ul className="entries">
          {content.projects.map(project => (
            <li className="entry" key={project.name}>
              <div className="entry-head">
                <h3 className="entry-name">{project.name}</h3>
                {project.kind && (
                  <span className="entry-place is-italic">{project.kind}</span>
                )}
                <p className="entry-sub">{project.stack}</p>
              </div>
              <Items items={project.items} />
            </li>
          ))}
        </ul>
      </Section>

      <Section id="education" title={headings.education}>
        <ol className="entries">
          {content.education.map(course => (
            <li className="entry" key={course.org}>
              <div className="entry-head">
                <h3 className="entry-name">{course.org}</h3>
                <span className="entry-place is-italic">
                  <Period
                    from={course.from}
                    to={course.to}
                    presentLabel={ui.present}
                  />
                </span>
                <p className="entry-sub">{course.program}</p>
              </div>
              <p className="entry-stack">
                {ui.stack}: {course.stack}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="skills" title={headings.skills}>
        <dl className="skills">
          {content.skills.map(skill => (
            <React.Fragment key={skill.label}>
              <dt>{skill.label}</dt>
              <dd>{skill.text}</dd>
            </React.Fragment>
          ))}
        </dl>
      </Section>

      <Section id="languages" title={headings.languages}>
        <p>{content.languages}</p>
      </Section>
    </article>
  )
}

export default CvPage
