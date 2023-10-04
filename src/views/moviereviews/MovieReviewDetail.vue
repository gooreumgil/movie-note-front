<template>
  <section class="container-main" v-if="init">
    <Header />
    <div class="container-inner">

      <div class="box-review">
        <div class="box-title">
          <h2 class="title">{{ movieReview.title }}</h2>
          <p class="nickname">by {{ movieReview.member.nickname }}</p>
          <div class="review-info">
            <p class="created-date">{{ dateTimeTo(movieReview.createdDateTime, 'yyyy년 MM월DD일 h:m') }}</p>
          </div>
        </div>
        <div class="box-content">

          <div class="box-image" v-if="isExistsMovieReviewImg(movieReview)">
            <img v-bind:src="getMovieReviewImg(movieReview)" alt="">
          </div>

          <div class="box-text">
            <pre>{{ movieReview.content }}</pre>
          </div>

          <div class="box-like">
            <span @click="changeMovieReviewLike(movieReview)" v-if="movieReview.isLike" class="material-symbols-outlined icon" style="color: #ff4141">favorite</span>
            <span @click="changeMovieReviewLike(movieReview)" v-else class="material-symbols-outlined icon" style="font-variation-settings: 'FILL' 0">favorite</span>
            <span class="text">좋아요</span>
          </div>

          <div class="box-statistics">
            <p>댓글 {{ movieReview.statistics.replyTotal }} 좋아요 {{ movieReview.statistics.likeTotal }}</p>
          </div>

        </div>
      </div>



      <div class="box-reply">
        <ul class="wrapper-reply">
          <li class="list-reply" v-for="(reply, replyIdx) in movieReviewReplyList" v-bind:key="replyIdx">
            <p class="reply-writer">{{ reply.member.nickname }}</p>
            <p class="reply-datetime">{{ dateTimeTo(reply.createdDateTime, 'yyyy년 MM월DD일 h:mm') }}</p>
            <p class="reply-content">{{ reply.content }}</p>
          </li>
        </ul>
      </div>

      <div class="box-reply-write">
        <form @submit.prevent="saveReply()">
          <textarea @click="goLoginPage()" v-if="!userNickname" rows="5" placeholder="댓글을 달려면 로그인해주세요."></textarea>
          <textarea v-else rows="5" v-model="replyContent" placeholder="댓글을 입력해주세요."></textarea>
          <button type="submit">입력</button>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
import Header from "@/components/core/Header.vue";
import {useRoute, useRouter} from "vue-router";
import movieReviewApi from "@/api/movieReviewApi";
import mixin from "@/mixin/mixin";
import {computed} from "vue";
import {useStore} from "vuex";

export default {
  name: "MovieReviewDetail",
  components: {Header},
  mixins: [mixin],
  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    const userNickname = computed(() => store.state.userInfo.nickname);
    return {router, route, store, userNickname};
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
      },
      replyContent: null
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

    async saveReply() {

      const replyContent = this.replyContent;
      if (!replyContent) {
        alert("내용을 입력해주세요!");
        return;
      }

      const replySaveModel = {
        content: replyContent
      }

      const params = this.route.params;
      const id = params.id;

      try {
        await movieReviewApi.saveMovieReviewReply(id, replySaveModel);
      } catch (err) {
        console.log(err);
      } finally {
        this.replyContent = null;
        await this.getMovieReviewStatistics(id);
        await this.getMovieReviewReplies(id);
      }


    },

    async getMovieReviewStatistics(id) {

      try {
        const { data } = await movieReviewApi.getMovieReviewStatistics(id);
        console.log(data);
        if (data) {
          this.movieReview.statistics = data;
        }
      } catch (err) {
        console.log(err);
      }

    },

    async changeMovieReviewLike(movieReview) {

      const id = movieReview.id;
      const like = movieReview.isLike;
      const likeId = movieReview.likeId;

      if (!like) {
        try {
          const { data } = await movieReviewApi.movieReviewLike(id);
          console.log(data);
          movieReview.isLike = true;
          movieReview.likeId = data.id;
          await this.getMovieReviewStatistics(id);
        } catch (err) {
          console.log(err);
        }
      } else {
        await movieReviewApi.movieReviewLikeCancel(id, likeId);
        movieReview.isLike = false;
        movieReview.likeId = null;
        await this.getMovieReviewStatistics(id);
      }

    },

    getMovieReviewImg(movieReview) {
      return movieReview.uploadFileList[0].url;
    },

    isExistsMovieReviewImg(movieReview) {
      return movieReview.uploadFileList.length > 0;
    },

    goLoginPage() {
      this.router.push('/auth/login');
    },

  }
}
</script>

<style scoped lang="scss">

.container-main {

  .material-symbols-outlined {
    font-variation-settings:
        'FILL' 1,
        'wght' 400,
        'GRAD' 0,
        'opsz' 24
  }


  .box-review-img {
    width: 100%;
    height: 400px;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
  }

  .container-inner {

    width: 1020px;
    margin: 0 auto;
    text-align: left;
    padding-bottom: 80px;

    .box-review {
      box-sizing: border-box;
      padding: 10px;

      .box-title {
        margin-top: 40px;

        h2 {
          font-size: 20px;
          font-weight: 300;
          color: #000;
        }

        p {
          margin-top: 10px;
          font-size: 13px;
          color: #a0a0a0;
        }

        .nickname {
          margin-top: 20px;
        }

        .review-info {
          font-size: 13px;
          .created-date {
            margin-top: 10px;
          }
        }
      }

      .box-image {
        img {
          max-width: 500px;
          width: 100%;
        }
      }

      .box-content {
        margin-top: 40px;

        pre {
          font-size: 15px;
          text-wrap: inherit;
          line-height: 1.4;
          margin-top: 20px;
        }

        .box-like {
          display: flex;
          align-items: center;
          margin-top: 20px;

          span {

            &.icon {
              font-size: 20px;
              cursor: pointer;
            }

            &.text {
              font-size: 14px;
              margin-left: 3px;
              transform: translateY(-1px);
            }

          }
        }

      }

      .box-statistics {
        p {
          font-size: 14px;
          font-weight: 400;
          margin-top: 20px;
          color: #777;
        }
      }
    }

    .box-reply {
      box-sizing: border-box;
      padding: 10px;
      font-size: 14px;

      ul {


        li {

          box-sizing: border-box;
          padding: 15px;
          background-color: #f6f6f6;
          margin-bottom: 10px;

          .reply-writer {
            font-weight: 700;
          }

          .reply-datetime {
            margin-top: 5px;
            font-size: 13px;
          }

          .reply-content {
            margin-top: 10px;
          }

        }
      }
    }

    .box-reply-write {
      box-sizing: border-box;
      padding: 10px;

      form {
        textarea {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #ddd;
          border-radius: 3px;
          padding: 10px;
          outline: none;
        }

        button {
          &[type=submit] {
            margin-top: 5px;
            background-color: #42b983;
            color: #000000;
            font-weight: 700;
            box-sizing: border-box;
            padding: 5px 7px;
            font-size: 12px;
            border-radius: 3px;
          }
        }
      }
    }

  }

}

</style>