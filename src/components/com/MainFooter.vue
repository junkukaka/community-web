<template>
  <v-footer background-color="white" style="padding: 0">
    <v-card flat tile class="text-center" width="100%">
      <v-bottom-navigation color="primary" :v-mode="activeBtn" horizontal style="box-shadow:none">
        <v-btn to="/main">
          <span>{{$t('home')}}</span>
          <v-icon>mdi-home</v-icon>
        </v-btn>

        <v-btn to="/community/communityMain">
          <span>{{$t('community')}}</span>
          <v-icon>mdi-account-multiple</v-icon>
        </v-btn>

        <v-btn to="/wiki/wikiMain">
          <span>{{$t('wiki')}}</span>
          <v-icon>mdi-school</v-icon>
        </v-btn>

        <v-btn to="/wiki/wikiDetail?wikiId=7">
          <span>{{$t('help')}}</span>
          <v-icon>mdi-help-box</v-icon>
        </v-btn>

        <!-- <v-btn @click="toFtp">
          <span>FTP</span>
          <v-icon>mdi-file-cloud</v-icon>
        </v-btn> -->
      </v-bottom-navigation>

      <v-card-text class="pt-1">
        A wiki is a hypertext publication collaboratively edited and managed by its own audience directly using a web browser. A typical wiki contains multiple pages for the subjects or scope of the project and could be either open to the public or limited to use within an organization for maintaining its internal knowledge base.
      </v-card-text>
      <v-card-text class="bgColor">
        {{ new Date().getFullYear() }} —
        <strong>ASPN China Wiki and Community</strong>
      </v-card-text>
    </v-card>
  </v-footer>
</template>


<script>
export default {
   data: () => ({ activeBtn:null}),
    methods: {
      toFtp(){
        // console.log(_.words("http://192.168.0.116:9000","192").length)
        let url = window.location.href;
        if(_.words(url,"192").length > 0){
          window.open('http://192.168.0.116:9000/', '_blank');
        }else{
          window.open('http://36.97.142.103:9000/', '_blank');
        }
      }
    }
};
</script>