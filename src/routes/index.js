import { createRouter, createWebHistory } from 'vue-router'
import Main from "@/views/Main.vue";

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            component: Main
        }
    ]
})