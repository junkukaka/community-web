<template>
  <div class="pt-12">
    <v-card flat>
      <carousel />
    </v-card>
    <!-- Wiki and community -->
    <div class="mt-8 mb-10" flat>
      <v-row>
        <v-col cols="12" md="12" lg="6">
            <v-card class="boxShadow pa-5" flat style="max-height:2435px"> 
                <wiki-main-template />
            </v-card>
        </v-col>
        <v-col cols="12" md="12" lg="6">
            <v-card class="boxShadow pa-5" flat style="max-height:2435px"> 
                <community-main-template/>
            </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import CommunityMainTemplate from '../community/CommunityMainTemplate.vue';
import WikiMainTemplate from '../wiki/WikiMainTemplate.vue';
import Carousel from "./Carousel.vue";

export default {
  components: { Carousel, WikiMainTemplate, CommunityMainTemplate },
};
</script>