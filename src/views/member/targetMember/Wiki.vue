<template>
  <v-card flat class="mx-auto pb-10">
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
                              : item.title.substring(0, 26) + '...'
                          }`
                        "
                      ></v-card-title>
                      <v-card-subtitle class="text-subtitle-2">
                        {{$t('lastUpdate')}} {{ item.updateName }}
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
  </v-card>
</template>


<script>
export default {
  props: ['memberId'],  
  data: () => ({
    wikis: [],
  }),

  created: function () {
    this.initialize();
  },

  methods: {
    initialize() {
      this.$nextTick(function () {
        this.$http
          .get(`/wiki/wikiProfileEditedList/${this.memberId}`)
          .then((response) => {
            this.wikis = response.data.data;
          });
      });
    },
  },
};
</script>

