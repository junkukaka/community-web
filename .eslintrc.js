module.exports = {
    extends: [
      'plugin:vue/base',
      'plugin:vuetify/recommended'
    ],
    plugins: [
      'vuetify'
    ],
    rules: {
      'vue/no-v-html': 'off',
      'vue/valid-v-slot': 'error'
    },
  }
