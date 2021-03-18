<template>
    <v-card flat>
      <v-card flat>
        <div class="transition-swing text-h5 mb-1 ml-3">{{menuName}}</div>
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
              :to ="`/communityDetail?id=${item.id}`" 
            >
              <v-list-item-avatar>
                <v-img :src="item.picture"></v-img>
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

        <v-fab-transition>
          <router-link :to="`/communityEdit?menuId=${menuId}`">
            <v-btn
              color="primary"
              large
              fab
              fixed
              style="right:350px;bottom:50px"
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
  export default {
    data: () => ({
      page: 1,
      pages: 1,
      menuId: null,
      menuName: "",
      items: []
    }),

    created(){
      this.menuId = this.$route.query.menuId;
    },

    watch: {
      //使用监听跳转页面
      $route(){
        this.menuId = this.$route.query.menuId;
      },

      menuId: function(){
        this.initialize();
      },
      
      page: function(){
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
            page: data.page
          } 
        }
        this.$nextTick(function(){
          this.$http.get("/community/communitys/pageList",request)
            .then(function(response){
              let newCommunitys = response.data.data.communitys;
              data.page = response.data.data.page; //当前页面
              data.pages = response.data.data.pages; //页数
              data.menuName = response.data.data.menuName; //当前页面标题
              //console.log(communitys);
              //添加下划线
              for(let i = 0; i < newCommunitys.length ; i++){
                  data.items.push(newCommunitys[i])
                  data.items.push({divider: true, inset: true })
              }
            })
        });
      },
    }


   
  }
</script>