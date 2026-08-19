module.exports = {
    root: true,
    parserOptions: {
      parser: '@babel/eslint-parser',
      requireConfigFile: false
    },
    extends: [
      'plugin:vue/vue3-essential'
    ],
    rules: {
      'vue/no-v-html': 'off',
      'vue/valid-v-slot': 'error'
    },
  }
