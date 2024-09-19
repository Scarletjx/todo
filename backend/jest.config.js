module.exports = {
  preset: 'ts-jest',             // Use ts-jest for TypeScript files
  testEnvironment: 'node',        // Use node environment for testing
  moduleFileExtensions: ['ts', 'js'],  // Allow both TypeScript and JavaScript
  testMatch: ['**/tests/**/*.test.ts'],  // Ensure it matches your TypeScript test files
};