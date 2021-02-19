import request from '@/utils/request'
export default {
  /* 对外担保 */ getExternalGuarantee(params) {
    return request({
      url: 'financing/ensure/getPageList',
      method: 'GET',
      params
    })
  },
  /* 删除对外担保 */ delExternalGuarantee(data) {
    return request({
      url: 'financing/ensure/delete/{ids}',
      method: 'DELETE',
      data
    })
  },
  /* 添加对外担保 */ addExternalGuarantee(data) {
    return request({
      url: 'financing/ensure/save',
      method: 'POST',
      data
    })
  },
  /* 对外担保详细 */ externalGuaranteeInfo(id) {
    return request({
      url: `financing/ensure/getById/${id}`,
      method: 'GET'
    })
  },
  /* 修改对外担保 */ updExternalGuarantee(data) {
    return request({
      url: `financing/ensure/update`,
      method: 'POST',
      data
    })
  },
}