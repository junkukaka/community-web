<template>
    <v-navigation-drawer
        app
        class="deep-purple accent-4"
        dark
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

        <v-list>
            <v-list-item
                v-for="item in items"
                :key="item.title"
                link
                :to ="item.link"
            >
            <v-list-item-icon>
                <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
            </v-list-item>
        </v-list>

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
    data () {
      return {
        items: [
          { title: 'Dashboard', icon: 'mdi-view-dashboard', link:'home'},
          { title: 'Account', icon: 'mdi-account-box', link:'account' },
          { title: 'Admin', icon: 'mdi-gavel', link:'home' },
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

