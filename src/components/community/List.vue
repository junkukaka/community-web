<template>
    <v-card flat>
      <div style="margin: -10px 0 15px">
        <!-- dashboard -->
        <dashboard-vue/>
      </div>
      
      <v-card flat>
        <v-divider class="ml-3"></v-divider>
        <v-list>
          <template v-for="(item, index) in items">
            <v-divider
              v-if="item.divider"
              :key="index"
              :inset="item.inset"
            ></v-divider>
            <v-list-item
               v-else
              :key="index"
              link
              :to ="`/community/communityDetail?id=${item.id}`" 
            >
              <v-list-item-avatar>
                <v-avatar size="43" v-if="item.picture !== ''">
                  <img :src="item.picture" :alt="`photo`" />
                </v-avatar>
                <v-avatar color="#E0E0E0" v-if="item.picture === ''">
                  <v-icon dark class="mr-2" size="52"> mdi-account-circle </v-icon>
                </v-avatar>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>{{item.title}}</v-list-item-title>
                <v-list-item-subtitle>{{item.memberName}}</v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action>
                <v-list-item-subtitle>
                  {{item.registerTime|date-format('yyyy-mm-dd hh:mi:ss')}}
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                  hits : {{item.hitsCount}} ; likes : {{item.likesCount}} ; comments : {{item.commentCount}}
                </v-list-item-subtitle>
              </v-list-item-action>
              
            </v-list-item>
          </template>
        </v-list>

        <v-fab-transition v-if="memberAuthority.editYn === 1">
          <router-link :to="`/community/communityEdit?menuId=${menuId}`">
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
      
      <v-card flat class="mt-5">
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
      page: 1,
      pages: 1,
      itemsPerPage: 20,
      menuId: null,
      items: [],
      member:{},
      memberAuthority: {}
    }),

    created(){
      this.menuId = _.toNumber(this.$route.query.menuId);
      if(this.$route.query.page != null){
        this.page = _.toNumber(this.$route.query.page);
      }
      this.member = this.$store.state.member;
    },

    watch: {
      //使用监听跳转页面
      $route(){
        this.menuId = this.$route.query.menuId;
      },

      menuId: function(){
        this.initialize();
        this.getMemberAuthority();
      },
      
      page: function(){
        this.$router.push(`/community/communityList?menuId=${this.menuId}&page=${this.page}`);
        this.initialize();
      }
    },



    methods: {
      //初始化方法
      initialize(){
        let data  = this.$data
        data.items = [] //清空
        //请求参数
        let request = {
          params: {
            menuId: data.menuId,
            page: data.page,
            itemsPerPage: data.itemsPerPage,
            authority: data.member.authority
          } 
        }
        this.$nextTick(function(){
          this.$http.get("/community/communitys/pageList",request)
            .then(function(response){
              let newCommunitys = response.data.data.communitys;
              data.page = response.data.data.page; //当前页面
              data.pages = response.data.data.pages; //页数
              //添加下划线
              for(let i = 0; i < newCommunitys.length ; i++){
                  data.items.push(newCommunitys[i])
                  data.items.push({divider: true, inset: true })
              }
            })
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
          this.$http.get("/authority/getMemberCommunityAuthority",request).then((response) => {
            this.memberAuthority = response.data.data;
            console.log(this.memberAuthority);
            if(this.memberAuthority.viewYn != 1){
              this.$router.go(-1);
            }
          });
        });
      }



    }
  }
</script>