
<template>
  <v-container>
    <h2>Filme</h2>
    <movie-list @select-movie="showMovieActors" />
    <v-dialog v-model="showForm" max-width="600px">
      <template v-slot:activator="{ props }">
        <v-btn color="primary" v-bind="props" class="mb-4">
          Neuen Film hinzufügen
        </v-btn>
      </template>
      <movie-form @save="closeForm" />
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import MovieList from '../components/MovieList.vue';
import MovieForm from '../components/MovieForm.vue';

const showForm = ref(false);
const closeForm = () => {
  showForm.value = false;
};

</script>