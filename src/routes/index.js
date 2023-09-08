import {createRouter, createWebHistory} from 'vue-router'
import Main from "@/views/Main.vue";
import Login from "@/views/auth/Login.vue";
import authApi from "@/api/authApi";
import {useCookies} from "vue3-cookies";
import store from "@/store";

const {cookies} = useCookies();

/**
 * 로그인 페이지 접근시 세션 검증이 되면 메인 페이지로 redirect
 */
function authenticateBeforeLogin(to, from, next) {
    const TAG = "[authenticateInIntro]";


    const token = cookies.get("accessToken");

    // when catch
    const catchFunc = function (err) {
        console.log(`${TAG} session 검증에러 (/api/v1/printshop/auth/verification") - ${JSON.stringify(err)}`);
        if (token) {
            cookies.remove("accessToken", "/")
        }
        goLoginPage()
    };

    if (token) {
        authApi.tokenVerification()
            .then(onVerifyTokenSuccess.bind(this))
            .catch(catchFunc.bind(this))
    } else {
        next();
    }

}

/**
 * 로그인이 필요한 페이지에 접근시에 세션검증
 */
export function redirectLoginPageIfTokenNotValid(to, from, next) {

    const token = cookies.get("accessToken");
    const thenFunc = function (response) {

        const {accessToken, email, nickname, imageUrl} = response.data;
        if (accessToken) {
            cookies.set("accessToken", accessToken, '4d', '/');
        }

        store.commit("SET_USER_EMAIL", email)
        store.commit("SET_USER_NICKNAME", nickname)
        store.commit("SET_USER_IMAGE_URL", imageUrl)

        next();
    }

    const catchFunc = function (e) {
        console.log(e);
        cookies.remove("accessToken");
        goLoginPage();
    }


    if (token) {
        authApi.tokenVerification()
            .then(thenFunc)
            .catch(catchFunc.bind(this))
    } else {
        goLoginPage();
    }
}

/**
 * 로그인 페이지 접근시에 세션 검증 성공시
 */
function onVerifyTokenSuccess(response) {
    const TAG = "[onVerifyTokenSuccess]";
    const status = response.status;
    console.log(`${TAG} 세션검증 성공 ${status}`);

    const {accessToken} = response.data;
    if (status === 200) {
        cookies.set("token", accessToken, '4d', '/');
    }

    goMainPage();
}


/**
 * 로그인 페이지로
 */
function goLoginPage() {
    router.replace("/auth/login");
}

/**
 * 메인페이지로
 */
function goMainPage() {
    router.replace("/");
}

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            component: Main,
            beforeEnter: redirectLoginPageIfTokenNotValid
        },
        {
            path: "/auth/login",
            component: Login,
            beforeEnter: authenticateBeforeLogin
        }
    ]
})