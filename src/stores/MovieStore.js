import { defineStore } from 'pinia';

let nextMovieId = 1;

function loadMovies() {
    const data = localStorage.getItem('movies');
    return data ? JSON.parse(data) : [];
}

function saveMovies(movies) {
    localStorage.setItem('movies', JSON.stringify(movies));
}

export const useMovieStore = defineStore('movieStore', {
    state: () => ({
        movies: loadMovies()
    }),

    actions: {
        fetchMovies() {
            this.movies = loadMovies();
            return this.movies;
        },

        getMovie(id) {
            return this.movies.find(m => m.id === id) || null;
        },

        addMovie({ title, year, genre }) {
            const newMovie = {
                id: nextMovieId++,
                title,
                year,
                genre
            };
            this.movies.push(newMovie);
            saveMovies(this.movies);
            return newMovie.id;
        },

        updateMovie(updatedMovie) {
            const index = this.movies.findIndex(m => m.id === updatedMovie.id);
            if (index !== -1) {
                this.movies[index] = { ...updatedMovie };
                saveMovies(this.movies);
            }
        },

        deleteMovie(id) {
            this.movies = this.movies.filter(movie => movie.id !== id);
            saveMovies(this.movies);
        },

        seedMovies() {
            this.addMovie({ title: 'Batman Begins', year: 2005, genre: 'Action' });
            this.addMovie({ title: 'The Dark Knight', year: 2008, genre: 'Action' });
            this.addMovie({ title: 'Skyfall', year: 2012, genre: 'Spy/Action' });
        }
    }
});
