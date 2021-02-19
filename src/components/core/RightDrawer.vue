<template>
    <v-navigation-drawer
      fixed
      open
      floating
      right
      v-model="drawer"
      :style="{top: `${this.$store.state.window.rightDrawerTop}px !important`, width: `256px !important`}"
    >
      <v-list dense>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          :to = "item.link"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
</template>

<script>
  export default {
    data () {
      return {
        items: [
          { title: 'Home', icon: 'mdi-home-city',link: 'Home' },
          { title: 'Profile', icon: 'mdi-account',link: 'UserInfo' },
          { title: 'Users', icon: 'mdi-account-group-outline',link: 'Home' },
        ],
      }
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

