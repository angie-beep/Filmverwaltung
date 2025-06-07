
<template>
  <v-container>
    <h2>Schauspieler</h2>
    <actor-list />
    <v-dialog v-model="showForm" max-width="600px">
      <template v-slot:activator="{ props }">
        <v-btn color="primary" v-bind="props" class="mb-4">
          Neuen Schauspieler hinzufügen
        </v-btn>
      </template>
      <actor-form @save="closeForm" />
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import ActorList from '../components/ActorList.vue';
import ActorForm from '../components/ActorForm.vue';

const showForm = ref(false);
const closeForm = () => {
  showForm.value = false;
};
</script>