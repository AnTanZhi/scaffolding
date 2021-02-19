import request from '@/utils/request'
import qs from 'qs'
export default {
  /* 获取用户 */
  getUser(params) {
    return request({
      url: 'system/user/getPageList',
      method: 'GET',
      params
    })
  },
  /* 用户排序 */
  userMove(params) {
    return request({
      url: 'system/user/updateSort',
      method: 'POST',
      params
    })
  },
  /* 添加用户 */
  addUser(data) {
    return request({
      url: 'system/user/save',
      method: 'POST',
      data
    })
  },
  /* 解锁用户 */
  unlockUser(params) {
    return request({
      url: `system/user/unlock/{ids}?${qs.stringify(params, { arrayFormat: 'repeat' })}`,
      method: 'GET'
    })
  },
  /* 锁定用户 */
  LockedUser(params) {
    return request({
      url: `system/user/lock/{ids}?${qs.stringify(params, { arrayFormat: 'repeat' })}`,
      method: 'GET'
    })
  },
  /* 删除用户 */
  delUser(data) {
    return request({
      url: 'system/user/deleteByIds',
      method: 'DELETE',
      data
    })
  },
  /* 用户详细 */
  userInfo(id) {
    return request({
      url: `system/user/getById/{id}?id=${id}`,
      method: 'GET'
    })
  },
}