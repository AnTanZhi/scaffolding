import request from '@/utils/request'
export default {
  /* 土地查询 */
  getLand(params) {
    return request({
      url: 'financing/administration/getEntityByPageList',
      method: 'GET',
      params
    })
  },
  /* 土地详细 */
  getLandInfo(id) {
    return request({
      url: `financing/tAssetsLand/getEntityById/${id}`,
      method: 'GET'
    })
  },
}