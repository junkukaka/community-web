<template>
  <v-system-bar
    color="indigo"
    height="30"
    absolute
    style="position: fixed"
    class="d-flex justify-space-between"
  >
    <!-- <div class="pl-3 pt-4 white--text" v-show="$vuetify.breakpoint.xs">
      <router-link to="/">
        <p class="font-weight-medium white--text">ASPN wiki&Community</p>
      </router-link>
    </div> -->
    <div
      class="pl-3 pt-4 text-white"
      v-show="
        $vuetify.display.md ||
        $vuetify.display.lg ||
        $vuetify.display.xl
      "
    >
      <p class="font-weight-medium text-white">{{$t('sysMsg')}}</p>
    </div>
    <v-card flat class="text-white pa-0 ma-0">
      <v-tabs
        bg-color="indigo"
        show-arrows

      >
        <v-tab
          v-if="
            $store.state.member != null
          "
        >
          <router-link class="text-white text-body-small" to="/ReportMain">
           {{$t('report')}}
          </router-link>
        </v-tab>
        <v-tab>
          <a
            href="http://csr.aspn.com.cn/"
            target="_blank"
            rel="noopener noreferrer"
            class="text-white text-body-small"
            >{{$t('csr')}}</a
          >
        </v-tab>
        <v-tab>
          <a
            href="http://gw.aspnc.com/"
            target="_blank"
            rel="noopener noreferrer"
            class="text-white text-body-small"
            >{{$t('groupware')}}</a
          >
        </v-tab>
        <v-tab>
          <a
            href="http://ftp.aspnc.com.cn:9000/"
            target="_blank"
            rel="noopener noreferrer"
            class="text-white text-body-small"
            >{{$t('ftp')}}</a
          >
          <!-- <a @click="toFtp" class="white--text text-caption text-caption">{{$t('ftp')}}</a> -->
        </v-tab>
        <v-tab>
          <a
            href="http://192.168.0.116:5000/"
            target="_blank"
            rel="noopener noreferrer"
            class="text-white text-body-small"
            >{{$t('books')}}</a
          >
          <!-- <a @click="toFtp" class="white--text text-caption text-caption">{{$t('ftp')}}</a> -->
        </v-tab>
        <v-tab
          v-if="
            $store.state.member != null && $store.state.member.authority === 0
          "
        >
          <a @click="toAdmin" class="text-white text-body-small">{{$t('admin')}}</a>
        </v-tab>
         <v-tab v-if="$store.state.member != null">
          <a @click="signOut" class="text-white text-body-small">{{$t('logout')}}</a>
        </v-tab>
        <v-tab v-if="$store.state.member == null">
          <a @click="signIn" class="text-white text-body-small">{{$t('login')}}</a>
        </v-tab>


        <v-tab>
          <v-menu location="bottom">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  variant="flat"
                  class="text-white v-icon notranslate"
                  color="indigo"                >
                <v-icon class="text-white v-icon notranslate"> mdi-translate </v-icon>
                <v-icon class="text-white v-icon notranslate">mdi-menu-down </v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(item, index) in langs"
                  :key="index"
                  @click="selectLanguage(item.code,item.name)"
                >
                  <v-list-item-title>{{ item.name }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
        </v-tab>

      </v-tabs>

      <v-dialog v-model="toFtpDialog" width="260">
        <v-card class="text-center">
          <v-card-title class="bg-indigo text-white"> FTP LINK </v-card-title>
          <v-card-text class="pt-4">
            <v-btn class="ma-2" color="warning" variant="flat" @click="toInteriorIp">
              내부
              <v-icon end> mdi-television </v-icon>
            </v-btn>

            <v-btn
              class="ma-2 text-white"
              color="success"
              variant="flat"
              @click="toExternalIp"
            >
              외부
              <v-icon end> mdi-cloud-upload </v-icon>
            </v-btn>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-card>
  </v-system-bar>
</template>

<script>
export default {
  data: () => ({
    toFtpDialog: false,
    langs: [
      {name: "English", code: "en"},
      {name: "简体中文", code: "ch"},
      {name: "한글", code: "ko"}
    ],
    lang: "English"
  }),
  created(){
    //设置语言
    if(this.$store.state.lang && this.$store.state.lang.code){
      this.selectLanguage(this.$store.state.lang.code,this.$store.state.lang.name)
    }
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
      localStorage.removeItem("token");
      localStorage.removeItem("store");
      this.$router.push("/signIn");
    },

    signIn() {
      this.$router.push("/signIn");
    },


    selectLanguage(code,name) {
      this.$i18n.locale = code;
      this.$store.state.lang =  {name: name, code: code};
      this.lang = name;
      //console.log(this.$store.state.lang);
    }

  },
};
</script>
