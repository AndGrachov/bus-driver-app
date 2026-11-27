// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*', '.expo/*'],
  },
  {
    // Runtime import cycles break module init on web and native (Jest misses
    // them), so they fail lint. Type-only imports are ignored.
    rules: { 'import/no-cycle': ['error', { ignoreExternal: true }] },
  },
]);
