<template>
  <v-card flat class="mx-auto">
      <v-row dense>
        <v-col
          v-for="(item, i) in wikis"
          :key="i"
          cols="col-xs-12 col-sm-12 col-md-12 col-lg-6 col-xl-6"
        >
          <v-card color="#FAFAFA" flat :to="'/wiki/wikiDetail?wikiId=' + item.id">
            <div class="d-flex flex-no-wrap justify-space-between">
              <div>
                <v-card-title
                  class="text-subtitle-1"
                  v-text="`${item.title.length < 27 ? item.title : (item.title.substring(0,27) + '...') }`"
                ></v-card-title>
                <v-card-subtitle class="text-subtitle-2">
                  Founder: {{item.registerName}} | Last Review: {{item.updateName}}
                </v-card-subtitle>
                <v-card-actions style="margin-top:-16px !important">
                  <v-btn class="ml-1" outlined rounded small>
                    Wiki content
                  </v-btn>
                </v-card-actions>
              </div>
              <v-avatar class="ma-4" size="78" tile>
                <v-img :src="item.picture" v-show="item.picture!= null"></v-img>
                <v-img src="../../assets/wiki.jpg" v-show="item.picture == null"></v-img>
              </v-avatar>
            </div>
          </v-card>
        </v-col>
      </v-row>

    <v-fab-transition>
      <router-link :to="`/wiki/wikiEdit?menuId=${menuId}`">
        <v-btn
          color="primary"
          large
          fab
          fixed
          class="rightBottomArea"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </router-link>
    </v-fab-transition>
  </v-card>
</template>


<script>
export default {
  data: () => ({
    menuId: null,
    wikis:[]
  }),

  created: function(){
    this.menuId = this.$route.query.menuId;
    this.initialize();
  },

  watch: {
    //使用监听跳转页面
      $route(){
        this.menuId = this.$route.query.menuId;
      },
      
      menuId: function(){
        this.initialize();
      },
  },

  methods: {
    
    initialize(){
     this.wikis = [];
     this.$nextTick(function () {
        this.$http
          .get(`/wiki/wikis/${this.menuId}`)
          .then((response) => {
            this.wikis = response.data.data;
          });
      });
    },
  }

};
</script>

