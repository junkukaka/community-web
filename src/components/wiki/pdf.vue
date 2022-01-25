<template>
  <v-card flat>
    <v-card flat style="max-width: 1200px; margin: 0 auto">
      <v-card-title class="text-h3 font-weight-bold pt-5 pb-5">
        {{ wikiHis.title }}
      </v-card-title>
      <v-divider></v-divider>
      <v-md-editor v-model="wikiHis.content" mode="preview" ref="editor" />
    </v-card>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    wikiHis: {},
    wikiId: null,
  }),

  created() {
    this.wikiId = this.$route.query.wikiId;
    this.getWikiHisDetail();
  },

  watch: {
    wikiHis: function () {
      this.$nextTick(function () {
        this.sleep(5000).then(() => {
          window.print();
        });
      });
    },
  },

  methods: {
    getWikiHisDetail() {
      this.$http.get(`/wiki/wikiDetail/${this.wikiId}`).then((response) => {
        this.wikiHis = response.data.data;
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