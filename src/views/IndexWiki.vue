<template>
  <v-app>
    <system-bar/>
    <Drawer />
    <AppBar />
    <!-- Sizes your content based upon application components -->
    <v-main
      :style="{
        padding: `64px ${this.$store.state.window.mainPaddingLeft}px 0px ${this.$store.state.window.mainPaddingRight}px !important`,
      }"
    >
      <!-- Provides the application the proper gutter -->
      <v-container fluid color="grey lighten-4" class="containerPadding">
        <!-- If using vue-router -->
        <div class="containerMaxWith pl-lg-7 pr-lg-7 pt-8">
          <router-view></router-view>
        </div>
       
      </v-container>
    </v-main>
     <Footer />
  </v-app>
</template>

<script>
import SystemBar from '../components/com/SystemBar.vue';
export default {
  name: "IndexWiki",
  components: {
    AppBar: () => import("@/components/wiki/AppBar"),
    Drawer: () => import("@/components/wiki/Drawer"),
    Footer: () => import("@/components/com/Footer"),
    SystemBar,
  }
};
</script>
