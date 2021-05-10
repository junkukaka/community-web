<template>
  <v-timeline>
    <v-timeline-item
      v-for="item in wikiHis"
      :key="item.wikiHisId"
      large
    >
      <template v-slot:icon>
        <v-avatar>
          <img :src="item.picture">
        </v-avatar>
      </template>
      <template v-slot:opposite>
        <div> 
          <v-chip v-if="item.hisId == item.wikiHisId"
            class="mr-3"
            color="green"
            label
            text-color="white"
          >
            <v-icon left>
              mdi-label
            </v-icon>
            Active
          </v-chip>
          <span>{{item.memberName}} </span>
        </div>
        <div>{{ item.updateTime | date-format('yyyy-mm-dd hh:mi:ss') }}</div>
      </template>
      <v-card class="elevation-2" @click="hisReview(item.wikiHisId)">
        <v-card-title class="text-subtitle-2">
          {{item.information}}
        </v-card-title>
        <!-- <v-card-text>{{item.information}}</v-card-text> -->
      </v-card>
    </v-timeline-item>
  </v-timeline>
</template>

<script>
export default {
  props: ["parent"],
  data: () => ({
    wikiId: null,
    hisReviewDialog: false,
    wikiHis: []
  }),

  created() {
    this.wikiId = this.$props.parent;
    //console.log(this.wikiId);
    this.initialize();
  },

  methods: {
    //
    initialize() {
      this.$nextTick(function () {
        this.$http
          .get(`/wiki/wikiHisList/${this.wikiId}`)
          .then((response) => {
            this.wikiHis = response.data.data;
          });
      });
    },

    hisReview(wikiHisId){
      this.$router.push(`/wiki/hisReview?wikiHisId=${wikiHisId}`);
    }
  },

};
</script>

