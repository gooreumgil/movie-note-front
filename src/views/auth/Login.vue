<template>
  <section class="container-main">
    <div class="box-title">
      <h2>로그인 해주세요.</h2>
    </div>

    <div class="login-box">
      <form @submit.prevent="login()">
        <input v-model.trim="email" type="text" placeholder="이메일">
        <input v-model.trim="password" type="password" placeholder="패스워드를 입력하세요">
        <button type="submit">로그인</button>
        <button type="button">
          <router-link to="/auth/sign-up">회원가입</router-link>
        </button>
      </form>
    </div>
  </section>
</template>

<script>
import authApi from "@/api/authApi";
import {useCookies} from "vue3-cookies";
import {useRoute, useRouter} from "vue-router";


export default {
  name: "Login",
  setup() {
    return {
      router: useRouter(),
      cookies: useCookies().cookies,
    }
  },
  data() {
    return {
      email: "sonaky47@naver.com",
      password: "aormfl132",
    }
  },
  methods: {
    async login() {
      const email = this.email;
      const password = this.password;

      if (!email) {
        alert("이메일을 입력해주세요!");
        return;
      }

      if (!password) {
        alert("패스워드를 입력해주세요!");
        return;
      }

      const loginRequestForm = {
        email,
        password
      };

      try {
        const { data } = await authApi.login(loginRequestForm);
        if (data && data.accessToken) {
          this.cookies.set("accessToken", data.accessToken, "6d", "/");
        }
        await this.router.push("/")
      } catch (err) {
        console.log(err);
      }
    },
  }
}

</script>

<style scoped lang="scss">
  .container-main {
    .box-title {

      margin: 0 auto;

      width: 300px;
      text-align: left;
      margin-top: 100px;

      h2 {
        font-size: 24px;
      }
    }

    form {
      width: 300px;
      margin: 0 auto;
      margin-top: 20px;

      text-align: left;
      input {
        width: 100%;
        box-sizing: border-box;
        border: 1px solid #ddd;
        padding: 10px;

        &:first-child {
          border-bottom: 0;
        }

      }

      button {
        width: 100%;
        display: inline-block;
        padding: 15px;
        font-weight: 700;
        border-radius: 0;

        &[type=submit] {
          margin-top: 20px;
          background-color: #42b983;
          color: #000;
        }

        &[type=button] {
          margin-top: 5px;
          background-color: #42b5b9;

          a {
            display: inline-block;
            width: 100%;
            height: 100%;
          }
        }

      }
    }
  }
</style>