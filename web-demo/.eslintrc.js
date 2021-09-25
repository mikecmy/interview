module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
  },
  extends: ["plugin:vue/essential", "eslint:recommended", "@vue/typescript"],
  plugins: ["@typescript-eslint"],
  rules: {
    "no-console": "off",
    // "no-debugger": process.env.NODE_ENV === "development" ? "off" : "error",
    // 'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // 'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  },
  parserOptions: {
    parser: "@typescript-eslint/parser",
  },
};
