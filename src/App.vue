<template>
  <v-app>
    <v-app-bar color="primary">
      <v-app-bar-title>Filmverwaltung</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn to="/">Home</v-btn>
      <v-btn to="/movies">Filme</v-btn>
      <v-btn to="/actors">Schauspieler</v-btn>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script setup>
</script>