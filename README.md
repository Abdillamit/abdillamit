<!-- AUTO-GENERATED-CONTENT:START (STARTER) -->
<p align="center">
  <a href="https://www.gatsbyjs.com">
    <img alt="Gatsby" src="https://www.gatsbyjs.com/Gatsby-Monogram.svg" width="60" />
  </a>
</p>
<h1 align="center">
  Gatsby's default starter
</h1>

Kick off your project with this default boilerplate. This starter ships with the main Gatsby configuration files you might need to get up and running blazing fast with the blazing fast app generator for React.

_Have another more specific idea? You may want to check out our vibrant collection of [official and community-created starters](https://www.gatsbyjs.com/docs/gatsby-starters/)._

## 🚀 Quick start

1.  **Create a Gatsby site.**

    Use the Gatsby CLI ([install instructions](https://www.gatsbyjs.com/docs/tutorial/getting-started/part-0/#gatsby-cli)) to create a new site, specifying the default starter.

    ```shell
    # create a new Gatsby site using the default starter
    gatsby new my-default-starter https://github.com/gatsbyjs/gatsby-starter-default
    ```

1.  **Start developing.**

    Navigate into your new site’s directory and start it up.

    ```shell
    cd my-default-starter/
    gatsby develop
    ```

1.  **Open the source code and start editing!**

    Your site is now running at `http://localhost:8000`!

    Note: You'll also see a second link: `http://localhost:8000/___graphql`. This is a tool you can use to experiment with querying your data. Learn more about using this tool in the [Gatsby Tutorial](https://www.gatsbyjs.com/docs/tutorial/getting-started/part-4/#use-graphiql-to-explore-the-data-layer-and-write-graphql-queries).

    Open the `my-default-starter` directory in your code editor of choice and edit `src/pages/index.js`. Save your changes and the browser will update in real time!

## 🚀 Quick start (Netlify)

Deploy this starter with one click on [Netlify](https://app.netlify.com/signup):

[<img src="https://www.netlify.com/img/deploy/button.svg" alt="Deploy to Netlify" />](https://app.netlify.com/start/deploy?repository=https://github.com/gatsbyjs/gatsby-starter-default)

## 🧐 What's inside?

A quick look at the top-level files and directories you'll see in a typical Gatsby project.

    .
    ├── node_modules
    ├── src
    ├── .gitignore
    ├── gatsby-browser.js
    ├── gatsby-config.js
    ├── gatsby-node.js
    ├── gatsby-ssr.js
    ├── LICENSE
    ├── package.json
    └── README.md

1.  **`/node_modules`**: This directory contains all of the modules of code that your project depends on (npm packages) are automatically installed.

1.  **`/src`**: This directory will contain all of the code related to what you will see on the front-end of your site (what you see in the browser) such as your site header or a page template. `src` is a convention for “source code”.

1.  **`.gitignore`**: This file tells git which files it should not track / not maintain a version history for.

1.  **`gatsby-browser.js`**: This file is where Gatsby expects to find any usage of the [Gatsby browser APIs](https://www.gatsbyjs.com/docs/reference/config-files/gatsby-browser/) (if any). These allow customization/extension of default Gatsby settings affecting the browser.

1.  **`gatsby-config.js`**: This is the main configuration file for a Gatsby site. This is where you can specify information about your site (metadata) like the site title and description, which Gatsby plugins you’d like to include, etc. (Check out the [config docs](https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/) for more detail).

1.  **`gatsby-node.js`**: This file is where Gatsby expects to find any usage of the [Gatsby Node APIs](https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/) (if any). These allow customization/extension of default Gatsby settings affecting pieces of the site build process.

1.  **`gatsby-ssr.js`**: This file is where Gatsby expects to find any usage of the [Gatsby server-side rendering APIs](https://www.gatsbyjs.com/docs/reference/config-files/gatsby-ssr/) (if any). These allow customization of default Gatsby settings affecting server-side rendering.

1.  **`LICENSE`**: This Gatsby starter is licensed under the 0BSD license. This means that you can see this file as a placeholder and replace it with your own license.

1.  **`package.json`**: A manifest file for Node.js projects, which includes things like metadata (the project’s name, author, etc). This manifest is how npm knows which packages to install for your project.

1.  **`README.md`**: A text file containing useful reference information about your project.

## 🎓 Learning Gatsby

Looking for more guidance? Full documentation for Gatsby lives [on the website](https://www.gatsbyjs.com/). Here are some places to start:

- **For most developers, we recommend starting with our [in-depth tutorial for creating a site with Gatsby](https://www.gatsbyjs.com/docs/tutorial/getting-started/).** It starts with zero assumptions about your level of ability and walks through every step of the process.

- **To dive straight into code samples, head [to our documentation](https://www.gatsbyjs.com/docs/).** In particular, check out the _Guides_, _API Reference_, and _Advanced Tutorials_ sections in the sidebar.

## 💫 Deploy

[Build, Deploy, and Host On Netlify](https://netlify.com)

The fastest way to combine your favorite tools and APIs to build the fastest sites, stores, and apps for the web. And also the best place to build, deploy, and host your Gatsby sites.

<!-- AUTO-GENERATED-CONTENT:END -->

# Gatsby.js Project with AWS S3 & CloudFront CI/CD

This repository contains a Gatsby.js project configured for continuous integration and continuous deployment (CI/CD) to AWS S3 and CloudFront. It supports `local`, `beta`, and `prod` environments, each with its own dedicated S3 bucket and CloudFront distribution.

## Project Structure

```
.github/
├── workflows/           # GitHub Actions workflows for CI/CD
│   ├── beta-deploy.yml
│   └── prod-deploy.yml
├── .gitignore           # Specifies intentionally untracked files to ignore
├── gatsby-aws-project/  # Root directory for the Gatsby project
│   ├── abdillamit-site/ # Gatsby.js project files
│   │   ├── .env.development
│   │   ├── .env.beta
│   │   ├── .env.production
│   │   ├── gatsby-config.js
│   │   ├── package.json
│   │   ├── src/
│   │   │   └── pages/
│   │   │       └── index.js
│   │   └── ... (other Gatsby files)
│   └── aws_s3_cloudfront_setup.md # Documentation for AWS S3 and CloudFront setup
└── README.md            # This file
```

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

*   Node.js (LTS version recommended)
*   npm (Node Package Manager)
*   Gatsby CLI (`npm install -g gatsby-cli`)
*   AWS CLI (configured with appropriate credentials)

### Local Development

1.  **Clone the repository:**

    ```bash
    git clone <your-repo-url>
    cd gatsby-aws-project/abdillamit-site
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Run the development server:**

    ```bash
    npm run develop:local
    ```

    This will start a local development server, typically at `http://localhost:8000`. The site will display "Hello Abdillamit" and indicate the `local` environment.

### Building the Project

To build the project for a specific environment, use the following commands:

*   **Local build:**

    ```bash
    npm run build:local
    ```

*   **Beta build:**

    ```bash
    npm run build:beta
    ```

*   **Production build:**

    ```bash
    npm run build:prod
    ```

    These commands will generate static assets in the `public/` directory, configured for the respective environment.

### Deploying to AWS S3 (Manual)

Before deploying, ensure you have set up your AWS S3 buckets and CloudFront distributions as described in the `aws_s3_cloudfront_setup.md` document.

To manually deploy to a specific environment (requires AWS credentials configured with `gatsby-plugin-s3` permissions):

*   **Deploy to Local S3 bucket:**

    ```bash
    npm run deploy:local
    ```

*   **Deploy to Beta S3 bucket:**

    ```bash
    npm run deploy:beta
    ```

*   **Deploy to Production S3 bucket:**

    ```bash
    npm run deploy:prod
    ```

## AWS Setup

Detailed instructions for setting up AWS S3 buckets and CloudFront distributions for each environment can be found in:

*   [`aws_s3_cloudfront_setup.md`](./aws_s3_cloudfront_setup.md)

**Important:** Ensure your S3 bucket names in `gatsby-config.js` match the actual bucket names created in AWS.

## CI/CD with GitHub Actions

This project uses GitHub Actions for automated CI/CD. Workflows are defined in the `.github/workflows/` directory. These workflows will:

1.  Build the Gatsby.js project for the target environment.
2.  Deploy the built assets to the corresponding AWS S3 bucket.
3.  Invalidate the CloudFront cache for the deployed content.

More details on setting up GitHub Actions and AWS credentials will be provided in subsequent sections.

## Future Enhancements

*   Integration with AWS CodePipeline and CodeBuild for more robust CI/CD.
*   Adding backend services (e.g., AWS Lambda, API Gateway).
*   Implementing more advanced Gatsby features and plugins.

---

*Authored by Manus AI*

