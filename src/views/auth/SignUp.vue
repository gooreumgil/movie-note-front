<template>
  <section class="container-main">
    <div class="box-title">
      <h2>회원가입</h2>
    </div>

    <div class="outer-form">
      <form @submit.prevent="signUp()">
        <input v-model.trim="email" type="text" placeholder="이메일">
        <input v-model.trim="name" type="text" placeholder="이름">
        <input v-model.trim="nickname" type="text" placeholder="닉네임">
        <input v-model.trim="password" type="password" placeholder="패스워드를 입력하세요">
        <button type="submit">가입하기</button>
      </form>
    </div>
  </section>
</template>

<script>
  import authApi from "@/api/authApi";
  import {useRouter} from "vue-router";

  export default {
    setup() {
      const router = useRouter();
      return {router};
    },

    data() {
      return {
        email: 'hunter407@naver.com',
        name: '김덕배',
        nickname: '나라의경제',
        password: 'aormfl123'
      }
    },
    methods: {
      async signUp() {
        console.log('들어옴');
        const email = this.email;
        const name = this.name;
        const nickname = this.nickname;
        const password = this.password;

        if (!email || !name || !nickname || !password) {
          alert("필수 항목이 입력되지 않았습니다!");
          return;
        }

        const req = {
          email,
          name,
          nickname,
          password
        };

        try {
          await authApi.signUpReqForm(req);
          alert('회원가입이 완료 되었습니다!');
          await this.router.push('/auth/login');
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
      border-top: 0;

      &:first-child {
        border-top: 1px solid #ddd;
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