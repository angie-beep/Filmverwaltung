import { openDB } from 'idb';

const dbName = 'movieDatabase';
const dbVersion = 1;

let db = null;

export const initDB = async () => {
    db = await openDB(dbName, dbVersion, {
        upgrade(db) {
            if (!db.objectStoreNames.contains('movies')) {
                const movieStore = db.createObjectStore('movies', {
                    keyPath: 'id',
                    autoIncrement: true
                });
                movieStore.createIndex('title', 'title', { unique: false });
            }

            if (!db.objectStoreNames.contains('actors')) {
                const actorStore = db.createObjectStore('actors', {
                    keyPath: 'id',
                    autoIncrement: true
                });
                actorStore.createIndex('lastName', 'lastName', { unique: false });
            }

            if (!db.objectStoreNames.contains('movie_actors')) {
                const relationStore = db.createObjectStore('movie_actors', {
                    keyPath: ['movieId', 'actorId']
                });
                relationStore.createIndex('movieId', 'movieId', { unique: false });
                relationStore.createIndex('actorId', 'actorId', { unique: false });
            }
        }
    });

    //Beispiel-Daten
    const actorsCount = await db.count('actors');
    const moviesCount = await db.count('movies');
    if (actorsCount === 0 && moviesCount === 0) {

        const actorTx = db.transaction('actors', 'readwrite');
        const actorStore = actorTx.objectStore('actors');
        const actor1Id = await actorStore.add({ firstName: 'Tom', lastName: 'Hanks' });
        const actor2Id = await actorStore.add({ firstName: 'Emma', lastName: 'Watson' });
        const actor3Id = await actorStore.add({ firstName: 'Leonardo', lastName: 'DiCaprio' });
        const actor4Id = await actorStore.add({firstName: 'Joseph', lastName: 'Gordon-Levitt'});
        await actorTx.done;


        const movieTx = db.transaction('movies', 'readwrite');
        const movieStore = movieTx.objectStore('movies');
        const movie1Id = await movieStore.add({ title: 'Forrest Gump', year: 1994, genre: 'Drama' });
        const movie2Id = await movieStore.add({ title: 'Inception', year: 2010, genre: 'Sci-Fi' });
        const movie3Id = await movieStore.add({ title: 'Harry Potter', year: 2001, genre: 'Fantasy' });
        await movieTx.done;


        const relTx = db.transaction('movie_actors', 'readwrite');
        const relStore = relTx.objectStore('movie_actors');
        await relStore.add({ movieId: movie1Id, actorId: actor1Id });
        await relStore.add({ movieId: movie2Id, actorId: actor3Id });
        await relStore.add({ movieId: movie2Id, actorId: actor4Id });
        await relStore.add({ movieId: movie3Id, actorId: actor2Id });
        await relTx.done;
    }


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

    async getMovie(id) {
        try {
            const db = await getDB();
            return await db.get('movies', id);
        } catch (error) {
            console.error('Fehler beim Abrufen des Films:', error);
            return null;
        }
    },

    async updateMovie(movie) {
        try {
            const db = await getDB();
            const tx = db.transaction('movies', 'readwrite');
            const store = tx.objectStore('movies');
            await store.put({
                id: movie.id,
                title: movie.title,
                year: movie.year,
                genre: movie.genre
            });
            await tx.done;
            if (Array.isArray(movie.actors)) {
                const relTx = db.transaction('movie_actors', 'readwrite');
                const relStore = relTx.objectStore('movie_actors');
                const oldRelations = await relStore.index('movieId').getAll(movie.id);
                for (const rel of oldRelations) {
                    await relStore.delete([rel.movieId, rel.actorId]);
                }
                for (const actorId of movie.actors) {
                    await relStore.add({ movieId: movie.id, actorId });
                }
                await relTx.done;
            }
            console.log('Film aktualisiert:', movie.id);
        } catch (error) {
            console.error('Fehler beim Aktualisieren des Films:', error);
            throw error;
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

    async getActor(id) {
        try {
            const db = await getDB();
            return await db.get('actors', id);
        } catch (error) {
            console.error('Fehler beim Abrufen des Schauspielers:', error);
            return null;
        }
    },

    async updateActor(actor) {
        try {
            const db = await getDB();
            const tx = db.transaction('actors', 'readwrite');
            const store = tx.objectStore('actors');
            await store.put({
                id: actor.id,
                firstName: actor.firstName,
                lastName: actor.lastName
            });
            await tx.done;
            console.log('Schauspieler aktualisiert:', actor.id);
        } catch (error) {
            console.error('Fehler beim Aktualisieren des Schauspielers:', error);
            throw error;
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