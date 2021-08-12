<template>
  <v-system-bar color="primary" height="30" fixed>
    <!-- <div class="pl-3 pt-4 white--text" v-show="$vuetify.breakpoint.xs">
      <router-link to="/">
        <p class="font-weight-medium white--text">ASPN wiki&Community</p>
      </router-link>
    </div> -->
    <div class="pl-3 pt-4 white--text">
      <p class="font-weight-medium white--text">지식은 공유하면 더 커진다.</p>
    </div>
    <v-spacer></v-spacer>
    <div class="pr-3 white--text">
      <v-row class="textCenter darken-4--text">
        <v-col
          ><a
            href="http://csr.aspnc.com"
            target="_blank"
            rel="noopener noreferrer"
            class="white--text"
            >CSR</a
          ></v-col
        >
        <v-col
          ><a
            href="http://gw.aspnc.com/"
            target="_blank"
            rel="noopener noreferrer"
            class="white--text"
            >Groupware</a
          ></v-col
        >
        <v-col><a @click="toFtp" class="white--text">FTP</a></v-col>
      </v-row>
    </div>
  </v-system-bar>
</template>

<script>
import AppMemberTool from "./AppMemberTool";
export default {
  components: {
    AppMemberTool,
  },
  methods: {
    toFtp() {
      // console.log(_.words("http://192.168.0.116:9000","192").length)
      let url = window.location.href;
      if (_.words(url, "192").length > 0) {
        window.open("http://192.168.0.116:9000/", "_blank");
      } else {
        window.open("http://36.97.142.103:9000/", "_blank");
      }
    },
  },
};
</script>