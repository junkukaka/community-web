<template>
  <v-system-bar
    color="primary"
    height="30"
    fixed
    class="d-flex justify-space-between"
  >
    <!-- <div class="pl-3 pt-4 white--text" v-show="$vuetify.breakpoint.xs">
      <router-link to="/">
        <p class="font-weight-medium white--text">ASPN wiki&Community</p>
      </router-link>
    </div> -->
    <div
      class="pl-3 pt-4 white--text"
      v-show="
        $vuetify.breakpoint.md ||
        $vuetify.breakpoint.lg ||
        $vuetify.breakpoint.xl
      "
    >
      <p class="font-weight-medium white--text">지식은 공유하면 더 커진다.</p>
    </div>
    <v-card flat class="white--text pa-0 ma-0">
      <v-tabs
        background-color="primary"
        show-arrows
        
      >
        <v-tab
          v-if="
            $store.state.member != null && $store.state.member.authority < 4
          "
        >
          <router-link class="white--text text-caption" to="/ReportMain">
            Report
          </router-link>
        </v-tab>
        <v-tab>
          <a
            href="http://csr.aspnc.com"
            target="_blank"
            rel="noopener noreferrer"
            class="white--text text-caption"
            >CSR</a
          >
        </v-tab>
        <v-tab>
          <a
            href="http://gw.aspnc.com/"
            target="_blank"
            rel="noopener noreferrer"
            class="white--text text-caption"
            >Groupware</a
          >
        </v-tab>
        <v-tab>
          <a @click="toFtp" class="white--text text-caption text-caption">FTP</a>
        </v-tab>
        <v-tab
          v-if="
            $store.state.member != null && $store.state.member.authority === 0
          "
        >
          <a @click="toAdmin" class="white--text text-caption">Admin</a>
        </v-tab>
         <v-tab v-if="$store.state.member != null">
          <a @click="signOut" class="white--text text-caption">Logout</a>
        </v-tab>
        <v-tab v-if="$store.state.member == null">
          <a @click="signIn" class="white--text text-caption">Login</a>
        </v-tab>
      </v-tabs>

      <v-dialog v-model="toFtpDialog" width="260">
        <v-card class="text-center">
          <v-card-title class="primary white--text"> FTP LINK </v-card-title>
          <v-card-text class="pt-4">
            <v-btn class="ma-2" color="warning" depressed @click="toInteriorIp">
              내부
              <v-icon right dark> mdi-television </v-icon>
            </v-btn>

            <v-btn
              class="ma-2 white--text"
              color="success"
              depressed
              @click="toExternalIp"
            >
              외부
              <v-icon right dark> mdi-cloud-upload </v-icon>
            </v-btn>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-card>
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

    toInteriorIp() {
      window.open("http://192.168.0.116:9000/", "_blank");
      this.toFtpDialog = false;
    },

    toExternalIp() {
      window.open("http://ftp.aspnc.com.cn:9000", "_blank");
      this.toFtpDialog = false;
    },

    toAdmin() {
      this.$router.push("/aspnAdmin");
    },

    signOut() {
      this.$store.state.member = null;
      //退出登录，清空token
      localStorage.removeItem("Authorization");
      localStorage.removeItem("store");
      this.$router.push("/signIn");
    },

    signIn() {
      this.$router.push("/signIn");
    },
  },
};
</script>