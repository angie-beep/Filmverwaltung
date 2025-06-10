<template>
  <v-data-table
      :headers="headers"
      :items="movies"
      :items-per-page="5"
      class="elevation-1"
  >
    <template v-slot:item.actions="{ item }">
      <v-btn
          color="primary"
          size="small"
          class="mr-2"
          @click="showActors(item)"
      >
        Schauspieler anzeigen
      </v-btn>
      <v-btn
          color="warning"
          size="small"
          class="mr-2"
          @click="editMovie(item)"
      >
        Bearbeiten
      </v-btn>
      <v-btn
          color="error"
          size="small"
          @click="confirmDelete(item)"
      >
        Löschen
      </v-btn>
    </template>
  </v-data-table>

  <v-dialog v-model="showActorsDialog" max-width="500px">
    <v-card>
      <v-card-title>Schauspieler im Film</v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item v-for="actor in movieActors" :key="actor.id">
            {{ actor.firstName }} {{ actor.lastName }}
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="showActorsDialog = false">Schließen</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="showEditDialog" max-width="600px">
    <MovieForm
      v-if="showEditDialog"
      :movie-id="editedMovieId"
      @save="onMovieSaved"
    />
  </v-dialog>

  <v-dialog v-model="deleteDialog" max-width="400px">
    <v-card>
      <v-card-title>Film löschen</v-card-title>
      <v-card-text>
        Möchten Sie diesen Film wirklich löschen?
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="deleteDialog = false">Abbrechen</v-btn>
        <v-btn color="error" @click="deleteMovieConfirmed">Löschen</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { dbOperations } from '../db/indexedDb';
import MovieForm from './MovieForm.vue';

const emit = defineEmits(['select-movie']);

const movies = ref([]);
const movieActors = ref([]);
const showActorsDialog = ref(false);
const deleteDialog = ref(false);
const movieToDelete = ref(null);

const showEditDialog = ref(false);
const editedMovieId = ref(null);

const headers = [
  { title: 'Titel', key: 'title' },
  { title: 'Jahr', key: 'year' },
  { title: 'Genre', key: 'genre' },
  { title: 'Aktionen', key: 'actions', sortable: false }
];

onMounted(async () => {
  await loadMovies();
});

const loadMovies = async () => {
  movies.value = await dbOperations.getMovies();
};

const showActors = async (item) => {
  try {
    movieActors.value = await dbOperations.getMovieActors(item.id);
    showActorsDialog.value = true;
    emit('select-movie', item.id);
  } catch (error) {
    console.error('Fehler beim Laden der Schauspieler:', error);
  }
};

const editMovie = (item) => {
  editedMovieId.value = item.id;
  showEditDialog.value = true;
};

const onMovieSaved = async () => {
  showEditDialog.value = false;
  editedMovieId.value = null;
  await loadMovies();
};

const confirmDelete = (item) => {
  movieToDelete.value = item;
  deleteDialog.value = true;
};

const deleteMovieConfirmed = async () => {
  try {
    if (movieToDelete.value) {
      await dbOperations.deleteMovie(movieToDelete.value.id);
      await loadMovies();
    }
    deleteDialog.value = false;
    movieToDelete.value = null;
  } catch (error) {
    console.error('Fehler beim Löschen des Films:', error);
  }
};
</script>

<style scoped>
.v-btn {
  margin-right: 8px;
}
</style>