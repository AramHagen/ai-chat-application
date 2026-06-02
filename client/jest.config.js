module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testMatch: [
    '<rootDir>/src/app/components/**/*.spec.ts',
    '<rootDir>/src/app/services/**/*.spec.ts',
  ],
  testEnvironment: 'jsdom',
  transformIgnorePatterns: ['node_modules/(?!(marked|.*\\.mjs$))'],
};
