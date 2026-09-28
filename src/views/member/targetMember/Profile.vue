<template>
  <v-card class="mt-12 boxShadow pa-5 mb-10">
    <v-card justify="space-around" flat>
      <div class="v-list-item__content justify-center">
        <div class="mx-auto text-center">
          <v-avatar size="43" v-if="$store.state.member != null">
            <img
              :src="`${member.picture}`"
              v-if="member.picture != null"
              :alt="`photo`"
            />
            <v-icon v-if="member.picture == null">
              mdi-account-circle
            </v-icon>
          </v-avatar>
          <h3 class="mt-3">{{member.memberName}}</h3>
          <p class="text-body-small mt-2">
            {{member.email}}
          </p>
        </div>
      </div>
    </v-card>
    <v-tabs fixed-tabs v-model="tabs">
      <v-tab v-for="itme in tabItems" :key="itme">
        {{ itme }}
      </v-tab>
    </v-tabs>

    <v-window v-model="tabs" class="mt-5">
      <!-- wiki -->
      <v-window-item>
        <Wiki v-bind:memberId="memberId" />
      </v-window-item>

      <!-- community-->
      <v-window-item>
        <Community v-bind:memberId="memberId" />
      </v-window-item>
    </v-window>
  </v-card>
</template>
<script>
import Wiki from "./Wiki.vue";
import Community from "./Community.vue";
export default {
  components: {
    Wiki,
    Community,
  },

  data() {
    return {
      tabs: null,
      memberId: null,
      member: {}
    };
  },

  computed: {
    tabItems() {
      return [
        this.$t("wiki", { 0: this.$t("wiki") }),
        this.$t("community", { 0: this.$t("community") }),
      ];
    },
  },

  created() {
    this.memberId = this.$route.query.memberId;
    this.initialize()
  },

  methods: {
    initialize () {
      this.$nextTick(function () {
        this.$http
          .get(`/member/members/${this.memberId}`)
          .then((response) => {
            this.member = response.data.data;
          });
      });
    }
  }
};
</script>
