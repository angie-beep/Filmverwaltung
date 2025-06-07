import { openDB } from 'idb';

const dbName = 'movieDatabase';
const dbVersion = 1;

let db = null;

export const initDB = async () => {
    db = await openDB(dbName, dbVersion, {
        upgrade(db) {
            // Movies Store
            if (!db.objectStoreNames.contains('movies')) {
                const movieStore = db.createObjectStore('movies', {
                    keyPath: 'id',
                    autoIncrement: true
                });
                movieStore.createIndex('title', 'title', { unique: false });
            }

            // Actors Store
            if (!db.objectStoreNames.contains('actors')) {
                const actorStore = db.createObjectStore('actors', {
                    keyPath: 'id',
                    autoIncrement: true
                });
                actorStore.createIndex('lastName', 'lastName', { unique: false });
            }

            // Movie-Actor Relationships Store
            if (!db.objectStoreNames.contains('movie_actors')) {
                const relationStore = db.createObjectStore('movie_actors', {
                    keyPath: ['movieId', 'actorId']
                });
                relationStore.createIndex('movieId', 'movieId', { unique: false });
                relationStore.createIndex('actorId', 'actorId', { unique: false });
            }
        }
    });
    return db;
};

const getDB = async () => {
    if (!db) {
        db = await initDB();
    }
    return db;
};

export const dbOperations = {

    async addMovie(movie) {
        try {
            const db = await getDB();
            const tx = db.transaction('movies', 'readwrite');
            const store = tx.objectStore('movies');
            const id = await store.add({
                title: movie.title,
                year: movie.year,
                genre: movie.genre
            });
            await tx.done;
            console.log('Film hinzugefügt mit ID:', id);
            return id;
        } catch (error) {
            console.error('Fehler beim Hinzufügen des Films:', error);
            throw error;
        }
    },

    async getMovies() {
        try {
            const db = await getDB();
            return await db.getAll('movies');
        } catch (error) {
            console.error('Fehler beim Abrufen der Filme:', error);
            return [];
        }
    },


    async addActor(actor) {
        try {
            const db = await getDB();
            const tx = db.transaction('actors', 'readwrite');
            const store = tx.objectStore('actors');
            const id = await store.add({
                firstName: actor.firstName,
                lastName: actor.lastName
            });
            await tx.done;
            console.log('Schauspieler hinzugefügt mit ID:', id);
            return id;
        } catch (error) {
            console.error('Fehler beim Hinzufügen des Schauspielers:', error);
            throw error;
        }
    },

    async getActors() {
        try {
            const db = await getDB();
            return await db.getAll('actors');
        } catch (error) {
            console.error('Fehler beim Abrufen der Schauspieler:', error);
            return [];
        }
    },

    async addMovieActor(movieId, actorId) {
        try {
            const db = await getDB();
            const tx = db.transaction('movie_actors', 'readwrite');
            const store = tx.objectStore('movie_actors');
            await store.add({
                movieId: movieId,
                actorId: actorId
            });
            await tx.done;
            console.log('Film-Schauspieler-Beziehung hinzugefügt');
        } catch (error) {
            console.error('Fehler beim Hinzufügen der Film-Schauspieler-Beziehung:', error);
            throw error;
        }
    },

    async getMovieActors(movieId) {
        try {
            const db = await getDB();
            const tx = db.transaction(['movie_actors', 'actors'], 'readonly');
            const movieActorsStore = tx.objectStore('movie_actors');
            const actorsStore = tx.objectStore('actors');

            const relations = await movieActorsStore.index('movieId').getAll(movieId);
            const actors = [];

            for (const relation of relations) {
                const actor = await actorsStore.get(relation.actorId);
                if (actor) actors.push(actor);
            }

            return actors;
        } catch (error) {
            console.error('Fehler beim Abrufen der Schauspieler für den Film:', error);
            return [];
        }
    },

    //Funktionieren nicht richtig, muss noch EDIT operationen hinzufügen.
    async deleteMovie(id) {
        try {
            const db = await getDB();
            const tx = db.transaction(['movies', 'movie_actors'], 'readwrite');
            await tx.objectStore('movie_actors').index('movieId').getAll(id).then(relations => {
                relations.forEach(relation => {
                    tx.objectStore('movie_actors').delete([relation.movieId, relation.actorId]);
                });
            });
            await tx.objectStore('movies').delete(id);
            await tx.done;
            console.log('Film und zugehörige Beziehungen gelöscht');
        } catch (error) {
            console.error('Fehler beim Löschen des Films:', error);
            throw error;
        }
    },

    async deleteActor(id) {
        try {
            const db = await getDB();
            const tx = db.transaction(['actors', 'movie_actors'], 'readwrite');
            await tx.objectStore('movie_actors').index('actorId').getAll(id).then(relations => {
                relations.forEach(relation => {
                    tx.objectStore('movie_actors').delete([relation.movieId, relation.actorId]);
                });
            });
            await tx.objectStore('actors').delete(id);
            await tx.done;
            console.log('Schauspieler und zugehörige Beziehungen gelöscht');
        } catch (error) {
            console.error('Fehler beim Löschen des Schauspielers:', error);
            throw error;
        }
    }
};