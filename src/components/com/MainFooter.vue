<template>
  <v-footer background-color="white" style="padding: 0">
    <v-card flat tile class="text-center">
      <v-bottom-navigation color="primary" :v-mode="activeBtn" horizontal style="box-shadow:none">
        <v-btn to="/main">
          <span>Home</span>
          <v-icon>mdi-home</v-icon>
        </v-btn>

        <v-btn to="/community/communityMain">
          <span>커뮤니티</span>
          <v-icon>mdi-account-multiple</v-icon>
        </v-btn>

        <v-btn to="/wiki/wikiMain">
          <span>위키</span>
          <v-icon>mdi-school</v-icon>
        </v-btn>

        <v-btn to="/wiki/wikiDetail?wikiId=7">
          <span>Help</span>
          <v-icon>mdi-help-box</v-icon>
        </v-btn>

        <v-btn @click="toFtp">
          <span>FTP</span>
          <v-icon>mdi-file-cloud</v-icon>
        </v-btn>
      </v-bottom-navigation>

      <v-card-text class="pt-0">
        Phasellus feugiat arcu sapien, et iaculis ipsum elementum sit amet.
        Mauris cursus commodo interdum. Praesent ut risus eget metus luctus
        accumsan id ultrices nunc. Sed at orci sed massa consectetur dignissim a
        sit amet dui. Duis commodo vitae velit et faucibus. Morbi vehicula
        lacinia malesuada. Nulla placerat augue vel ipsum ultrices, cursus
        iaculis dui sollicitudin. Vestibulum eu ipsum vel diam elementum tempor
        vel ut orci. Orci varius natoque penatibus et magnis dis parturient
        montes, nascetur ridiculus mus.
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