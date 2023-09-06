import axios from "axios";
import commonUtils from "@/utils/commonUtils";

const client = axios.create({
    baseURL: commonUtils.getApiBaseUrl()
});

client.interceptors.request.use(
    config => {
        const token = Vue.$cookies.get("accessToken");
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token;
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    }
)

export default client;