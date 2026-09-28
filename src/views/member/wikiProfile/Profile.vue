<template>
  <v-card class="mt-12 boxShadow pa-5">
    <v-tabs fixed-tabs v-model="tabs" color="indigo">
      <v-tab v-for="itme in tabItems" :key="itme">
        {{ itme }}
      </v-tab>
    </v-tabs>

    <v-window v-model="tabs">
      <!-- wiki editing-->
      <v-window-item>
        <profile-wiki-editing v-bind:parent="member" />
      </v-window-item>

      <!-- wiki edited-->
      <v-window-item>
        <profile-wiki-edited v-bind:parent="member" />
      </v-window-item>

      <!-- wiki like-->
      <v-window-item>
        <profile-wiki-likes v-bind:parent="member" />
      </v-window-item>
    </v-window>
  </v-card>
</template>
<script>
import ProfileWikiEditing from "./ProfileWikiEditing.vue";
import ProfileWikiEdited from "./ProfileWikiEdited.vue";
import ProfileWikiLikes from "./ProfileWikiLikes.vue";
export default {
  components: {
    ProfileWikiEditing,
    ProfileWikiEdited,
    ProfileWikiLikes
  },

  data() {
    return {
      tabs: null,
      member: {},
    };
  },

  computed: {
    tabItems(){
      return [
          this.$t('editingOption',{0:this.$t('wiki')}),
          this.$t('editedOption',{0:this.$t('wiki')}),
          this.$t('likeOption',{0:this.$t('wiki')})
        ]
    }
  },

  created() {
    this.member = this.$store.state.member;
  },
};
</script>