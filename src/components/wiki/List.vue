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
                          {{$t('lastUpdate')}} {{ item.updateName }}
                        </v-card-subtitle>
                        <v-card-actions style="margin-top: -16px !important">
                          <v-rating
                            :value ="item.average_rating"   
                            background-color="grey lighten-1"
                            color="indigo accent-2"
                            size="18"
                            length="10"
                            readonly
                            style="margin-top:-6px"
                          ></v-rating>
                        </v-card-actions>
                      </div>
                      <v-avatar class="ma-4" size="78" tile>
                        <v-img
                          :src="item.picture"
                          contain
                          v-show="item.picture != null && item.picture != ''"
                        ></v-img> 
                        <v-img
                          src="../../assets/wiki.jpg"
                          v-show="item.picture == null || item.picture == ''"
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

    <v-fab-transition v-if="memberAuthority.editYn === 1">
      <router-link :to="`/wiki/wikiEdit?menuId=${menuId}`">
        <v-btn color="indigo" depressed large fab fixed class="rightBottomArea white--text">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </router-link>
    </v-fab-transition>

    <v-card flat class="mt-10">
        <template>
          <div class="text-center">
            <v-pagination
              color = "indigo"
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
    menuName: null,
    page: 1,
    pages: 1,
    itemsPerPage: 20,
    wikis: [],
    member: {},
    memberAuthority: {}
  }),

  created: function () {
    this.menuId = _.toNumber(this.$route.query.menuId);
    if(this.$route.query.page != null){
      this.page = _.toNumber(this.$route.query.page);
    }
    this.member = this.$store.state.member;
   
  },
  
  mounted: function(){
    this.menuName = this.$route.query.menuName; 
    //console.log(this.menuName);
    document.title = this.menuName;
  },
  
  watch: {
    //使用监听跳转页面
    $route() {
      this.menuId = this.$route.query.menuId;
      this.menuName = this.$route.query.menuName; 
      document.title = this.menuName;
    },

    menuId: function () {
      this.initialize();
      this.getMemberAuthority();
    },

    page: function(){
      this.$router.push(`/wiki/wikiList?menuId=${this.menuId}&page=${this.page}`);
      this.initialize();
    }
  },

  methods: {
    initialize() {
      let data  = this.$data
      data.wikis = [] //清空
      //请求参数
      let request = {
        params: {
          menuId: data.menuId,
          page: data.page,
          itemsPerPage: data.itemsPerPage,
          authority: data.member.authority
        } 
      }
      
     
      this.$http.get('/wiki/wikis/pageList',request).then((response) => {
          this.wikis = response.data.data.wikis;
          this.page = response.data.data.page; //当前页面
          this.pages = response.data.data.pages; //页数
          
      });
     
    },

    getMemberAuthority(){
      let data = this.$data;
      let request = {
        params: {
          menuId : data.menuId,
          authority : data.member.authority
        } 
      }
      this.$nextTick(function () {
        this.$http.get("/authority/getMemberWikiAuthority",request).then((response) => {
          this.memberAuthority = response.data.data;
          if(this.memberAuthority.viewYn != 1){
             this.$router.go(-1);
          }
        });
      });
    }
    
  },
};
</script>

