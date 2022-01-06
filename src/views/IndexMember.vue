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
        <v-card class="d-flex flex-row pa-0 ma-0" flat>
          <v-card class="pa-0 ma-0" flat>
            <v-row>
              <v-avatar
                size="42"
                v-if="$store.state.member != null"
                class="mr-10 mt-4"
                @click="myInfo"
                style="cursor: pointer"
              >
                <v-tooltip bottom  v-if="$store.state.member.picture != null">
                  <template v-slot:activator="{ on, attrs }">
                    <img
                      :src="`${$store.state.member.picture}`"
                      v-bind="attrs"
                      v-on="on"
                      :alt="`photo`"
                    />
                  </template>
                  <span>{{$t('myInfo')}}</span>
                </v-tooltip>
                <v-icon v-if="$store.state.member.picture == null">
                  mdi-account-circle
                </v-icon>
              </v-avatar>
            </v-row>
          </v-card>

          <v-card flat to="/" class="pr-3 pl-3">
           <v-btn color="primary" class="mt-2" outlined>
             {{$t('home')}}
             <v-icon
                right
                dark
              >
                mdi-home
              </v-icon>
              
            </v-btn>
          </v-card>

          <v-card flat clas="pa-0 ma-0">
            <v-tabs>
              <v-tab @click="toLink(2)">
                <span class="black--text pl-3 pr-3 pl-3 pr-3">
                  {{$t('wikiCollect')}}
                </span>
              </v-tab>
              <v-tab @click="toLink(3)">
                <span class="black--text pl-3 pr-3 pl-3 pr-3">
                  {{$t('wikiProfile')}}
                </span>
              </v-tab>
              <v-tab @click="toLink(4)">
                <span class="black--text pl-3 pr-3 pl-3 pr-3">
                  {{$t('communityProfile')}}
                </span>
              </v-tab>
              <v-tab v-if="$store.state.memberAlert > 0" @click="toLink(5)">
                <router-link
                  to="/member/notifications"
                  class="black--text pl-3 pr-3"
                >
                  <v-badge color="green" :content="$store.state.memberAlert"
                    >{{$t('notifications')}}
                  </v-badge>
                </router-link>
              </v-tab>
            </v-tabs>
          </v-card>
        </v-card>
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

  data: () => ({
    tabModel: "#",
  }),

  watch: {
    "$store.state.memberAlert": function (newVal) {
      this.getMyCommunityCommentCount();
    },
  },

  created() {
    console.log(this.$store.state.member.picture);
  },

  methods: {
    myInfo() {
      let id = this.$store.state.member.id;
      this.$router.push(`/member/memberInfo?id=${id}`);
    },

    toLink(toLink) {
      switch (toLink) {
        case 1:
          this.$router.push(`/`);
          break;
        case 2:
          this.$router.push(`/member/wikiCollect`);
          break;
        case 3:
          this.$router.push(`/member/wikiProfile`);
          break;
        case 4:
          this.$router.push(`/member/communityProfile`);
          break;
        case 5:
          this.$router.push(`/member/notifications`);
          break;
      }
    },
  },
};
</script>