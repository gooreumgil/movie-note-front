<template>
  <section id="main" class="container-main" v-if="init">
    <Header/>
    <div class="container-inner">
      <div class="box-welcome">
        <h2><span class="nickname">마이페이지</span></h2>
      </div>

      <div class="box-member">
        <h3>닉네임: {{ member.nickname }}</h3>
        <h3>이메일: {{ member.email }}</h3>
      </div>
    </div>
  </section>
</template>
<script>

import {computed, defineComponent} from "vue";
import Header from "@/components/core/Header.vue";
import {useStore} from "vuex";
import memberApi from "@/api/memberApi";

export default defineComponent({
  components: {Header},
  setup() {
    const store = useStore();
    const nickname = computed(() => store.state.userInfo.nickname);
    return {store, nickname};
  },

  data() {
    return {
      init: false,
      member: null
    }
  },

  async created() {
    this.store.commit('SET_CURRENT_NAV', 'MY_PAGE')
    await this.getUserInfo();
    this.init = true;
  },

  methods: {
    async getUserInfo() {

      try {
        const { data } = await memberApi.getSessionMember();
        this.member = data;
      } catch (err) {
        console.log(err);
      }

    },
  }
})
</script>
<style scoped lang="scss">
.container-main {
  position: relative;
}

.container-inner {
  width: 1020px;
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

.box-member {
  margin-top: 20px;
  text-align: left;
  box-sizing: border-box;
  padding: 10px;

  h3 {
    margin-bottom: 8px;
    font-size: 15px;
    font-weight: 400;
  }
}
</style>