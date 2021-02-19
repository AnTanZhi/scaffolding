<template>
  <div class="view-container bg-gray">
    <div class="border-card">
      <div class="title">融资信息</div>
      <el-form :model="addOrUpdParams.rongZiEntityInfo" ref="addOrUpdParams" label-width="150px" class="demo-ruleForm"
        :rules="rules">
        <el-row>
          <el-col :span="12">
            <el-form-item label="合同编号：">
              <el-input v-model="addOrUpdParams.rongZiEntityInfo.dkdbhs" style="width:33%" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="债务名称：" prop="zwmc">
              <el-input v-model="addOrUpdParams.rongZiEntityInfo.zwmc" style="width:33%" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="还款账号：">
              <el-input v-model="addOrUpdParams.rongZiEntityInfo.hkzh" style="width:33%" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="还款银行：">
              <el-input v-model="addOrUpdParams.rongZiEntityInfo.hkyh" style="width:33%" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="所属公司：">
              <GongSi v-model="addOrUpdParams.rongZiEntityInfo.suoshugs" style="width:33%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="融资主体：">
              <ZhuTi v-model="addOrUpdParams.rongZiEntityInfo.rzzt" style="width:33%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="贷款日期起：" prop="dkrqq">
              <el-date-picker v-model="addOrUpdParams.rongZiEntityInfo.dkrqq" type="date" placeholder="选择日期"
                style="width:33%" format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss" @change="loanDateVerification">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="贷款日期止：" prop="dkrqz">
              <el-date-picker v-model="addOrUpdParams.rongZiEntityInfo.dkrqz" type="date" placeholder="选择日期"
                style="width:33%" format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss" @change="loanDateVerification">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="融资类型：">
              <el-select v-model="addOrUpdParams.rongZiEntityInfo.rzlxmc" style="width:33%" clearable>
                <el-option v-for="item in typeFinancing" :key="item.pid" :label="item.pname" :value="item.pid"
                  :disabled="item.fid==0" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="签订日期：" prop="qdrq">
              <el-date-picker v-model="addOrUpdParams.rongZiEntityInfo.qdrq" type="date" style="width:33%"
                placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="期限(天)：">
              <span>{{deadlineTian}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="期限(月)：">
              <span>{{deadlineYue}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="币种：">
              <BiZhong v-model="addOrUpdParams.rongZiEntityInfo.bz" style="width:33%" :cle="false" @initBz="initBz" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="贷款周期固定：">
              <el-checkbox v-model="addOrUpdParams.rongZiEntityInfo.zqgd" style="width:33%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="授信金额：" prop="sxje">
              <el-input v-model="addOrUpdParams.rongZiEntityInfo.sxje" type="number" style="margin-right:20px;width:33%"
                clearable @input="setSXJE" />[万元]
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="金融机构：" prop="jinRongJiGou">
              <el-input v-model="addOrUpdParams.rongZiEntityInfo.jinRongJiGou" style="width:33%" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="合同利率(%)：" prop="lilv">
              <el-input v-model="addOrUpdParams.rongZiEntityInfo.lilv" type="number" style="width:33%" clearable
                @input="setLendingFrequency" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="综合成本(%)：">
              <el-input v-model="addOrUpdParams.rongZiEntityInfo.ptlv" style="width:33%" type="number" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="付息频率：" prop="hkplid">
              <PinLv v-model="addOrUpdParams.rongZiEntityInfo.hkplid" style="width:33%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="付息日：" prop="hkr">
              <el-input v-model="addOrUpdParams.rongZiEntityInfo.hkr" style="width:33%" type="number" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="首次付息日期：" prop="schkrq">
              <el-date-picker v-model="addOrUpdParams.rongZiEntityInfo.schkrq" type="date" style="width:33%"
                placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="可续贷：">
              <el-checkbox v-model="addOrUpdParams.rongZiEntityInfo.kxd" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="本金还款方式：" prop="bjhkfsmc">
              <HuanKuanFangShi v-model="addOrUpdParams.rongZiEntityInfo.bjhkfsmc" style="width:33%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="利息还款方式：" prop="lxhkfsmc">
              <LiXiHuanKuanFangShi v-model="addOrUpdParams.rongZiEntityInfo.lxhkfsmc" style="width:33%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="担保方式：">
              <el-checkbox v-model="addOrUpdParams.rongZiEntityInfo.dsf">担保</el-checkbox>
              <el-checkbox v-model="addOrUpdParams.rongZiEntityInfo.dy">抵质押</el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="还款模式：">
              <MoShi v-model="addOrUpdParams.rongZiEntityInfo.hkModel" style="width:33%" :cle="false"
                @initMS="initMS" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="addOrUpdParams.rongZiEntityInfo.dsf">
          <el-col :span="4">
            <el-form-item label="担保方：">
              <el-input v-model="addOrUpdParams.rongZiEntityInfo.dbrmc" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="担保协议号：">
              <el-input v-model="addOrUpdParams.rongZiEntityInfo.dbxyh" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="征信报告：">
              <BaoGao v-model="addOrUpdParams.rongZiEntityInfo.dbrmczx" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="addOrUpdParams.rongZiEntityInfo.dsf">
          <el-col :span="4">
            <el-form-item label="担保方2：">
              <el-input v-model="addOrUpdParams.rongZiEntityInfo.dbrmc2" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="担保协议号：">
              <el-input v-model="addOrUpdParams.rongZiEntityInfo.dbxyh2" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="征信报告：">
              <BaoGao v-model="addOrUpdParams.rongZiEntityInfo.dbrmczx2" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="保证金(万元)：">
              <el-input v-model="addOrUpdParams.rongZiEntityInfo.bzj" type="number" style="width:33%" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手续费(万元)：">
              <el-input v-model="addOrUpdParams.rongZiEntityInfo.sxf" type="number" style="width:33%" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="监管账户：">
              <el-input v-model="addOrUpdParams.rongZiEntityInfo.jianGuanZhangHu" style="width:33%" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="监管银行：">
              <el-input v-model="addOrUpdParams.rongZiEntityInfo.jianGuanYinHang" style="width:33%" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="责任人：" prop="zrr">
              <ZeRenRen v-model="addOrUpdParams.rongZiEntityInfo.zrr" style="width:33%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="责任科室：">
              <KeShi v-model="addOrUpdParams.rongZiEntityInfo.zrks" style="width:33%" @initKS="initKS" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="融资主体征信报告：">
              <BaoGao v-model="addOrUpdParams.rongZiEntityInfo.zlbk" style="width:15%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注：">
              <el-input type="textarea" :rows="5" v-model="addOrUpdParams.rongZiEntityInfo.bzcontext">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 放款金额代码块 -->
        <el-divider content-position="left">
          <div style="display:flex;align-items:center">
            <span style="color: #666666;font-weight: 900;font-size: 1.2em">放款金额</span>
            <el-button type="success" icon="el-icon-edit-outline" circle size="mini"
              @click="()=>{loanAmountDia = true;loanAmountParams={}}" style="margin-left:10px"
              v-if="this.$route.query.id" />
          </div>
        </el-divider>
        <div v-if="!this.$route.query.id">
          <el-form :model="item" v-for="item in addOrUpdParams.rongziFangdais" :key="item.rongziFangdaisKey"
            label-position="right" label-width="140px" inline style="display:flex;justify-content: space-between;">
            <div>
              <el-form-item label="* 放款金额(万元)：" class="dzyName">
                <el-input type="number" v-model="item.efkjy" clearable style="width:140px" />
              </el-form-item>
              <el-form-item label="* 放款时间：" class="dzyName">
                <el-date-picker v-model="item.efksj" type="date" placeholder="选择日期" format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd HH:mm:ss" style="width:140px" />
              </el-form-item>
              <el-form-item label="* 放款利率：" class="dzyName">
                <el-input type="number" v-model="item.efkll" clearable style="width:140px" />
              </el-form-item>
              <el-form-item label="* 手续费(万元)：" class="dzyName">
                <el-input type="number" v-model="item.sxf" clearable style="width:140px" />
              </el-form-item>
              <el-form-item label="* 保证金(万元)：" class="dzyName">
                <el-input type="number" v-model="item.bzj" clearable style="width:140px" />
              </el-form-item>
            </div>
            <div>
              <el-form-item style="text-align: end;margin-right:0">
                <el-button type="success" icon="el-icon-plus" circle size="mini" @click="addLoanAmount" />
                <el-button type="danger" icon="el-icon-minus" circle size="mini" @click="delLoanAmount" />
              </el-form-item>
            </div>
          </el-form>
        </div>
        <el-table :header-cell-style="{background:'#F0FAFF',color:'#787878'}" border stripe
          element-loading-text="加载中，请稍候……" :data="loanData" tooltip-effect="dark" style="width: 100%"
          v-if="this.$route.query.id">
          <el-table-column label="放款金额(万元)" :formatter="row=>Number(row.efkjy).toFixed(6)" align="right" />
          <el-table-column label="放款时间" :formatter="row=>String(row.efksj)=='null'?'':String(row.efksj).substring(0,10)"
            align="center" width="100" />
          <el-table-column label="放款利率" :formatter="row=>Number(row.efkll).toFixed(3)+'%'" align="right" />
          <el-table-column label="手续费(万元)" :formatter="row=>Number(row.sxf).toFixed(6)" align="right" />
          <el-table-column label="保证金(万元)" :formatter="row=>Number(row.bzj).toFixed(6)" align="right" />
        </el-table>
        <!-- 放款金额修改对话框 -->
        <el-dialog title="新沂市城市投资发展有限公司内部办公平台" :visible.sync="loanAmountDia" :close-on-click-modal="false">
          <el-form :model="loanAmountParams" label-width="130px">
            <el-row>
              <el-col :span="8">
                <ShangChuan />
              </el-col>
              <el-col :span="4">
                <el-button type="primary" @click="mbxz">模板下载</el-button>
              </el-col>
            </el-row>
            <div style="border:#CCCCCC 1px solid;margin-top:10px">
              <div
                style="height: 35px;line-height: 35px;font-size: 14px;font-weight: bold;padding-left: 15px;color: #5a5a5a;border-bottom: 1px solid #ccc;box-shadow: inset 0 0 0px 1px #FFF;border-radius: 4px 4px 0 0;background:#F8F8F8">
                放款金额编辑</div>
              <div style="padding:10px 20px">
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="放款金额(万元)：">
                      <el-input placeholder="放款金额" type="Number" v-model="loanAmountParams.efkjy" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="放款日期：">
                      <el-date-picker v-model="loanAmountParams.efksj" type="date" placeholder="选择日期"
                        value-format="yyyy-MM-dd HH:mm:ss">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="利率(%)：">
                      <el-input placeholder="利率" type="number" v-model="loanAmountParams.efkll" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="手续费(万元)：">
                      <el-input placeholder="手续费" type="number" v-model="loanAmountParams.sxf" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="保证金(万元)：">
                      <el-input placeholder="保证金" type="number" v-model="loanAmountParams.bzj" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <div style="text-align:center">
                  <el-button type="primary" @click="updLoanAmount">确定</el-button>
                </div>
              </div>
            </div>
          </el-form>
          <el-button type="danger" style="margin-top:20px;margin-bottom:10px" @click="delLoan">删除选中</el-button>
          <el-table :header-cell-style="{background:'#F0FAFF',color:'#787878'}" border stripe v-loading="loading"
            element-loading-text="加载中，请稍候……" :data="loanData" tooltip-effect="dark" style="width: 100%;"
            @selection-change="loanCountChange" :summary-method="loanCount" show-summary>
            <el-table-column type="selection" width="40" align="center" />
            <el-table-column label="放款金额(万元)" :formatter="row=>Number(row.efkjy).toFixed(6)" align="right"
              prop="efkjy" />
            <el-table-column label="放款日期" width="100"
              :formatter="row=>String(row.efksj)=='null'?'':String(row.efksj).substring(0,10)" />
            <el-table-column label="利率(%)" prop="efkll" align="right"
              :formatter="row=>`${Number(row.efkll).toFixed(3)}%`" />
            <el-table-column label="手续费(万元)" :formatter="row=>Number(row.sxf).toFixed(6)" align="right" prop="sxf" />
            <el-table-column label="保证金(万元)" :formatter="row=>Number(row.bzj).toFixed(6)" align="right" prop="bzj" />
            <el-table-column label="日期" width="100"
              :formatter="row=>String(row.addTime)=='null'?'':String(row.addTime).substring(0,10)" />
            <el-table-column label="操作" align="center" width="50">
              <template slot-scope="s">
                <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
                  <i class="el-icon-edit-outline edit-btn" @click="goUpd(s.row.id)" />
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination style="text-align: end;margin-top:10px" background @size-change="loanSizeSelect"
            @current-change="loanPageSelect" :current-page="selectParams.pageIndex" :page-sizes="[10, 20, 50, 100]"
            :page-size="selectParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="loanTotal"
            v-loading="loanLoading">
          </el-pagination>
        </el-dialog>
        <!-- 资金使用情况登记表代码块 -->
        <el-divider content-position="left">
          <div style="display:flex;align-items:center">
            <span style="color: #666666;font-weight: 900;font-size: 1.2em">资金使用情况登记表</span>
            <span style="color: #666666;font-weight: 900;font-size: 1.2em;margin-left:10px"
              v-if="this.$route.query.id">监管账户余额: {{Number(addOrUpdParams.superviseBalance).toFixed(6)}}(万元)</span>
            <el-button type="success" icon="el-icon-edit-outline" circle size="mini"
              @click="()=>{updFundsTableDia = true;updFundsParams={}}" style="margin-left:10px"
              v-if="this.$route.query.id" />
          </div>
        </el-divider>
        <div v-if="!this.$route.query.id">
          <el-form :model="item" v-for="item in addOrUpdParams.rongziTicords" :key="item.rongziTicordsKey"
            label-position="right" label-width="140px" inline style="display:flex;justify-content: space-between;">
            <div>
              <el-form-item label="提款金额(万元)：">
                <el-input type="number" v-model="item.tiMoney" clearable style="width:140px" />
              </el-form-item>
              <el-form-item label="提款银行：">
                <el-input v-model="item.tiBlank" clearable style="width:140px" />
              </el-form-item>
              <el-form-item label="提款账户：">
                <el-input v-model="item.tiAccount" clearable style="width:140px" />
              </el-form-item>
              <el-form-item label="日期：">
                <el-date-picker v-model="item.tiTime" type="date" placeholder="选择日期" format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd HH:mm:ss" style="width:140px" />
              </el-form-item>
            </div>
            <div>
              <el-form-item style="text-align: end;margin-right:0">
                <el-button type="success" icon="el-icon-plus" circle size="mini" @click="addFunds" />
                <el-button type="danger" icon="el-icon-minus" circle size="mini" @click="delFunds" />
              </el-form-item>
            </div>
          </el-form>
        </div>
        <el-table :header-cell-style="{background:'#F0FAFF',color:'#787878'}" border stripe
          element-loading-text="加载中，请稍候……" :data="fundsData" tooltip-effect="dark" style="width: 100%"
          v-if="this.$route.query.id">
          <el-table-column label="提款金额(万元)" :formatter="row=>Number(row.tiMoney).toFixed(6)" align="right" />
          <el-table-column label="提款银行" prop="tiBlank" />
          <el-table-column label="提款账户" prop="tiAccount" />
          <el-table-column label="日期" :formatter="row=>String(row.tiTime)=='null'?'':String(row.tiTime).substring(0,10)"
            width="100" align="center" />
        </el-table>
        <!-- 资金使用修改对话框 -->
        <el-dialog title="新沂市城市投资发展有限公司内部办公平台" :visible.sync="updFundsTableDia" :close-on-click-modal="false">
          <el-form :model="updFundsParams" label-width="130px">
            <div style="border:#CCCCCC 1px solid;margin-top:10px">
              <div
                style="height: 35px;line-height: 35px;font-size: 14px;font-weight: bold;padding-left: 15px;color: #5a5a5a;border-bottom: 1px solid #ccc;box-shadow: inset 0 0 0px 1px #FFF;border-radius: 4px 4px 0 0;background:#F8F8F8">
                资金使用情况登记表编辑</div>
              <div style="padding:10px 20px">
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="提款金额(万元)：">
                      <el-input placeholder="提款金额" type="Number" v-model="updFundsParams.tiMoney" clearable />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="提款银行：">
                      <el-input placeholder="提款银行" v-model="updFundsParams.tiBlank" clearable />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="提款账户：">
                      <el-input placeholder="提款账户" v-model="updFundsParams.tiAccount" clearable />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="日期：">
                      <el-date-picker type="date" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss"
                        v-model="updFundsParams.tiTime" clearable style="width:100%">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
                <div style="text-align:center">
                  <el-button type="primary" @click="setFundRecords">确定</el-button>
                </div>
              </div>
            </div>
          </el-form>
          <el-button type="danger" style="margin:10px 0" @click="delFundRecords">删除选中</el-button>
          <el-table :header-cell-style="{background:'#F0FAFF',color:'#787878'}" border stripe v-loading="loading"
            element-loading-text="加载中，请稍候……" :data="fundsData" tooltip-effect="dark" style="width: 100%"
            @selection-change="fundRecordsChange" :summary-method="fundsCount" show-summary>
            <el-table-column type="selection" width="40" align="center" />
            <el-table-column label="提款金额(万元)" :formatter="row=>Number(row.tiMoney).toFixed(6)" align="right"
              prop="tiMoney" />
            <el-table-column label="提款银行" prop="tiBlank" />
            <el-table-column label="提款账户" prop="tiAccount" />
            <el-table-column label="日期" align="center" prop="tiAccount"
              :formatter="row=>String(row.tiTime)=='null'?'':String(row.tiTime).substring(0,10)" width="100" />
            <el-table-column label="操作" align="center" width="50">
              <template slot-scope="s">
                <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
                  <i class="el-icon-edit-outline edit-btn" @click="getFundRecordsInfo(s.row.tiid)" />
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination style="text-align: end;margin-top:10px" background @size-change="fundsSizeSelect"
            @current-change="fundsPageSelect" :current-page="fundsSelectParams.pageIndex"
            :page-sizes="[10, 20, 50, 100]" :page-size="fundsSelectParams.pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="fundsTotal">
          </el-pagination>
        </el-dialog>
        <div v-if="addOrUpdParams.rongZiEntityInfo.kxd">
          <el-divider content-position="left">
            <span style="color: #666666;font-weight: 900;font-size: 1.2em">续贷</span>
          </el-divider>
          <el-form :model="item" v-for="item in addOrUpdParams.rongziXudais" :key="item.rongziXudaisKey"
            label-position="right" label-width="140px" inline style="display:flex;justify-content: space-between;">
            <div>
              <el-form-item label="续贷金额(万元)：">
                <el-input type="number" v-model="item.efkjy" clearable style="width:140px" />
              </el-form-item>
              <el-form-item label="续贷开始：">
                <el-date-picker v-model="item.efksj" type="date" placeholder="选择日期" format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd HH:mm:ss" style="width:140px" />
              </el-form-item>
              <el-form-item label="续贷结束：">
                <el-date-picker v-model="item.ejzsj" type="date" placeholder="选择日期" format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd HH:mm:ss" style="width:140px" />
              </el-form-item>
            </div>
            <div>
              <el-form-item style="text-align: end;margin-right:0">
                <el-button type="success" icon="el-icon-plus" circle size="mini" @click="addRenew" />
                <el-button type="danger" icon="el-icon-minus" circle size="mini" @click="delRenew" />
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div v-if="addOrUpdParams.rongZiEntityInfo.dy">
          <el-divider content-position="left">
            <span style="color: #666666;font-weight: 900;font-size: 1.2em">抵质押物</span>
          </el-divider>
          <el-form :model="item" v-for="item in addOrUpdParams.rongziDiyawus" :key="item.rongziDiyawusKey"
            label-position="right" label-width="140px" inline>
            <div>
              <el-form-item label="抵质押物类型：">
                <DiZhiYaLeiXing v-model="item.zclb" style="width:140px" />
              </el-form-item>
              <el-form-item label="证件编号：">
                <el-input v-model="item.zjbh" clearable style="width:140px" />
              </el-form-item>
              <el-form-item label="* 抵质押物名称：" class="dzyName">
                <el-input v-model="item.zcmc" clearable style="width:140px" />
              </el-form-item>
              <el-form-item label="土地证号：" v-if="item.zclb==1">
                <el-autocomplete class="inline-input" v-model="item.dkh" :fetch-suggestions="querySearch"
                  style="width:140px" :trigger-on-focus="false" />
                <!-- <el-input v-model="" clearable style="width:140px" /> -->
              </el-form-item>
              <el-form-item label="抵质押日期起：">
                <el-date-picker v-model="item.dyrq" type="date" placeholder="选择日期" format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd HH:mm:ss" style="width:140px" />
              </el-form-item>
            </div>
            <div style="display:flex;justify-content:space-between">
              <div>
                <el-form-item label="抵质押日期止：">
                  <el-date-picker v-model="item.dyrqz" type="date" placeholder="选择日期" format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd HH:mm:ss" style="width:140px" />
                </el-form-item>
                <el-form-item label="抵质押金额(万元)：">
                  <el-input type="number" v-model="item.dyje" clearable style="width:140px" />
                </el-form-item>
              </div>
              <div style="text-align: end;">
                <el-form-item style="margin-right:0">
                  <el-button type="success" icon="el-icon-plus" circle size="mini" @click="addCollateral" />
                  <el-button type="danger" icon="el-icon-minus" circle size="mini" @click="delCollateral" />
                </el-form-item>
              </div>
            </div>
          </el-form>
        </div>
        <el-form-item style="text-align: center;margin-top:20px">
          <el-button type="primary" @click="addManagementParameters">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import publicMixin from "@/mixin/publicMixin";
import GongSi from "@/myComponents/GongSi";
import ZhuTi from "@/myComponents/ZhuTi";
import LeiXing from "@/myComponents/LeiXing";
import BiZhong from "@/myComponents/BiZhong";
import PinLv from "@/myComponents/PinLv";
import HuanKuanFangShi from "@/myComponents/HuanKuanFangShi";
import LiXiHuanKuanFangShi from "@/myComponents/LiXiHuanKuanFangShi";
import MoShi from "@/myComponents/MoShi";
import BaoGao from "@/myComponents/BaoGao";
import ZeRenRen from "@/myComponents/ZeRenRen";
import KeShi from "@/myComponents/KeShi";
import guanLi from "@/api/guanLi";
import index from "@/api/index";
import { isNull, tableTotal, templateDownload } from "@/utils/utils";
import DiZhiYaLeiXing from "@/myComponents/DiZhiYaLeiXing";
import ShangChuan from "@/myComponents/ShangChuan";
export default {
  data() {
    return {
      /* 添加/修改参数 */ addOrUpdParams: {
        rongZiEntityInfo: {
          dkrqq: "",
          dkrqz: "",
        },
        rongziFangdais: [
          {
            efkjy: "",
            efksj: "",
            efkll: "",
            sxf: 0,
            bzj: 0,
            rongziFangdaisKey: "rongziFangdais",
          },
        ],
        rongziTicords: [
          {
            tiMoney: "",
            tiBlank: "",
            tiAccount: "",
            tiTime: "",
            rongziTicordsKey: "rongziTicords",
          },
        ],
        rongziXudais: [
          {
            efkjy: "",
            efksj: "",
            ejzsj: "",
            rongziXudaisKey: "rongziXudais",
          },
        ],
        rongziDiyawus: [
          {
            rongziDiyawusKey: "rongziDiyawus",
            zcmc: "",
            zclb: "",
            zjbh: "",
            dkh: "",
            dyrq: "",
            dyrqz: "",
            dyje: "",
          },
        ],
      },
      /* 添加/修改校验 */ rules: {
        hkplid: [
          { required: true, message: "请选择首次付息频率", trigger: "change" },
        ],
        zwmc: [{ required: true, message: "请输入债务名称", trigger: "blur" }],
        qdrq: [
          {
            required: true,
            message: "请选择签订日期",
            trigger: "change",
          },
        ],
        sxje: [{ required: true, message: "请输入授信金额", trigger: "blur" }],
        jinRongJiGou: [
          { required: true, message: "请输入金融机构", trigger: "blur" },
        ],
        lilv: [{ required: true, message: "请输入合同利率", trigger: "blur" }],
        hkr: [
          { required: true, message: "请输入付息日", trigger: "blur" },
          {
            pattern: /^(([1-9])|(1)[0-9]|(2)[0-8])$/g,
            message: "付息日只能为每月的1号-28号",
            trigger: "blur",
          },
        ],
        schkrq: [
          {
            required: true,
            message: "请选择首次付息日期",
            trigger: "change",
          },
        ],
        bjhkfsmc: [
          { required: true, message: "请选择本金还款方式", trigger: "change" },
        ],
        lxhkfsmc: [
          { required: true, message: "请选择利息还款方式", trigger: "change" },
        ],
        dkrqq: [
          {
            required: true,
            message: "请选择贷款日期",
            trigger: "change",
          },
        ],
        dkrqz: [
          {
            required: true,
            message: "请选择贷款日期止",
            trigger: "change",
          },
        ],
        zrr: [{ required: true, message: "请选择责任人", trigger: "change" }],
      },
      /* 期限(天) */ deadlineTian: 0,
      /* 期限(月) */ deadlineYue: 0,
      /* mixin参数 */ mixinParams: { api: guanLi },
      /* 放款金额对话框 */ loanAmountDia: false,
      /* 放款金额参数 */ loanAmountParams: {},
      /* 放款金额分页参数 */ selectParams: {
        pageIndex: 1,
        pageSize: 20,
        rongziId: this.$route.query.id,
      },
      /* 放款金额删除参数 */ ids: "",
      /* 放款金额数据 */ loanData: [],
      /* 放款金额总条数 */ loanTotal: 0,
      /* 放款金额加载中 */ loanLoading: false,
      /* 修改资金对话框 */ updFundsTableDia: false,
      /* 修改资金参数 */ updFundsParams: {},
      /* 资金记录查询参数 */ fundsSelectParams: { pageIndex: 1, pageSize: 20 },
      /* 资金记录总条数 */ fundsTotal: 0,
      /* 资金记录加载中 */ fundsLoading: false,
      /* 资金记录数据 */ fundsData: [],
      /* 资金删除参数 */ delFundsIds: [],
      /* 放款删除总额 */ ttld: "",
      /* 放款金额备用 */ las: "",
      /* 资金金额备用 */ raof: "",
      /* 资金删除总额 */ tfd: "",
      /* 建议 */ restaurants: "",
      /* 融资类型 */ typeFinancing: [],
    };
  },
  methods: {
    /* 模板下载 */ mbxz() {
      let data = {
        method: "GET",
        url: `${this.$store.state.upload.uploadHost}financing/rongziFangdai/loadTemp`,
        fileName: "放款金额.xls",
      };
      templateDownload(data);
    },
    /* 放款金额默认值 */ setSXJE() {
      this.addOrUpdParams.rongziFangdais[0].efkjy = this.addOrUpdParams.rongZiEntityInfo.sxje;
    },
    /* 获取建议 */ getSearchEngineLandNo() {
      index.getSearchEngineLandNo().then((res) => {
        this.restaurants = res.data;
      });
    },
    /* 分割取值 */ createFilter(queryString) {
      return (restaurant) => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    /* 返回的建议数据 */ querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      cb(results);
    },
    /* 更改放款频率 */ setLendingFrequency(val) {
      this.addOrUpdParams.rongziFangdais.forEach((item) => {
        item.efkll = val;
      });
    },
    /* 资金记录选中 */ fundRecordsChange(val) {
      this.delFundsIds = [];
      this.delFundsIds = val.map((v) => v.tiid);
      this.tfd = val.map((v) => v.tiMoney);
    },
    /* 删除资金记录 */ delFundRecords() {
      if (this.delFundsIds == "") this.$message.error("请至少选择一条数据");
      else
        this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          guanLi.delFundRecords(this.delFundsIds).then((res) => {
            this.$message.success("删除成功");
            this.tfd.forEach((item) => {
              this.addOrUpdParams.superviseBalance += item;
            });
            this.fundRecordsTable();
            this.financingInfo();
          });
        });
    },
    /* 资金记录详细 */ getFundRecordsInfo(id) {
      guanLi.getFundRecordsInfo(id).then((res) => {
        this.updFundsParams = res.data;
        this.raof = this.updFundsParams.tiMoney;
      });
    },
    /* 资金记录合计 */ fundsCount(param) {
      return tableTotal(param, ["提款金额(万元)"]);
    },
    /* 资金分页查询 */ fundsPageSelect(page) {
      this.selectParams.pageIndex = page;
      this.fundRecordsTable();
    },
    /* 资金更改每页查询条数 */ fundsSizeSelect(size) {
      this.selectParams.pageSize = size;
      this.fundRecordsTable();
    },
    /* 资金使用记录表格 */ fundRecordsTable() {
      this.fundsLoading = true;
      this.fundsSelectParams.rongziId = this.$route.query.id;
      guanLi.getFundRecords(this.fundsSelectParams).then((res) => {
        this.fundsData = res.data.records;
        this.fundsLoading = false;
        this.fundsTotal = res.data.total;
      });
    },
    /* 添加/修改资金使用记录 */ setFundRecords() {
      this.updFundsParams.rongziId = this.$route.query.id;
      guanLi.setFundRecords(this.updFundsParams).then((res) => {
        if (this.updFundsParams.tiid) {
          if (this.updFundsParams.tiMoney > this.raof) {
            this.addOrUpdParams.superviseBalance =
              this.addOrUpdParams.superviseBalance -
              (this.updFundsParams.tiMoney - this.raof);
          } else {
            this.addOrUpdParams.superviseBalance =
              this.addOrUpdParams.superviseBalance +
              (this.raof - this.updFundsParams.tiMoney);
          }
        } else {
          this.addOrUpdParams.superviseBalance -= this.updFundsParams.tiMoney;
        }
        this.$message.success("操作成功");
        this.updFundsParams = {};
        this.fundRecordsTable();
        // this.financingInfo();
      });
    },
    /* 更改放款金额每页展示的数量 */ loanSizeSelect(size) {
      this.selectParams.pageSize = size;
      this.getLoan();
    },
    /* 放款金额分页查询 */ loanPageSelect(page) {
      this.selectParams.pageIndex = page;
      this.getLoan();
    },
    /* 删除放款金额 */ delLoan() {
      if (isNull(this.ids)) this.$message.error("请至少选择一条数据");
      else
        this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          guanLi.delLoan(this.ids).then((res) => {
            this.$message.success("删除成功");
            this.ttld.forEach((item) => {
              this.addOrUpdParams.superviseBalance -= item;
            });
            this.getLoan();
          });
        });
    },
    /* 放款选中 */ loanCountChange(val) {
      this.ids = [];
      this.ttld = [];
      this.ids = val.map((v) => v.id);
      this.ttld = val.map((v) => v.efkjy);
    },
    /* 放款金额合计 */ loanCount(param) {
      return tableTotal(param, [
        "放款金额(万元)",
        "手续费(万元)",
        "保证金(万元)",
      ]);
    },
    /* 修改前置(放款金额详细) */ goUpd(id) {
      guanLi.loanInfo(id).then((res) => {
        this.loanAmountParams = res.data;
        this.las = res.data.efkjy;
      });
    },
    /* 添加/修改放款金额 */ updLoanAmount() {
      this.loanAmountParams.rongziId = this.$route.query.id;
      guanLi.setLoan(this.loanAmountParams).then((res) => {
        this.$message.success("操作成功");
        if (!this.loanAmountParams.id) {
          this.addOrUpdParams.superviseBalance += parseInt(
            this.loanAmountParams.efkjy
          );
        } else {
          if (this.las > this.loanAmountParams.efkjy) {
            this.addOrUpdParams.superviseBalance -=
              parseInt(this.las) - parseInt(this.loanAmountParams.efkjy);
          } else {
            this.addOrUpdParams.superviseBalance +=
              parseInt(this.loanAmountParams.efkjy) - parseInt(this.las);
          }
        }
        this.loanAmountParams = {};
        this.getLoan();
      });
    },
    /* 删除抵质押物 */ delCollateral() {
      if (this.addOrUpdParams.rongziDiyawus.length == 1)
        this.$message.error("至少保留一个");
      else this.addOrUpdParams.rongziDiyawus.pop();
    },
    /* 添加抵质押物 */ addCollateral() {
      this.addOrUpdParams.rongziDiyawus.push({
        zclb: "",
        zjbh: "",
        dkh: "",
        dyrq: "",
        dyrqz: "",
        dyje: "",
      });
    },
    /* 删除续贷 */ delRenew() {
      if (this.addOrUpdParams.rongziXudais.length == 1)
        this.$message.error("至少保留一个");
      else this.addOrUpdParams.rongziXudais.pop();
    },
    /* 添加续贷 */ addRenew() {
      this.addOrUpdParams.rongziXudais.push({
        eFkjy: "",
        eFksj: "",
        eJzsj: "",
      });
    },
    /* 删除记录使用情况 */ delFunds() {
      if (this.addOrUpdParams.rongziTicords.length == 1)
        this.$message.error("至少保留一个");
      else this.addOrUpdParams.rongziTicords.pop();
    },
    /* 添加记录使用情况 */ addFunds() {
      this.addOrUpdParams.rongziTicords.push({
        tiMoney: "",
        tiBlank: "",
        tiAccount: "",
        tiTime: "",
      });
    },
    /* 删除放款金额 */ delLoanAmount() {
      if (this.addOrUpdParams.rongziFangdais.length == 1)
        this.$message.error("至少保留一个");
      else this.addOrUpdParams.rongziFangdais.pop();
    },
    /* 添加放款金额 */ addLoanAmount() {
      this.addOrUpdParams.rongziFangdais.push({
        eFkjy: "",
        eFksj: "",
        eFkll: "",
        sxf: "",
        bzj: "",
      });
    },
    /* 添加管理参数 */ addManagementParameters() {
      if (this.publicRules("addOrUpdParams")) {
        let start = this.addOrUpdParams.rongZiEntityInfo.dkrqq;
        let end = this.addOrUpdParams.rongZiEntityInfo.dkrqz;
        let dy = this.addOrUpdParams.rongZiEntityInfo.dy;
        let dsf = this.addOrUpdParams.rongZiEntityInfo.dsf;
        let zqgd = this.addOrUpdParams.rongZiEntityInfo.zqgd;
        let kxd = this.addOrUpdParams.rongZiEntityInfo.kxd;
        if (dy) {
          for (let i of this.addOrUpdParams.rongziDiyawus) {
            if (i.zcmc == "" || i.zcmc == null) {
              this.$message.error("抵质押物名称为必填");
              return;
            }
          }
        }
        if (start >= end) {
          this.$message.error("贷款日期止必须大于贷款日期");
          return;
        }
        this.addOrUpdParams.rongZiEntityInfo.dkrqz = end.substring(0, 10);
        this.addOrUpdParams.rongZiEntityInfo.qx = this.deadlineTian;
        this.addOrUpdParams.rongZiEntityInfo.qxy = this.deadlineYue;
        this.addOrUpdParams.rongZiEntityInfo.dkrqz += " 23:59:59";
        this.addOrUpdParams.rongZiEntityInfo.dsf = dsf ? 1 : 0;
        this.addOrUpdParams.rongZiEntityInfo.dy = dy ? 1 : 0;
        this.addOrUpdParams.rongZiEntityInfo.zqgd = zqgd ? 1 : 0;
        this.addOrUpdParams.rongZiEntityInfo.kxd = kxd ? 1 : 0;
        if (
          !isNull(this.addOrUpdParams.rongziFangdais) &&
          !this.$route.query.id
        )
          for (let i of this.addOrUpdParams.rongziFangdais) {
            if (isNull(i.efkjy)) {
              this.$message.error("放款金额不能为空");
              return;
            }
            if (isNull(i.efksj)) {
              this.$message.error("放款时间不能为空");
              return;
            }
          }
        if (!isNull(this.addOrUpdParams.rongziTicords)) {
          this.addOrUpdParams.rongziTicords.forEach((item, index) => {
            if (isNull(item.tiMoney)) {
              if (isNull(item.tiBlank)) {
                if (isNull(item.tiAccount)) {
                  if (isNull(item.tiTime)) {
                    this.addOrUpdParams.rongziTicords[index] = null;
                  }
                }
              }
            }
          });
        }
        let data = [];
        if (!isNull(this.addOrUpdParams.rongziTicords)) {
          this.addOrUpdParams.rongziTicords.forEach((item, index) => {
            if (item != null) {
              data.push(item);
            }
          });
        }
        this.addOrUpdParams.rongziTicords = data;
        let url = {
          path: "/rongZiGuanLi/guanLi",
          query: this.$route.query,
        };
        // this.addOrUpdParams
        if (this.$route.query.id) {
          this.addOrUpdParams.rongziFangdais = this.loanData;
          this.addOrUpdParams.rongziTicords = this.fundsData;
        }
        this.publicAdd(
          "addManagementParameters",
          this.addOrUpdParams,
          url,
          false
        );
      }
    },
    /* 贷款日期止校验 */ loanDateVerification() {
      let [start, end] = [
        this.addOrUpdParams.rongZiEntityInfo.dkrqq,
        this.addOrUpdParams.rongZiEntityInfo.dkrqz,
      ];
      this.addOrUpdParams.rongziFangdais[0].efksj = this.addOrUpdParams.rongZiEntityInfo.dkrqq;
      if (start != "" && start != null && end != "" && end != null) {
        if (start >= end) {
          this.$message.error("贷款日期止必须大于贷款日期");
          return false;
        } else {
          let dataYue = 0;
          let ms = new Date(end).getTime() - new Date(start).getTime();
          let tian = parseInt(ms / 1000 / 60 / 60 / 24 + 1);
          this.deadlineTian = tian;
          let nian =
            new Date(end).getFullYear() - new Date(start).getFullYear();
          let yue =
            new Date(end).getMonth() + 1 - (new Date(start).getMonth() + 1);
          let ri = new Date(end).getDate() - new Date(start).getDate();
          if (ri > 0) dataYue += nian * 12 + yue + 1;
          else dataYue += nian * 12 + yue;
          this.deadlineYue = dataYue;
        }
      }
    },
    /* 融资详细 */ financingInfo() {
      guanLi.getFinancingInfo(this.$route.query.id).then((res) => {
        let zqgd = res.data.rongZiEntityInfo.zqgd;
        let kxd = res.data.rongZiEntityInfo.kxd;
        let dsf = res.data.rongZiEntityInfo.dsf;
        let dy = res.data.rongZiEntityInfo.dy;
        res.data.rongZiEntityInfo.zqgd = zqgd == 1 ? true : false;
        res.data.rongZiEntityInfo.kxd = kxd == 1 ? true : false;
        res.data.rongZiEntityInfo.dsf = dsf == 1 ? true : false;
        res.data.rongZiEntityInfo.dy = dy == 1 ? true : false;
        res.data.rongZiEntityInfo.bjhkfsmc += "";
        if (isNull(res.data.rongZiEntityInfo.bjhkfsmc))
          res.data.rongZiEntityInfo.bjhkfsmc = "";
        res.data.rongZiEntityInfo.lxhkfsmc += "";
        if (isNull(res.data.rongZiEntityInfo.lxhkfsmc))
          res.data.rongZiEntityInfo.lxhkfsmc = "";
        res.data.rongZiEntityInfo.hkplid += "";
        if (isNull(res.data.rongZiEntityInfo.hkplid))
          res.data.rongZiEntityInfo.hkplid = "";
        res.data.rongZiEntityInfo.zrr += "";
        if (isNull(res.data.rongZiEntityInfo.zrr))
          res.data.rongZiEntityInfo.zrr = "";
        res.data.rongZiEntityInfo.hkModel += "";
        if (isNull(res.data.rongZiEntityInfo.hkModel))
          res.data.rongZiEntityInfo.hkModel = "";
        this.deadlineTian = res.data.rongZiEntityInfo.qx;
        this.deadlineYue = res.data.rongZiEntityInfo.qxy;
        this.addOrUpdParams = res.data;
        if (!this.addOrUpdParams.rongziXudais)
          this.$set(this.addOrUpdParams, "rongziXudais", [
            {
              efkjy: "",
              efksj: "",
              ejzsj: "",
              rongziXudaisKey: "rongziXudais",
            },
          ]);
        if (!this.addOrUpdParams.rongziDiyawus)
          this.$set(this.addOrUpdParams, "rongziDiyawus", [
            {
              rongziDiyawusKey: "rongziDiyawus",
              zcmc: "",
              zclb: "",
              zjbh: "",
              dkh: "",
              dyrq: "",
              dyrqz: "",
              dyje: "",
            },
          ]);
      });
    },
    /* 放款金额表格 */ getLoan() {
      this.loanLoading = true;
      guanLi.getLoan(this.selectParams).then((res) => {
        this.loanData = res.data.records;
        this.loanTotal = res.data.total;
        this.loanLoading = false;
      });
    },
    /* 获取融资类型 */ getTypeFinancing() {
      index.getFinancingType().then((res) => {
        this.typeFinancing = this.financingTypeRecursion(res.data, [], "");
      });
    },
    /* 类型递归 */
    financingTypeRecursion(data, array, index) {
      data.forEach((item) => {
        array.push({
          pname: index + item.pname,
          pid: item.pid,
          fid: item.fid,
        });
        if (item.childrens != "") {
          index += "-";
          this.financingTypeRecursion(item.childrens, array, index);
          index = "";
        }
      });
      return array;
    },
    /* 币种默认值 */ initBz(val) {
      if (isNull(val)) {
        this.$set(this.addOrUpdParams.rongZiEntityInfo, "bz", "");
      } else {
        let arr = [];
        for (let v of Object.keys(val)) {
          arr.push({
            label: val[v],
            value: v,
          });
        }
        this.$set(this.addOrUpdParams.rongZiEntityInfo, "bz", arr[0].value);
      }
    },
    /* 还款模式 */ initMS(val) {
      if (isNull(val)) {
        this.$set(this.addOrUpdParams.rongZiEntityInfo, "hkModel", "1");
      } else {
        let arr = [];
        for (let v of Object.keys(val)) {
          arr.push({
            label: val[v],
            value: v,
          });
        }
        this.$set(
          this.addOrUpdParams.rongZiEntityInfo,
          "hkModel",
          arr[0].value
        );
      }
    },
    /* 责任科室 */ initKS(val) {
      if (isNull(val))
        this.$set(this.addOrUpdParams.rongZiEntityInfo, "zrks", "");
      else
        this.$set(this.addOrUpdParams.rongZiEntityInfo, "zrks", val[0].value);
    },
  },
  mounted() {
    /* 获取融资类型 */ this.getTypeFinancing();
    this.getSearchEngineLandNo();
    if (this.$route.query.id) {
      /* 融资详细 */ this.financingInfo();
      /* 放款金额表格 */ this.getLoan();
      /* 资金使用记录表格 */ this.fundRecordsTable();
    }
  },
  components: {
    GongSi,
    ZhuTi,
    LeiXing,
    BiZhong,
    PinLv,
    HuanKuanFangShi,
    LiXiHuanKuanFangShi,
    MoShi,
    BaoGao,
    ZeRenRen,
    KeShi,
    DiZhiYaLeiXing,
    ShangChuan,
  },
  mixins: [publicMixin],
};
</script>
<style lang="scss" scoped>
.title {
  height: 35px;
  line-height: 35px;
  font-size: 14px;
  font-weight: bold;
  padding-left: 15px;
  color: #5a5a5a;
  border: 1px solid #ccc;
  box-shadow: inset 0 0 0px 1px #fff;
  border-radius: 4px 4px 0 0;
  background: #f5f5f5;
  margin-bottom: 20px;
}
</style>
<style lang="scss">
.dzyName {
  .el-form-item__label {
    color: red;
  }
}
</style>