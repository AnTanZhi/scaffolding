import request from '@/utils/request'

export const login = data => {
  return request({
    url: 'user/doLogin',
    method: 'POST',
    data
  })
}

export const getInfo = () => {
  return request({
    url: 'user/info',
    method: 'GET'
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
export function userAuthority() {
  return request({
    url: 'system/menu/getMenuForUser',
    method: 'GET'
  })
}
