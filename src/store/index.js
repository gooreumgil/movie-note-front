import {createStore} from "vuex";
import mutations from "@/store/mutations";

const store = createStore({
    state: {
        userInfo: {
            email: null,
            nickname: null,
            imageUrl: null
        },
        currentNav: null
    },
    getters: {
        getEmail(state) {
            return state.userInfo.email
        },
        getNickname(state) {
            return state.userInfo.nickname
        },
        getImageUrl(state) {
            return state.userInfo.imageUrl
        },
        getCurrentNav(state) {
            return state.currentNav;
        },
    },
    mutations
})


export default store