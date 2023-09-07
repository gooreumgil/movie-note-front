import config from "../config";

export default {

    getProcessEnv() {
        return process.env.NODE_ENV.trim();
    },

    getApiBaseUrl() {
        const env = this.getProcessEnv() || 'default';
        console.log(env);
        const target = config[env];
        return target.api.baseUrl;
    },

}