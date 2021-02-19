import Layout from '@/layout'
const rongZiGuanLi = {
  path: '/rongZiGuanLi',
  component: Layout,
  name: 'rongZiGuanLi',
  meta: {
    title: '融资管理',
    icon: 'table'
  },
  children: [
    {
      path: 'guanLi',
      component: () => import('@/views/rongZiGuanLi/guanLi'),
      name: 'guanLi',
      meta: { title: '融资管理' }
    },
    /* 融资管理添加/修改页面 */
    {
      path: 'guanLiAdd',
      component: () => import('@/views/rongZiGuanLi/guanLiAdd'),
      name: 'guanLiAdd',
      meta: { title: '融资管理' },
      hidden: true
    },
    /* 还款计划 */
    {
      path: 'huanKuanJiHua',
      component: () => import('@/views/rongZiGuanLi/huanKuanJiHua'),
      name: 'huanKuanJiHua',
      meta: { title: '还款计划' },
      hidden: true
    },
    {
      path: 'yvJing',
      component: () => import('@/views/rongZiGuanLi/yvJing'),
      name: 'yvJing',
      meta: { title: '还款预警' }
    },
    {
      path: 'taiZhang',
      component: () => import('@/views/rongZiGuanLi/taiZhang'),
      name: 'taiZhang',
      meta: { title: '融资台账' }
    },
    {
      path: 'mingXi',
      component: () => import('@/views/rongZiGuanLi/mingXi'),
      name: 'mingXi',
      meta: { title: '还本付息明细' }
    },
    {
      path: 'zeRen',
      component: () => import('@/views/rongZiGuanLi/zeRen'),
      name: 'zeRen',
      meta: { title: '还本付息责任表' }
    },
    {
      path: 'qingKuang',
      component: () => import('@/views/rongZiGuanLi/qingKuang'),
      name: 'qingKuang',
      meta: { title: '资金到账情况表' }
    },
    {
      path: 'huiZong',
      component: () => import('@/views/rongZiGuanLi/huiZong'),
      name: 'huiZong',
      meta: { title: '融资汇总' }
    },
    {
      path: 'tongJi',
      component: () => import('@/views/rongZiGuanLi/tongJi'),
      name: 'tongJi',
      meta: { title: '融资类型统计表' }
    },
    {
      path: 'jiHua',
      component: () => import('@/views/rongZiGuanLi/jiHua'),
      name: 'jiHua',
      meta: { title: '月工作计划' }
    },
    {
      path: 'xinXi',
      component: () => import('@/views/rongZiGuanLi/xinXi'),
      name: 'xinXi',
      meta: { title: '土地信息' }
    },
    /* 土地信息详细 */
    {
      path: 'tuDiXiangXi',
      component: () => import('@/views/rongZiGuanLi/tuDiXiangXi'),
      name: 'tuDiXiangXi',
      meta: { title: '土地信息详细' },
      hidden: true
    },
  ]
}
export default rongZiGuanLi
