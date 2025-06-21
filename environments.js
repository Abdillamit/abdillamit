// environments.js - Configuration for different environments

const environments = {
  local: {
    name: 'Local Development',
    s3Bucket: 'abdillamit-site-local',
    cloudFrontDistributionId: 'E1234567890ABC', // Replace with actual distribution ID
    region: 'us-east-1',
    domain: 'abdillamit-site-local.s3-website-us-east-1.amazonaws.com',
    customDomain: null, // Set to your custom domain if you have one
    apiUrl: 'http://localhost:3001', // For future backend integration
    enableAnalytics: false,
    enableErrorReporting: false,
    logLevel: 'debug'
  },
  beta: {
    name: 'Beta Testing',
    s3Bucket: 'abdillamit-site-beta',
    cloudFrontDistributionId: 'E1234567890DEF', // Replace with actual distribution ID
    region: 'us-east-1',
    domain: 'abdillamit-site-beta.s3-website-us-east-1.amazonaws.com',
    customDomain: 'beta.yourdomain.com', // Set to your custom domain if you have one
    apiUrl: 'https://api-beta.yourdomain.com', // For future backend integration
    enableAnalytics: true,
    enableErrorReporting: true,
    logLevel: 'info'
  },
  prod: {
    name: 'Production',
    s3Bucket: 'abdillamit-site-prod',
    cloudFrontDistributionId: 'E1234567890GHI', // Replace with actual distribution ID
    region: 'us-east-1',
    domain: 'abdillamit-site-prod.s3-website-us-east-1.amazonaws.com',
    customDomain: 'yourdomain.com', // Set to your custom domain if you have one
    apiUrl: 'https://api.yourdomain.com', // For future backend integration
    enableAnalytics: true,
    enableErrorReporting: true,
    logLevel: 'error'
  }
};

module.exports = environments;

