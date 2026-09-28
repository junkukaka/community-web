<template>
  <v-navigation-drawer
    open
    floating
    location="right"
    v-model="drawer"
    :style="{
      top: `${this.$store.state.window.rightDrawerTop}px !important`,
      width: `256px !important`,
    }"
  >
    <v-list density="compact">
      <!-- :to = "`${item.link}?id=${$store.state.user.id}`" -->
      <v-list-item
        v-for="item in items"
        color="indigo"
        :key="item.title"
        link
        :to="`${item.link}?id=${$store.state.user.id}`"
      >
        <div class="v-list-item__append">
          <v-icon>{{ item.icon }}</v-icon>
        </div>


          <v-list-item-title>{{ item.title }}</v-list-item-title>

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

