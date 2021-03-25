<template>
  <v-app>
    <Drawer />
    <AppBar />
    <!-- Sizes your content based upon application components -->
    <v-main
      :style="{
        padding: `64px ${this.$store.state.window.mainPaddingLeft}px 0px ${this.$store.state.window.mainPaddingRight}px !important`,
      }"
    >
      <!-- Provides the application the proper gutter -->
      <v-container fluid color="grey lighten-4">
        <!-- If using vue-router -->
        <div style="margin: 0 auto; max-width: 1100px">
          <router-view></router-view>
        </div>
       
      </v-container>
    </v-main>
     <Footer />
  </v-app>
</template>

<script>

import { mapMutations } from "vuex";

export default {
  name: "Index",
  components: {
    AppBar: () => import("@/components/core/AppBar"),
    Drawer: () => import("@/components/core/Drawer"),
    Footer: () => import("@/components/core/Footer"),
  },

  data() {
    return {
      paddingLeft: 256,
      paddingRight: 300,
    };
  },

  beforeCreate() {
     //如果用户改变了密码就推出登录
    if (this.$store.state.member != null) {  
      const u = this.$store.state.member;
      this.$http
        .post("/member/members/login",u)
        .then((response) => {
            if (response.data.data.member == 0) {
               this.$store.state.member = null;
                //退出登录，清空token
                this.dialog = false;
                localStorage.removeItem("Authorization");
                localStorage.removeItem("store");
                this.$router.push('/signIn');
            }
        });
    }
  },


  methods: {
    ...mapMutations(["changeLogin"]),

    pageResize() {
      let screenWidth = document.body.clientWidth;
      if (screenWidth < 1264) {
        this.$store.state.window.rightDrawerTop = -1000;
        this.$store.state.window.mainPaddingLeft = 0;
        this.$store.state.window.mainPaddingRight = 0;
      } else {
        this.$store.state.window.rightDrawerTop = 64;
        this.$store.state.window.mainPaddingLeft = 256;
        this.$store.state.window.mainPaddingRight = 300;
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

  created() {
    this.pageResize();
  },
};
</script>
