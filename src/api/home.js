import request from '@/utils/request'
export default {
  /* 数值类型 */
  getIndexValueType() {
    return request({
      url: 'financing/homePage/indexValueType',
      method: 'GET'
    })
  },
  /* 柱状图 */
  getHistogram(params) {
    return request({
      url: 'financing/homePage/indexHistogram',
      method: 'GET',
      params
    })
  },
  /* 饼图 */
  getPie(params) {
    return request({
      url: 'financing/homePage/indexPieChart',
      method: 'GET',
      params
    })
  },
  /* 融资类型(只有父级) */
  getFinancingType() {
    return request({
      url: 'financing/rongziParam/queryRzTypeList',
      method: 'GET',
    })
  },
}