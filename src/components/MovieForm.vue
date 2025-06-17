<template>
  <v-card>
    <v-card-title>
      {{ editMode ? 'Film bearbeiten' : 'Neuen Film hinzufügen' }}
    </v-card-title>
    <v-card-text>
      <v-form @submit.prevent="saveMovie">
        <v-text-field
          v-model="movie.title"
          label="Titel"
          required
        ></v-text-field>
        <v-text-field
          v-model="movie.year"
          label="Jahr"
          type="number"
          required
        ></v-text-field>
        <v-text-field
          v-model="movie.genre"
          label="Genre"
          required
        ></v-text-field>
        <v-select
          v-model="movie.actors"
          :items="actors"
          label="Schauspieler"
          multiple
          :item-title="item => `${item.firstName} ${item.lastName}`"
          item-value="id"
          persistent-hint
        ></v-select>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" type="submit">Speichern</v-btn>
        </v-card-actions>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { dbOperations } from '../db/indexedDb';

const props = defineProps({
  movieId: {
    type: Number,
    default: null
  }
});

const emit = defineEmits(['save']);

const editMode = ref(false);
const actors = ref([]);
const movie = ref({
  title: '',
  year: new Date().getFullYear(),
  genre: '',
  actors: []
});

const reloadPage = () => {
  window.location.reload();
};

onMounted(async () => {
  try {
    actors.value = await dbOperations.getActors();
    console.log('Verfügbare Schauspieler:', actors.value);
    
    if (props.movieId) {
      editMode.value = true;
      const movieData = await dbOperations.getMovie(props.movieId);
      movie.value = { ...movieData };
    }
  } catch (error) {
    console.error('Fehler beim Laden der Daten:', error);
  }
});

const saveMovie = async () => {
  try {
    if (!movie.value.title || !movie.value.year || !movie.value.genre) {
      alert('Bitte füllen Sie alle Pflichtfelder aus');
      return;
    }

    console.log('Speichere Film:', movie.value);
    
    if (editMode.value) {
      await dbOperations.updateMovie(movie.value);
    } else {
      const newMovieId = await dbOperations.addMovie(movie.value);
      console.log('Neuer Film ID:', newMovieId);
      

      if (movie.value.actors && movie.value.actors.length > 0) {
        for (const actorId of movie.value.actors) {
          await dbOperations.addMovieActor(newMovieId, actorId);
        }
      }
    }
    reloadPage();
    emit('save');
  } catch (error) {
    console.error('Fehler beim Speichern des Films:', error);
    alert('Fehler beim Speichern des Films');
  }
};
</script>