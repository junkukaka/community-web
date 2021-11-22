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
      <v-btn icon class="mr-1" @click="toMemberProfile">
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
  </div>
</template>

<script>
export default {
  data: () => ({
    admins: [
      { title: "Community Menu", link: "/community/communityMenu" },
      { title: "Wiki Menu", link: "/wiki/wikiMenu" },
    ],
    searchFlag: "WIKI",
    searchContent: null,
    timer: '',
    path: null,
  }),

  created() {
    this.member = this.$store.state.member;
    if (this.$store.state.member != null) {
      this.initialize();
    }
    this.path = this.$route.path;
    this.iniSearchFlag();
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

    iniSearchFlag(){
      if(_.startsWith(this.path,"/community")){
        this.searchFlag = 'COMMUNITY'
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

    getMyCommunityCommentCount(){
      this.$http
        .get(`/comment/getMyCommunityCommentCount/${this.member.id}`)
        .then((response) => {
          this.$store.state.memberAlert = response.data.data;
        });
    },

    searching() {
      this.$router.push(
        `/search?content=${this.searchContent}&flag=${this.searchFlag}`
      );
    },

    toMemberProfile(){
      this.$router.push("/member")
    }
  },
};
</script>