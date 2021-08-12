<template>
  <v-card flat>
    <!-- <carousel/> -->
    <!-- new community -->
    <community-template/>
  </v-card>
</template>

<script>
import CommunityTemplate from './CommunityTemplate';
export default {
  components: {
    CommunityTemplate
  },
  data() {
    return {
      tabs: null,
    };
  },
};
</script>

