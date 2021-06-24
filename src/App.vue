<template>
  <router-view></router-view>
</template>

<script>

import { mapMutations } from "vuex";

export default {
  name: "App",
  data: () => ({
    memberToken: null
  }),

  beforeCreate() {
     //如果用户改变了密码就推出登录
    if (this.$store.state.member != null) {  
      const u = this.$store.state.member;
      this.$http
        .post("/member/members/checkSession",u)
        .then((response) => {
            if (response.data.data.member == undefined || response.data.data.member == 0) {
               this.$store.state.member = null;
                //退出登录，清空token
                this.dialog = false;
                localStorage.removeItem("Authorization");
                localStorage.removeItem("store");
                this.$router.push('/signIn');
                this.removeLogin();
            }else{
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

     if(!localStorage.getItem("Authorization")){
        this.$store.state.member = null;
        //退出登录，清空token
        localStorage.removeItem("Authorization");
        localStorage.removeItem("store");
        this.$router.push("/signIn");
     }

    //在页面刷新时将vuex里的信息保存到localStorage里
    window.addEventListener("beforeunload", () => {
      localStorage.setItem("store", JSON.stringify(this.$store.state));
    });

    this.$store.state.clientWith = document.body.clientWidth;

    this.pageResize();
  },

  watch: {
    '$store.state.clientWith': function(clientWith){
      if(clientWith >= 1264) {
        this.$store.state.ifMobile = true;
      }else{
        this.$store.state.ifMobile = false;
      }
    }
  },

   methods: {
    ...mapMutations(["changeLogin","removeLogin"]),

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
};
</script>

<style>
.Mytitle {
  font-size: 2rem !important;
}
.anchorArea {
  position: fixed;
  right: 0px;
  top: 77px;
  width: 270px;
}
.anchorArea .contentsBorder {
  border-left: 1px solid black;
  color: black !important;
}

.rightBottomArea{
  right: 26px; bottom: 26px
}

.anchorArea .contentsBorder a {
  cursor: pointer;
  font-size: 12px;
  color: #0091ea;
}

.anchorArea .normalBorder {
  border-left: 1px solid #e0e0e0;
}
.anchorArea .normalBorder a {
  cursor: pointer;
  font-size: 12px;
  color: #757575;
}
#read .ql-syntax {
  background-color: rgb(236, 236, 236);
  padding: 10px;
}
#read p img {
  max-width: 100%;
}
.v-application a {
  text-decoration: none;
}

.containerMaxWith{
  margin: 0 auto; max-width: 1700px;
}

.containerPadding{
  padding: 12px 6px !important;
}

.wikiListBorder{
  border-color: #1976d2;
  border-left-width: 0.26rem;
  border-left-style: solid;
}
</style>
