module.exports = {
  extends: ['standard', 'plugin:node/recommended', 'plugin:prettier/recommended'],
  plugins: ['jest'],
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  parserOptions: {
    ecmaVersion: 9,
    sourceType: 'module',
  },
  ignorePatterns: ['/node_modules/**'],
  rules: {
    'space-before-function-parent': 'off',
    'no-unused-vars': [
      'error',
      {
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],
    camelcase: 'off',
    'no-undef': 'error',
  },
}
