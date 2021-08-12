<template>
  <div style="margin: 47px 0px 30px">
    <v-card class="pa-12 mx-lg-auto boxShadow" style="max-width:900px">
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          v-model="member.loginId"
          label="Login ID"
          :counter="20"
          required
          disabled
          @keyup.native.enter="validate"
        ></v-text-field>

        <v-text-field
          v-model="pw.new"
          :counter="50"
          label="신규 비밀번호"
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
          label="신규 비밀번호 확인"
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
          >수정</v-btn
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
    passwordRules: [
      (v) => !!v || "password is required",
      (v) =>
        (v && v.length >= 3 && v.length <= 50) ||
        "Name must be more than 3 characters",
    ],
  }),

  created: function () {
    this.member = this.getMember();
    this.initialize();
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
          this.dialogTitle = `비밀번호를 확인 하세요`;
          return false;
        }
        this.$http.put("/member/members/password", this.pw).then((response) => {
          const result = response.data.data;
          if (result == 1) {
            this.signOut();
            this.$router.push("/");
          } else {
            this.dialog = true;
            this.dialogTitle = `비밀번호를 확인 하세요`;
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
    },
  },
};
</script>