<template>
  <v-app-bar
    app
    fixed
    class="boxShadow appBarDisplay"
    elevation = 0
  >
    <v-app-bar-nav-icon @click="setDrawer(!drawer)"></v-app-bar-nav-icon>

    <v-toolbar-title class="pl-2">
      <v-btn to="/community/communityMain" text>
        <v-icon>mdi-account-multiple</v-icon>
        <span style="padding-left: 7px">{{$t('community')}}</span>
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


