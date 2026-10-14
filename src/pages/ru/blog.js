import * as React from "react"
import { graphql } from "gatsby"

import Layout from "../../components/layout"
import Seo from "../../components/seo"
import BlogList from "../../components/blog-list"
import { site } from "../../data/site"
import { pageRoutes } from "../../data/routes"
import { postsFrom } from "../../data/posts"

const lang = "ru"

const BlogPageRu = ({ data }) => (
  <Layout lang={lang} current="blog" translations={pageRoutes.blog}>
    <BlogList lang={lang} posts={postsFrom(data)} />
  </Layout>
)

export const Head = () => (
  <Seo
    lang={lang}
    path={pageRoutes.blog[lang]}
    alternates={pageRoutes.blog}
    title={site[lang].meta.blog.title}
    description={site[lang].meta.blog.description}
  />
)

export const query = graphql`
  query BlogRu {
    allMarkdownRemark(
      filter: { frontmatter: { lang: { eq: "ru" } } }
      sort: { frontmatter: { date: DESC } }
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

export default BlogPageRu
