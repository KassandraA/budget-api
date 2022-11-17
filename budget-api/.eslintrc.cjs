module.exports = {
  root: true,
  plugins: ["@typescript-eslint"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier",
  ],
  env: {
    node: true
  },
  rules: {
    "comma-dangle": ["error", "never"],
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/unbound-method": ["error", { "ignoreStatic": true }],
  }
};