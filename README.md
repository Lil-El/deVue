# 去

- vuex ： user 、permission
-------------------------
- 登录：登录获取token；
- 跳转：根据token触发user的action获取roles，再根据roles通过触发permission的action获取权限路由
- --------------------------
- 展示：展示hidden为false的项
------------------------
- XHR：
-    生产环境
-    开发环境 - 通过webpack-devServer-before -> Mock;

### Mock：
  使用Chokidar.js，对mock下的文件进行监控，当文件发生变化的时候，重新构建routes
 