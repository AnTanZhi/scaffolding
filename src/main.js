import Vue from 'vue'
import '@/styles/index.scss'
import Cookies from 'js-cookie'
import 'normalize.css/normalize.css'
import Element from 'element-ui'
import echarts from 'echarts'
import './styles/element-variables.scss'
import '@/styles/index.scss'
import App from './App'
import store from './store'
import router from './router'
import './icons'
import './permission'
import './utils/error-log'
import * as filters from './filters'
// import '@/utils/rem'
import './utils/rem'
import 'default-passive-events'
Vue.prototype.echarts = echarts
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}
Vue.use(Element, {
  size: Cookies.get('size') || 'medium',
})
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
Vue.config.productionTip = false
store.dispatch('upload/setHost', process.env.VUE_APP_BASE_API)
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})