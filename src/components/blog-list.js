import * as React from "react"
import { Link } from "gatsby"

import Reveal from "./reveal"
import { site, links } from "../data/site"
import { postPath, formatLongDate } from "../data/routes"

// Groups posts by year, newest first.
export const groupByYear = posts =>
  posts.reduce((groups, post) => {
    const year = post.date.slice(0, 4)
    const group = groups.find(item => item.year === year)
    if (group) group.posts.push(post)
    else groups.push({ year, posts: [post] })
    return groups
  }, [])

const BlogList = ({ lang = "en", posts = [] }) => {
  const text = site[lang].blog

  return (
    <div className="wrap blog">
      <header className="page-head">
        <h1 className="page-title">
          <span className="reveal-line">
            <span>{text.title}</span>
          </span>
        </h1>
        <p className="page-lede">{text.intro}</p>
      </header>

      {groupByYear(posts).map(group => (
        <Reveal
          as="section"
          key={group.year}
          className="split blog-year"
          aria-labelledby={`year-${group.year}`}
        >
          <h2 id={`year-${group.year}`} className="blog-year__title">
            {group.year}
          </h2>
          <div className="blog-year__posts">
            {group.posts.map(post => (
              <article key={post.slug} className="post-card">
                <p className="post-date">
                  <time dateTime={post.date}>
                    {formatLongDate(post.date, lang)}
                  </time>
                  {post.timeToRead
                    ? ` · ${post.timeToRead} ${text.minRead}`
                    : ""}
                </p>
                <h3 className="post-card__title">
                  <Link to={postPath(lang, post.slug)}>{post.title}</Link>
                </h3>
                <p className="post-card__text">{post.description}</p>
              </article>
            ))}
          </div>
        </Reveal>
      ))}

      <Reveal
        as="section"
        className="split blog-next"
        aria-labelledby="blog-next"
      >
        <h2 id="blog-next" className="section-title">
          {text.nextTitle}
        </h2>
        <p>
          {text.next} <a href={links.linkedin}>LinkedIn</a>.
        </p>
      </Reveal>
    </div>
  )
}

export default BlogList
