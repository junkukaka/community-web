import Vue from 'vue';
import VueI18n from 'vue-i18n';
Vue.use(VueI18n);

const messages = {
    ch: require('./ch.js'),
    en: require('./en.js'),
    ko: require('./ko.js')
};
const i18n = new VueI18n({
    locale: 'ko',
    fallbackLocale: 'en',
    messages: messages,
    silentFallbackWarn: true
});
export default i18n;