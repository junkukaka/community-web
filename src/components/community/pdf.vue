<template>
  <v-card flat>
    <v-card flat style="max-width: 1200px; margin: 0 auto">
      <v-card-title class="text-h3 font-weight-bold pt-5 pb-5">
        {{ community.title }}
      </v-card-title>
      <v-divider></v-divider>
      <v-md-editor v-model="community.content" mode="preview" ref="editor" />
    </v-card>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    community: {},
    id: null
  }),

  created() {
    this.id = this.$route.query.id;
    this.getCommunity();
  },

  watch: {
    community: function () {
      this.$nextTick(function () {
        this.sleep(5000).then(() => {
            window.print();
        })  
      });
    },
  },

  methods: {
    getCommunity() {
      //community select
      this.$http
        .get(`/community/communities/${this.id}`)
        .then((response) => {
          this.community = response.data.data;
        });
    },

    sleep(time) {
      return new Promise((resolve) => setTimeout(resolve, time));
    },

    print() {
      window.print();
    },
  },
};
</script>