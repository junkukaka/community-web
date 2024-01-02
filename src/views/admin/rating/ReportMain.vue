<template>
  <v-card class="mt-12 boxShadow pa-5">
    <v-tabs align-with-title v-model="tabs">
      <v-tab v-for="itme in tabItems" :key="itme">
        {{ itme }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tabs">
      <!-- 글통계 -->
      <v-tab-item>
        <report-c-w-member-cnt />
      </v-tab-item>

    </v-tabs-items>
  </v-card>
</template>
<script>

import ReportCWMemberCnt from './ReportCWMemberCnt';

 export default {
    components:{
      ReportCWMemberCnt
    },
    data () {
      return {
        tabs: null
      }
    },

    computed: {
      tabItems() {
        return [
          this.$t('reportTotal',{0:this.$t('wiki'),1: this.$t('community')})
        ]
      }
    }
  }
</script>