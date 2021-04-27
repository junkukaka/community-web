<template>

  <v-bottom-navigation
    color="primary"
    :v-mode="activeBtn"
    horizontal
  >
    <v-btn to= "/main">
      <span>Home</span>
      <v-icon>mdi-home</v-icon>
    </v-btn>

    <v-btn to= "/community/communityMain">
      <span>Community</span>
      <v-icon>mdi-account-multiple</v-icon>
    </v-btn>

    <v-btn to="/wiki/wikiMain">
      <span>Wike</span>
      <v-icon>mdi-school</v-icon>
    </v-btn>
    
  </v-bottom-navigation>
</template>

<script>
  export default {
    data: () => ({ activeBtn:null}),
  }
</script>