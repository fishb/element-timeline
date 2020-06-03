import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/view/index';
/*路由跳转页面*/
Vue.use(Router)

/*页面加载方法*/
export const constantRouterMap = [
  {
    path: '/',
    name: 'home',
    component: Home
  }
]

export const router =  new Router({
  routes: constantRouterMap,
})

router.beforeEach((to, from, next) => {
  next();
})

//loading chunk 解决方法
router.onError((error) => {
  const pattern = /Loading chunk (\d)+ failed/g;
  const isChunkLoadFailed = error.message.match(pattern);
  if (isChunkLoadFailed) {
    window.location.reload()
  }
})
