import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MovieView from '../views/MovieView.vue'
import ActorView from '../views/ActorView.vue'

const routes = [
    { path: '/', name : 'Home', component: HomeView },
    { path: '/movies', name: 'Movies', component: MovieView },
    { path: '/actors', name: 'Actors', component: ActorView },
]

export const router = createRouter({
    history: createWebHistory(),
    routes
})