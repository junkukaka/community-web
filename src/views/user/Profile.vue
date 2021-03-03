<template>
  <v-card>
    <v-toolbar flat>
      <template v-slot:extension>
        <v-tabs fixed-tabs v-model="tabs">
          <v-tab v-for="itme in tabItems" :key="itme">
            {{ itme }}
          </v-tab>
        </v-tabs>
      </template>
    </v-toolbar>

    <v-tabs-items v-model="tabs">
      <!-- community -->
      <v-tab-item>
        <v-card flat> community </v-card>
      </v-tab-item>
    
      <!-- comment -->
      <v-tab-item>
        <v-card flat> comment </v-card>
      </v-tab-item>
      
      <!-- liks -->
      <v-tab-item>
        <v-card flat> liks </v-card>
      </v-tab-item>

      <!-- liks -->
      <v-tab-item>
        <v-card flat> collect </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      tabs: null,
      tabItems: ["community", "comment", "liks", "collect"],
    };
  },
};
</script>