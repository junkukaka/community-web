import 'vuetify/styles';
import { defineComponent, h } from 'vue';
import { createVuetify } from 'vuetify';
import { md2 } from 'vuetify/blueprints';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const legacyListContainer = (name, className) => defineComponent({
    name,
    inheritAttrs: false,
    setup(props, { attrs, slots }) {
        return () => h('div', {
            ...attrs,
            class: [className, attrs.class]
        }, slots.default ? slots.default() : []);
    }
});

const legacyBoolean = value => value !== undefined && value !== false;

const legacyButton = defineComponent({
    name: 'LegacyVBtn',
    inheritAttrs: false,
    setup(props, { attrs, slots }) {
        return () => {
            const mapped = { ...attrs };

            if (legacyBoolean(mapped.outlined)) mapped.variant = 'outlined';
            else if (legacyBoolean(mapped.text)) mapped.variant = 'text';
            else if (legacyBoolean(mapped.depressed)) mapped.elevation = 0;

            if (legacyBoolean(mapped['x-large'])) mapped.size = 'x-large';
            else if (legacyBoolean(mapped.large)) mapped.size = 'large';
            else if (legacyBoolean(mapped.small)) mapped.size = 'small';
            else if (legacyBoolean(mapped['x-small'])) mapped.size = 'x-small';

            if (legacyBoolean(mapped.fab)) {
                mapped.icon = true;
                mapped.rounded = 'circle';
            }

            delete mapped.outlined;
            delete mapped.text;
            delete mapped.depressed;
            delete mapped.large;
            delete mapped.small;
            delete mapped['x-large'];
            delete mapped['x-small'];
            delete mapped.fab;
            delete mapped.dark;

            return h(components.VBtn, mapped, slots);
        };
    }
});

const legacyTextField = defineComponent({
    name: 'LegacyVTextField',
    inheritAttrs: false,
    setup(props, { attrs, slots }) {
        return () => {
            const mapped = { ...attrs };
            mapped.density = legacyBoolean(mapped['hide-details']) && legacyBoolean(mapped['single-line'])
                ? 'compact'
                : 'comfortable';

            if (mapped['append-icon'] !== undefined) {
                mapped.appendInnerIcon = mapped['append-icon'];
                delete mapped['append-icon'];
            }
            if (mapped['onClick:append'] !== undefined) {
                mapped['onClick:appendInner'] = mapped['onClick:append'];
                delete mapped['onClick:append'];
            }

            return h(components.VTextField, mapped, slots);
        };
    }
});

// Vuetify 3 removed these layout-only wrappers. Central aliases preserve the
// existing DOM grouping while the affected screens are migrated incrementally.
const legacyComponents = {
    VBtn: legacyButton,
    VTextField: legacyTextField,
    VSimpleTable: components.VTable,
    VSubheader: components.VListSubheader,
    VListItemGroup: legacyListContainer('VListItemGroup', 'v-list-item-group'),
    VListItemContent: legacyListContainer('VListItemContent', 'v-list-item__content'),
    VListItemIcon: legacyListContainer('VListItemIcon', 'v-list-item__append'),
    VListItemAvatar: legacyListContainer('VListItemAvatar', 'v-list-item__prepend'),
    VListItemAction: legacyListContainer('VListItemAction', 'v-list-item__append')
};

export default createVuetify({
    blueprint: md2,
    components: { ...components, ...legacyComponents },
    directives
});
