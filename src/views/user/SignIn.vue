<template>
  <v-card class="pa-5" flat>
    <v-form ref="form" v-model="valid" lazy-validation>

       <v-text-field
        v-model="user.email"
        :rules="emailRules"
        label="E-mail"
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

      <v-btn block large color="primary" class="mt-5" @click="validate" depressed>Sign In</v-btn>
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
        password: "",
        email: ""
    },
    dialog: false,
    dialogTitle: "",
    showPassword: false,
    valid: true,
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
  }),

  created: function(){
    this.initialize();
  },

  methods: {
    initialize(){
    }, 

    validate() {
      const val =this.$refs.form.validate();//是否填满表单
      let data = this.$data
      let that = this
      if(val){
        this.$http.post("/user/users/login",data.user).then(response => {
          //设置弹窗
          data.dialog = true
          if(response.data.data !== null){
            data.dialogTitle = `Hello ${response.data.data.userName} Welcome to ASPN`
            //给store user 赋值
            that.$store.state.user = response.data.data
          }else{
            data.dialogTitle = "email or password is fail"
          }
        }).catch(err => console.log(err))
      }
    },

    //关闭弹窗
    closeDialogMsg(){
      this.dialog = false;
      if(this.dialogTitle !== "email or password is fail"){
        this.$router.push('/')
      }
    },
 
  },
};
</script>