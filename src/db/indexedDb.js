export const dbName = 'MovieDB';
export const dbVersion = 1;

export function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, dbVersion);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            if (!db.objectStoreNames.contains('movies')) {
                const movieStore = db.createOnjectStore('movies', {keyPath: 'id', autoIncrement: true});
                movieStore.createIndex('title', 'title', {unique: false});
            }

            if (!db.objectStoreNames.contains('actors')) {
                const actorStore = db.createObjectStore('actors', {keyPath: 'id', autoIncrement: true});
                actorStore.createIndex('name', 'name', {unique: false});
            }

            if (!db.objectStoreNames.contains('movie_actor')) {
                db.createObjectStore('movie_actor', {keyPath: 'id', autoIncrement: true});
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export async function getAllFromStore(storeName) {
    const db = await openDB()
    return new Promise((resolve) => {
        const tx = db.transaction(storeName, 'readonly')
        const store = tx.objectStore(storeName)
        const request = store.getAll()
        request.onsuccess = () => resolve(request.result)
    })
}

export async function addToStore(storeName, data) {
    const db = await openDB()
    return new Promise((resolve) => {
        const tx = db.transaction(storeName, 'readwrite')
        const store = tx.objectStore(storeName)
        const request = store.add(data)
        request.onsuccess = () => resolve(request.result)
    })
}
