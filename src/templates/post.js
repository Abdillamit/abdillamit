import * as React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import { site } from "../data/site"
import { languages } from "../data/cv"
import { pageRoutes, formatLongDate } from "../data/routes"

const PostTemplate = ({ data, pageContext }) => {
  const { lang, translations = {} } = pageContext
  const post = data.markdownRemark
  const text = site[lang].blog
  const date = String(post.frontmatter.date).slice(0, 10)
  const others = languages.filter(
    item => item.lang !== lang && translations[item.lang]
  )

  return (
    <Layout
      lang={lang}
      current="blog"
      translations={{ ...pageRoutes.blog, ...translations }}
    >
      <article className="post">
        <p className="post-back">
          <Link to={pageRoutes.blog[lang]}>{text.allPosts}</Link>
        </p>
        <h1 className="post-title">{post.frontmatter.title}</h1>
        <p className="post-meta">
          <time dateTime={date}>{formatLongDate(date, lang)}</time>
          {post.readingTime ? (
            <span>
              {post.readingTime} {text.minRead}
            </span>
          ) : null}
          {others.map(item => (
            <span key={item.lang}>
              {text.alsoIn}{" "}
              <Link
                to={translations[item.lang]}
                lang={item.lang}
                hrefLang={item.lang}
              >
                {item.name}
              </Link>
            </span>
          ))}
        </p>
        <div
          className="post-body"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
        <nav className="post-footer" aria-label={text.allPosts}>
          <Link to={pageRoutes.blog[lang]}>{text.allPosts}</Link>
          <Link to={pageRoutes.about[lang]}>{text.aboutAuthor}</Link>
        </nav>
      </article>
    </Layout>
  )
}

export const Head = ({ data, pageContext, location }) => (
  <Seo
    lang={pageContext.lang}
    path={location?.pathname}
    title={`${data.markdownRemark.frontmatter.title} | Abdillamit Mamytov`}
    description={data.markdownRemark.frontmatter.description}
    alternates={pageContext.translations}
    type="article"
  />
)

export const query = graphql`
  query PostById($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      readingTime
      frontmatter {
        title
        description
        date
        slug
        lang
      }
    }
  }
`

export default PostTemplate
