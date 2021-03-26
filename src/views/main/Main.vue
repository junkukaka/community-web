<template>
  <v-card flat>
    <carousel/>
    <!-- new community -->
    <community-template/>
  </v-card>
</template>

<script>
import Carousel from "./Carousel";
import CommunityTemplate from './CommunityTemplate';
export default {
  components: {
    Carousel,
    CommunityTemplate
  },
  data() {
    return {
      tabs: null,
    };
  },
};
</script>

