<template>
  <v-app>
    <system-bar />
    <v-app-bar
      app
      class="white boxShadow"
      flat
      style="
        border-bottom: 1px solid rgba(0, 0, 0, 0.12) !important;
        top: 30px;
        border-bottom: none;
        padding: 0px !important;
      "
    >
      <v-container class="py-0 fill-height">
        <v-avatar
          size="39"
          v-if="$store.state.member != null"
          class="mr-10"
          @click="myInfo"
          style="cursor: pointer"
        >
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <img
                :src="`${$store.state.member.picture}`"
                v-bind="attrs"
                v-on="on"
                v-if="$store.state.member.picture != null"
                :alt="`photo`"
              />
              <v-icon dark v-if="$store.state.member.picture == null">
                mdi-account-circle
              </v-icon>
            </template>
            <span>회원정보</span>
          </v-tooltip>
        </v-avatar>

        <div>
          <v-btn text class="mr-7" to="/"> Home </v-btn>
          <v-btn text class="mr-7" to="/member/communityProfile">
            커뮤니티 프로파일
          </v-btn>
          <v-btn text class="mr-7" to="/member/wikiProfile">
            위키 프로파일
          </v-btn>
          <v-btn text class="mr-7" to="/member/notifications" v-if="$store.state.memberAlert > 0">
            <v-badge color="green" :content="$store.state.memberAlert">Notifications </v-badge>
          </v-btn>
          <!-- <v-btn text class="mr-7"> My Wiki </v-btn> -->
        </div>
      </v-container>
    </v-app-bar>

    <v-main class="grey lighten-3 pb-10">
      <v-container>
        <!-- If using vue-router -->
        <div class="containerMaxWith">
          <router-view></router-view>
        </div>
      </v-container>
    </v-main>
    <main-footer />
  </v-app>
</template>

<script>
import SystemBar from "../components/com/SystemBar.vue";
import MainFooter from "../components/com/MainFooter.vue";

export default {
  name: "Index",
  components: {
    MainFooter,
    SystemBar,
  },

   watch: {
    "$store.state.memberAlert": function (newVal) {
      this.getMyCommunityCommentCount();
    },
  },

  methods: {
    myInfo() {
      let id = this.$store.state.member.id;
      this.$router.push(`/member/memberInfo?id=${id}`);
    },
  },
};
</script>