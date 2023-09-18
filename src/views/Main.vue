<template>
  <section class="container-main">
    <Header/>
    <div class="outer-form">
      <form @submit.prevent="setFindMovieReviewPath()">
        <div class="box-input">
          <input v-model="searchWord" type="text" placeholder="검색어를 입력하세요">
          <button type="submit">검색</button>
        </div>
      </form>

    </div>

    <div class="container-inner">

      <div class="box-welcome" v-if="userNickname">
        <h2><span v-if="userNickname" class="nickname">{{ userNickname}}</span>님, 환영합니다!</h2>
      </div>

      <div class="box-welcome" v-else>
        <h2>환영합니다!</h2>
      </div>

      <div class="box-search-word" v-if="completedSearchWord">
        <p>검색어: <span>{{ completedSearchWord }}</span></p>
        <button @click="resetPage" type="button">x</button>
      </div>


      <div class="box-sort-nav">
        <nav @click="selectSort(sort)" v-for="(sort, sortIdx) in sorts" v-bind:key="sortIdx" v-bind:class="{'active': selectedSort === sort.value}">{{ sort.text }}</nav>
      </div>

      <ul class="movie-review-wrapper">
<!--        <div class="divider"></div>-->
        <li class="movie-review-list clearfix" v-for="(movieReview, movieReviewIdx) in movieReviewList" v-bind:key="movieReviewIdx">
          <div class="movie-review-list-inner clearfix">
            <div class="movie-review-item content" v-bind:style="{width: isExistsMovieReviewImg(movieReview) ? '70%' : '100%'}">
              <router-link :to="`/movie-reviews/${movieReview.id}`">
                {{ movieReview.title }}
              </router-link>
              <p class="review-content">{{ movieReview.content }}</p>
              <div class="review-info">
                <p>
                  by <span class="name">{{ movieReview.member.nickname }}</span><br>
                  <span class="wrote-time">{{ dateTimeTo(movieReview.createdDateTime, 'yyyy년 MM월 DD일 h:m') }}</span>
                </p>
                <div v-if="movieReview.isOwn" class="own-review">
                  <button type="button">
                    <router-link :to="`/movie-reviews/${movieReview.id}/edit`">수정</router-link>
                  </button>
                  <button @click="reviewDelete(movieReview)" type="button">삭제</button>
                </div>
              </div>
            </div>

            <div class="movie-review-item img" v-if="isExistsMovieReviewImg(movieReview)">
              <div class="box-img">
                <div class="box-bg" v-bind:style="{backgroundImage: getMovieReviewImgUrl(movieReview)}"></div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>

  </section>
</template>

<script>
import Header from "@/components/core/Header.vue";
import {useStore} from "vuex";
import {useRoute, useRouter} from "vue-router";
import {computed} from "vue";
import movieReviewApi from "@/api/movieReviewApi";
import helloWorld from "@/components/HelloWorld.vue";
import commonUtils from "@/utils/commonUtils";
import mixin from "@/mixin/mixin";

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();

    const userEmail = computed(() => store.state.userInfo.email);
    const userNickname = computed(() => store.state.userInfo.nickname);
    const userImageUrl = computed(() => store.state.userInfo.imageUrl);

    return {store, router, route, userEmail, userNickname, userImageUrl}
  },
  name: "Main",
  components: {
    Header
  },
  mixins: [mixin],

  data() {
    return {
      init: false,
      searchWord: null,
      completedSearchWord: null,
      findCondition: {

      },
      movieReviewPageInfo: {
        currentPage: 1,
        last: false,
        size: 9,
        totalElements: 0,
        totalPages: 0
      },
      movieReviewList: [],
      selectedSort: 'createdDateTime,DESC',
      sorts: [
        {value: 'createdDateTime,DESC', text: '최신순'},
        {value: 'createdDateTime,ASC', text: '오래된순'}
      ]
    }
  },

  async created() {
    this.searchConditionReset();
    await this.findConditionSetFromQuery();
    await this.getMovieReviews();
  },

  watch: {
    $route: async function() {
      this.searchConditionReset();
      this.movieReviewList = [];

      await this.findConditionSetFromQuery();
      await this.getMovieReviews();
    },
  },

  methods: {

    async setFindMovieReviewPath(page) {

      if (!page) {
        page = 1;
      }

      const path = this.route.path;
      const searchWord = this.searchWord ? this.searchWord : '';
      const size = this.movieReviewPageInfo.size ? this.movieReviewPageInfo.size : '';
      const sort = this.selectedSort ? this.selectedSort : '';

      const newPath = `${path}?searchWord=${searchWord}&page=${page}&size=${size}&sort=${sort}`;
      const fullPath = this.route.fullPath;

      if (newPath === fullPath) {
        window.location.reload();
      } else {
        await this.router.push(newPath);
      }


    },

    async getMovieReviews() {
      const searchWord = this.searchWord;
      const page = this.movieReviewPageInfo.currentPage;
      const size = this.movieReviewPageInfo.size;
      const sort = this.selectedSort;

      const condition = {
        searchWord,
        page,
        size,
        sort
      }

      try {
        const { data } = await movieReviewApi.getMovieReviews(condition);
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

        if (searchWord) {
          this.completedSearchWord = searchWord;
        }

      } catch (err) {
        console.log(err);
      }
    },

    selectSort(sort) {
      this.selectedSort = sort.value;
      this.setFindMovieReviewPath(1);
    },

    async goMovieReviewDetail(movieReviewId) {
      await this.router.push(`/movie-reviews/${movieReviewId}`);
    },

    scrollEndEvent() {
      console.log('들어옴');
    },

    async findConditionSetFromQuery() {
      const query = this.route.query;
      const searchWord = query.searchWord;
      const page = query.page;
      const size = query.size;
      const sort = query.sort;

      this.searchWord = searchWord;

      if (page != null && page > -1) {
        this.movieReviewPageInfo.currentPage = page;
      }

      if (size) {
        this.movieReviewPageInfo.size = size;
      }

      if (sort) {
        this.selectedSort = sort;
      }

    },

    resetPage() {
      this.router.push(this.route.path);
    },

    searchConditionReset() {
      this.searchWord = null;
      this.completedSearchWord = null;
    },

    getMovieReviewImgUrl(movieReview) {
      return `url(${movieReview.uploadFileList[0].url})`;
    },

    isExistsMovieReviewImg(movieReview) {
      return movieReview.uploadFileList.length > 0;
    },

    async reviewDelete(movieReview) {
      if (!confirm('정말로 삭제 하시겠습니까?')) {
        return;
      }

      try {
        await movieReviewApi.deleteMovieReview(movieReview.id);
        alert("삭제 되었습니다!");
        window.location.reload();
      } catch (err) {
        console.log(err);
      }

    },

  },
}

</script>

<style scoped lang="scss">

.container-main {
  position: relative;
}

.container-inner {
  width: 820px;
  margin: 0 auto;
}

.box-welcome {
  margin-top: 60px;
  text-align: left;
  box-sizing: border-box;
  padding-left: 10px;
  padding-right: 10px;
  h2 {
    font-weight: 400;
    font-size: 20px;
    span {
      &.nickname {
        font-weight: 700;
      }
    }
  }

}

.outer-form {
  text-align: left;
  /* margin-top: 20px; */
  box-sizing: border-box;
  padding-left: 10px;
  padding-right: 10px;
  position: absolute;
  top: 15px;
  left: 50%;
  /* left: 0; */
  transform: translateX(-50%);

  form {
    .box-input {

      position: relative;
      width: fit-content;
      height: 35px;

      input {
        height: 100%;
        box-sizing: border-box;
        padding: 10px;
        outline: none;
        font-size: 15px;
        border-radius: 100px;

        &::placeholder {
          font-size: 13px;
        }
      }

      button {
        font-size: 12px;
        display: inline-block;
        position: absolute;
        height: 35px;
        top: 0;
        right: -55px;
        background-color: #ddd;
        color: #000;
        font-weight: 700;
        padding: 10px;
        border-radius: 100px;
      }
    }
  }

}

.box-search-word {
  margin-top: 20px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 0 10px;

  p {
    font-size: 15px;

    span {
      background-color: #d8edff;
      box-sizing: border-box;
      padding: 3px 8px;
      border-radius: 100px;
      font-size: 13px;
    }
  }

  button {
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 18px;
    height: 18px;
    margin-left: 5px;
    line-height: 0;
  }

}

.box-sort-nav {
  text-align: left;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 10px;
  margin-top: 10px;

  nav {
    font-size: 13px;
    box-sizing: border-box;
    padding: 6px 9px;
    border: 1px solid #ddd;
    margin-right: 5px;
    border-radius: 100px;
    cursor: pointer;

    &.active {
      background-color: #42b983;
      color: #fff;
      font-weight: 400;
      //border: 1px solid #2d9fd3;
      border: 1px solid #42b983;
    }
  }

}

ul {

  margin-top: 45px;
  position: relative;

  //.divider {
  //  height: 1px;
  //  width: calc(100% - 20px);
  //  margin: 0 auto;
  //  background-color: #ddd;
  //  margin-bottom: 30px;
  //}

  li {
    box-sizing: border-box;
    padding: 10px;
    margin-bottom: 20px;

    .movie-review-list-inner {
      position: relative;
      box-sizing: border-box;
      //border: 1px solid #ddd;
      border-bottom: 1px solid #ddd;
      //border-radius: 5px;
      height: 165px;
      overflow: hidden;

      .movie-review-item {
        float: left;
        text-align: left;
        text-wrap: inherit;

        &.content {
          width: 70%;
        }

        &.img {
          width: 30%;
        }
      }

      .box-img {
        height: 100px;
        width: 100px;
        margin: 0 auto;
        margin-right: 0;

        .box-bg {
          border-radius: 5px;
          width: 100%;
          height: 100%;
          background-repeat: no-repeat;
          background-size: cover;
          background-position: center center;
        }
      }

      //&:hover {
      //  border: 1px solid #42b983;
      //  transition: all .1s ease-in-out;
      //}

      a {
        font-size: 20px;
        font-weight: 300;
        color: #000;
        text-align: left;
        white-space: nowrap;
        text-overflow: ellipsis;
        word-wrap: break-word;
        overflow: hidden;
        display: block;
        //margin-top: 15px;

        &:hover {
          text-decoration: underline;
        }
      }

      .review-content {
        font-size: 13px;
        margin-top: 5px;
        line-height: 1.4;
        text-align: left;
        color: #777;
        margin-top: 20px;

        overflow: hidden; /* -webkit-line-clamp 에 입력된 값 외의 텍스트를 모두 숨김 */
        display: -webkit-box; /* 텍스트를 박스 형태로 구성 */
        -webkit-line-clamp: 2; /* 입력된 값 만큼 문장 수 출력 */
        -webkit-box-orient: vertical;
      }

      .review-info {
        position: absolute;
        bottom: 15px;
        p {
          font-size: 13px;
          color: #777;
          .name {
            font-weight: 400;
            color: #418fd5;
          }

          .wrote-time {
            display: inline-block;
            margin-top: 7px;
            font-size: 12px;
            color: #a0a0a0;
          }
        }

        .own-review {
          margin-top: 10px;
          button {
            color: #333;
            font-size: 12px;
            margin-right: 2px;
            a {
              font-size: 12px;
              font-weight: 400;
              color: #333;
            }

          }
        }

      }

    }
  }
}
</style>