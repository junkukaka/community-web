<template>
  <v-app-bar
    app
    fixed
    flat
    elevate-on-scroll
    class="white"
    style="border-bottom: 1px solid rgba(0, 0, 0, 0.12) !important"
  >
    <v-btn to="/main" text class="ml-3">
      <span>Home</span>
    </v-btn>

    <v-btn to="/aspnAdmin/communityMenu" text class="ml-3">
      <span>커뮤니티 메뉴</span>
    </v-btn>

    <v-btn to="/aspnAdmin/wikiMenu" text class="ml-3">
      <span>위키 메뉴</span>
    </v-btn>

    <v-btn to="/aspnAdmin/memberComprehensive" text class="ml-3">
      <span>회원 관리</span>
    </v-btn>

    <v-spacer></v-spacer>

    <v-menu right bottom offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on" class="mr-1">
          <v-avatar size="43" v-if="$store.state.member != null">
            <img
              :src="`${$store.state.member.picture}`"
              v-if="$store.state.member.picture != null"
              :alt="`photo`"
            />
            <v-icon dark v-if="$store.state.member.picture == null">
              mdi-account-circle
            </v-icon>
          </v-avatar>
          <v-avatar color="#EEEEEE" v-if="$store.state.member == null">
            <v-icon dark> mdi-account-circle </v-icon>
          </v-avatar>
        </v-btn>
      </template>

      <v-list>
        <v-list-item to="/wiki/profile" v-if="$store.state.member != null">
          <v-list-item-title>프로파일</v-list-item-title>
        </v-list-item>
        <v-list-item @click="myInfo" v-if="$store.state.member != null">
          <v-list-item-title>회원정보</v-list-item-title>
        </v-list-item>
        <v-list-item @click="signOut" v-if="$store.state.member != null">
          <v-list-item-title>로그아웃</v-list-item-title>
        </v-list-item>
        <v-list-item to="/signIn" v-if="$store.state.member == null">
          <v-list-item-title>로그인</v-list-item-title>
        </v-list-item>
        <v-list-item to="/signUp" v-if="$store.state.member == null">
          <v-list-item-title>회원가입</v-list-item-title>
        </v-list-item>
        <v-list-item
          to="/aspnAdmin/adminMain"
          v-if="
            $store.state.member != null && $store.state.member.authority === 0
          "
        >
          <v-list-item-title>관리자 페이지</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
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

  created(){
    this.member = this.$store.state.member;
    this.checkAdmin();
    
  },

  methods: {
    ...mapMutations({
      setDrawer: "SET_DRAWER",
    }),

    checkAdmin(){
        if(this.member.authority != 0) {
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


