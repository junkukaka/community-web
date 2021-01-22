<template>
  <v-treeview
    activatable
    color="warning"
    :items="menu"
    open-on-click
    :open="initiallyOpen"
  >
    <template slot="label" slot-scope="props">
        <router-link :to="'/community/'+ props.item.id" class="v-list-item v-list-item--link">
            {{props.item.name}} --- {{props.item.id}}
        </router-link>
    </template>
  </v-treeview>
</template>


<script>
  export default {
    data: () => ({
      menu: [],
    }),

    created: function(){
      this.initialize();
    },

    methods: {
      //初始化方法
      initialize: function(){
        let data = this.$data;
        let request = {
            tier : 1
        }
        this.$nextTick(function(){
          this.$http.get("/menu/menus/tree").then(function(response){
            data.menu = response.data.data
          })
        })
      },
    }
    
  }
</script>