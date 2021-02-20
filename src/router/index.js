import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
import xiTongSheZhi from './modules/xiTongSheZhi'
export const constantRoutes = [
  {
    path: '/',
    hidden: true,
    redirect: '/system/log'
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  /* 系统设置 */
  xiTongSheZhi,
]
const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
const router = createRouter()
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}
export default router
