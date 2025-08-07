import { defineStore } from 'pinia';

function loadRelations() {
    const data = localStorage.getItem('relations');
    return data ? JSON.parse(data) : [];
}

function saveRelations(relations) {
    localStorage.setItem('relations', JSON.stringify(relations));
}

export const useActorMovieStore = defineStore('actorMovieStore', {
    state: () => ({
        relations: loadRelations()
    }),

    actions: {
        fetchRelations() {
            this.relations = loadRelations();
            return this.relations;
        },

        addRelation(movieId, actorId) {
            const exists = this.relations.some(
                rel => rel.movieId === movieId && rel.actorId === actorId
            );
            if (!exists) {
                this.relations.push({ movieId, actorId });
                saveRelations(this.relations);
            }
        },

        deleteRelationsByMovie(movieId) {
            this.relations = this.relations.filter(rel => rel.movieId !== movieId);
            saveRelations(this.relations);
        },

        getActorsForMovie(movieId) {
            return this.relations
                .filter(rel => rel.movieId === movieId)
                .map(rel => rel.actorId);
        },

        seedRelations() {
            this.addRelation(1, 1);
            this.addRelation(2, 1);
            this.addRelation(2, 2);
            this.addRelation(3, 3);
            this.addRelation(3, 4);
        }
    }
});
