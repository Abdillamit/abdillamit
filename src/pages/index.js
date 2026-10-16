import * as React from "react"
import { graphql } from "gatsby"

import Seo from "../components/seo"
import AboutPage from "../components/about-page"
import { site } from "../data/site"
import { pageRoutes } from "../data/routes"
import { postsFrom } from "../data/posts"

const lang = "en"

const AboutPageEn = ({ data }) => (
  <AboutPage lang={lang} latestPost={postsFrom(data)[0]} />
)

export const Head = () => (
  <Seo
    lang={lang}
    path={pageRoutes.about[lang]}
    alternates={pageRoutes.about}
    title={site[lang].meta.about.title}
    description={site[lang].meta.about.description}
  />
)

export const query = graphql`
  query AboutEn {
    allMarkdownRemark(
      filter: { frontmatter: { lang: { eq: "en" } } }
      sort: { frontmatter: { date: DESC } }
      limit: 1
    ) {
      nodes {
        readingTime
        frontmatter {
          title
          description
          date
          slug
        }
      }
    }
  }
`

export default AboutPageEn
