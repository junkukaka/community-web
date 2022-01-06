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
    <div style="width:90%;margin:15px auto" v-if="moreViewYn">
        <v-btn 
          class="pa-5 "
          outlined
          block
          @click="selectMoreWiki"
          color="#BDBDBD">
          {{$t('more')}}
        </v-btn>
    </div>
  </v-card>
</template>


<script>
export default {
  data: () => ({
    wikis: [],
    size: 20,
    page: 0,
    total: 0,
    pageNumber: 1,
    moreViewYn: true,
    member: {}
  }),

  created: function () {
    this.member = this.$store.state.member;
    this.initialize();
  },

  watch: {
    page(){
      //console.log(`page = ${this.page} total = ${this.total}`)
      if(this.page == this.total){
        this.moreViewYn = false;
      }
    }
  },

  methods: {
    initialize() {
      this.selectWikiTemplate();
      this.selectWikiTemplateCount();
    },

    selectWikiTemplateCount(){
      this.$http.get(`/wiki/wikiTemplateCount/${this.member.authority}`)
        .then((response)=>{
          if(response.data.code == "50000"){
            this.logout();
          }
          this.total = response.data.data;
        })
    },

    selectWikiTemplate(){
      let data  = this.$data;
      //请求参数
      let request = {
        params: {
          size: data.size,
          page: data.page,
          authority: data.member.authority
        } 
      }
      this.$http.get(`/wiki/WikiTemplate`,request).then((response) => {
        for (const wiki of response.data.data) {
          this.wikis.push(wiki);
        }
      });
    },

    selectMoreWiki(){
      this.page = this.size * this.pageNumber;
      this.pageNumber ++;
      if(this.page > this.total){
        this.page = this.total
      }
      this.selectWikiTemplate(); 
    },

    logout() {
      this.$store.state.member = null;
      //退出登录，清空token
      localStorage.removeItem("Authorization");
      localStorage.removeItem("store");
      this.$router.push("/signIn");
    },

  },
};
</script>

