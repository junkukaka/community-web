import { createI18n } from 'vue-i18n';

const messages = {
    ch: require('./ch.js'),
    en: require('./en.js'),
    ko: require('./ko.js')
};
const i18n = createI18n({
    legacy: true,
    locale: 'ko',
    fallbackLocale: 'en',
    messages: messages,
    silentFallbackWarn: true
});
export default i18n;
