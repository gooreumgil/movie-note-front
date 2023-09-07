import apiClient from "@/core/apiClient";

export default {
    login(loginReqForm) {
        const url = `/api/v1/auth/login`;
        return apiClient.post(url, loginReqForm);
    },

    tokenVerification() {
        const url = `/api/v1/auth/verification`;
        return apiClient.get(url);
    },
}