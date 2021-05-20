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

    <v-toolbar-title class="pl-2">
      <v-btn to="/community/communityMain" text>
        <v-icon>mdi-account-multiple</v-icon>
        <span style="padding-left: 7px">커뮤니티</span>
      </v-btn>
    </v-toolbar-title>

    <v-spacer></v-spacer>

     <v-text-field
      v-model="searchContent"
      append-icon="mdi-magnify"
      label="Search"
      single-line
      hide-details
      class="mr-3 ml-3"
      @keyup.native.enter="searching"
      style="max-width:35%"
    ></v-text-field>
    
    <v-menu right bottom offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on" class="mr-1">
          <v-avatar size="43" v-if="$store.state.member != null">
            <img :src="`${$store.state.member.picture}`" v-if="$store.state.member.picture != null" :alt="`photo`" />
            <v-icon dark v-if="$store.state.member.picture == null"> mdi-account-circle </v-icon>
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
          to="/community/communityMenu"
          v-if="
            $store.state.member != null && $store.state.member.authority === 0
          "
        >
          <v-list-item-title>커뮤니티 메뉴</v-list-item-title>
        </v-list-item>
        <v-list-item
          to="/wiki/wikiMenu"
          v-if="
            $store.state.member != null && $store.state.member.authority === 0
          "
        >
          <v-list-item-title>위키 메뉴</v-list-item-title>
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
    searchContent : null
  }),

  computed: {
    ...mapState(["drawer"]),
  },

  methods: {
    ...mapMutations({
      setDrawer: "SET_DRAWER",
    }),


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

    searching(){
      this.$router.push(`/wiki/wikiSearch?content=${this.searchContent}&flag=${this.searchFlag}`);
    }
  },
};
</script>


