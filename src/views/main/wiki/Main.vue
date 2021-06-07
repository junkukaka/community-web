<template>
  <v-card flat class="mx-auto">
      <v-row dense>
        <v-col
          v-for="(item, i) in wikis"
          :key="i"
          cols="col-xs-12 col-sm-12 col-md-12 col-lg-6 col-xl-6"
        >
          <v-card flat :to="'/wiki/wikiDetail?wikiId=' + item.id" class="grey lighten-5">
            <div class="d-flex flex-no-wrap justify-space-between wikiListBorder">
              <div>
                <v-card-title
                  class="text-subtitle-1"
                  v-text="`${item.title.length < 37 ? item.title : (item.title.substring(0,37) + '...') }`"
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
                <v-img :src="item.picture" v-show="item.picture!= null" contain></v-img>
                <v-img src="../../../assets/wiki.jpg" v-show="item.picture == null"></v-img>
              </v-avatar>
            </div>
          </v-card>
        </v-col>
      </v-row>
    <!-- <v-fab-transition>
      <router-link :to="`/wiki/wikiEdit?menuId=${menuId}`">
        <v-btn
          color="primary"
          large
          fab
          fixed
          style="right:30px;bottom:30px"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </router-link>
    </v-fab-transition> -->
  </v-card>
</template>


<script>
export default {
  data: () => ({
    wikis:[],
    count: 50
  }),

  created: function(){
    this.initialize();
  },

  methods: {

    initialize(){
     this.wikis = [];
     this.$nextTick(function () {
        this.$http
          .get(`/wiki/wikiMain/${this.count}`)
          .then((response) => {
            this.wikis = response.data.data;
          });
      });
    }

  }

};
</script>

