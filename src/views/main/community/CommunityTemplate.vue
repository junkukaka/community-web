<template>
    <v-card flat>
      <v-card flat>
        <div class="transition-swing text-h6 mb-1 ml-3">최신글</div>
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
                <v-img :src="item.picture"></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>{{item.title}}</v-list-item-title>
                <v-list-item-subtitle>{{item.memberName}}</v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action>
                <v-list-item-subtitle>
                  <v-chip small color="indigo darken-3" outlined>new</v-chip>
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                  {{item.registerTime|date-format('yyyy-mm-dd hh:mi:ss')}}
                </v-list-item-subtitle>
              </v-list-item-action>
              
            </v-list-item>
          </template>
        </v-list>
      </v-card>
    </v-card>

</template>

<script>
  export default {
    data: () => ({
      items: []
    }),

    created(){
      this.initialize();
    },

    methods: {
      //初始化方法
      initialize(){
        //请求参数
        let request = {
          params: {
            menuId: null,
            size: 15
          } 
        }
        this.$nextTick(function(){
          this.$http.get("/community/communitys/mainPage",request)
            .then((response)=>{
              const communitys = response.data.data;
              for(let i = 0; i < communitys.length ; i++){
                  this.items.push(communitys[i])
                  this.items.push({divider: true, inset: true })
              }
            })
        });
      },
    }
  }
</script>