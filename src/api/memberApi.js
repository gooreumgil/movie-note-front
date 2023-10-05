import apiClient from "@/core/apiClient";

export default {

    getSessionMember() {

        const url = `/api/v1/session-member`;
        return apiClient.get(url);

    },

}