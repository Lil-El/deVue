import router from "./router";
import store from "./store";
import { Message } from "element-ui";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { getToken } from "@/utils/auth";
import getPageTitle from "@/utils/get-page-title";

NProgress.configure({ showSpinner: false });

const whiteList = [
  "/",
  "/home",
  "/login",
  "/demo",
  "/scheme",
  "/department",
  "/news",
  "/contact",
  "/auth-redirect",
  "/404",
  "/401"
];

router.beforeEach(async (to, from, next) => {
  NProgress.start();

  // 设置页面title信息
  document.title = getPageTitle(to.meta.title);

  const hasToken = getToken();

  if (hasToken) {
    if (to.path === "/login") {
      next({ path: "/" });
      NProgress.done();
    } else {
      const hasRoles = store.getters.roles && store.getters.roles.length > 0;
      if (hasRoles) {
        next();
      } else {
        try {
          const { roles } = await store.dispatch("user/getInfo");
          const accessRoutes = await store.dispatch(
            "permission/generateRoutes",
            roles
          );
          router.addRoutes(accessRoutes);
          next({ ...to, replace: true });
        } catch (error) {
          await store.dispatch("user/resetToken");
          Message.error(error || "Has Error");
          next(`/login?redirect=${to.path}`);
          NProgress.done();
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});
/**
 * vuex ： user 、permission
 * --------------------------
 * 登录：登录获取token；
 * 跳转：根据token触发user的action获取roles，再根据roles通过触发permission的action获取权限路由
 * --------------------------
 * 展示：展示hidden为false的项
 * --------------------------
 * XHR：
 *    生产环境
 *    开发环境 - 通过webpack-devServer-before -> Mock;
 */