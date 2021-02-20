/*
 * @Author: gao 
 * @Date: 2021-02-Fr 02:19:39 
 * @Last Modified by:   gao 
 * @Last Modified time: 2021-02-Fr 02:19:39 
 */
import request from '@/utils/request'
export default {
  /* 获取系统日志 */
  getLog(params) {
    return request({
      url: 'log/getPageList',
      method: 'GET',
      params
    })
  },
  /* 获取用户信息 */
  getUserInfo(params) {
    return request({
      url: 'user/getPageList',
      method: 'GET',
      params
    })
  },
  /* 获取部门 */
  getBuMen(params) {
    return request({
      url: 'dept/getPageList',
      method: 'GET',
      params
    })
  },
  /* 添加部门 */
  addBuMen(data) {
    return request({
      url: 'dept/save',
      method: 'POST',
      data
    })
  },
  /* 获取部门(树形菜单) */
  getBuMenShu(params) {
    return request({
      url: 'dept/selectTree',
      method: 'GET',
      params
    })
  },
  /* 获取部门详细 */
  getBuMenInfo(id) {
    return request({
      url: `dept/getById/${id}`,
      method: 'GET'
    })
  },
  /* 修改部门 */
  updBuMen(data) {
    return request({
      url: `dept/update`,
      method: 'POST',
      data
    })
  },
  /* 删除部门 */
  delBuMen(id) {
    return request({
      url: `dept/delete/${id}`,
      method: 'DELETE',
    })
  },
  /* 获取职位 */
  getZhiWei(params) {
    return request({
      url: `position/getPageList`,
      method: 'GET',
      params
    })
  },
  /* 添加职位 */
  addZhiWei(data) {
    return request({
      url: `position/save`,
      method: 'POST',
      data
    })
  },
  /* 职位详细 */
  getZhiWeiInfo(id) {
    return request({
      url: `position/getById/${id}`,
      method: 'GET'
    })
  },
  /* 修改职位 */
  updZhiWei(data) {
    return request({
      url: `position/update`,
      method: 'POST',
      data
    })
  },
  /* 删除职位 */
  delZhiWei(id) {
    return request({
      url: `position/delete/${id}`,
      method: 'DELETE'
    })
  },
  /* 获取部门(下拉框) */
  getBuMenSel() {
    return request({
      url: `dept/getPageListAll`,
      method: 'GET',
    })
  },
  /* 获取职位(下拉框) */
  getZhiWeiSel() {
    return request({
      url: `position/getPageListAll`,
      method: 'GET',
    })
  },
  /* 获取角色 */
  getJS(params) {
    return request({
      url: `role/getPageList`,
      method: 'GET',
      params
    })
  },
  /* 获取菜单 */
  getCD(params) {
    return request({
      url: `menu/getPageList`,
      method: 'GET',
      params
    })
  },
}