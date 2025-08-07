import { defineStore } from 'pinia';

let nextActorId = 1;

function loadActors() {
    const data = localStorage.getItem('actors');
    return data ? JSON.parse(data) : [];
}

function saveActors(actors) {
    localStorage.setItem('actors', JSON.stringify(actors));
}

export const useActorStore = defineStore('actorStore', {
    state: () => ({
        actors: loadActors()
    }),

    actions: {
        fetchActors() {
            this.actors = loadActors();
            return this.actors;
        },

        getActor(id) {
            return this.actors.find(actor => actor.id === id) || null;
        },

        addActor({ firstName, lastName }) {
            const newActor = {
                id: nextActorId++,
                firstName,
                lastName
            };
            this.actors.push(newActor);
            saveActors(this.actors);
            return newActor.id;
        },

        updateActor(updated) {
            const index = this.actors.findIndex(a => a.id === updated.id);
            if (index !== -1) {
                this.actors[index] = { ...updated };
                saveActors(this.actors);
            }
        },

        deleteActor(id) {
            this.actors = this.actors.filter(actor => actor.id !== id);
            saveActors(this.actors);
        },

        seedActors() {
            this.addActor({ firstName: 'Christian', lastName: 'Bale' });
            this.addActor({ firstName: 'Heath', lastName: 'Ledger' });
            this.addActor({ firstName: 'Daniel', lastName: 'Craig' });
            this.addActor({ firstName: 'Javier', lastName: 'Bardem' });
        }
    }
});