<template>
  <v-navigation-drawer app class="" width="300" fixed v-model="drawer">
    <template v-slot:prepend>
      <div
        style="
          padding: 12px 0 12px 19px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.12) !important;
        "
      >
        <router-link to="/Home">
          <v-img
            height="39"
            width="109"
            src="../../assets/aspn_logo01.png"
          ></v-img>
        </router-link>
      </div>
    </template>

    <v-treeview
      activatable
      :items="menu"
      shaped
      open-all.lazy="!drawer"
      hoverable
      class="my-3"
    >
      <template slot="label" slot-scope="props">
        <router-link
          :to="'/communityList?menuId=' + props.item.id"
          class="v-list-item"
        >
          <span style="color: #212121">
            {{ props.item.name }} --- {{ props.item.id }}
          </span>
        </router-link>
      </template>
    </v-treeview>

    <!-- 用户登录部分 -->
    <template v-slot:append>
      <v-list width="260" style="padding: 13px 0">
        <v-list-item
          @click="dialog = !dialog"
          :style="{ display: `${$store.state.user == null ? 'none' : ''}` }"
        >
          <v-list-item-avatar>
            <v-img src="https://cdn.vuetifyjs.com/images/lists/1.jpg"></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <!-- this.$store.state.user.userName -->
            <v-list-item-title>{{
              `${
                $store.state.user == null
                  ? "username"
                  : $store.state.user.userName
              }`
            }}</v-list-item-title>
            <v-list-item-subtitle>{{
              `${$store.state.user == null ? "email" : $store.state.user.email}`
            }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-icon>mdi-account-multiple-outline</v-icon>
          </v-list-item-action>
        </v-list-item>
      </v-list>
      <div
        class="pa-5"
        :style="{ display: `${$store.state.user == null ? '' : 'none'}` }"
      >
        <v-btn block outlined color="primary" depressed to="/signIn">
          Sign in
        </v-btn>
        <v-btn
          block
          outlined
          color="grey darken-2"
          depressed
          class="mt-3"
          to="/signUp"
        >
          Sign up
        </v-btn>
      </div>
    </template>

    <div class="text-center">
      <v-dialog v-model="dialog" width="360">
        <v-card>
          <v-card-title> About My account </v-card-title>
          <v-card-text>
            <v-row align="center" justify="space-around">
              <v-btn color="primary" dark depresse @click="userInfo"
                >My Info</v-btn
              >
              <v-btn color="grey darken-3" dark depressed @click="signOut"
                >Sign out</v-btn
              >
              <v-btn color="primary" text @click="dialog = false">Close</v-btn>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
  </v-navigation-drawer>
</template>

<script>
export default {
  data: () => ({
    menu: [],
    dialog: false,
  }),

  created: function () {
    this.initialize();
  },

  methods: {
    //初始化方法
    initialize: function () {
      let data = this.$data;
      let request = {
        tier: 1,
      };
      if(this.menu.length === 0){
        this.$http.get("/menu/menus/tree").then(function (response) {
          data.menu = response.data.data;
        });
      }
    },

    signOut() {
      this.$store.state.user = null;
      //退出登录，清空token
      this.dialog = false;
      localStorage.removeItem("Authorization");
      this.$router.push('/signIn');
    },

    userInfo() {
      this.$router.push("/userInfo");
      this.dialog = false;
    },
  },

  computed: {
    drawer: {
      get() {
        return this.$store.state.drawer;
      },
      set(val) {
        this.$store.commit("SET_DRAWER", val);
      },
    },
  },
};
</script>

