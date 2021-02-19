import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import router from '@/router'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 1800000
})
service.interceptors.request.use(
  config => {
    if (getToken()) {
      config.headers['token'] = getToken()
    }
    return config
  },
  error => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)
service.interceptors.response.use(
  res => {
    switch (res.status) {
      case 200:
        break
      case 201:
        // Message.success('操作成功')
        break
      case 202:
        // Message.success('操作成功')
        break
      case 204:
        Message.success('操作成功')
        break
      case 400:
        Message.warning('请求错误')
        break
      case 401:
        Message.info('用户名或密码错误')
        break
      case 403:
        Message.info('禁止访问')
        break
      case 404:
        Message.info('请求路径不存在')
        break
      case 422:
        console.log('code:422', res)
        break
      default:
    }
    return res
  },
  error => {
    console.log(error)
    if (error.response) {
      console.log(error.response.status, error.response.data.message) // for debug
    }

    if (error && error.response) {
      switch (error.response.status) {
        case 401:
          console.log(store.state.user.isCallLogout)
          const path = router.currentRoute.path
          console.log(path)
          if (path.indexOf('/login') === -1 && !store.state.user.isCallLogout) {
            callback.reLogin('您的登录已过期，请重新登录')
          }
          break
        case 500:
          break
        case 404:
          Message.error('请求路径不存在')
          break
        default:
          // Message.error('未知错误')
          console.log('未知错误', error.response)
      }
    } else {
      // console.log(error)
      // Message.error('未知错误!')
    }
    /*    let result = error.response ? error.response.data.message : error
        if(error.response.data.message){
          result = error.response.data.message
        }else{
          result = error.response.data
        }*/
    /*let result = error.response ? error.response.data.message : error
    if(error.response.data.message){

    }*/
    let result = null
    if (error.response) {
      if (error.response.data.message) {
        result = error.response.data.message
      } else {
        result = error.response
      }
    } else {
      result = error
    }
    return Promise.reject(result)
  }
)

const callback = {
  reLogin(tip) {
    MessageBox.confirm(tip, '提示', {
      confirmButtonText: '去登录',
      cancelButtonText: '继续停留',
      cancelButtonClass: "btn-custom-cancel",
      type: 'warning'
    }).then(async () => {
      await store.dispatch('user/logout')
      location.reload()
    })
  }

}

export default service
