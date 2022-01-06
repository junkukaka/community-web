<template>

  <v-bottom-navigation
    color="primary"
    :v-mode="activeBtn"
    horizontal
  >
    <v-btn to= "/main">
      <span>{{$t('home')}}</span>
      <v-icon>mdi-home</v-icon>
    </v-btn>

    <v-btn to= "/community/communityMain">
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
  }
</script>