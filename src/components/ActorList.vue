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
          @click="confirmDelete(item)"
      >
        Löschen
      </v-btn>
    </template>
  </v-data-table>

  <v-dialog v-model="deleteDialog" max-width="400px">
    <v-card>
      <v-card-title>Schauspieler löschen</v-card-title>
      <v-card-text>
        Möchten Sie diesen Schauspieler wirklich löschen?
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="deleteDialog = false">Abbrechen</v-btn>
        <v-btn color="error" @click="deleteActorConfirmed">Löschen</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { dbOperations } from '../db/indexedDb';

const actors = ref([]);
const deleteDialog = ref(false);
const ActorToDelete = ref(null);

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

const confirmDelete = (item) => {
  ActorToDelete.value = item;
  deleteDialog.value = true;
};

const deleteActorConfirmed = async () => {
  try {
    if (ActorToDelete.value) {
      await dbOperations.deleteActor(ActorToDelete.value.id);
      await loadActors();
    }
    deleteDialog.value = false;
    ActorToDelete.value = null;
  } catch (error) {
    console.error('Fehler beim Löschen des Films:', error);
  }
};


</script>