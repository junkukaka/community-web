<template>
    <v-app-bar
      app
      absolute
      color="white"
      elevate-on-scroll
    >
      <v-app-bar-nav-icon @click="setDrawer(!drawer)"></v-app-bar-nav-icon>

      <v-toolbar-title v-text="$route.name"></v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-heart</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-app-bar>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {

  computed: {
    ...mapState(['drawer']),
  },
  
  methods: {
    ...mapMutations({
      setDrawer: 'SET_DRAWER',
    }),
  }, 
}
</script>