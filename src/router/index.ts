import { createRouter, createWebHistory } from 'vue-router'
import Homepage from '../Homepage.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: Homepage
        }
    ]
})

export default router
