
<template>
  <v-card>
    <v-card-title>
      {{ editMode ? 'Schauspieler bearbeiten' : 'Neuen Schauspieler hinzufügen' }}
    </v-card-title>
    <v-card-text>
      <v-form @submit.prevent="saveActor">
        <v-text-field
            v-model="actor.firstName"
            label="Vorname"
            required
        ></v-text-field>
        <v-text-field
            v-model="actor.lastName"
            label="Nachname"
            required
        ></v-text-field>
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

const props = defineProps({
  actorId: {
    type: Number,
    default: null
  }
});

const emit = defineEmits(['save']);
const actorStore = useActorStore();

const editMode = ref(false);
const actor = ref({
  firstName: '',
  lastName: ''
});



onMounted(async () => {
  try {
    if (props.actorId) {
      editMode.value = true;
      const existing = actorStore.getActor(props.actorId);
      if (existing) {
        actor.value = { ...existing };
      }
    }
  } catch (error) {
    console.error('Fehler beim Laden des Schauspielers:', error);
  }
});

const saveActor = async () => {
  try {
    if (!actor.value.firstName || !actor.value.lastName) {
      alert('Bitte füllen Sie alle Pflichtfelder aus');
      return;
    }

    console.log('Speichere Schauspieler:', actor.value);

    if (editMode.value) {
      actorStore.updateActor(actor.value);
    } else {
      actorStore.addActor(actor.value);
    }

    emit('save');

  } catch (error) {
    console.error('Fehler beim Speichern des Schauspielers:', error);
    alert('Fehler beim Speichern des Schauspielers');
  }
};
</script>