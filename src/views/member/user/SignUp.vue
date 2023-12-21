<template>
  <div style="margin: 47px 0px 30px">
    <v-card class="pa-12 mx-lg-auto boxShadow" style="max-width: 900px">
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-on="on"
              v-bind="attrs"
              v-model="member.memberName"
              :counter="30"
              :rules="nameRules"
              :label="$t('userName')"
              required
              @keyup.native.enter="validate"
            ></v-text-field>
          </template>
          <span>{{$t('realNameTip')}}</span>
        </v-tooltip>

        <v-text-field
          v-model="member.loginId"
          :counter="20"
          :rules="loginRules"
          :label="$t('id')"
          required
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

        <v-text-field
          v-model="confirmPassord"
          :counter="50"
          :label="$t('confirmSomeThing',{0:$t('pw')})"
          :type="showPassword ? 'text' : 'password'"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          required
          @click:append="showPassword = !showPassword"
          @keyup.native.enter="validate"
        ></v-text-field>

        <v-text-field
          v-model="member.email"
          :rules="emailRules"
          :label="$t('mail')"
          @keyup.native.enter="validate"
          required
        ></v-text-field>

        <v-select
          v-model="member.department"
          :items="departments"
          :rules="[(v) => !!v || $t('required',{0:$t('department')})]"
          :label="$t('department')"
          required
        ></v-select>

        <v-textarea
          outlined
          :label="$t('reasonForSomeThing')"
          v-model="member.comment"
          :rules="[(v) => !!v || $t('required',{0:$t('reasonForSomeThing')})]"
        ></v-textarea>

        <v-btn
          block
          large
          color="indigo"
          class="mt-5"
          @click="validate"
          depressed
          @keyup.native.enter="validate"
          >{{$t('ok')}}</v-btn
        >
      </v-form>

      <div class="text-center">
        <v-dialog v-model="dialog" width="500" persistent>
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
              <v-btn color="indigo" text @click="closeDialogMsg"> {{$t('ok')}} </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  data: () => ({
    member: {
      memberName: "",
      password: "",
      email: "",
      phone: null,
      department: null,
      comment: "",
    },
    successYn: false,
    departments: [],
    confirmPassord: "",
    dialog: false,
    dialogMsg: "",
    dialogTitle: "",
    showPassword: false,
    valid: true,
    phoneRules: [
      (v) => !!v || "E-mail is required",
      (v) => /^[1][3,4,5,7,8,9,6][0-9]{9}$/.test(v) || "Phone must be valid",
    ],
  }),

  computed: {
    nameRules(){
      return [
        (v) => !!v || this.$t('required',{0:this.$t('userName')}),
        (v) => (v && v.length <= 30) || this.$t('lessThan',{0:30})
      ]
    },

    loginRules() {
      return [
        (v) => !!v || this.$t('required',{0:this.$t('id')}),
        (v) => (v && v.length <= 20) || this.$t('lessThan',{0:20}) ,
        (v) =>
            /^[A-Za-z0-9]+$/.test(v) || this.$t('msgNumberOrAlphabet')
        ]
    },

    passwordRules(){
      return [
        (v) => !!v || this.$t('required',{0:this.$t('pw')}),
        (v) =>
          (v && v.length >= 3 && v.length <= 50) || this.$t('moreThan',{0:3}),
      ]
    },

    emailRules(){
      return [
        (v) => !!v || this.$t('required',{0:this.$t('mail')}),
        (v) => /.+@.+\..+/.test(v) || this.$t('mailValid'),
        (v) => (v && v.length <= 32) || this.$t('lessThan',{0:32}),
      ]
    },
  },

  created: function () {
    this.initialize();
  },

  methods: {
    initialize() {
      this.$nextTick(function () {
        this.$http
          .get("/member/members/department")
          .then((response) => (this.departments = response.data.data));
      });
    },

    validate() {
      const val = this.$refs.form.validate(); //是否填满表单
      if (this.member.password !== this.confirmPassord) {
        this.dialog = true;
        this.dialogTitle = this.$t('errorSomeThing',{0:this.$t('pw')});
        this.dialogMsg = this.$t('confirmSomeThing',{0:this.$t('pw')});
        return false;
      }
      let data = this.$data;
      if (val) {
        this.$http
          .post("/member/memberApplication", data.member)
          .then((response) => {
            //设置弹窗
            data.dialog = true;
            data.dialogMsg = response.data.data.msg;
            if (response.data.data.code == "1") {
              data.dialogTitle = this.$t('msgWelcome',{0:this.member.memberName});
              data.dialogMsg = this.$t('msgSignUpSuccess',{0:this.member.memberName});
              data.dialog = true;
              this.successYn = true;
            } else {
              data.dialogTitle = this.$t('msgFailed',{0:this.$t('application')});
            }
          })
          .catch((err) => console.log(err));
      }
    },

    //关闭弹窗
    closeDialogMsg() {
      this.dialog = false;
      if (this.successYn) {
        this.$router.push("/signIn");
      }
    },
  },
};
</script>