<template>
  <v-app-bar
    app
    fixed
    class="white boxShadow"
    style="
      border-bottom: 1px solid rgba(0, 0, 0, 0.12) !important;
      top: 30px;
      border-bottom: none;
      padding: 0px !important;
    "
  >
    <router-link to="/" v-show="!$vuetify.breakpoint.xs">
      <h2 class="fontGray">
        ASPN
        <span class="font-weight-medium" style="font-size: 16px"
          >Wiki&Community</span
        >
      </h2>
    </router-link>

    <v-row class="pt-1 textCenter">
      <v-col>
        <router-link to="/wiki/wikiMain">
          <h3 class="font-weight-medium fontGray">Wiki</h3>
        </router-link>
      </v-col>
      <v-col v-show="!$vuetify.breakpoint.xs">
        <router-link to="/community/communityMain">
          <h3 class="font-weight-medium fontGray">Community</h3>
        </router-link>
      </v-col>
    </v-row>

    <v-spacer></v-spacer>

    <v-row>
      <v-col>
        <app-member-tool />
      </v-col>
    </v-row>
  </v-app-bar>
</template>

<script>
import AppMemberTool from "./AppMemberTool.vue";
export default {
  components: { AppMemberTool },
};
</script>