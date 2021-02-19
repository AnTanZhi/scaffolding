import request from '@/utils/request'
export default {
  /* 获取部门 */
  getDepartment() {
    return request({
      url: 'system/depart/selectTree',
      method: 'GET'
    })
  },
  /* 获取职位 */
  getPost() {
    return request({
      url: 'system/positions/getPageList',
      method: 'GET'
    })
  },
  /* 获取角色 */
  getRole() {
    return request({
      url: 'system/roles/getPageList',
      method: 'GET'
    })
  },
  /* 获取附件地址 */
  getAnnexURL(id) {
    return request({
      url: `system/file/getFileInfo/${id}`,
      method: 'POST'
    })
  },
  /* 获取大类 */
  getCategories(id) {
    return request({
      url: `financing/rongziParam/queryRzTypeList?fid=${id}`,
      method: 'GET'
    })
  },
  /* 获取融资类型(级联) */
  getFinancingType() {
    return request({
      url: `financing/rongziParam/getRzTypeCascadeList`,
      method: 'GET'
    })
  },
  /* 获取所属公司 */
  getCompany() {
    return request({
      url: `financing/rongziParam/getBelongingCompanyMap`,
      method: 'GET'
    })
  },
  /* 获取融资主体 */
  getFinancingBody() {
    return request({
      url: `financing/rongziParam/queryRzSubjectList`,
      method: 'GET'
    })
  },
  /* 获取币种 */
  getCurrency() {
    return request({
      url: `financing/rongziParam/getCurrencyMap`,
      method: 'GET'
    })
  },
  /* 获取付息频率 */
  getInterestPaymentFrequency() {
    return request({
      url: `financing/rongziParam/queryRzFrequencyList`,
      method: 'GET'
    })
  },
  /* 获取本金还款方式 */
  getPrincipalRepayment() {
    return request({
      url: `financing/rongziParam/getPrincipalModelMap`,
      method: 'GET'
    })
  },
  /* 获取利息还款方式 */
  getInterestRepayment() {
    return request({
      url: `financing/rongziParam/getInterestModelMap`,
      method: 'GET'
    })
  },
  /* 获取还款模式 */
  getRepaymentMode() {
    return request({
      url: `financing/rongziParam/getRepaymentModelMap`,
      method: 'GET'
    })
  },
  /* 获取征信报告 */
  getCreditReport() {
    return request({
      url: `financing/rongziParam/getSubjectReportMap`,
      method: 'GET'
    })
  },
  /* 获取责任人(根据部门) */
  getResponsible(name) {
    return request({
      url: `financing/rongzi/querySYSUserByDepartName/${name}`,
      method: 'GET'
    })
  },
  /* 获取责任科室 */
  getResponsibilityDepartment() {
    return request({
      url: `financing/rongziParam/getDepartmentMap`,
      method: 'GET'
    })
  },
  /* 获取抵质押物类型 */
  getCollateralType() {
    return request({
      url: `financing/rongziParam/getDywTypeMap`,
      method: 'GET'
    })
  },
  /* 获取土地状态 */
  getStateLand() {
    return request({
      url: `financing/rongziParam/getLandStateMap`,
      method: 'GET'
    })
  },
  /* 获取融资类型(一级) */
  getFinancingTypeOne() {
    return request({
      url: `financing/rongziParam/queryRzTypeList`,
      method: 'GET'
    })
  },
  /* 土地证号搜索引擎 */
  getSearchEngineLandNo() {
    return request({
      url: `financing/rongziParam/getLandCodeBox`,
      method: 'GET'
    })
  },
  /* 获取用户信息 */
  getInfo() {
    return request({
      url: `user/info`,
      method: 'GET'
    })
  },
  /* 获取当前登录人权限菜单 */
  getCurrentLoginAuthorityMenu() {
    return request({
      url: `system/menu/getMenuForUser`,
      method: 'GET'
    })
  },
}