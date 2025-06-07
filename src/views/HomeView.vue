<template>
  <v-container>
    <h1>Willkommen zur Filmverwaltung</h1>
    <v-row>
      <v-col cols="6">
        <v-card to="/movies" class="ma-2">
          <v-card-title>Filme</v-card-title>
          <v-card-text>Verwalten Sie Ihre Filmsammlung</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card to="/actors" class="ma-2">
          <v-card-title>Schauspieler</v-card-title>
          <v-card-text>Verwalten Sie Ihre Schauspieler</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
</script>