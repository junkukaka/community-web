<template>
  <router-view v-wechat-title="$route.meta.title"></router-view>
</template>

<script>
import "./static/css/api.css";
import { mapMutations } from "vuex";

export default {
  name: "App",
  data: () => ({
    memberToken: null,
    member: {},
  }),

  beforeCreate() {
    //如果用户改变了密码就推出登录
    if (this.$store.state.member != null) {
      const u = this.$store.state.member;
      this.$http.post("/member/members/checkSession", u).then((response) => {
        if (
          response.data.data.member == undefined ||
          response.data.data.member == 0
        ) {
          this.$store.state.member = null;
          //退出登录，清空token
          this.dialog = false;
          localStorage.removeItem("Authorization");
          localStorage.removeItem("store");
          this.$router.push("/");
          this.removeLogin();
        } else {
          this.$store.state.member = response.data.data.member;
          this.memberToken = response.data.data.token;
          this.changeLogin({ Authorization: this.memberToken });
        }
      });
    }
  },

  created() {
    //在页面加载时读取localStorage里的状态信息
    if (localStorage.getItem("store")) {
      this.$store.replaceState(
        Object.assign(
          {},
          this.$store.state,
          JSON.parse(localStorage.getItem("store"))
        )
      );
    }

    this.checkSession();
    if (this.$store.state.member == null) {
      this.logout();
    } else {
      this.member = this.$store.state.member;
      this.getMemberMenuTree();
    }

    //在页面刷新时将vuex里的信息保存到localStorage里
    window.addEventListener("beforeunload", () => {
      localStorage.setItem("store", JSON.stringify(this.$store.state));
    });
    this.$store.state.clientWith = document.body.clientWidth;
    this.pageResize();
  },

  watch: {
    "$store.state.clientWith": function (clientWith) {
      if (clientWith >= 1264) {
        this.$store.state.ifMobile = true;
      } else {
        this.$store.state.ifMobile = false;
      }
    },
  },

  mounted() {
    let that = this; //赋值vue的this
    window.onresize = () => {
      //调用methods中的事件
      that.pageResize();
    };
  },

  methods: {
    ...mapMutations(["changeLogin", "removeLogin"]),

    pageResize() {
      let screenWidth = document.body.clientWidth;
      if (screenWidth < 1260) {
        this.$store.state.window.rightDrawerTop = -1000;
        this.$store.state.window.mainPaddingLeft = 0;
        this.$store.state.window.mainPaddingRight = 0;
      } else {
        this.$store.state.window.rightDrawerTop = 64;
        this.$store.state.window.mainPaddingLeft = 256;
        this.$store.state.window.mainPaddingRight = 270;
      }
    },

    checkSession() {
      const token = localStorage.getItem("token");
      this.$http.get(`/member/memberVerify/${token}`).then((response) => {
        if (response.data.data < 1 || response.data.code == "50000") {
          this.logout();
        }
      });
    },

    getMemberMenuTree() {
      let data = this.$data;
      let request = {
        params: {
          authority: data.member.authority,
          flag: 0,
        },
      };
      //get wiki menu
      this.$http.get(`/wikiMenu/menus/tree`, request).then((response) => {
        this.$store.state.wikiMenus = response.data.data;
      });
      //get community menu
      this.$http.get(`/communityMenu/menus/tree`, request).then((response) => {
        this.$store.state.communityMenus = response.data.data;
      });
    },

    logout() {
      this.$store.state.member = null;
      //退出登录，清空token
      localStorage.removeItem("Authorization");
      localStorage.removeItem("store");
      this.$router.push("/");
    },
  },
};
</script>

<style>

</style>
