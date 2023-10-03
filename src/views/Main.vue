<template>
  <section id="main" class="container-main">
    <Header/>
    <div class="outer-form">
      <form @submit.prevent="setFindMovieReviewPath()">
        <div class="box-input">
          <input v-model="searchWord" type="text" placeholder="검색어를 입력하세요">
          <button type="submit">검색</button>
          <button @click="checkLoginBeforeMovieReviewSave()" type="button">작성하기</button>
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
                  <span class="wrote-time">{{ dateTimeTo(movieReview.createdDateTime, 'yyyy년 MM월 DD일 hh:mm') }}</span><span class="middle-dot">&#183;</span><span class="statistics">댓글 {{ movieReview.statistics.replyTotal }} 좋아요 {{ movieReview.statistics.likeTotal }}</span>
                </p>
              </div>
            </div>

            <div class="movie-review-item img" v-if="isExistsMovieReviewImg(movieReview)">
              <div @click="goMovieReviewDetail(movieReview.id)" class="box-img">
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
        currentPage: null,
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
      ],
      scrolledToBottom: false
    }
  },

  async created() {
    this.searchConditionReset();
    await this.findConditionSetFromQuery();
    await this.getMovieReviews();
  },

  mounted() {
    this.scroll();
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

    async getMovieReviews(pageVal) {
      const searchWord = this.searchWord;
      const page = pageVal ? pageVal : this.movieReviewPageInfo.currentPage;
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
        if (this.scrolledToBottom) {
          list.forEach(movieReview => {
            this.movieReviewList.push(movieReview);
          })
        } else {
          if (list && list.length > 0) {
            this.movieReviewList = list;
          }
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

    checkLoginBeforeMovieReviewSave() {
      const userNickname = this.userNickname;
      if (!userNickname) {
        if (confirm("로그인이 필요한 페이지입니다! 로그인 하시겠습니까?")) {
          this.router.push('/auth/login')
        }
      } else {
        this.router.push('/movie-reviews/save');
      }

    },

    scroll () {
      window.onscroll = () => {
        this.scrolledToBottom = Math.ceil(Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop)) + window.innerHeight === document.documentElement.offsetHeight;
        if (this.scrolledToBottom && !this.movieReviewPageInfo.last) {
          this.getMovieReviews(++this.movieReviewPageInfo.currentPage);
        }
      }
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
        font-size: 13px;
        border-radius: 100px;
        &::placeholder {
          font-size: 13px;
        }
      }

      button {
        font-size: 11px;
        display: inline-block;
        position: absolute;
        height: 35px;

        padding: 10px;
        border-radius: 100px;
        line-height: 0;
        font-weight: 700;

        &[type=submit] {
          top: 0;
          right: -50px;
          background-color: #ffdd42;
          color: #000;
        }

        &[type=button] {
          right: -120px;
          background-color: #51d99b;
        }
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
    font-size: 12px;
    box-sizing: border-box;
    padding: 6px 9px;
    border: 1px solid #ddd;
    margin-right: 5px;
    border-radius: 100px;
    cursor: pointer;

    &.active {
      //background-color: #42b983;
      background-color: #65e1eb;
      color: #000;
      font-weight: 700;
      //border: 1px solid #2d9fd3;
      border: 1px solid #65e1eb;
    }
  }

}

ul {

  margin-top: 20px;
  position: relative;


  li {
    box-sizing: border-box;
    padding: 10px;
    margin-bottom: 20px;
    position: relative;

    .movie-review-list-inner {
      position: relative;
      box-sizing: border-box;
      border-bottom: 1px solid #ddd;
      height: 165px;
      overflow: hidden;

      .movie-review-item {
        float: left;
        text-align: left;
        text-wrap: inherit;

        &.content {
          width: 70%;

          a {
            font-size: 18px;
            font-weight: 300;
            color: #000;
            text-align: left;
            white-space: nowrap;
            text-overflow: ellipsis;
            word-wrap: break-word;
            overflow: hidden;
            display: block;
            height: 20px;
            //margin-top: 15px;

            &:hover {
              text-decoration: underline;
            }
          }

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
        overflow: hidden;
        border-radius: 5px;
        cursor: pointer;

        .box-bg {
          width: 100%;
          height: 100%;
          background-repeat: no-repeat;
          background-size: cover;
          background-position: center center;

          &:hover {
            transform:scale(1.1);             /*  default */
            -webkit-transform:scale(1.1);  /*  크롬 */
            -moz-transform:scale(1.1);     /* FireFox */
            -o-transform:scale(1.1);        /* Opera */
            transition: all .3s ease-in-out;
          }
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
          font-size: 12px;
          color: #777;
          .name {
            font-weight: 400;
            color: #418fd5;
          }

          .statistics {
            display: inline-block;
            margin-top: 7px;
            font-size: 12px;
            color: #a0a0a0;
          }

          .middle-dot {
            display: inline-block;
            margin-left: 5px;
            margin-right: 5px;
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
            font-size: 11px;
            margin-right: 2px;
            a {
              font-size: 11px;
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