import apiClient from "@/core/apiClient";

export default {

    getMovieReviews(query) {
        const url = `/api/v1/movie-reviews`;
        return apiClient.get(url, {
            params: {
                query
            }
        })
    },

}