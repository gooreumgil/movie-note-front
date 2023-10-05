export default {
    SET_USER_EMAIL(state, email) {
        state.userInfo.email = email;
    },

    SET_USER_NICKNAME(state, nickname) {
        state.userInfo.nickname = nickname;
    },

    SET_USER_IMAGE_URL(state, imageUrl) {
        state.userInfo.imageUrl = imageUrl;
    },
    SET_CURRENT_NAV(state, currentNav) {
        state.currentNav = currentNav;
    },
}