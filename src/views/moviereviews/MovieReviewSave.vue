<template>
  <section class="container-main" v-if="init">
    <Header />
    <div class="container-inner">

      <div class="box-review">

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
  name: "MovieReviewSave",
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


  },
  data() {
    return {
      init: false,
      movieReview: null,
      replyContent: null
    }
  },
  methods: {


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
    padding-bottom: 80px;

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

      .box-statistics {
        p {
          font-size: 14px;
          font-weight: 400;
          margin-top: 20px;
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
            margin-top: 2px;
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