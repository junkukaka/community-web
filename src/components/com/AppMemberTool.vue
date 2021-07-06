<template>
  <div class="pa-0 d-flex justify-end" style="padding-bottom: 0 !important">
    <v-text-field
      v-model="searchContent"
      append-icon="mdi-magnify"
      label="Search"
      single-line
      hide-details
      class="mr-3 ml-3 pt-2"
      style="max-width: 60%"
      @keyup.native.enter="searching"
    ></v-text-field>
    <v-menu right bottom offset-y transition="slide-x-reverse-transition">
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on" class="mr-1">
          <v-badge
            bordered
            bottom
            color="green accent-4"
            dot
            :offset-x="$store.state.memberAlert > 0 ? 10 : 10000"
            offset-y="10"
          >
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
          </v-badge>
          <v-avatar color="#EEEEEE" v-if="$store.state.member == null">
            <v-icon dark> mdi-account-circle </v-icon>
          </v-avatar>
        </v-btn>
      </template>

      <v-list>
        <v-list-item to="/notifications" v-if="$store.state.member != null" v-show="$store.state.memberAlert > 0">
          <v-list-item-title>
            <v-badge color="green" :content="$store.state.memberAlert">Notifications </v-badge>
          </v-list-item-title>
        </v-list-item>
        <v-list-item to="/community/profile" v-if="$store.state.member != null">
          <v-list-item-title>커뮤니티 프로파일</v-list-item-title>
        </v-list-item>
        <v-list-item to="/wiki/profile" v-if="$store.state.member != null">
          <v-list-item-title>위키 프로파일</v-list-item-title>
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
          to="/aspnAdmin"
          v-if="
            $store.state.member != null && $store.state.member.authority === 0
          "
        >
          <v-list-item-title>관리자 페이지</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
export default {
  data: () => ({
    admins: [
      { title: "Community Menu", link: "/community/communityMenu" },
      { title: "Wiki Menu", link: "/wiki/wikiMenu" },
    ],
    searchFlag: "COMMUNITY",
    searchContent: null,
    timer: '',
  }),

  created() {
    this.member = this.$store.state.member;
    if (this.$store.state.member != null) {
      this.initialize();
    }
  },

  watch: {
    "$store.state.memberAlert": function (newVal) {
      this.getMyCommunityCommentCount();
    },
  },

  mounted(){
    //반시간 한번씩 실행
    this.timer = setInterval(this.getMyCommunityCommentCount,1800000)
  },

  beforeDestroy() {
    clearInterval(this.timer);
  },

  methods: {

    initialize() {
      this.getMyCommunityCommentCount();
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

    getMyCommunityCommentCount() {
      this.$http
        .get(`/comment/getMyCommunityCommentCount/${this.member.id}`)
        .then((response) => {
          this.$store.state.memberAlert = response.data.data;
        });
    },

    searching() {
      this.$router.push(
        `/community/communitySearch?content=${this.searchContent}&flag=${this.searchFlag}`
      );
    },
  },
};
</script>