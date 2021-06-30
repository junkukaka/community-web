<template>
  <v-app>
    <AppBar />
    <!-- Sizes your content based upon application components -->
    <v-main>
      <!-- Provides the application the proper gutter -->
      <v-container fluid color="grey lighten-4" class="containerPadding">
        <!-- If using vue-router -->
        <div style="margin:0 auto">
          <router-view></router-view>
        </div>
      </v-container>
    </v-main>
     <Footer />
  </v-app>
</template>

<script>
export default {
  name: "IndexAdmin",
  components: {
    AppBar: () => import("@/components/admin/AppBar"),
    Footer: () => import("@/components/com/Footer"),
  },

  data() {
    return {
      paddingLeft: 256,
      paddingRight: 300,
      memberToken: ""
    };
  },
};
</script>
