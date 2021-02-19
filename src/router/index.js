import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
import Layout from '@/layout'
import rongZiCanShu from './modules/rongZiCanShu'
// import xiTongSheZhi from './modules/xiTongSheZhi'
import rongZiGuanLi from './modules/rongZiGuanLi'
import duiWaiDanBao from './modules/duiWaiDanBao'
import home from './modules/home'
export const constantRoutes = [
  {
    path: '/',
    hidden: true,
    redirect: '/home/index'
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
  /* 首页 */
  home,
  /* 融资管理 */
  rongZiGuanLi,
  /* 融资参数 */
  rongZiCanShu,
  /* 对外担保 */
  duiWaiDanBao,
  /* 系统设置 */
  // xiTongSheZhi,
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
