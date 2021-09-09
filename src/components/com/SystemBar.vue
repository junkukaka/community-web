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

      <v-dialog v-model="toFtpDialog" width="260">
        <v-card class="text-center">
          <v-card-title class="primary white--text"> FTP LINK </v-card-title>
          <v-card-text class="pt-4">
            <v-btn class="ma-2" color="warning" depressed @click="toInteriorIp">
              내부
              <v-icon right dark> mdi-television </v-icon>
            </v-btn>

            <v-btn class="ma-2 white--text" color="success" depressed @click="toExternalIp">
              외부
              <v-icon right dark> mdi-cloud-upload </v-icon>
            </v-btn>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
  </v-system-bar>
</template>

<script>
import AppMemberTool from "./AppMemberTool";
export default {
  data: () => ({
    toFtpDialog: false,
  }),
  components: {
    AppMemberTool,
  },
  methods: {
    toFtp() {
      this.toFtpDialog = true;
    },

    toInteriorIp(){
      window.open("http://192.168.0.116:9000/", "_blank");
      this.toFtpDialog = false;
    },

    toExternalIp(){
      window.open("http://ftp.aspnc.com.cn:9000", "_blank");
      this.toFtpDialog = false;
    }
  },
};
</script>