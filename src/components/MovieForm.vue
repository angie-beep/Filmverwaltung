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
import { useActorStore } from '../stores/ActorStore';
import { useMovieStore } from '../stores/MovieStore';
import { useActorMovieStore } from '../stores/ActorMovieStore';

const props = defineProps({
  movieId: {
    type: Number,
    default: null
  }
});

const emit = defineEmits(['save']);

const actorStore = useActorStore();
const movieStore = useMovieStore();
const actorMovieStore = useActorMovieStore();

const editMode = ref(false);
const actors = ref([]);
const movie = ref({
  title: '',
  year: new Date().getFullYear(),
  genre: '',
  actors: []
});

onMounted(async () => {
  try {
    actorStore.fetchActors();
    actors.value = actorStore.actors;

    if (props.movieId) {
      editMode.value = true;
      const existing = movieStore.getMovie(props.movieId);
      if (existing) {
        movie.value = { ...existing };
        movie.value.actors = actorMovieStore.getActorsForMovie(existing.id);
      }
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
      movieStore.updateMovie(movie.value);
    } else {
      const id = movieStore.addMovie({
        title: movie.value.title,
        year: movie.value.year,
        genre: movie.value.genre
      });
      movie.value.id = id;
    }
    actorMovieStore.deleteRelationsByMovie(movie.value.id);
    for (const actorId of movie.value.actors) {
      actorMovieStore.addRelation(movie.value.id, actorId);
    }
    emit('save');
  } catch (error) {
    console.error('Fehler beim Speichern des Films:', error);
    alert('Fehler beim Speichern des Films');
  }
};
</script>