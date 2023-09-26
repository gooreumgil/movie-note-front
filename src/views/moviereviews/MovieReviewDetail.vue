<template>
  <section class="container-main" v-if="init">
    <Header />
    <div class="container-inner">

      <div class="box-review">
        <div class="box-title">
          <h2 class="title">{{ movieReview.title }}</h2>
          <p class="nickname">by {{ movieReview.member.nickname }}</p>
          <div class="review-info">
            <p class="created-date">{{ dateTimeTo(movieReview.createdDateTime, 'yyyy년 MM월 DD일 h:m') }}</p>
          </div>
        </div>
        <div class="box-content">
          <div class="box-image" v-if="isExistsMovieReviewImg(movieReview)">
            <img v-bind:src="getMovieReviewImg(movieReview)" alt="">
          </div>
          <div class="box-text">
            <pre>{{ movieReview.content }}</pre>
          </div>
          <div class="box-statistics">
            <p>댓글 {{ movieReview.statistics.replyTotal }} 좋아요 {{ movieReview.statistics.likeTotal }}</p>
          </div>

        </div>
      </div>

      <div class="box-reply">
        <ul class="wrapper-reply">
          <li class="list-reply" v-for="(reply, replyIdx) in movieReviewReplyList" v-bind:key="replyIdx">
            {{ reply }}
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script>
import Header from "@/components/core/Header.vue";
import {useRoute, useRouter} from "vue-router";
import movieReviewApi from "@/api/movieReviewApi";
import mixin from "@/mixin/mixin";

export default {
  name: "MovieReviewDetail",
  components: {Header},
  mixins: [mixin],
  setup() {
    const router = useRouter();
    const route = useRoute();
    return {router, route};
  },
  async created() {
    const params = this.route.params;
    const id = params.id;
    await this.getMovieReview(id)
    await this.getMovieReviewReplies(id);
  },
  data() {
    return {
      init: false,
      movieReview: null,
      movieReviewReplyList: [],
      movieReviewReplyPageInfo: {
        currentPage: 1,
        last: false,
        size: 10,
        totalElements: 0,
        totalPages: 0
      }
    }
  },
  methods: {
    async getMovieReview(id) {
      try {
        const { data } = await movieReviewApi.getMovieReview(id);
        this.movieReview = data;
        this.init = true;
      } catch (err) {
        console.log(err);
      }
    },

    async getMovieReviewReplies(id) {
      try {
        const { data } = await movieReviewApi.getMovieReviewReplies(id);

        const pageInfo = data.pageInfo;
        if (pageInfo) {
          this.movieReviewReplyPageInfo.currentPage = pageInfo.currentPage
          this.movieReviewReplyPageInfo.last = pageInfo.last
          this.movieReviewReplyPageInfo.size = pageInfo.size
          this.movieReviewReplyPageInfo.totalElements = pageInfo.totalElements
          this.movieReviewReplyPageInfo.totalPages = pageInfo.totalPages
        }

        const list = data.list;
        if (list && list.length > 0) {
          this.movieReviewReplyList = list;
        }

      } catch (err) {
        console.log(err);
      }
    },

    getMovieReviewImg(movieReview) {
      return movieReview.uploadFileList[0].url;
    },

    isExistsMovieReviewImg(movieReview) {
      return movieReview.uploadFileList.length > 0;
    },
  }
}
</script>

<style scoped lang="scss">

.container-main {


  .box-review-img {
    width: 100%;
    height: 400px;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
  }

  .container-inner {

    width: 820px;
    margin: 0 auto;
    text-align: left;

    .box-review {
      box-sizing: border-box;
      padding: 10px;

      .box-title {
        margin-top: 40px;

        h2 {
          font-size: 24px;
          font-weight: 300;
          color: #000;
        }

        p {
          margin-top: 10px;
          font-size: 14px;
          color: #a0a0a0;
        }

        .nickname {
          margin-top: 20px;
        }

        .review-info {
          font-size: 12px;
          .created-date {
          }
        }
      }

      .box-image {
        img {
          max-width: 100%;
        }
      }

      .box-content {
        margin-top: 40px;

        pre {
          text-wrap: inherit;
          line-height: 1.4;
          margin-top: 20px;
        }
      }
    }

  }

}

</style>