import Layout from '@/layout'
const rongZiCanShu = {
  path: '/rongZiCanShu',
  component: Layout,
  name: 'rongZiCanShu',
  meta: {
    title: '融资参数',
    icon: 'table'
  },
  children: [
    {
      path: 'pinLv',
      component: () => import('@/views/rongZiCanShu/pinLv'),
      name: 'pinLv',
      meta: { title: '还款频率' }
    },
    {
      path: 'leiXing',
      component: () => import('@/views/rongZiCanShu/leiXing'),
      name: 'leiXing',
      meta: { title: '融资类型' }
    },
    {
      path: 'zhuTi',
      component: () => import('@/views/rongZiCanShu/zhuTi'),
      name: 'zhuTi',
      meta: { title: '融资主体' }
    },
    {
      path: 'keShi',
      component: () => import('@/views/rongZiCanShu/keShi'),
      name: 'keShi',
      meta: { title: '责任科室' }
    },
  ]
}
export default rongZiCanShu
