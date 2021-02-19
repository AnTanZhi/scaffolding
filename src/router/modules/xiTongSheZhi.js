import Layout from '@/layout'
const xiTongSheZhi = {
  path: '/xiTongSheZhi',
  component: Layout,
  name: 'xiTongSheZhi',
  meta: {
    title: '系统设置',
    icon: 'table'
  },
  children: [
    {
      path: 'caiDan',
      component: () => import('@/views/xiTongSheZhi/caiDan/caiDan'),
      name: 'caiDan',
      meta: { title: '菜单管理' }
    },
    {
      path: 'yongHuQuanXian',
      component: () => import('@/views/xiTongSheZhi/yongHuQuanXian/index'),
      name: 'yongHuQuanXian',
      meta: { title: '用户权限' }
    },
    {
      path: 'yongHuTianJia',
      component: () => import('@/views/xiTongSheZhi/yongHuQuanXian/yongHuTianJia'),
      name: 'yongHuTianJia',
      meta: { title: '编辑用户' },
      hidden: true
    },
  ]
}
export default xiTongSheZhi