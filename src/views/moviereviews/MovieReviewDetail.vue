<template>
  <section class="container-main">
    <Header />
    <div class="container-inner">
      <div class="box-title">
        <h2></h2>
      </div>
    </div>
  </section>
</template>

<script>
import Header from "@/components/core/Header.vue";
import {useRoute, useRouter} from "vue-router";
import movieReviewApi from "@/api/movieReviewApi";

export default {
  name: "MovieReviewDetail",
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
      movieReview: null
    }
  },
  methods: {
    async getMovieReview(id) {
      try {
        const { data } = await movieReviewApi.getMovieReview(id);
        this.movieReview = data;
      } catch (err) {
        console.log(err);
      }
    },
  }
}
</script>

<style scoped lang="scss">

</style>