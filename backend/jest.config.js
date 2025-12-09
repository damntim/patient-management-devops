// backend/jest.config.js
module.exports = {
    testEnvironment: 'node',
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
      '*.js',
      '!node_modules/**',
      '!coverage/**',
      '!jest.config.js',
      '!**/*.test.js'
    ],
    coverageThreshold: {
      global: {
        branches: 70,
        functions: 75,
        lines: 80,
        statements: 80
      }
    },
    testMatch: [
      '**/__tests__/**/*.js',
      '**/*.test.js'
    ],
    verbose: true,
    testTimeout: 10000,
    coverageReporters: ['text', 'lcov', 'html'],
    collectCoverage: true
  };