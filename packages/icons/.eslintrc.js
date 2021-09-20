const path = require('path');

module.exports = {
  parser: '@babel/eslint-parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2021,
    ecmaFeatures: {
      jsx: true,
      impliedStrict: true,
    },
    babelOptions: {
      configFile: path.resolve(__dirname, '.babelrc'),
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  env: {
    node: true,
    browser: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  rules: {
    'arrow-body-style': 0,
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
  },
};
