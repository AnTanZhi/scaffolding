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
      url: 'dept/saveOrUpdate',
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
      url: `position/saveOrUpdate`,
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
      url: `menu/selectTree`,
      method: 'GET',
      params
    })
  },
  /* 添加菜单 */
  addCD(data) {
    return request({
      url: `menu/saveOrUpdate`,
      method: 'POST',
      data
    })
  },
  /* 修改菜单 */
  updCD(data) {
    return request({
      url: `menu/update`,
      method: 'POST',
      data
    })
  },
  /* 获取菜单详细 */
  getCDInfo(id) {
    return request({
      url: `menu/getById/${id}`,
      method: 'GET'
    })
  },
  /* 删除菜单 */
  delCD(id) {
    return request({
      url: `menu/delete/${id}`,
      method: 'DELETE'
    })
  },
  /* 添加角色 */
  addJS(data) {
    return request({
      url: `role/saveOrUpdate`,
      method: 'POST',
      data
    })
  },
  /* 角色详细 */
  getJSInfo(id) {
    return request({
      url: `role/getById/${id}`,
      method: 'GET'
    })
  },
  /* 修改角色 */
  updJS(data) {
    return request({
      url: `role/update`,
      method: 'POST',
      data
    })
  },
  /* 删除角色 */
  delJS(id) {
    return request({
      url: `role/delete/${id}`,
      method: 'DELETE'
    })
  },
  /* 角色排序 */
  sortJS(params) {
    return request({
      url: `role/updateSort`,
      method: 'POST',
      params
    })
  },
  /* 绑定菜单 */
  bingMenu(data) {
    return request({
      url: `role/bingMenu`,
      method: 'POST',
      data
    })
  },
  /* 菜单回显 */
  getMenu(id) {
    return request({
      url: `roleMenu/getMenuListByRoleId?roleId=${id}`,
      method: 'GET'
    })
  },
  /* 查询全部角色 */
  getJSAll() {
    return request({
      url: `role/getPageListAll`,
      method: 'GET'
    })
  },
  /* 添加用户 */
  addYH(data) {
    return request({
      url: `user/saveOrUpdate`,
      method: 'POST',
      data
    })
  },
  /* 用户信息 */
  getYHInfo(id) {
    return request({
      url: `user/getById/${id}`,
      method: 'GET'
    })
  },
  /* 附件信息 */
  getFile(code) {
    return request({
      url: `file/getByCode/${code}`,
      method: 'GET'
    })
  },
  /* 用户排序 */
  userPX(params) {
    return request({
      url: `user/updateSort`,
      method: 'POST',
      params
    })
  },
  /* 用户排序 */
  delsUser(id) {
    return request({
      url: `user/delete/${id}`,
      method: 'DELETE',
    })
  },
  /* 批量解锁/禁用 */
  jsjys(ids, state) {
    return request({
      url: `user/updateState/${ids}?state=${state}`,
      method: 'POST',
    })
  },
  /* 部门排序 */
  bmPX(params) {
    return request({
      url: `dept/updateSort`,
      method: 'POST',
      params
    })
  },
  /* 职位排序 */
  zwPX(params) {
    return request({
      url: `position/updateSort`,
      method: 'POST',
      params
    })
  },
  /* 部门删除前检查 */
  delBMCheck(id) {
    return request({
      url: `dept/deleteChange/${id}`,
      method: 'GET'
    })
  },
  /* 职位删除前检查 */
  delZWCheck(id) {
    return request({
      url: `position/deleteChange/${id}`,
      method: 'GET'
    })
  },
  /* 角色删除前检查 */
  delJSCheck(id) {
    return request({
      url: `role/deleteChange/${id}`,
      method: 'GET'
    })
  },
  /* 获取当前登陆人菜单 */
  getCurrLoginMenu() {
    return request({
      url: `menu/getMenuForUser`,
      method: 'GET'
    })
  },
}