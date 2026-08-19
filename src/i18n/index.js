import { createI18n } from 'vue-i18n';
import ch from './ch.js';
import en from './en.js';
import ko from './ko.js';

const messages = {
    ch,
    en,
    ko
};
const i18n = createI18n({
    legacy: true,
    locale: 'ko',
    fallbackLocale: 'en',
    messages: messages,
    missingWarn: false,
    fallbackWarn: false
});
export default i18n;
