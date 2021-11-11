<template>
  <v-app-bar
    app
    fixed
    flat
    elevate-on-scroll
    class="white"
    style="border-bottom: 1px solid rgba(0, 0, 0, 0.12) !important"
  >
    <v-row align="center">
      <v-col>
        <v-btn to="/main" text>
          <span>Home</span>
        </v-btn>
      </v-col>

      <v-col>
        <v-btn to="/aspnAdmin/communityMenu" text>
          <span>커뮤니티 메뉴</span>
        </v-btn>
      </v-col>

      <v-col>
        <v-btn to="/aspnAdmin/wikiMenu" text>
          <span>위키 메뉴</span>
        </v-btn>
      </v-col>
      
      <v-col>
        <v-btn to="/aspnAdmin/memberComprehensive" text>
          <span>회원 관리</span>
        </v-btn>
      </v-col>

      <v-col>
        <v-btn to="/aspnAdmin/authorityComprehensive" text>
          <span>권한 관리</span>
        </v-btn>
      </v-col>
    </v-row>
  </v-app-bar>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  data: () => ({
    options: [{ title: "Profile", link: "/wiki/profile" }],
    admins: [
      { title: "Community Menu", link: "/community/communityMenu" },
      { title: "Wiki Menu", link: "/wiki/wikiMenu" },
    ],
    searchFlag: "WIKI",
    searchContent: null,
  }),

  computed: {
    ...mapState(["drawer"]),
  },

  created() {
    this.member = this.$store.state.member;
    this.checkAdmin();
  },

  methods: {
    ...mapMutations({
      setDrawer: "SET_DRAWER",
    }),

    checkAdmin() {
      if (this.member.authority != 0) {
        this.$router.push("/");
      }
    },

    signOut() {
      this.$store.state.member = null;
      //退出登录，清空token
      localStorage.removeItem("Authorization");
      localStorage.removeItem("store");
      this.$router.push("/signIn");
    },

    myInfo() {
      let id = this.$store.state.member.id;
      this.$router.push(`/memberInfo?id=${id}`);
    },

    searching() {
      this.$router.push(
        `/wiki/wikiSearch?content=${this.searchContent}&flag=${this.searchFlag}`
      );
    },
  },
};
</script>


