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


  <v-dialog v-model="showEditDialog" max-width="400px">
    <ActorForm
        v-if="showEditDialog"
        :actor-id="editedActorId"
        @save="onActorSaved"
    />
  </v-dialog>

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
import { useActorStore } from "../stores/ActorStore";
import { storeToRefs } from "pinia";
import ActorForm from "./ActorForm.vue";
import {seedAll} from "@/utils/seedData.js";

const actorStore = useActorStore();
const { actors } = storeToRefs(actorStore);

const deleteDialog = ref(false);
const ActorToDelete = ref(null);

const showEditDialog = ref(false);
const editedActorId = ref(null);

const headers = [
  { title: 'Vorname', key: 'firstName' },
  { title: 'Nachname', key: 'lastName' },
  { title: 'Aktionen', key: 'actions', sortable: false }
];

onMounted(() => {
  actorStore.fetchActors();
});


const editActor = (item) => {
  editedActorId.value = item.id;
  showEditDialog.value = true;
};

const onActorSaved = () => {
  showEditDialog.value = false;
  editedActorId.value = null;
};


const confirmDelete = (item) => {
  ActorToDelete.value = item;
  deleteDialog.value = true;
};

const deleteActorConfirmed = async () => {
  try {
    if (ActorToDelete.value) {
      actorStore.deleteActor(ActorToDelete.value.id);
      await actorStore.fetchActors();
    }
    deleteDialog.value = false;
    ActorToDelete.value = null;
  } catch (error) {
    console.error('Fehler beim Löschen des Films:', error);
  }
};


</script>