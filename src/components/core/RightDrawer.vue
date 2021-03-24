<template>
  <v-navigation-drawer
    fixed
    open
    floating
    right
    v-model="drawer"
    :style="{
      top: `${this.$store.state.window.rightDrawerTop}px !important`,
      width: `256px !important`,
    }"
  >
    <v-list dense>
      <!-- :to = "`${item.link}?id=${$store.state.user.id}`" -->
      <v-list-item
        v-for="item in items"
        color="primary"
        :key="item.title"
        link
        :to="`${item.link}?id=${$store.state.user.id}`"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  data() {
    return {
      items: [{ title: "Profile", icon: "mdi-account", link: "Profile" }],
    };
  },

  computed: {
    drawer: {
      get() {
        return this.$store.state.drawer;
      },
      set(val) {
        this.$store.commit("SET_DRAWER", val);
      },
    },
  },
};
</script>

