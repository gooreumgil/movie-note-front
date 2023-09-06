import apiClient from "@/core/apiClient";

export default {
    login(loginReqForm) {
        const url = `/api/v1/auth/login`;
        return apiClient.get(url, loginReqForm);
    },
}