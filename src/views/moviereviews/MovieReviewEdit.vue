<template>
  <section class="container-main" v-if="init">
    <Header />
    <div class="container-inner">

      <div class="box-review">
        <div class="box-title">
          <h2>{{ movieReview.title }}</h2>
          <p>by {{ movieReview.member.nickname }}</p>
        </div>
        <div class="box-content">
          <div class="box-image" v-if="isExistsMovieReviewImg(movieReview)">
            <img v-bind:src="getMovieReviewImg(movieReview)" alt="">
          </div>
          <div class="box-text">
            <pre>{{ movieReview.content }}</pre>
          </div>
        </div>
<!--        {{ movieReview }}-->
      </div>
    </div>
  </section>
</template>

<script>
import Header from "@/components/core/Header.vue";
import {useRoute, useRouter} from "vue-router";
import movieReviewApi from "@/api/movieReviewApi";

export default {
  name: "MovieReviewEdit",
  components: {Header},
  setup() {
    const router = useRouter();
    const route = useRoute();
    return {router, route};
  },
  async created() {
    const params = this.route.params;
    const id = params.id;
    await this.getMovieReview(id)
  },
  data() {
    return {
      init: false,
      movieReview: null
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