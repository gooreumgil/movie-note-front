import apiClient from "@/core/apiClient";

export default {
    login(loginReq) {
        const url = `/api/v1/auth/login`;
        return apiClient.post(url, loginReq);
    },

    tokenVerification() {
        const url = `/api/v1/auth/verification`;
        return apiClient.get(url);
    },

    signUpReqForm(signUpReq) {
        const url = `/api/v1/auth/sign-up`;
        return apiClient.post(url, signUpReq);
    },

}