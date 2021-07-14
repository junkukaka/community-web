<template>
  <v-card flat class="mx-auto">
    <v-row dense>
      <v-col
        v-for="(item, i) in wikis"
        :key="i"
        cols="col-xs-12 col-sm-12 col-md-12 col-lg-6 col-xl-6"
        class="pa-1"
      >
        <v-card flat class="grey lighten-5">
          <v-hover>
            <template v-slot:default="{ hover }">
              <div
                :class="`elevation-${hover ? 24 : 0}`"
                :style="`${hover ? 'background-color : white' : ''}`"
              >
                <router-link
                  :to="`/wiki/wikiDetail?wikiId=${item.id}`"
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
                            item.title.length < 37
                              ? item.title
                              : item.title.substring(0, 37) + '...'
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
                        v-show="item.picture != null"
                        contain
                      ></v-img>
                      <v-img
                        src="../../../assets/wiki.jpg"
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
    wikis: [],
    count: 20,
    member: {}
  }),

  created: function () {
    this.member = this.$store.state.member;
    this.initialize();
  },

  methods: {
    initialize() {
      let data  = this.$data;
      //请求参数
      let request = {
        params: {
          count: data.count,
          authority: data.member.authority
        } 
      }

      this.wikis = [];
      this.$nextTick(function () {
        this.$http.get(`/wiki/wikiMain`,request).then((response) => {
          this.wikis = response.data.data;
        });
      });
    },
  },
};
</script>

