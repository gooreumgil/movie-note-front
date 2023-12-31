import apiClient from "@/core/apiClient";

export default {

    getMovieReviews(condition) {
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

    saveMovieReview(data) {
        const url = `/api/v1/session-member/movie-reviews`;
        return apiClient.post(url, data);
    },

    getMovieReview(id) {
        const url = `/api/v1/movie-reviews/${id}`;
        return apiClient.get(url);
    },

    getMovieReviewStatistics(id) {
        const url = `/api/v1/movie-reviews/${id}/statistics`;
        return apiClient.get(url);
    },

    getMovieReviewReplies(id) {
        const url = `/api/v1/movie-reviews/${id}/replies`;
        return apiClient.get(url, {
            params: {
                size: 50
            }
        });
    },

    saveMovieReviewReply(id, data) {

        const url = `/api/v1/movie-reviews/${id}/replies`;
        return apiClient.post(url, data)

    },

    deleteMovieReview(id) {
        const url = `/api/v1/session-member/movie-reviews/${id}`;
        return apiClient.delete(url);
    },

    movieReviewLike(id) {
        const url = `/api/v1/movie-reviews/${id}/likes`;
        return apiClient.post(url);
    },

    movieReviewLikeCancel(id, likeId) {
        const url = `/api/v1/movie-reviews/${id}/likes/${likeId}`;
        return apiClient.delete(url);
    },


}