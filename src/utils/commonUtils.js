import config from "@/config";

export default {

    getProcessEnv() {
        return process.env.NODE_ENV.trim();
    },

    getApiBaseUrl() {
        const env = this.getProcessEnv() || 'default';
        const target = config[env];
        return target.api.baseUrl;
    },

}