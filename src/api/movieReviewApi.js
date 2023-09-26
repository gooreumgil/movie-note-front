import apiClient from "@/core/apiClient";

export default {

    getMovieReviews(condition) {
        console.log(condition);
        const url = `/api/v1/movie-reviews`;
        return apiClient.get(url, {
            params: {
                query: condition.searchWord,
                page: condition.page,
                size: condition.size,
                sort: condition.sort
            }
        })
    },

    getMovieReview(id) {
        const url = `/api/v1/movie-reviews/${id}`;
        return apiClient.get(url);
    },

    getMovieReviewReplies(id) {
        const url = `/api/v1/movie-reviews/${id}/replies`;
        return apiClient.get(url);
    },

    deleteMovieReview(id) {
        const url = `/api/v1/session-member/movie-reviews/${id}`;
        return apiClient.delete(url);
    },

}