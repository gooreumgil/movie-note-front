<template>
  <header class="header">
    <div class="inner-header">
      <nav>
        <router-link to="/">Movie Note</router-link>
      </nav>
      <nav class="login" v-if="!email"><router-link to="/auth/login">로그인</router-link></nav>
      <nav class="logout" v-else>
        <button type="button" @click="logout">로그아웃</button>
      </nav>
    </div>

  </header>
</template>

<script>
  import {computed} from "vue";
  import store from "@/store";
  import {useCookies} from "vue3-cookies";
  import {useRouter} from "vue-router";

  export default {
    name: "Header",
    setup() {
      const cookies = useCookies().cookies;
      const router = useRouter();
      const email = computed(() => store.getters.getEmail);
      return {email, cookies, router};
    },
    methods: {
      logout() {
        this.cookies.remove("accessToken", "/")
        this.router.replace("/auth/login");
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
      width: 800px;
      margin: 0 auto;
      position: relative;
    }

    nav {

      &:last-child {
        font-size: 13px;
      }

      &.login, &.logout {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        font-weight: 400;
      }

      button[type=button] {
        cursor: pointer;
        background-color: transparent;
        box-sizing: border-box;
        font-weight: 400;
        color: #333;
      }

    }
  }
</style>