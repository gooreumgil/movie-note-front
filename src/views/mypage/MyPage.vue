<template>
  <section id="main" class="container-main">
    <Header/>
    <div class="container-inner">
      <div class="box-welcome">
        <h2><span class="nickname">마이페이지</span></h2>
      </div>
    </div>
  </section>
</template>
<script>

import {computed, defineComponent} from "vue";
import Header from "@/components/core/Header.vue";
import {useStore} from "vuex";

export default defineComponent({
  components: {Header},
  setup() {
    const store = useStore();
    const nickname = computed(() => store.state.userInfo.nickname);
    return {store, nickname};
  },

  created() {
    this.store.commit('SET_CURRENT_NAV', 'MY_PAGE')
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
</style>