/*
 * @Author: gao 
 * @Date: 2021-02-Fr 09:43:30 
 * @Last Modified by:   gao 
 * @Last Modified time: 2021-02-Fr 09:43:30 
 */
import request from '@/utils/request'
/* 登录接口 */
export const login = data => {
  return request({
    url: 'login',
    method: 'POST',
    data
  })
}
/* 获取用户信息 */
export const getInfo = () => {
  return request({
    url: 'getUserInfo',
    method: 'GET'
  })
}
/* 退出登录 */
export function logout(params) {
  return request({
    url: 'logOut',
    method: 'GET',
    params
  })
}
/* 获取用户菜单 */
export function userAuthority() {
  return request({
    url: 'system/menu/getMenuForUser',
    method: 'GET'
  })
}
