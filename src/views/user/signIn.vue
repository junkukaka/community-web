<template>
  <v-card class="pa-5" flat>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-text-field
        v-model="user.nameName"
        :counter="10"
        :rules="nameRules"
        label="Name"
        required
      ></v-text-field>

      <v-text-field
        v-model="user.password"
        :counter="10"
        label="Password"
        :type="showPassword ? 'text' : 'password'"
        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        required
        @click:append="showPassword = !showPassword"
      ></v-text-field>

      <v-text-field
        v-model="user.email"
        :rules="emailRules"
        label="E-mail"
        required
      ></v-text-field>

      <v-text-field
        v-model="user.phone"
        :rules="phoneRules"
        label="Phone"
        required
      ></v-text-field>

      <v-select
        v-model="user.department"
        :items="departments"
        :rules="[(v) => !!v || 'Item is required']"
        label="Department"
        required
      ></v-select>
      <v-btn block large color="success" class="mt-3" @click="validate">ASPN 회원가입</v-btn>
    </v-form>


     <div class="text-center">
        <v-dialog
          v-model="dialog"
          width="500"
        >
          <v-card>
            <v-card-title class="headline">
              {{dialogTitle}}
            </v-card-title>

            <v-card-text>
              {{dialogMsg}}
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                text
                @click="closeDialogMsg"
              >
                Ok
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    user: {
        nameName: "",
        password: "",
        email: "",
        phone: null,
        department: null
    },
    dialog: false,
    dialogMsg: "",
    dialogTitle: "",
    showPassword: false,
    valid: true,
    nameRules: [
      (v) => !!v || "Name is required",
      (v) => (v && v.length <= 10) || "Name must be less than 10 characters",
    ],
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    phoneRules: [
      (v) => !!v || "E-mail is required",
      (v) => /^[1][3,4,5,7,8,9][0-9]{9}$/.test(v) || "Phone must be valid",
    ],
    departments: [],
    
  }),

  created: function(){
    this.initialize();
  },

  methods: {
    initialize(){
       this.$nextTick(function(){
        this.$http.get(`/user/department`)
          .then(response =>
            this.departments = response.data.data
          )
      })
    }, 

    validate() {
      const val =this.$refs.form.validate();//是否填满表单
      let data = this.$data
      if(val){
        this.$http.post("/user/users",data.user).then(response => {
          console.log(response.data)
          //设置弹窗
          data.dialog = true
          data.dialogMsg = response.data.data.msg
          if(response.data.data.code == "1"){
            data.dialogTitle = "Welcome to the ASPN community"
          }else{
            data.dialogTitle = "Application failed"
          }
        }).catch(err => console.log(err))
      }
    },

    //关闭弹窗
    closeDialogMsg(){
      this.dialog = false;
      if(this.dialogTitle == "Welcome to the ASPN community"){
        this.$router.push('/')
      }
    },

    reset() {
      this.$refs.form.reset();
      this.dialog = true
      this.dialogMsg = "ASPN 커뮤니티 가입 하신거를 축합니다"
    }
    
  },
};
</script>