// Turns a markdownRemark node from a page query into a plain post object.
export const toPost = node => ({
  title: node.frontmatter.title,
  description: node.frontmatter.description,
  date: String(node.frontmatter.date).slice(0, 10),
  slug: node.frontmatter.slug,
  timeToRead: node.readingTime,
})

export const postsFrom = data =>
  (data?.allMarkdownRemark?.nodes || []).map(toPost)
