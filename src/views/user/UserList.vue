<template>
    <v-card flat>
        <div class="transition-swing text-h5 mb-1 ml-3">Users list</div>
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
              :to ="`/user/users?id=${item.id}`" 
            >
              <v-list-item-avatar>
                <v-img src="https://cdn.vuetifyjs.com/images/lists/1.jpg"></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>{{item.userName}}</v-list-item-title>
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
          this.$http.get("/user/users/getAll","")
            .then(function(response){
              let users = response.data.data;
              //console.log(communitys);
              //添加下划线
              for(let i = 0; i < users.length ; i++){
                  data.items.push(users[i])
                  data.items.push({divider: true, inset: true })
              }
            })
        });
      },
    }


   
  }
</script>