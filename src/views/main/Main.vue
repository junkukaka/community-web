<template>
  <v-card flat>
    <carousel/>
    <new-community/>
  </v-card>
</template>

<script>
import Carousel from "./Carousel";
import NewCommunity from './NewCommunity';
export default {
  components: {
    Carousel,
    NewCommunity
  },
  data() {
    return {
      tabs: null,
    };
  },
};
</script>

