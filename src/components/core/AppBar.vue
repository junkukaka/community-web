<template>
  <v-app-bar
    app
    fixed
    flat
    elevate-on-scroll
    class="white"
    style="border-bottom: 1px solid rgba(0, 0, 0, 0.12) !important"
  >
    <v-app-bar-nav-icon @click="setDrawer(!drawer)"></v-app-bar-nav-icon>

    <v-toolbar-title>
      <v-btn to= "/" text>
        <v-icon>mdi-school</v-icon>
        <span style="padding-left:7px">Wiki</span>
      </v-btn>
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <!-- <v-text-field
      v-model="search"
      append-icon="mdi-magnify"
      label="Search"
      single-line
      hide-details
      class="mr-1"
    ></v-text-field> -->
    <v-menu right bottom offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item
          v-for="item in options"
          :key="item.title"
          @click="() => {}"
          :to="item.link"
        >
          <v-list-item-title v-text="item.title"></v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  data: () => ({
    options: [
      { title: "Profile", link: "Profile" }
    ],
    search: "",
  }),

  computed: {
    ...mapState(["drawer"]),
  },

  methods: {
    ...mapMutations({
      setDrawer: "SET_DRAWER",
    }),
  },
};
</script>


