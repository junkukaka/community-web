<template>
  <v-bottom-navigation
    :value="value"
    color="primary"
    horizontal
  >
    <v-btn to= "/">
      <span>Home</span>
      <v-icon>mdi-home</v-icon>
    </v-btn>

    <v-btn to= "/Main">
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
    data: () => ({ value: 1 }),
  }
</script>