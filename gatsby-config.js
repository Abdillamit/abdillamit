/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/
 */

require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
})

const environment = process.env.GATSBY_ENVIRONMENT || 'local'

// S3 bucket configurations for different environments
const s3Configs = {
  local: {
    bucketName: 'abdillamit-site-local',
    region: 'us-east-1',
    protocol: 'https',
    hostname: 'abdillamit-site-local.s3-website-us-east-1.amazonaws.com'
  },
  beta: {
    bucketName: 'abdillamit-site-beta',
    region: 'us-east-1', 
    protocol: 'https',
    hostname: 'abdillamit-site-beta.s3-website-us-east-1.amazonaws.com'
  },
  prod: {
    bucketName: 'abdillamit-site-prod',
    region: 'us-east-1',
    protocol: 'https',
    hostname: 'abdillamit-site-prod.s3-website-us-east-1.amazonaws.com'
  }
}

const currentS3Config = s3Configs[environment] || s3Configs.local

/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    title: `Abdillamit Mamytov, Full Stack Software Engineer`,
    description: `Full Stack engineer in Bishkek with 2+ years of commercial experience in fintech and logistics: React, TypeScript, GraphQL, Node.js, AWS serverless.`,
    author: `Abdillamit Mamytov`,
    siteUrl: `${currentS3Config.protocol}://${currentS3Config.hostname}`,
  },
  plugins: [
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Abdillamit Mamytov`,
        short_name: `Abdillamit`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#000000`,
        display: `minimal-ui`,
        icon: `src/images/icon.png`,
      },
    },
    {
      resolve: `gatsby-plugin-s3`,
      options: {
        bucketName: currentS3Config.bucketName,
        region: currentS3Config.region,
        protocol: currentS3Config.protocol,
        hostname: currentS3Config.hostname,
        acl: null,
        generateRedirectObjectsForPermanentRedirects: true,
        generateIndexPageForRedirect: true,
        generateMatchPathRewrites: false,
      },
    },
  ],
}

