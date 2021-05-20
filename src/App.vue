<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: "App",

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

    //在页面刷新时将vuex里的信息保存到localStorage里
    window.addEventListener("beforeunload", () => {
      localStorage.setItem("store", JSON.stringify(this.$store.state));
    });

    this.$store.state.clientWith = document.body.clientWidth;
  },

  watch: {
    '$store.state.clientWith': function(clientWith){
       console.log(this.$store.state.ifMobile)
      if(clientWith >= 1264) {
        this.$store.state.ifMobile = true;
      }else{
        this.$store.state.ifMobile = false;
      }
    }
  }
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
  margin: 0 auto; max-width: 1090px
}

.containerPadding{
  padding: 12px 0 !important;
}
</style>
