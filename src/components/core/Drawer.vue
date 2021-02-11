<template>
    <v-navigation-drawer
        app
        class=""
        width = "300"
        fixed
        v-model="drawer"
    >
        <template v-slot:prepend>
            <div style="padding:12px 0 12px 19px;border-bottom:1px solid rgba(0, 0, 0, 0.12) !important">
                <v-img height="39" width="109"
                src="../../assets/aspn_logo01.png"></v-img>
            </div>
        </template>
        
        <v-treeview
            activatable
            :items="menu"
            shaped
            open-all.lazy="!drawer"
            hoverable
            class="my-3"
        >
            <template slot="label" slot-scope="props">
                <router-link :to="'/communityList?menuId='+ props.item.id" class="v-list-item">
                    <span style="color: #212121">
                    {{props.item.name}} --- {{props.item.id}}
                    </span>
                </router-link>
            </template>
        </v-treeview>

        <!-- 用户登录部分 -->
        <template v-slot:append>
            <v-list width="260" style="padding:13px 0">
                <v-list-item>
                    <v-list-item-avatar>
                        <v-img src="https://cdn.vuetifyjs.com/images/lists/1.jpg"></v-img>
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title>남광준</v-list-item-title>
                        <v-list-item-subtitle>nanguangjun</v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                        <v-icon>mdi-account-multiple-outline</v-icon>
                    </v-list-item-action>
                </v-list-item>
            </v-list>
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

