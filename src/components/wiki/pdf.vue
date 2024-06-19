<template>
  <v-card flat>
    <v-card flat style="max-width: 1200px; margin: 0 auto">
      <v-card-title class="text-h3 font-weight-bold pt-5 pb-5">
        {{ wikiHis.title }}
      </v-card-title>
      <v-divider></v-divider>
      <div id="pdfHeight">
        <v-md-editor v-model="wikiHis.content" mode="preview" ref="editor"/>
      </div>
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
          this.print();
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

    printHeight(){
      let div = document.querySelector("#pdfHeight > div");
      console.log(`old height is ${div.offsetHeight}`);
      let more = div.offsetHeight/4;
      let newHeight = div.offsetHeight + more;
      console.log(`newHeight is ${newHeight}`);
      div.style.height = newHeight + "px";
    },

    print() {
      this.printHeight();
      window.print();
    },
  },
};
</script>