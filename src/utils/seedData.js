import { useActorStore } from '../stores/ActorStore';
import { useMovieStore } from '../stores/MovieStore';
import { useActorMovieStore } from '../stores/ActorMovieStore';

export function seedAll() {
    if (localStorage.getItem('seeded') === 'true') {
        return;
    }

    const actorStore = useActorStore();
    const movieStore = useMovieStore();
    const actorMovieStore = useActorMovieStore();

    actorStore.seedActors();
    movieStore.seedMovies();
    actorMovieStore.seedRelations();

    localStorage.setItem('seeded', 'true');
}