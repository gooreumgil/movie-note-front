import {createStore} from "vuex";
import mutations from "@/store/mutations";

const store = createStore({
    state: {
        userInfo: {
            email: null,
            nickname: null,
            imageUrl: null
        }
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
    },
    mutations
})


export default store