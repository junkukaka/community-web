<template>
    <v-card flat>
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
              :to ="`/member/members?id=${item.id}`" 
            >
              <v-list-item-avatar>
                <v-img src="https://cdn.vuetifyjs.com/images/lists/1.jpg"></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>{{item.memberName}}</v-list-item-title>
                <!-- <v-list-item-subtitle v-html="item.content"></v-list-item-subtitle> -->
              </v-list-item-content>

              <v-list-item-action>
                <v-list-item-subtitle>
                  {{item.registerTime|date-format('yyyy-mm-dd')}}
                </v-list-item-subtitle>
                <v-list-item-subtitle>
               
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
      items: []
    }),


    created(){
      this.initialize()
    },


    methods: {
      //初始化方法
      initialize(){
        let data  = this.$data
        data.items = [] //清空
        this.$nextTick(function(){
          this.$http.get("/member/members/getAll","")
            .then(function(response){
              let members = response.data.data;
              //console.log(communitys);
              //添加下划线
              for(let i = 0; i < members.length ; i++){
                  data.items.push(members[i])
                  data.items.push({divider: true, inset: true })
              }
            })
        });
      },
    }


   
  }
</script>