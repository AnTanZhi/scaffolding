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
      path: 'deptInfo',
      component: () => import('@/views/system/buMen'),
      name: 'deptInfo',
      meta: { title: '部门管理' }
    },
    {
      path: 'posInfo',
      component: () => import('@/views/system/zhiWei'),
      name: 'posInfo',
      meta: { title: '职位管理' }
    },
    {
      path: 'roleInfo',
      component: () => import('@/views/system/jueSe'),
      name: 'roleInfo',
      meta: { title: '角色管理' }
    },
    {
      path: 'menuInfo',
      component: () => import('@/views/system/caiDan'),
      name: 'menuInfo',
      meta: { title: '菜单管理' }
    },
    {
      path: 'setRole',
      component: () => import('@/views/system/setJueSe'),
      name: 'setRole',
      meta: { title: '操作角色' },
      hidden: true
    },
    {
      path: 'chatroom',
      component: () => import('@/views/system/chatroom'),
      name: 'chatroom',
      meta: { title: '聊天室' },
    },
  ]
}
export default xiTongSheZhi