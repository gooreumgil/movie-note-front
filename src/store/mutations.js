export default {

    SET_USER_EMAIL(state, email) {
        console.log(state);
        state.userInfo.email = email;
    },

    SET_USER_NICKNAME(state, nickname) {
        state.userInfo.email = nickname;
    },

    SET_USER_IMAGE_URL(state, imageUrl) {
        state.userInfo.email = imageUrl;
    }
}