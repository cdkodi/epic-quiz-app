// Lean Jest Configuration for Solo Development
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/?(*.)+(spec|test).ts'],
  
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/tests/**/*.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'html'],
  
  // Simplified test timeout
  testTimeout: 30000,
  
  // Essential test projects only
  projects: [
    {
      displayName: 'essential',
      testMatch: ['<rootDir>/src/tests/essential-minimal.test.ts'],
      testEnvironment: 'node',
      preset: 'ts-jest',
      testTimeout: 10000,
    },
    {
      displayName: 'unit',
      testMatch: ['<rootDir>/src/tests/services/*.test.ts'],
      testEnvironment: 'node',
      preset: 'ts-jest',
    },
    {
      displayName: 'integration', 
      testMatch: ['<rootDir>/src/tests/integration/*.test.ts'],
      testEnvironment: 'node',
      preset: 'ts-jest',
      testTimeout: 15000,
    },
  ],
};