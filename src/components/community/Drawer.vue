<template>
  <v-navigation-drawer
    app
    width="270"
    fixed
    v-model="drawer"
    style="top: 30px;"
  >
    <template v-slot:prepend>
      <div
        style="padding: 16px 0px 14px 16px; border-right: none"
        class="boxShadow"
      >
        <router-link to="/">
          <h2 class="fontGray">
            ASPN
            <span class="font-weight-medium" style="font-size: 16px"
              >Wiki&Community</span
            >
          </h2>
        </router-link>
      </div>
    </template>

    <v-treeview
      activatable
      :items="$store.state.communityMenus"
      open-all.lazy="!drawer"
      hoverable
      class="my-3"
    >
      <template slot="label" slot-scope="props">
        <router-link
          :to="'/community/communityList?menuId=' + props.item.id"
          class="v-list-item"
        >
          <span style="color: #000000">
            {{ props.item.name }}
          </span>
        </router-link>
      </template>
    </v-treeview>
  </v-navigation-drawer>
</template>

<script>
export default {
  data: () => ({
    menu: [],
    member: {},
  }),

  created: function () {
    this.member = this.$store.state.member;
    // this.initialize();
  },

  methods: {
    //初始化方法
    initialize: function () {
      let data = this.$data;
      if (this.menu.length === 0) {
        this.$http
          .get(`/communityMenu/menus/tree/${this.member.authority}`)
          .then(function (response) {
            data.menu = response.data.data;
          });
      }
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

