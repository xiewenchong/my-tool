module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    // 'eslint:recommended',
    // 'eslint-config-ali/vue',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    quotes: ["error", "single"],
    camelcase: 2,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
