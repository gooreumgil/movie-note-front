import apiClient from "@/core/apiClient";

export default {

    getMovieReviews(condition) {

        const url = `/api/v1/movie-reviews`;
        return apiClient.get(url, {
            params: {
                query: condition.searchWord,
                page: condition.page,
                size: condition.size
            }
        })
    },

}