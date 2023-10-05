<template>
  <header class="header">
    <div class="inner-header">
      <nav>
        <router-link to="/">Movie Note</router-link>
      </nav>
      <nav class="login" v-if="!email"><router-link to="/auth/login">로그인</router-link></nav>
      <nav class="logout" v-else>
        <router-link v-bind:style="{fontWeight: getFontWeightByCurrentNav('MOVIE_REVIEW')}" to="/">영화리뷰</router-link>
        <router-link v-bind:style="{fontWeight: getFontWeightByCurrentNav('MY_PAGE')}" to="/my-page">마이페이지</router-link>
        <button type="button" @click="logout">
          로그아웃
<!--          <span class="material-symbols-outlined icon">logout</span>-->
<!--          로그아웃-->
        </button>
      </nav>
      <div class="outer-form">
        <form @submit.prevent="setFindMovieReviewPath()">
          <div class="box-input">
            <input ref="searchWord" @change="changeSearchWord" :value="searchWord" type="text" placeholder="검색어를 입력하세요">
            <button type="submit">검색</button>
            <button @click="checkLoginBeforeMovieReviewSave()" type="button">작성하기</button>
          </div>
        </form>

      </div>
    </div>

  </header>
</template>

<script>
  import {computed} from "vue";
  import store from "@/store";
  import {useCookies} from "vue3-cookies";
  import {useRoute, useRouter} from "vue-router";
  import {useStore} from "vuex";

  export default {
    name: "Header",
    setup() {
      const cookies = useCookies().cookies;
      const router = useRouter();
      const route = useRoute();
      const store = useStore();
      const email = computed(() => store.getters.getEmail);
      const nickname = computed(() => store.getters.getNickname);
      const currentNav = computed(() => store.getters.getCurrentNav).value;
      return {email, nickname, currentNav, cookies, router, route, store};
    },
    props: {
      searchWord: {
        default: null
      }
    },
    methods: {
      logout() {
        this.cookies.remove("accessToken", "/")
        this.router.replace("/auth/login");
        this.store.state.userInfo.nickname = null;
        this.store.state.userInfo.email = null;
        this.store.state.userInfo.imageUrl = null;
      },

      setFindMovieReviewPath() {
        const path = this.route.path;
        if (path === '/') {
          this.$emit('setFindMovieReviewPath');
        } else {
          this.router.push(`/?searchWord=${this.$refs.searchWord.value}`);
        }
      },

      changeSearchWord(e) {
        this.$emit('changeSearchWord', e.target.value)
      },

      checkLoginBeforeMovieReviewSave() {
        const nickname = this.nickname;
        if (!nickname) {
          if (confirm("로그인이 필요한 페이지입니다! 로그인 하시겠습니까?")) {
            this.router.push('/auth/login')
          }
        } else {
          this.router.push('/movie-reviews/save');
        }

      },

      getFontWeightByCurrentNav(currentNav) {
        console.log(this.currentNav);
        console.log(currentNav);
        return this.currentNav === currentNav ? 700 : 400;
      },
    }
  }
</script>

<style scoped lang="scss">
  .header {
    width: 100%;
    text-align: left;
    box-sizing: border-box;
    padding: 25px;
    font-weight: 700;
    color: #000;
    font-size: 20px;
    border-bottom: 1px solid #ddd;

    .inner-header {
      width: 1000px;
      margin: 0 auto;
      position: relative;
      display: flex;
      align-items: center;

      .outer-form {
        text-align: left;
        margin-left: 10px;
        /* margin-top: 20px; */
        box-sizing: border-box;
        padding-left: 10px;
        padding-right: 10px;
        //position: absolute;
        //top: 19px;
        //left: 50%;
        /* left: 0; */
        //transform: translateX(-100%);

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
              font-size: 12px;
              display: inline-block;
              //position: absolute;
              height: 35px;
              padding: 10px;
              border-radius: 100px;
              line-height: 0;
              font-weight: 700;
              margin-left: 10px;

              &[type=submit] {
                top: 0;
                right: -55px;
                background-color: #ffdd42;
                color: #000;
              }

              &[type=button] {
                right: -125px;
                background-color: #51d99b;
              }
            }
          }
        }

      }

    }

    nav {

      &:first-child a {
        font-family: 'Skranji', cursive;
        font-weight: 700;
        color: #ff005c;
        font-size: 22px;
      }

      &:last-child {
        font-size: 13px;
      }

      &.login, &.logout {
        font-size: 13px;
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        font-weight: 400;
        display: flex;
        align-items: center;

      }

      &.logout {

        a {
          font-size: 13px;
          color: #333;
          font-weight: 400;

          display: inline-block;
          border-radius: 100px;
          margin-right: 15px;
          //padding: 5px 7px;
          //background-color: #65e1eb;

          &:hover {
            font-weight: 700 !important;
            transition: all .1s ease-in-out;
          }
        }

        button[type=button] {
          cursor: pointer;
          background-color: transparent;
          box-sizing: border-box;
          font-weight: 400;
          color: #333;
          font-size: 13px;
          display: flex;
          align-items: center;
          padding: 0;

          &:hover {
            font-weight: 700;
            transition: all .1s ease-in-out;
          }

          span {
            font-size: 15px;
          }
        }
      }



    }
  }
</style>