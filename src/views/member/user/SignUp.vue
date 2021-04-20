<template>
  <v-card class="pa-5" flat>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-text-field
        v-model="member.memberName"
        :counter="10"
        :rules="nameRules"
        label="Name"
        required
      ></v-text-field>

      <v-text-field
        v-model="member.loginId"
        :counter="10"
        :rules="loginRules"
        label="LogIn ID"
        required
      ></v-text-field>

      <v-text-field
        v-model="member.password"
        :counter="10"
        label="Password"
        :type="showPassword ? 'text' : 'password'"
        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        required
        @click:append="showPassword = !showPassword"
      ></v-text-field>

      <v-text-field
        v-model="confirmPassord"
        :counter="10"
        label="confirm Password"
        :type="showPassword ? 'text' : 'password'"
        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        required
        @click:append="showPassword = !showPassword"
      ></v-text-field>

      <v-text-field
        v-model="member.email"
        :rules="emailRules"
        label="E-mail"
        required
      ></v-text-field>

      <!-- <v-text-field
        v-model="member.phone"
        :rules="phoneRules"
        label="Phone"
        required
      ></v-text-field> -->

      <v-btn
        block
        large
        color="primary"
        class="mt-5"
        @click="validate"
        depressed
        >ASPN 회원가입</v-btn
      >
    </v-form>

    <div class="text-center">
      <v-dialog v-model="dialog" width="500">
        <v-card>
          <v-card-title class="headline">
            {{ dialogTitle }}
          </v-card-title>

          <v-card-text>
            {{ dialogMsg }}
          </v-card-text>

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
export default {
  data: () => ({
    member: {
      memberName: "",
      password: "",
      email: "",
      phone: null,
    },
    confirmPassord: "",
    dialog: false,
    dialogMsg: "",
    dialogTitle: "",
    showPassword: false,
    valid: true,
    nameRules: [
      (v) => !!v || "Name is required",
      (v) => (v && v.length <= 50) || "Name must be less than 50 characters",
    ],
    loginRules: [
      (v) => !!v || "login id is required",
      (v) => (v && v.length <= 11) || "Name must be less than 11 characters",
      (v) => /^[A-Za-z0-9]+$/.test(v) || "login id must be number or English alphabet",
    ],
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      (v) => (v && v.length <= 32) || "Name must be less than 32 characters",
    ],
    phoneRules: [
      (v) => !!v || "E-mail is required",
      (v) => /^[1][3,4,5,7,8,9][0-9]{9}$/.test(v) || "Phone must be valid",
    ],
  }),

  created: function () {

  },

  methods: {
    validate() {
      const val = this.$refs.form.validate(); //是否填满表单
      if(this.member.password !== this.confirmPassord){
        this.dialog = true;
        this.dialogTitle = "Password error"
        this.dialogMsg = "please check your password and confirm password";
        return false;
      }
      console.log(this.member);
      let data = this.$data;
      if (val) {
        this.$http
          .post("/member/members", data.member)
          .then((response) => {
            console.log(response.data);
            //设置弹窗
            data.dialog = true;
            data.dialogMsg = response.data.data.msg;
            if (response.data.data.code == "1") {
              data.dialogTitle = "Welcome to the ASPN community";
            } else {
              data.dialogTitle = "Application failed";
            }
          })
          .catch((err) => console.log(err));
      }
    },

    //关闭弹窗
    closeDialogMsg() {
      this.dialog = false;
      if (this.dialogTitle == "Welcome to the ASPN community") {
        this.$router.push("/signIn");
      }
    },
  },
};
</script>