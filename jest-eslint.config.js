module.exports = {
  runner: 'jest-runner-eslint',
  displayName: 'lint',
  testMatch: [
    '<rootDir>/bin/**/*.js',
    '<rootDir>/lib/**/*.js',
    '<rootDir>/test/**/*.js',
  ],
};
