import { createRouter, createWebHistory } from 'vue-router'
import Main from "@/views/Main.vue";
import Login from "@/views/auth/Login.vue";

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            component: Main
        },
        {
            path: "/auth/login",
            component: Login
        }
    ]
})