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

    <v-toolbar-title class="pl-0">
      <v-btn to="/wiki/wikiMain" text>
        <v-icon>mdi-school</v-icon>
        <span style="padding-left: 7px">위키</span>
      </v-btn>
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <v-row>
      <v-col>
        <app-member-tool />
      </v-col>
    </v-row>
  </v-app-bar>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import AppMemberTool from "../com/AppMemberTool";
export default {
  components: {
    AppMemberTool,
  },

  data: () => ({}),

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


