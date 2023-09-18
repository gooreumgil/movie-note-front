import moment from "moment";

export default {
    methods: {
        dateTimeTo(date, format) {
            if (!date) {
                return;
            }
            return moment(date).format(format);
        },
    }
}