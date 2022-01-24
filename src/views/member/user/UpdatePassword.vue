<template>
  <div style="margin: 47px 0px 30px">
    <v-card class="pa-12 mx-lg-auto boxShadow" style="max-width:900px">
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          v-model="member.loginId"
          :label="$t('id')"
          :counter="20"
          required
          disabled
          @keyup.native.enter="validate"
        ></v-text-field>

        <v-text-field
          v-model="pw.new"
          :counter="50"
          :label="$t('newPW')"
          :type="showPassword ? 'text' : 'password'"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          required
          :rules="passwordRules"
          @click:append="showPassword = !showPassword"
          @keyup.native.enter="validate"
        ></v-text-field>

        <v-text-field
          v-model="pw.confirm"
          :counter="50"
          :label="$t('confirmSomeThing',{0:$t('pw')})"
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
          >{{$t('changeSomeThing',{0:$t('pw')})}}</v-btn
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
              <v-btn color="primary" text @click="closeDialogMsg"> {{$t('ok')}} </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </v-card>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { mapGetters } from "vuex";

export default {
  data: () => ({
    member: {
      loginId: "",
    },
    pw: {
      id: null,
      new: null,
      confirm: null,
    },
    memberToken: "",
    dialog: false,
    dialogTitle: "",
    showPassword: false,
    valid: true,
    successYn : false
  }),

  created: function () {
    this.member = this.getMember();
    this.initialize();
  },

  computed:{
    passwordRules(){
      return [
        (v) => !!v || this.$t('required',{0:this.$t('pw')}),
        (v) =>
          (v && v.length >= 3 && v.length <= 50) || this.$t('moreThan',{0:3}),
      ]
    },
  },

  methods: {
    ...mapGetters(["getMember"]),
    ...mapMutations(["changeLogin"]),

    initialize() {
      this.pw.id = this.member.id;
    },

    validate() {
      const val = this.$refs.form.validate(); //是否填满表单
      if (val) {
        if (this.pw.new != this.pw.confirm) {
          this.dialog = true;
          this.dialogTitle = this.$t('confirmSomeThing',{0:this.$t('pw')});
          return false;
        }
        this.$http.put("/member/members/password", this.pw).then((response) => {
          const result = response.data.data;
          if (result == 1) {
            this.dialog = true;
            this.dialogTitle = this.$t('msgSuccessChange');
            this.successYn = true;
          } else {
            this.dialog = true;
            this.dialogTitle = this.$t('confirmSomeThing',{0:this.$t('pw')});
          }
        });
      }
    },

    signOut() {
      this.$store.state.member = null;
      //退出登录，清空token
      localStorage.removeItem("Authorization");
      localStorage.removeItem("store");
      this.$router.push("/signIn");
    },

    //关闭弹窗
    closeDialogMsg() {
      this.dialog = false;
      if (this.memberToken != "") {
        this.$router.push("/");
      }

      if(this.successYn){
        this.signOut();
        this.$router.push("/");
      }
    },
  },
};
</script>