<template>
  <v-navigation-drawer app class="" width="270" fixed v-model="drawer">
    <template v-slot:prepend>
      <div
        style="
          padding: 12px 0 12px 19px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.12) !important;
        "
      >
        <router-link to="/wiki/wikiMain">
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
      
      open-all.lazy="!drawer"
      hoverable
      class="my-3"
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
  </v-navigation-drawer>
</template>

<script>
export default {
  data: () => ({
    menu: [],
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
        this.$http.get("/wikiMenu/menus/tree").then(function (response) {
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

