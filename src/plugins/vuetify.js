import 'vuetify/styles';
import { defineComponent, h } from 'vue';
import { createVuetify } from 'vuetify';
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

// Vuetify 3 removed these layout-only wrappers. Central aliases preserve the
// existing DOM grouping while the affected screens are migrated incrementally.
const legacyComponents = {
    VSimpleTable: components.VTable,
    VSubheader: components.VListSubheader,
    VListItemGroup: legacyListContainer('VListItemGroup', 'v-list-item-group'),
    VListItemContent: legacyListContainer('VListItemContent', 'v-list-item__content'),
    VListItemIcon: legacyListContainer('VListItemIcon', 'v-list-item__append'),
    VListItemAvatar: legacyListContainer('VListItemAvatar', 'v-list-item__prepend'),
    VListItemAction: legacyListContainer('VListItemAction', 'v-list-item__append')
};

export default createVuetify({
    components: { ...components, ...legacyComponents },
    directives
});
