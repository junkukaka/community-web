<template>
  <v-system-bar
    color="indigo"
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
      <p class="font-weight-medium white--text">{{$t('sysMsg')}}</p>
    </div>
    <v-card flat class="white--text pa-0 ma-0">
      <v-tabs
        background-color="indigo"
        show-arrows
        
      >
        <v-tab
          v-if="
            $store.state.member != null
          "
        >
          <router-link class="white--text text-caption" to="/ReportMain">
           {{$t('report')}}
          </router-link>
        </v-tab>
        <v-tab>
          <a
            href="http://csr.aspn.com.cn/"
            target="_blank"
            rel="noopener noreferrer"
            class="white--text text-caption"
            >{{$t('csr')}}</a
          >
        </v-tab>
        <v-tab>
          <a
            href="http://gw.aspnc.com/"
            target="_blank"
            rel="noopener noreferrer"
            class="white--text text-caption"
            >{{$t('groupware')}}</a
          >
        </v-tab>
        <v-tab>
          <a
            href="http://ftp.aspnc.com.cn:9000/"
            target="_blank"
            rel="noopener noreferrer"
            class="white--text text-caption"
            >{{$t('ftp')}}</a
          >
          <!-- <a @click="toFtp" class="white--text text-caption text-caption">{{$t('ftp')}}</a> -->
        </v-tab>
        <v-tab>
          <a
            href="http://192.168.0.116:5000/"
            target="_blank"
            rel="noopener noreferrer"
            class="white--text text-caption"
            >{{$t('books')}}</a
          >
          <!-- <a @click="toFtp" class="white--text text-caption text-caption">{{$t('ftp')}}</a> -->
        </v-tab>
        <v-tab
          v-if="
            $store.state.member != null && $store.state.member.authority === 0
          "
        >
          <a @click="toAdmin" class="white--text text-caption">{{$t('admin')}}</a>
        </v-tab>
         <v-tab v-if="$store.state.member != null">
          <a @click="signOut" class="white--text text-caption">{{$t('logout')}}</a>
        </v-tab>
        <v-tab v-if="$store.state.member == null">
          <a @click="signIn" class="white--text text-caption">{{$t('login')}}</a>
        </v-tab>


        <v-tab>
          <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  depressed
                  class="white--text v-icon notranslate"
                  color="indigo"                >
                <v-icon class="white--text v-icon notranslate"> mdi-translate </v-icon> 
                <v-icon class="white--text v-icon notranslate">mdi-menu-down </v-icon> 
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
          <v-card-title class="indigo white--text"> FTP LINK </v-card-title>
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
    langs: [
      {name: "English", code: "en"},
      {name: "简体中文", code: "ch"},
      {name: "한글", code: "ko"}
    ],
    lang: "English"
  }),
  components: {
    AppMemberTool,
  },

  created(){
    //设置语言
    if(this.$store.state.lang != null){
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