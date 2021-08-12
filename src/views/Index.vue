<template>
  <v-app>
    <system-bar/>
    <main-app-bar />
    <!-- Sizes your content based upon application components -->
    <v-main class="bgColor">
      <!-- Provides the application the proper gutter -->
      <v-container fluid color="grey lighten-4" class="" >
        <!-- If using vue-router -->
        <div class="containerMaxWith">
          <router-view></router-view>
        </div>
      </v-container>
    </v-main>
    <main-footer/>
  </v-app>
</template>

<script>
import MainAppBar from '../components/com/MainAppBar.vue';
import MainFooter from '../components/com/MainFooter.vue';
import SystemBar from '../components/com/SystemBar.vue';


export default {
  name: "Index",
  components: {
    MainAppBar,
    MainFooter,
    SystemBar
  }
};
</script>
