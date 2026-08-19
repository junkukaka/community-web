import pluginVue from 'eslint-plugin-vue';
import globals from 'globals';

export default [
  {
    ignores: ['dist/**', 'src/components/language/*.min.js']
  },
  ...pluginVue.configs['flat/essential'],
  {
    files: ['**/*.{js,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        Download: 'readonly',
        Prism: 'readonly',
        _: 'readonly'
      }
    },
    rules: {
      'vue/no-v-html': 'off',
      'vue/valid-v-slot': 'error',
      'vue/multi-word-component-names': 'off',
      'vue/no-reserved-component-names': 'off',
      'vue/no-v-text-v-html-on-component': 'off'
    }
  }
];
