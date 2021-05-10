<template>
  <v-card class="pa-5" flat>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-text-field
        v-model="member.loginId"
        label="Login ID"
        required
        :rules="loginRules"
        @keyup.native.enter="validate"
      ></v-text-field>

      <v-text-field
        v-model="member.password"
        :counter="10"
        label="Password"
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
        >Sign In</v-btn
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
</template>

<script>
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
    passwordRules: [
      (v) => !!v || "password is required",
      (v) => (v && v.length >= 3) || "Name must be more than 3 characters",
    ],
    loginRules: [
      (v) => !!v || "login ID is required",
      (v) => (v && v.length <= 20) || "Name must be less than 20 characters"
    ]
  }),

  created: function () {
    this.initialize();
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
              data.dialogTitle = `Hello ${response.data.data.member.memberName} Welcome to ASPN`;
              //给store member 赋值
              that.$store.state.member = response.data.data.member;
              that.memberToken = response.data.data.token;
              //将用户token保存到vuex中
              that.changeLogin({ Authorization: that.memberToken });
   
            } else {
              data.dialogTitle = "login ID or password is fail";
              data.dialog = true;
            }
          })
          .catch((err) => console.log(err));
      }
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