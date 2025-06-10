<template>
  <v-data-table
    :headers="headers"
    :items="actors"
    :items-per-page="5"
    class="elevation-1"
  >

    <template v-slot:item.actions="{ item }">
      <v-btn
          color="warning"
          size="small"
          class="mr-2"
          @click="editActor(item)"
      >
        Bearbeiten
      </v-btn>
      <v-btn
          color="error"
          size="small"
          @click="deleteActor(item)"
      >
        Löschen
      </v-btn>
    </template>
  </v-data-table>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { dbOperations } from '../db/indexedDb';

const actors = ref([]);

const headers = [
  { title: 'Vorname', key: 'firstName' },
  { title: 'Nachname', key: 'lastName' },
  { title: 'Aktionen', key: 'actions', sortable: false }
];

onMounted(async () => {
  await loadActors();
});

const loadActors = async () => {
  actors.value = await dbOperations.getActors();
};

const showDialog = ref(false);
const editedActor = ref({
  firstName: '',
  lastName: '',
  id: null
});

//MUSS NOCH GEMACHT WERDEN/ funktiponiert noch nicht
const editActor = (item) => {
  editedActor.value = {
    firstName: item.firstName,
    lastName: item.lastName,
    id: item.id
  };
  showDialog.value = true;
};


const saveActor = async () => {
  if (editedActor.value.id) {
    await dbOperations.updateActor(editedActor.value);
    await loadActors();
    showDialog.value = false;
  }
};

const deleteActor = async (item) => {
  await dbOperations.deleteActor(item.id);
  await loadActors();
};


</script>