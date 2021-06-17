<template>
  <v-app>
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
        <div class="containerMaxWith pl-lg-7 pr-lg-7">
          <router-view></router-view>
        </div>
       
      </v-container>
    </v-main>
     <Footer />
  </v-app>
</template>

<script>
export default {
  name: "IndexCommunity",
  components: {
    AppBar: () => import("@/components/communityCore/AppBar"),
    Drawer: () => import("@/components/communityCore/Drawer"),
    Footer: () => import("@/components/com/Footer"),
  },
};
</script>
