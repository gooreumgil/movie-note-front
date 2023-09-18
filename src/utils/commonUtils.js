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

    convertDateToStrWithMinutes(value) {
        const date = new Date(value);

        const month = date.getMonth() + 1;

        let minutes = date.getMinutes();
        if (minutes < 10) {
            minutes = "0" + minutes;
        }

        let hours = date.getHours();
        if (hours < 10) {
            hours = "0" + hours;
        }

        return `${date.getFullYear()}-${month}-${date.getDate()} ${hours}:${minutes}`
        // return `${date.getFullYear()}-${month}-${date.getDate()}`

    }

}