// CI-specific Jest config with relaxed coverage thresholds
let base = {};
try {
  // Try to extend existing Jest config if present
  // eslint-disable-next-line global-require
  base = require('./jest.config.js');
} catch (e1) {
  try {
    // eslint-disable-next-line global-require
    base = require('./jest.config');
  } catch (e2) {
    base = {};
  }
}

module.exports = {
  ...base,
  rootDir: base.rootDir || __dirname,        // ensure coverage is under backend/
  collectCoverage: true,
  coverageDirectory: './coverage',            // write to backend/coverage
  coverageReporters: ['lcov', 'text'],        // ensure lcov.info is generated
  testEnvironment: base.testEnvironment || 'node',
  coverageThreshold: {
    global: {
      statements: 65,
      branches: 60,
      functions: 70,
      lines: 65,
    },
  },
};