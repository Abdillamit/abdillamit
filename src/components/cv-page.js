import * as React from "react"

import Period from "./period"

const Items = ({ items }) => (
  <ul className="items">
    {items.map(item => (
      <li key={item.label}>
        <strong>{item.label}:</strong> {item.text}
      </li>
    ))}
  </ul>
)

const Section = ({ id, title, children }) => (
  <section className="cv-section" aria-labelledby={id}>
    <h2 id={id}>{title}</h2>
    {children}
  </section>
)

const CvPage = ({ content }) => {
  const { headings, ui } = content

  return (
    <article className="cv">
      <header className="cv-head">
        <h1 className="cv-name">{content.name}</h1>
        <p className="cv-role">
          <span>{content.role}</span>
          <span>{content.location}</span>
        </p>
        <ul className="cv-contacts">
          {content.contacts.map(contact => (
            <li key={contact.id}>
              <a href={contact.href}>{contact.label}</a>
            </li>
          ))}
        </ul>
      </header>

      <Section id="profile" title={headings.profile}>
        <p className="lede">{content.profile}</p>
      </Section>

      <Section id="experience" title={headings.experience}>
        <ol className="entries">
          {content.experience.map(job => (
            <li className="entry" key={`${job.org}-${job.from}`}>
              <div className="entry-head">
                <h3 className="entry-name">{job.org}</h3>
                <span className="entry-place">{job.place}</span>
                <p className="entry-sub">{job.title}</p>
                <span className="entry-date">
                  <Period from={job.from} to={job.to} presentLabel={ui.present} />
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
                  <Period from={course.from} to={course.to} presentLabel={ui.present} />
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
        <ul className="items items--skills">
          {content.skills.map(skill => (
            <li key={skill.label}>
              <strong>{skill.label}:</strong> {skill.text}
            </li>
          ))}
        </ul>
      </Section>

      <Section id="languages" title={headings.languages}>
        <p>{content.languages}</p>
      </Section>
    </article>
  )
}

export default CvPage
