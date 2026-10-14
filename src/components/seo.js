/**
 * Page <head> tags: title, description, language, canonical URL,
 * links to the other language versions and Open Graph tags.
 *
 * `alternates` maps a language to the same page in that language,
 * e.g. { en: "/resume/", ru: "/ru/resume/" }.
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */

import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"

import { pageRoutes } from "../data/routes"

function Seo({
  description,
  title,
  lang = "en",
  path = "/",
  alternates = pageRoutes.about,
  type = "website",
  children,
}) {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
            siteUrl
          }
        }
      }
    `
  )

  const meta = site.siteMetadata || {}
  const metaDescription = description || meta.description
  const pageTitle = title || meta.title
  const siteUrl = (meta.siteUrl || "").replace(/\/$/, "")
  const url = page => `${siteUrl}${page}`
  const versions = Object.entries(alternates || {})

  return (
    <>
      <html lang={lang} />
      <title>{pageTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="author" content={meta.author || ``} />
      {siteUrl && <link rel="canonical" href={url(path)} />}
      {siteUrl &&
        versions.map(([code, page]) => (
          <link key={code} rel="alternate" hrefLang={code} href={url(page)} />
        ))}
      {siteUrl && alternates?.en && (
        <link rel="alternate" hrefLang="x-default" href={url(alternates.en)} />
      )}
      <link
        rel="preload"
        href="/fonts/cmunrm.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content={lang === "ru" ? "ru_RU" : "en_US"} />
      {siteUrl && <meta property="og:url" content={url(path)} />}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={metaDescription} />
      {children}
    </>
  )
}

export default Seo
