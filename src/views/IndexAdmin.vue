<template>
  <v-app>
    <AppBar />
    <!-- Sizes your content based upon application components -->
    <v-main>
      <!-- Provides the application the proper gutter -->
      <v-container fluid color="grey lighten-4" class="containerPadding">
        <!-- If using vue-router -->
        <div style="margin:0 auto">
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
    AppBar: () => import("@/components/adminCore/AppBar"),
    Footer: () => import("@/components/com/Footer"),
  },

  data() {
    return {
      paddingLeft: 256,
      paddingRight: 300,
      memberToken: ""
    };
  },

  beforeCreate() {
     //如果用户改变了密码就推出登录
    if (this.$store.state.member != null) {  
      const u = this.$store.state.member;
      this.$http
        .post("/member/members/checkSession",u)
        .then((response) => {
            if (response.data.data.member == 0) {
               this.$store.state.member = null;
                //退出登录，清空token
                this.dialog = false;
                localStorage.removeItem("Authorization");
                localStorage.removeItem("store");
                this.$router.push('/signIn');
            }else{
              this.$store.state.member = response.data.data.member;
              this.memberToken = response.data.data.token;
              this.changeLogin({ Authorization: this.memberToken });
            }
        });
    }
  },


  methods: {
    ...mapMutations(["changeLogin"]),

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
