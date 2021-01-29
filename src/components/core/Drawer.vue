<template>
    <v-navigation-drawer
        app
        class="deep-purple accent-4"
        dark
        width = "300"
        v-model="drawer"
    >

        <v-list-item class="pt-3 ml-1">
            <v-list-item-content>
            <v-list-item-title class="title">
                ASPN
            </v-list-item-title>
            <v-list-item-subtitle>
                Patrick
            </v-list-item-subtitle>
            </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-treeview
            activatable
            :items="menu"
            shaped
            hoverable
            class="my-3"
        >
            <template slot="label" slot-scope="props">
                <router-link :to="'/communityList?menuId='+ props.item.id" class="v-list-item theme--dark">
                    {{props.item.name}} --- {{props.item.id}}
                </router-link>
            </template>
        </v-treeview>

        <template v-slot:append>
            <div class="pa-2">
            <v-btn block>
                Logout
            </v-btn>
            </div>
        </template>
    </v-navigation-drawer>
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
    },

    computed :{
        drawer : {
            get () {
                return this.$store.state.drawer
            },
            set (val) {
                this.$store.commit('SET_DRAWER', val)
            },
        }
    }
  }
</script>

