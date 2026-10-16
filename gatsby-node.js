/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/
 *
 * Static pages come from src/pages ("/" and "/ru/" trees).
 * Blog posts come from content/blog/<lang>/<slug>.md and are created here:
 *   English: /blog/<slug>/   Russian: /ru/blog/<slug>/
 */

const path = require("path")

const postPath = (lang, slug) =>
  lang === "ru" ? `/ru/blog/${slug}/` : `/blog/${slug}/`

// Mark the 404 page, so the layout does not treat a missing
// /blog/<slug>/ URL as a blog post.
exports.onCreatePage = ({ page, actions }) => {
  if (!/^\/404/.test(page.path) || page.context?.notFound) return
  actions.deletePage(page)
  actions.createPage({ ...page, context: { ...page.context, notFound: true } })
}

exports.createSchemaCustomization = ({ actions }) => {
  actions.createTypes(`
    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
    }
    type Frontmatter {
      title: String!
      description: String
      date: Date! @dateformat
      slug: String!
      lang: String!
    }
  `)
}

// Reading time in minutes at about 200 words per minute. Used instead of
// remark's timeToRead (265 wpm), which rounds a 370-word Russian post
// down to 1 minute while its English version gets 2.
const WORDS_PER_MINUTE = 200

exports.createResolvers = ({ createResolvers }) => {
  createResolvers({
    MarkdownRemark: {
      readingTime: {
        type: `Int`,
        resolve: source => {
          const words = String(source.rawMarkdownBody || ``)
            .split(/\s+/)
            .filter(Boolean).length
          return Math.max(1, Math.round(words / WORDS_PER_MINUTE))
        },
      },
    },
  })
}

exports.createPages = async ({ graphql, actions, reporter }) => {
  const result = await graphql(`
    {
      allMarkdownRemark {
        nodes {
          id
          frontmatter {
            slug
            lang
          }
        }
      }
    }
  `)

  if (result.errors) {
    reporter.panicOnBuild("Could not load blog posts", result.errors)
    return
  }

  const nodes = result.data.allMarkdownRemark.nodes
  const template = path.resolve("./src/templates/post.js")

  nodes.forEach(node => {
    const { slug, lang } = node.frontmatter
    // Every language version of the same post, for the language switch
    const translations = {}
    nodes
      .filter(other => other.frontmatter.slug === slug)
      .forEach(other => {
        translations[other.frontmatter.lang] = postPath(
          other.frontmatter.lang,
          slug
        )
      })

    actions.createPage({
      path: postPath(lang, slug),
      component: template,
      context: { id: node.id, lang, translations },
    })
  })
}
