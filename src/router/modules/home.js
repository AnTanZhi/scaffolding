import Layout from '@/layout'
const home = {
  path: '/home',
  component: Layout,
  name: 'home',
  alwaysShow: false,
  children: [
    {
      path: 'index',
      component: () => import('@/views/home/home'),
      name: 'home',
      meta: { title: '首页' },
      hidden: true
    },
  ]
}
export default home