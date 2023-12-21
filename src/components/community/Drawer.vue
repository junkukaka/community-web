<template>
  <v-navigation-drawer app width="270" fixed v-model="drawer" style="top: 30px" elevation = 0>
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

    <v-card flat class="mt-2 pb-10">
      <v-sheet class="pa-2 grey lighten-5">
        <v-text-field
          v-model="search"
          :label="$t('searchMenuName')"
          flat
          solo-inverted
          hide-details
          clearable
          clear-icon="mdi-close-circle-outline"
        ></v-text-field>
      </v-sheet>

      <v-treeview
        activatable
        :items="$store.state.communityMenus"
        open-all.lazy="!drawer"
        hoverable
        class="my-3"
        :search="search"
        :filter="filter"
        :open.sync="open"
      >
        <template slot="label" slot-scope="props">
          <router-link
            :to="'/community/communityList?menuId=' + props.item.id + '&menuName='+ props.item.name "
            class="v-list-item"
          >
            <span style="color: #000000">
              {{ props.item.name }}
            </span>
          </router-link>
        </template>
      </v-treeview>
    </v-card>
  </v-navigation-drawer>
</template>

<script>
export default {
  data: () => ({
    menu: [],
    member: {},
    search: null,
    open: [],
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

    filter() {
      (item, search, textKey) => item[textKey].indexOf(search) > -1;
    },
  },
};
</script>

