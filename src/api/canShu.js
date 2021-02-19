import request from '@/utils/request'
export default {
  /* 获取还款频率 */
  getRepaymentFrequency(params) {
    return request({
      url: 'financing/rongziParam/getFrequencyByPage',
      method: 'GET',
      params
    })
  },
  /* 删除还款频率 */
  delRepaymentFrequency(data) {
    return request({
      url: `financing/rongziParam/delete/{ids}`,
      method: 'DELETE',
      data
    })
  },
  /* 添加还款频率 */
  addRepaymentFrequency(data) {
    return request({
      url: `financing/rongziParam/saveOrUpdateRzFrequency`,
      method: 'POST',
      data
    })
  },
  /* 还款频率详细 */
  infoRepaymentFrequency(id) {
    return request({
      url: `financing/rongziParam/getById/${id}`,
      method: 'GET'
    })
  },
  /* 融资类型数据 */
  getFinancingType(params) {
    return request({
      url: `financing/rongziParam/getTypeByPage`,
      method: 'GET',
      params
    })
  },
  /* 融资类型添加 */
  addFinancingType(data) {
    return request({
      url: `financing/rongziParam/saveOrUpdateRzType`,
      method: 'POST',
      data
    })
  },
  /* 融资类型详细 */
  infoFinancingType(id) {
    return request({
      url: `financing/rongziParam/getById/${id}`,
      method: 'GET'
    })
  },
  /* 获取融资主体 */
  getFinancingBody(params) {
    return request({
      url: `financing/rongziParam/getSubjectByPage`,
      method: 'GET',
      params
    })
  },
  /* 添加融资主体 */
  addFinancingBody(data) {
    return request({
      url: `financing/rongziParam/saveOrUpdateRzSubject`,
      method: 'POST',
      data
    })
  },
  /* 获取责任科室 */
  getResponsibility(params) {
    return request({
      url: `financing/rongziParam/getResponsibility`,
      method: 'GET',
      params
    })
  },
  /* 添加/修改责任科室 */
  setResponsibility(data) {
    return request({
      url: `financing/rongziParam/saveOrUpdateResponsibility`,
      method: 'POST',
      data
    })
  },
  /* 添加/修改责任科室 */
  setResponsibility(data) {
    return request({
      url: `financing/rongziParam/saveOrUpdateResponsibility`,
      method: 'POST',
      data
    })
  },
}