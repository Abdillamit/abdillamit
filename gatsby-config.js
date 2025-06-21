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
    title: `Hello Abdillamit - ${environment.toUpperCase()}`,
    description: `Gatsby site for Abdillamit deployed on AWS S3 - ${environment} environment`,
    author: `@abdillamit`,
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
        name: `Hello Abdillamit Site`,
        short_name: `Abdillamit`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`,
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

