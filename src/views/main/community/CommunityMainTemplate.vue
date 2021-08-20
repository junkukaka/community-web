<template>
    <v-card flat>
        <div class="transition-swing text-h6 ml-3">New Community</div>
        <v-divider class="ml-3"></v-divider>
        <v-list class="mb-4">
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
                  <v-chip x-small color="primary" outlined>new</v-chip>
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                  {{item.registerTime|date-format('yyyy-mm-dd hh:mi:ss')}}
                </v-list-item-subtitle>
              </v-list-item-action>
              
            </v-list-item>
          </template>
        </v-list>
    </v-card>
</template>

<script>
  export default {
    data: () => ({
      items: [],
      count: 38,
      member: {}
    }),

    created(){
      this.member = this.$store.state.member;
      this.initialize();
    },

    methods: {
      //初始化方法
      initialize(){
        //请求参数
        let data  = this.$data;
        //请求参数
        let request = {
          params: {
            count: data.count,
            authority: 0
          } 
        }

        this.$nextTick(function(){
          this.$http.get("/community/communities/mainPage",request)
            .then((response)=>{
              if(response.data.code == "50000"){
                this.logout();
              }
              const communitys = response.data.data;
              for(let i = 0; i < communitys.length ; i++){
                  this.items.push(communitys[i])
                  this.items.push({divider: true, inset: true })
              }
            })
        });
      },

      logout() {
        this.$store.state.member = null;
        //退出登录，清空token
        localStorage.removeItem("Authorization");
        localStorage.removeItem("store");
        this.$router.push("/signIn");
      },
      
    }
  }
</script>