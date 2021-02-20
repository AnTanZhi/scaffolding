import Layout from '@/layout'
const xiTongSheZhi = {
  path: '/system',
  component: Layout,
  name: 'system',
  meta: {
    title: '系统设置',
    icon: 'table'
  },
  children: [
    {
      path: 'log',
      component: () => import('@/views/system/log'),
      name: 'log',
      meta: { title: '系统日志' }
    },
    {
      path: 'userInfo',
      component: () => import('@/views/system/userInfo'),
      name: 'userInfo',
      meta: { title: '用户信息' }
    },
    {
      path: 'setUser',
      component: () => import('@/views/system/setUser'),
      name: 'setUser',
      meta: { title: '操作用户' },
      hidden: true
    },
    {
      path: 'buMen',
      component: () => import('@/views/system/buMen'),
      name: 'buMen',
      meta: { title: '部门管理' }
    },
    {
      path: 'zhiWei',
      component: () => import('@/views/system/zhiWei'),
      name: 'zhiWei',
      meta: { title: '职位管理' }
    },
    {
      path: 'jueSe',
      component: () => import('@/views/system/jueSe'),
      name: 'jueSe',
      meta: { title: '角色管理' }
    },
    {
      path: 'caiDan',
      component: () => import('@/views/system/caiDan'),
      name: 'caiDan',
      meta: { title: '菜单管理' }
    },
  ]
}
export default xiTongSheZhi