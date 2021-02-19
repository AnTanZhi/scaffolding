import Layout from '@/layout'
const duiWaiDanBao = {
  path: '/duiWaiDanBao',
  component: Layout,
  name: 'duiWaiDanBao',
  alwaysShow: true,
  meta: {
    title: '对外担保',
    icon: 'table'
  },
  children: [
    {
      path: 'dwGuanLi',
      component: () => import('@/views/duiWaiDanBao/guanLi'),
      name: 'dwGuanLi',
      meta: { title: '对外担保管理' },
    },
  ]
}
export default duiWaiDanBao
