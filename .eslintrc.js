module.exports = {
    extends: [
      'plugin:vue/base',
      'plugin:vuetify/recommend'
    ],
    plugins: [
      'vuetify'
    ],
    rules: [
      'vue/no-v-html:off',
      'vue/no-v-text-v-html-on-component:off'
    ],
  }