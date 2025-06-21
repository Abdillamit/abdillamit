module.exports = {
  transform: {
    "^.+\\.jsx?$": `<rootDir>/jest-preprocess.js`,
  },
  moduleNameMapper: {
    ".+\\.(css|styl|less|sass|scss)$": `identity-obj-proxy`,
    ".+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": `<rootDir>/__mocks__/file-mock.js`,
    "^gatsby$": `<rootDir>/__mocks__/gatsby.js`
  },
  testPathIgnorePatterns: [`node_modules`, `\\.cache`, `<rootDir>.*/public`],
  transformIgnorePatterns: [`node_modules/(?!(gatsby|gatsby-script)/)`],
  globals: {
    __PATH_PREFIX__: ``,
  },
  testEnvironment: `jsdom`,
  setupFiles: [`<rootDir>/loadershim.js`],
  setupFilesAfterEnv: ["<rootDir>/setup-test-env.js"],
  testEnvironmentOptions: {
    url: "http://localhost"
  },
  modulePathIgnorePatterns: [".cache/"],
  collectCoverage: true,
  coverageReporters: ["lcov", "text", "html"],
  coverageDirectory: "<rootDir>/coverage",
  collectCoverageFrom: [
    "src/**/*.{js,jsx}",
    "!**/node_modules/**",
    "!**/vendor/**",
    "!**/__tests__/**",
    "!**/public/**"
  ],
  coverageThreshold: {
    global: {
      branches: 14,
      functions: 40,
      lines: 30,
      statements: 30
    }
  }
}
