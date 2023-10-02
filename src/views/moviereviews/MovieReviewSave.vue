<template>
  <section class="container-main" v-if="init">
    <Header />
    <div class="container-inner">

      <div class="box-title">
        <h2>리뷰를 작성해주세요.</h2>
      </div>

      <form @submit.prevent="saveMovieReview">

        <div v-if="uploadImageFileResult" class="upload-image-preview" v-bind:style="{backgroundImage: 'url(' + uploadImageFileResult + ')'}"></div>

        <div class="box-review-title">
          <input v-model="reviewTitle" type="text" placeholder="제목을 입력하세요.">
        </div>
        <div class="box-content">
          <div class="box-content">
            <textarea v-model="reviewContent" placeholder="내용을 입력하세요." rows="8"></textarea>
          </div>
          <div class="box-img">
            <input id="file-selector" ref="file" type="file" @change="handleFileUpload" accept="image/*">
          </div>
        </div>
        <button type="submit">작성하기</button>
      </form>


    </div>
  </section>
</template>

<script>
import Header from "@/components/core/Header.vue";
import {useRoute, useRouter} from "vue-router";
import mixin from "@/mixin/mixin";
import {computed} from "vue";
import {useStore} from "vuex";
import uploadFileApi from "@/api/uploadFileApi";
import movieReviewApi from "@/api/movieReviewApi";

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

    this.init = true;
  },
  data() {
    return {
      init: false,
      reviewTitle: null,
      reviewContent: null,
      uploadImageFile: null,
      uploadImageFileResult: null
    }
  },
  methods: {

    async saveMovieReview() {


      const uploadImageFile = this.uploadImageFile;

      const formData = new FormData();
      formData.append('file', uploadImageFile);

      let uploadFileIds = [];

      try {
        const { data } = await uploadFileApi.saveUploadFile(formData, 'MOVIE_REVIEW_IMAGE');
        uploadFileIds.push(data.id);
      } catch (err) {
        alert('오류가 발생하였습니다');
        console.log(err);
        return;
      }

      if (uploadFileIds.length === 0) {
        console.log(uploadFileIds.length)
        return;
      }

      const reviewTitle = this.reviewTitle;
      const reviewContent = this.reviewContent;

      const movieReviewSaveData = {
        title: reviewTitle,
        content: reviewContent,
        uploadFileIds
      }

      try {
        await movieReviewApi.saveMovieReview(movieReviewSaveData);
        alert("성공적으로 등록 되었습니다!");
        await this.router.replace('/');
      } catch (err) {
        console.log(err);
      }

    },

    handleFileUpload(event) {
      const files = event.target.files;
      if (files && files.length > 0) {

        this.uploadImageFile = files[0];

        if (window.File && window.FileList && window.FileReader) {

          const file = files.item(0);
          //Only pics
          if (!file.type.match('image')) return;

          const picReader = new FileReader();

          picReader.onload = function (e) {
            this.uploadImageFileResult = e.target.result;
          }.bind(this);
          picReader.readAsDataURL(file);
        } else {
          console.log("Your browser does not support File API");
        }

      }
    },

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

    .box-title {
      box-sizing: border-box;
      padding: 0 10px;
      margin-top: 60px;

      h2 {
        font-size: 20px;
        color: #000;
        font-weight: 400;
      }
    }

    form {
      box-sizing: border-box;
      padding: 10px;

      .upload-image-preview {
        width: 150px;
        height: 150px;
        background-position: center center;
        background-repeat: no-repeat;
        background-size: cover;
        border-radius: 10px;
        margin-top: 10px;
        margin-bottom: 10px;
      }

      input {
        width: 100%;
        box-sizing: border-box;

        &[type=text] {
          padding: 15px;
        }

        &[type=file] {
          margin-top: 10px;
        }

      }

      textarea {
        width: 100%;
        outline: none;
        border: 1px solid #ddd;
        margin-top: 10px;
        box-sizing: border-box;
        padding: 15px;
      }

      .box-review-title {
        margin-top: 15px;

      }

      .box-img {

      }

      .box-content {

      }

    }

    button {
      &[type=submit] {
        margin-top: 10px;
        background-color: #51d99b;
        color: #000;
        font-weight: 700;
        box-sizing: border-box;
        padding: 10px;
        border-radius: 3px;
        font-size: 13px;
      }
    }

  }

}

</style>