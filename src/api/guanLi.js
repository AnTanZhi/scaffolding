import request from '@/utils/request'
export default {
  /* 添加管理参数 */
  addManagementParameters(data) {
    return request({
      url: 'financing/rongzi/saveOrUpdateRongzi',
      method: 'POST',
      data
    })
  },
  /* 融资管理详细 */
  getFinancingInfo(id) {
    return request({
      url: `financing/rongzi/queryEntityInfoById/${id}`,
      method: 'GET'
    })
  },
  /* 获取融资管理 */
  getFinancing(params) {
    return request({
      url: `financing/administration/getByPage`,
      method: 'GET',
      params
    })
  },
  /* 删除融资管理 */
  delFinancing(data) {
    return request({
      url: `financing/rongzi/delete/{ids}`,
      method: 'DELETE',
      data
    })
  },
  /* 添加/修改放款 */
  setLoan(data) {
    return request({
      url: `financing/rongziFangdai/addOrUpdateEntity`,
      method: 'POST',
      data
    })
  },
  /* 放款详细 */
  loanInfo(id) {
    return request({
      url: `financing/rongziFangdai/getEntityById/${id}`,
      method: 'GET'
    })
  },
  /* 放款删除 */
  delLoan(data) {
    return request({
      url: `financing/rongziFangdai/delete/{ids}`,
      method: 'DELETE',
      data
    })
  },
  /* 放款金额表格 */
  getLoan(params) {
    return request({
      url: `financing/rongziFangdai/getByIdPageList`,
      method: 'GET',
      params
    })
  },
  /* 资金使用记录表格 */
  getFundRecords(params) {
    return request({
      url: `financing/rongziTicord/getByIdPageList`,
      method: 'GET',
      params
    })
  },
  /* 添加/修改资金使用记录 */
  setFundRecords(data) {
    return request({
      url: `financing/rongziTicord/saveOrUpdateTiCode`,
      method: 'POST',
      data
    })
  },
  /* 资金使用记录详细 */
  getFundRecordsInfo(id) {
    return request({
      url: `financing/rongziTicord/getTiCodeEntityById/${id}`,
      method: 'GET',
    })
  },
  /* 删除资金使用记录 */
  delFundRecords(data) {
    return request({
      url: `financing/rongziTicord/deleteEntity/{id}`,
      method: 'DELETE',
      data
    })
  },
  /* 还款计划表格 */
  getRepaymentPlan(params) {
    return request({
      url: `financing/rongziHuankuan/getByPage`,
      method: 'GET',
      params
    })
  },
  /* 还款计划详细 */
  getRepaymentPlanInfo(id) {
    return request({
      url: `financing/rongziHuankuan/getEntityById/${id}`,
      method: 'GET',
    })
  },
  /* 还款计划修改 */
  setRepaymentPlan(data) {
    return request({
      url: `financing/rongziHuankuan/updateEntity`,
      method: 'POST',
      data
    })
  },
  /* 还款计划删除 */
  delRepaymentPlan(data) {
    return request({
      url: `financing/rongziHuankuan/deleteEntityById/{ids}`,
      method: 'DELETE',
      data
    })
  },
  /* 生成还款计划 */
  generateRepaymentPlan(id) {
    return request({
      url: `financing/rongziHuankuan/generate/${id}`,
      method: 'POST'
    })
  },
  /* 本金管理 */
  getPrincipalManagement(params) {
    return request({
      url: `financing/rongziBenjin/getBenjinListByPage`,
      method: 'GET',
      params
    })
  },
  /* 删除本金 */
  delPrincipalManagement(data) {
    return request({
      url: `financing/rongziBenjin/delete/{ids}`,
      method: 'DELETE',
      data
    })
  },
  /* 添加本金 */
  addPrincipalManagement(data) {
    return request({
      url: `financing/rongziBenjin/saveOrUpdateEntity`,
      method: 'POST',
      data
    })
  },
  /* 获取利率 */
  getInterestRate(params) {
    return request({
      url: `financing/rongziLl/getEntityByPageList`,
      method: 'GET',
      params
    })
  },
  /* 添加利率 */
  addInterestRate(data) {
    return request({
      url: `financing/rongziLl/addOrUpdateEntity`,
      method: 'POST',
      data
    })
  },
  /* 删除利率 */
  delInterestRate(data) {
    return request({
      url: `financing/rongziLl/deleteEntityById/{id}`,
      method: 'DELETE',
      data
    })
  },
  /* 本金详细 */
  getPrincipalManagementInfo(id) {
    return request({
      url: `financing/rongziBenjin/getEntityById/${id}`,
      method: 'GET'
    })
  },
  /* 利率详细 */
  getInterestRateInfo(id) {
    return request({
      url: `financing/rongziLl/getEntityByPageList/${id}`,
      method: 'GET'
    })
  },
  /* 获取还款预警 */
  getRepaymentWarning(params) {
    return request({
      url: `financing/administration/getAlertListByPage`,
      method: 'GET',
      params
    })
  },
  /* 还款操作 */
  repaymentOperation(data) {
    return request({
      url: `financing/administration/repaymentEntity`,
      method: 'POST',
      data
    })
  },
  /* 资金到账情况表 */
  getFundsArrive(params) {
    return request({
      url: `financing/administration/getUsageListByPage`,
      method: 'GET',
      params
    })
  },
  /* 资金到账情况表 */
  getFinancingTypeStatistics(params) {
    return request({
      url: `financing/administration/rongziTypeStatistics`,
      method: 'GET',
      params
    })
  },
  /* 获取融资台账 */
  getFinancingLedger(params) {
    return request({
      url: `financing/administration/rongziStanding`,
      method: 'GET',
      params
    })
  },
  /* 获取还本付息明细 */
  getDebtServiceDetails(params) {
    return request({
      url: `financing/administration/backPayDetailed`,
      method: 'GET',
      params
    })
  },
  /* 获取融资汇总 */
  getFinancingSummary(params) {
    return request({
      url: `financing/administration/rongziStatistics`,
      method: 'GET',
      params
    })
  },
  /* 获取月工作计划 */
  getMonthlyWorkPlan(params) {
    return request({
      url: `financing/rongziWork/getWorkByPage`,
      method: 'GET',
      params
    })
  },
  /* 添加/修改月工作计划 */
  setMonthlyWorkPlan(data) {
    return request({
      url: `financing/rongziWork/saveOrUpdateEntity`,
      method: 'POST',
      data
    })
  },
  /* 删除月工作计划 */
  delMonthlyWorkPlan(id) {
    return request({
      url: `financing/rongziWork/deleteByIds/${id}`,
      method: 'DELETE'
    })
  },
  /* 月工作计划详细 */
  monthlyWorkPlanInfo(id) {
    return request({
      url: `financing/rongziWork/getEntityById/${id}`,
      method: 'GET'
    })
  },
  /* 获取还本付息责任表 */
  getTableDebtServiceLiability(params) {
    return request({
      url: `financing/administration/backPayResponsibility`,
      method: 'GET',
      params
    })
  },
  /* 结清 */
  settle(params) {
    return request({
      url: `financing/rongzi/settle/{rongziId}`,
      method: 'POST',
      params
    })
  },
}