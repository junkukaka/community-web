<template>
  <v-navigation-drawer
    app
    class=""
    width="270"
    fixed
    v-model="drawer"
    style="top: 30px"
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
    <v-card flat class="mt-2">
      <v-sheet class="pa-2 grey lighten-5">
        <v-text-field
          v-model="search"
          label="Search menu name"
          flat
          solo-inverted
          hide-details
          clearable
          clear-icon="mdi-close-circle-outline"
        ></v-text-field>
      </v-sheet>

        <v-treeview
          activatable
          :items="$store.state.wikiMenus"
          open-all.lazy="!drawer"
          hoverable
          :search="search"
          :filter="filter"
          :open.sync="open"
        >
          <template slot="label" slot-scope="props">
            <router-link
              :to="'/wiki/wikiList?menuId=' + props.item.id"
              class="v-list-item"
            >
              <span style="color: #212121">
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
    search: null,
    open: [],
    filter: null,
  }),

  created: function () {
    // this.initialize();
  },

  computed: {
    filter () {
      (item, search, textKey) => item[textKey].indexOf(search) > -1
    },
  },

  methods: {
    //初始化方法
    initialize: function () {
      let data = this.$data;
      if (this.menu.length === 0) {
        this.$http
          .get(`/wikiMenu/menus/tree/${this.member.authority}`)
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

