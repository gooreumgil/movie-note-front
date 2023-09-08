<template>
  <section class="container-main">
    <Header/>
    <div class="container-inner">
      <div class="box-welcome">
        <h2><span class="nickname">{{ userNickname}}</span>님, 환영합니다!</h2>
      </div>

      <div class="outer-form">
        <form @submit.prevent="getMovieReviews">
          <div class="box-input">
            <input v-model="query" type="text" placeholder="검색어를 입력하세요">
            <button type="submit">검색</button>
          </div>
        </form>
        <div class="box-search-word" v-if="searchWord">
          검색어: {{ searchWord }}
        </div>
      </div>

      <ul class="movie-review-wrapper clearfix">
        <li class="movie-review-list" v-for="(movieReview, movieReviewIdx) in movieReviewList" v-bind:key="movieReviewIdx">
          <div class="movie-review-list-inner">
            <div class="box-img">
              <div class="box-bg" v-if="movieReview.uploadFileList.length > 0" v-bind:style="{backgroundImage: getMovieReviewImg(movieReview)}"></div>
              <div class="box-bg" v-else v-bind:style="{backgroundColor: '#f1f1f1'}"></div>
              <!--            <img v-if="movieReview.uploadFileList.length > 0" v-bind:src="movieReview.uploadFileList[0].url" alt="">-->
            </div>
            <h3 class="review-title">{{ movieReview.title }}</h3>
            <p class="review-content">{{ movieReview.content }}</p>
            <p class="review-writer">by {{ movieReview.member.nickname }}</p>

          </div>

        </li>
      </ul>
    </div>

  </section>
</template>

<script>
import Header from "@/components/core/Header.vue";
import {useStore} from "vuex";
import {useRouter} from "vue-router";
import {computed} from "vue";
import movieReviewApi from "@/api/movieReviewApi";

export default {
  setup() {
    const store = useStore();
    const router = useRouter();

    const userEmail = computed(() => store.state.userInfo.email);
    const userNickname = computed(() => store.state.userInfo.nickname);
    const userImageUrl = computed(() => store.state.userInfo.imageUrl);

    return {store, router, userEmail, userNickname, userImageUrl}
  },
  name: "Main",
  components: {
    Header
  },

  data() {
    return {
      query: null,
      searchWord: null,
      movieReviewPageInfo: {
        currentPage: 1,
        last: false,
        size: 10,
        totalElements: 0,
        totalPages: 0
      },
      movieReviewList: []
    }
  },

  async created() {
    await this.getMovieReviews();
  },

  methods: {

    async getMovieReviews() {
      const query = this.query;
      try {
        const { data } = await movieReviewApi.getMovieReviews(query);
        const pageInfo = data.pageInfo;
        if (pageInfo) {
          this.movieReviewPageInfo.currentPage = pageInfo.currentPage
          this.movieReviewPageInfo.last = pageInfo.last
          this.movieReviewPageInfo.size = pageInfo.size
          this.movieReviewPageInfo.totalElements = pageInfo.totalElements
          this.movieReviewPageInfo.totalPages = pageInfo.totalPages
        }

        const list = data.list;
        if (list && list.length > 0) {
          this.movieReviewList = list;
        }

        if (query) {
          this.searchWord = query;
        }

      } catch (err) {
        console.log(err);
      }
    },

    getMovieReviewImg(movieReview) {
      return `url(${movieReview.uploadFileList[0].url})`;
    },

  }

}

</script>

<style scoped lang="scss">

.container-inner {
  width: 1040px;
  margin: 0 auto;
}

.box-welcome {
  margin-top: 40px;
  text-align: left;
  box-sizing: border-box;
  padding-left: 10px;
  padding-right: 10px;
  h2 {
    font-weight: 400;
    font-size: 24px;
    span {
      &.nickname {
        font-weight: 700;
      }
    }
  }

}

.outer-form {
  text-align: left;
  margin-top: 20px;
  box-sizing: border-box;
  padding-left: 10px;
  padding-right: 10px;

  form {
    .box-input {

      position: relative;
      width: fit-content;
      height: 40px;

      input {
        height: 100%;
        box-sizing: border-box;
        padding: 10px;
        outline: none;
        font-size: 15px;
      }

      button {
        font-size: 12px;
        display: inline-block;
        position: absolute;
        height: 40px;
        top: 0;
        right: -40px;
        background-color: #ddd;
        color: #000;
        font-weight: 700;
        padding: 10px;
      }
    }
  }

  .box-search-word {
    margin-top: 10px;
    p {

    }
  }

}

ul {

  margin-top: 20px;
  position: relative;

  li {
    float: left;
    width: 33.333%;
    box-sizing: border-box;
    padding: 10px;

    .movie-review-list-inner {
      position: relative;
      cursor: pointer;
      box-sizing: border-box;
      padding: 25px;
      border: 1px solid #ddd;
      border-radius: 5px;
      height: 400px;
      overflow: hidden;

      .box-img {
        height: 200px;

        .box-bg {
          border-radius: 5px;
          width: 100%;
          height: 100%;
          background-repeat: no-repeat;
          background-size: cover;
          background-position: center center;
        }
      }

      &:hover {
        border: 1px solid #42b983;
        transition: all .1s ease-in-out;
      }

      h3 {
        text-align: left;
        white-space: nowrap;
        text-overflow: ellipsis;
        word-wrap: break-word;
        overflow: hidden;
        margin-top: 15px;
      }

      p.review-content {
        font-size: 13px;
        margin-top: 5px;
        line-height: 1.4;
        text-align: left;
        color: #555;
      }

      p.review-writer {
        position: absolute;
        bottom: 20px;
        font-size: 13px;
        color: #777;
      }

    }
  }
}
</style>