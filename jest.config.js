module.exports = {
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '/out', '/cypress'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  moduleNameMapper: {
    '\\.svg': '<rootDir>/__mocks__/svgrMock.js',
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    '^~/assets(.*)$': '<rootDir>/src/assets$1',
    '^~/components(.*)$': '<rootDir>/src/components$1',
    '^~/locale(.*)$': '<rootDir>/src/locale$1',
    '^~/data(.*)$': '<rootDir>/src/data$1',
    '^~/utils(.*)$': '<rootDir>/src/utils$1',
    '^~/static-props(.*)$': '<rootDir>/src/static-props$1',
  },
};
