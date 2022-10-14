<template>
  <div style="margin: 47px 0px 30px">
    <v-card class="pa-12 mx-lg-auto boxShadow" style="max-width:900px">
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          v-model="member.loginId"
          :label="$t('id')"
          :counter="20"
          required
          :rules="loginRules"
          @keyup.native.enter="validate"
        ></v-text-field>

        <v-text-field
          v-model="member.password"
          :counter="50"
          :label="$t('pw')"
          :type="showPassword ? 'text' : 'password'"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          required
          :rules="passwordRules"
          @click:append="showPassword = !showPassword"
          @keyup.native.enter="validate"
        ></v-text-field>

        <v-btn
          block
          large
          color="primary"
          class="mt-5"
          @click="validate"
          depressed
          @keyup.native.enter="validate"
          >{{$t('login')}}</v-btn
        >
        <v-btn
          block
          outlined
          large
          color="primary"
          class="mt-3"
          to="/signUp"
          depressed
          >{{$t('signUp')}}</v-btn
        >
      </v-form>

      <div class="text-center">
        <v-dialog v-model="dialog" width="500">
          <v-card>
            <v-card-title class="headline">
              {{ dialogTitle }}
            </v-card-title>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="closeDialogMsg"> Ok </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </v-card>
  </div>
</template>

<script>
import { el } from "vuetify/lib/locale";
import { mapMutations } from "vuex";

export default {
  data: () => ({
    member: {
      password: "",
      loginId: "",
    },
    memberToken: "",
    dialog: false,
    dialogTitle: "",
    showPassword: false,
    valid: true,
  }),

  created: function () {
    this.initialize();
  },

  computed: {
    passwordRules() {
      return [
        (v) => !!v || this.$t('required', {0: this.$t('pw')}),
        (v) =>
          (v && v.length >= 3 && v.length <= 50) ||
          this.$t('moreThan',{0:3})
      ]
    },
    loginRules() {
      return  [
        (v) => !!v || this.$t('required', {0: this.$t('id')}),
        (v) => (v && v.length <= 20) || this.$t('lessThan',{0:20})
      ]
    }
  },

  methods: {
    ...mapMutations(["changeLogin"]),

    initialize() {},

    validate() {
      const val = this.$refs.form.validate(); //是否填满表单
      let data = this.$data;
      let that = this;
      if (val) {
        this.$http
          .post("/member/members/login", data.member)
          .then((response) => {
            that.dialog = true;
            if (response.data.data.member != "0") {
              data.dialogTitle = this.$t('msgWelcome',{0: `${response.data.data.member.memberName}`}) ;
              //给store member 赋值
              that.$store.state.member = response.data.data.member;
              that.member = response.data.data.member;
              that.memberToken = response.data.data.token;
              //将用户token保存到vuex中
              that.changeLogin({ Authorization: that.memberToken });
              this.getMemberMenuTree();
            } else {
              data.dialogTitle = this.$t('msgPWFail');
              data.dialog = true;
            }
          })
          .catch((err) => console.log(err));
      }
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

    //关闭弹窗
    closeDialogMsg() {
      this.dialog = false;
      if (this.memberToken != "") {
        let url = localStorage.getItem('PreUrl');
        if(url != "" && url != null){
          this.$router.push(url); 
        } else {
          this.$router.push("/"); 
        } 
        
      }
    },
  },
};
</script>