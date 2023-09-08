import { createApp } from 'vue'
import App from './App.vue'
import {router} from "@/routes";
import {globalCookiesConfig} from "vue3-cookies";
import store from './store'

globalCookiesConfig({
    expireTimes: "4d",
    path: "/",
    domain: "",
    secure: true,
    sameSite: "None",
});

let app = createApp(App);

app.use(router)
app.use(store)
app.mount('#app');
