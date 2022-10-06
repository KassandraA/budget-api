module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
  env: {
    node: true
  },
  rules: {
    "comma-dangle": ["error", "never"],
    "@typescript-eslint/no-explicit-any": "off"
  }
};