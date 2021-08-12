<template>
  <div style="margin:47px 0px 30px">
    <v-card class="pa-12 mx-lg-auto boxShadow" style="max-width:900px">
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-row no-gutters>
          <v-col cols="12" sm="3" md="2" lg="1">
            <v-avatar size="62">
              <img :src="member.picture" />
            </v-avatar>
          </v-col>
          <v-col cols="12" sm="5" md="5" lg="5" class="pl-2 pt-2">
            <v-file-input
              :rules="imgRules"
              accept="image/png, image/jpeg, image/bmp"
              placeholder="Pick an avatar"
              label="Avatar"
              v-model="avatar"
              style="cursor: pointer"
            ></v-file-input>
          </v-col>

          <v-col cols="12" sm="4" md="5" lg="6" class="pl-2 pt-2">
            <v-btn outlined color="grey" to="/updatePassword">
              비밀번호 수정
            </v-btn>
          </v-col>
        </v-row>

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
          :rules="nameRules"
          label="Login ID"
          disabled
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

        <v-select
          v-model="member.department"
          :items="departments"
          :rules="[(v) => !!v || 'Item is required']"
          label="Department"
          required
        ></v-select>
        <v-btn
          block
          large
          color="primary"
          class="mt-5"
          @click="validate"
          depressed
          >Update profile</v-btn
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
  </div>
</template>

<script>
export default {
  data: () => ({
    member: {},
    avatar: null,
    dialog: false,
    dialogMsg: "",
    dialogTitle: "",
    showPassword: false,
    valid: true,
    nameRules: [
      (v) => !!v || "Name is required",
      (v) => (v && v.length <= 30) || "Name must be less than 30 characters",
    ],
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    phoneRules: [
      (v) => !!v || "E-mail is required",
      (v) => /^[1][3,4,5,7,8,9][0-9]{9}$/.test(v) || "Phone must be valid",
    ],
    imgRules: [
      (value) =>
        !value ||
        value.size < 10000000 ||
        "Avatar size should be less than 10 MB!",
    ],
    departments: [],
  }),

  watch: {
    //图片上传
    avatar: {
      handler(newVal) {
        const formData = new FormData();
        formData.append("image", newVal);
        this.$http
          .post("/minio/user", formData)
          .then((result) => {
            this.member.picture = result.data.data;
          })
          .catch((e) => console.log(e));
      },
    },
  },

  created: function () {
    this.member.id = this.$route.query.id;
    this.initialize();
  },

  methods: {
    initialize() {
      let that = this;
      //获取用户信息
      this.$nextTick(function () {
        this.$http
          .get(`/member/members/${that.member.id}`)
          .then((response) => (that.member = response.data.data));
      });

      this.$nextTick(function () {
        this.$http
          .get("/member/members/department")
          .then((response) => (that.departments = response.data.data));
      });
    },

    validate() {
      const val = this.$refs.form.validate(); //是否填满表单
      let data = this.$data;
      if (val) {
        this.$http
          .put("/member/members", data.member)
          .then((response) => {
            console.log(response.data);
            //设置弹窗
            data.dialog = true;
            data.dialogMsg = response.data.data.msg;
            if (response.data.data.code == "1") {
              data.dialogTitle = "Successfully changed";
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
      if (this.dialogTitle == "Successfully changed") {
        this.$router.push("/");
      }
    },
  },
};
</script>