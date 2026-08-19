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
      'vue/valid-v-slot': 'error',
      'vue/multi-word-component-names': 'off',
      'vue/no-reserved-component-names': 'off',
      'vue/no-v-text-v-html-on-component': 'off'
    },
  }
