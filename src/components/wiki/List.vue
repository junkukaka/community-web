<template>
  <v-card flat class="mx-auto">
    <div style="margin: -10px 0 10px -10px">
      <!-- dashboard -->
      <dashboard-vue />
    </div>
    <v-card flat>
      <v-row dense>
        <v-col
          v-for="(item, i) in wikis"
          :key="i"
          cols="col-xs-12 col-sm-12 col-md-12 col-lg-6 col-xl-6"
          class="pa-1"
        >
          <v-card class="grey lighten-5" flat>
            <v-hover>
              <template v-slot:default="{ hover }">
                <div :class="`elevation-${hover ? 24 : 0}`" :style="`${hover ? 'background-color : white' : '' }`">
                  <router-link
                    :to="'/wiki/wikiDetail?wikiId=' + item.id"
                    style="color: #151515f2"
                  >
                    <div
                      class="
                        d-flex
                        flex-no-wrap
                        justify-space-between
                        wikiListBorder
                      "
                    >
                      <div>
                        <v-card-title
                          class="text-subtitle-1"
                          v-text="
                            `${
                              item.title.length < 27
                                ? item.title
                                : item.title.substring(0, 27) + '...'
                            }`
                          "
                        ></v-card-title>
                        <v-card-subtitle class="text-subtitle-2">
                          Founder: {{ item.registerName }} | Last Review:
                          {{ item.updateName }}
                        </v-card-subtitle>
                        <v-card-actions style="margin-top: -16px !important">
                          <v-btn class="ml-1" outlined rounded small>
                            Wiki content
                          </v-btn>
                        </v-card-actions>
                      </div>
                      <v-avatar class="ma-4" size="78" tile>
                        <v-img
                          :src="item.picture"
                          contain
                          v-show="item.picture != null"
                        ></v-img>
                        <v-img
                          src="../../assets/wiki.jpg"
                          v-show="item.picture == null"
                        ></v-img>
                      </v-avatar>
                    </div>
                  </router-link>
                </div>
              </template>
            </v-hover>
          </v-card>
        </v-col>
      </v-row>
    </v-card>

    <v-fab-transition>
      <router-link :to="`/wiki/wikiEdit?menuId=${menuId}`">
        <v-btn color="primary" large fab fixed class="rightBottomArea">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </router-link>
    </v-fab-transition>

    <v-card flat class="mt-10">
        <template>
          <div class="text-center">
            <v-pagination
              v-model="page"
              :length="pages"
              :total-visible="7"
            ></v-pagination>
          </div>
        </template>
      </v-card>
  </v-card>

  
</template>


<script>
import DashboardVue from "../com/Dashboard.vue";
export default {
  components: { DashboardVue },

  data: () => ({
    menuId: null,
    page: 1,
    pages: 1,
    itemsPerPage: 20,
    wikis: [],

  }),

  created: function () {
    this.menuId = this.$route.query.menuId;
    this.initialize();
  },

  watch: {
    //使用监听跳转页面
    $route() {
      this.menuId = this.$route.query.menuId;
    },

    menuId: function () {
      this.initialize();
    },
  },

  methods: {
    initialize() {
      let data = this;
      let request = {
        params: {
          menuId: data.menuId,
          page: data.page,
          itemsPerPage: data.itemsPerPage
        } 
      };
      
      this.wikis = [];
      this.$nextTick(function () {
        this.$http.get(`/wiki/wikis/${this.menuId}`).then((response) => {
          this.wikis = response.data.data;
        });
      });
    },
  },
};
</script>

