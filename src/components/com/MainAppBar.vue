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

    <v-app-bar-nav-icon v-show="$vuetify.breakpoint.xs" @click="showNavi"></v-app-bar-nav-icon>

    <v-dialog v-model="naviDialog" width="260">
        <v-card class="text-center">
          <v-card-title class="primary white--text"> Navigation </v-card-title>
          <v-card-text class="pt-4">
            <v-btn class="ma-2" color="warning" depressed to="/community/communityMain" width="150" @click="naviDialog =false">
              Community
              <v-icon right dark> mdi-account-multiple </v-icon>
            </v-btn>

            <v-btn class="ma-2 white--text" color="success" depressed to="/wiki/wikiMain" width="150" @click="naviDialog =false">
              Wiki
              <v-icon right dark> mdi-school </v-icon>
            </v-btn>
          </v-card-text>
        </v-card>
      </v-dialog>

    <v-row class="pt-1 textCenter" v-show="!$vuetify.breakpoint.xs">
      <v-col>
        <router-link to="/wiki/wikiMain">
          <h3 class="font-weight-medium fontGray">Wiki</h3>
        </router-link>
      </v-col>
      <v-col>
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
  data: () => ({
    naviDialog: false
  }),
  components: { AppMemberTool },
  methods: {
    showNavi(){
      this.naviDialog = true;
    },
  }
};
</script>