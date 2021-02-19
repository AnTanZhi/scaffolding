<template>
  <div class="view-container bg-gray">
    <div class="border-card">
      <header class="view-header" style="margin-bottom:0px !important">
        <div class="header-container">
          <el-form :inline="true" :model="selectParams" class="demo-form-inline">
            <div style="display:flex;justify-content: space-between;">
              <div>
                <el-form-item>
                  <LeiXing v-model="copyRzlxmc" style="width:230px" @change="setCopyRzlxmc" />
                </el-form-item>
                <el-form-item>
                  <div style="display:flex;">
                    <el-select v-model="selectParams.queryType" clearable style="width:120px">
                      <el-option value="金融机构" label="金融机构" />
                      <el-option value="融资主体" label="融资主体" />
                      <el-option value="债务名称" label="债务名称" />
                    </el-select>
                    <span v-text="`:`" style="font-size:.2rem;margin-left:.125rem;margin-right:.125rem" />
                    <el-input v-model="selectParams.queryContent" clearable style="width:140px" @input="getTablData" />
                  </div>
                </el-form-item>
                <el-form-item>
                  <BiZhong v-model="selectParams.bz" style="width:90px" @change="getTablData" />
                </el-form-item>
                <el-form-item>
                  <GongSi v-model="selectParams.suoshugs" style="width:110px" @change="getTablData" />
                </el-form-item>
                <el-form-item>
                  <el-select v-model="selectParams.jieqing" placeholder="是否结清" clearable style="width:110px"
                    @change="getTablData">
                    <el-option label="是" value="1" />
                    <el-option label="否" value="0" />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <KeShi v-model="selectParams.zrks" style="width:110px" @change="getTablData" />
                </el-form-item>
                <el-form-item>
                  <el-date-picker v-model="selectTime" type="daterange" range-separator="~" start-placeholder="贷款日期"
                    end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" style="width:240px" @change="setTime" />
                </el-form-item>
              </div>
              <div style="text-align: end;">
                <el-form-item>
                  <el-button type="primary" icon="el-icon-document-checked" @click="exportEG">导出</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" icon="el-icon-plus"
                    @click="()=> this.$router.push({path:'/rongZiGuanLi/guanLiAdd',query:{pageIndex:this.selectParams.pageIndex,pageSize:this.selectParams.pageSize}})">
                    添加
                  </el-button>
                </el-form-item>
                <el-form-item v-if="userMenu">
                  <el-button type="danger" icon="el-icon-delete" @click="delS">删除选中</el-button>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </div>
      </header>
      <section class="table-container view-section">
        <el-table :header-cell-style="{background:'#F0FAFF',color:'#787878'}" border v-loading="loading"
          element-loading-text="加载中，请稍候……" :data="tableData" tooltip-effect="dark" style="width: 100%"
          @selection-change="handleSelectionChange" :summary-method="getSummaries" show-summary
          :row-class-name="tableRowClassName" highlight-current-row>
          <el-table-column type="selection" width="40" align="center" />
          <el-table-column label="融资主体" prop="rzztName" width="260" show-overflow-tooltip />
          <el-table-column label="金融机构" prop="jinRongJiGou" width="260" show-overflow-tooltip />
          <el-table-column label="债务名称" width="350" prop="zwmc" show-overflow-tooltip>
            <template slot-scope="s">
              <div style="display:flex;justify-content: space-between;">
                <el-link type="primary" :underline="false" @click="getFinancingInfo(s.row.id)">{{s.row.zwmc}}</el-link>
                <el-link type="primary" :underline="false" @click="repaymentPlan(s.row.id)"
                  style="text-align:right;color:red">[还款计划]</el-link>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="贷款日期" prop="dkrqq" width="100" :formatter="setDkrqq" />
          <el-table-column label="贷款日期止" prop="dkrqz" width="100" :formatter="setDkrqz" />
          <el-table-column label="贷款期限(月)" prop="qxy" width="110" align="center" />
          <el-table-column label="授信金额(万元)" prop="sxje" width="180" align="right"
            :formatter="row=>Number(row.sxje).toFixed(6)" />
          <el-table-column label="放款金额(万元)" prop="dkje" width="180" align="right"
            :formatter="row=>Number(row.dkje).toFixed(6)" />
          <el-table-column label="本期余额(万元)" width="180" align="right" prop="balance"
            :formatter="row=>Number(row.balance).toFixed(6)" />
          <el-table-column label="利率(%)" align="right" width="100" show-overflow-tooltip
            :formatter="row=>Number(row.lilv).toFixed(3)+'%'" />
          <el-table-column label="综合成本(%)" width="110" align="right"
            :formatter="row=>Number(row.ptlv).toFixed(3)+'%'" />
          <el-table-column label="币种" prop="bzName" align="center" width="70" />
          <el-table-column label="责任人" prop="zrrName" width="100" show-overflow-tooltip align="center" />
          <el-table-column label="是否结清" prop="jieqingmc" align="center" />
          <el-table-column width="100" label="操作" align="center" fixed="right">
            <template slot-scope="s">
              <el-tooltip class="item" effect="dark" content="编辑" placement="bottom"
                v-if="(userInfo.userId==s.row.zrr)||userMenu">
                <i class="el-icon-edit-outline edit-btn" @click="goUpd(s.row.id)" />
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="bottom"
                v-if="(userInfo.userId==s.row.zrr)||userMenu">
                <i class="el-icon-delete edit-btn" @click="publicDel('delFinancing', [s.row.id])" />
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="结清" placement="bottom"
                v-if="(userInfo.userId==s.row.zrr&&s.row.jieqing==0)||(userMenu&&s.row.jieqing==0)">
                <i class="el-icon-edit edit-btn" @click="settile(s.row)" />
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </section>
      <el-pagination style="text-align: end;" background @size-change="publicSizeSelect"
        @current-change="publicPageSelect" :current-page="selectParams.pageIndex" :page-sizes="[10, 20, 50, 100]"
        :page-size="selectParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" />
    </div>
    <el-dialog title="贷款单详细" :visible.sync="loanNoteDia" :close-on-click-modal="false">
      <el-form :model="financingInfo" label-width="150px" class="demo-ruleForm">
        <el-row>
          <el-col :span="12">
            <el-form-item label="合同编号：">
              <el-input v-model="financingInfo.dkdbhs" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="债务名称：" prop="zwmc">
              <el-input v-model="financingInfo.zwmc" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="还款账号：">
              <el-input v-model="financingInfo.hkzh" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="还款银行：">
              <el-input v-model="financingInfo.hkyh" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="所属公司：">
              <GongSi v-model="financingInfo.suoshugs" style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="融资主体：">
              <ZhuTi v-model="financingInfo.rzzt" style="width:100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="贷款日期起：" prop="dkrqq">
              <el-date-picker v-model="financingInfo.dkrqq" type="date" placeholder="选择日期" format="yyyy-MM-dd"
                value-format="yyyy-MM-dd HH:mm:ss" style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="贷款日期止：" prop="dkrqz">
              <el-date-picker v-model="financingInfo.dkrqz" type="date" placeholder="选择日期" format="yyyy-MM-dd"
                value-format="yyyy-MM-dd HH:mm:ss" style="width:100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="融资类型：">
              <LeiXing v-model="financingInfo.rzlxmc" :isMultiple="false" style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="签订日期：" prop="qdrq">
              <el-date-picker v-model="financingInfo.qdrq" type="date" placeholder="选择日期" format="yyyy-MM-dd"
                value-format="yyyy-MM-dd HH:mm:ss" style="width:100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="期限(天)：">
              <span>{{financingInfo.qx}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="期限(月)：">
              <span>{{financingInfo.qxy}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="币种：">
              <BiZhong v-model="financingInfo.bz" style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="贷款周期固定：">
              <el-checkbox v-model="financingInfo.zqgd" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="授信金额：" prop="sxje">
              <el-input v-model="financingInfo.sxje" type="number" style="margin-right:20px;width:80%" clearable />[万元]
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="金融机构：" prop="jinRongJiGou">
              <el-input v-model="financingInfo.jinRongJiGou" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="合同利率(%)：" prop="lilv">
              <el-input v-model="financingInfo.lilv" type="number" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="综合成本(%)：">
              <el-input v-model="financingInfo.ptlv" type="number" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="付息频率：">
              <PinLv v-model="financingInfo.hkplid" style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="付息日：" prop="hkr">
              <el-input v-model="financingInfo.hkr" type="number" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="首次付息日期：" prop="schkrq">
              <el-date-picker v-model="financingInfo.schkrq" type="date" placeholder="选择日期" format="yyyy-MM-dd"
                value-format="yyyy-MM-dd HH:mm:ss" style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="可续贷：">
              <el-checkbox v-model="financingInfo.kxd" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="本金还款方式：" prop="bjhkfsmc">
              <HuanKuanFangShi v-model="financingInfo.bjhkfsmc" style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="利息还款方式：" prop="lxhkfsmc">
              <LiXiHuanKuanFangShi v-model="financingInfo.lxhkfsmc" style="width:100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="担保方式：">
              <el-checkbox v-model="financingInfo.dsf">担保</el-checkbox>
              <el-checkbox v-model="financingInfo.dy">抵质押</el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="还款模式：">
              <MoShi v-model="financingInfo.hkModel" style="width:100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="financingInfo.dsf">
          <el-col :span="8">
            <el-form-item label="担保方：">
              <el-input v-model="financingInfo.dbrmc" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="担保协议号：">
              <el-input v-model="financingInfo.dbxyh" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="征信报告：">
              <BaoGao v-model="financingInfo.dbrmczx" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="financingInfo.dsf">
          <el-col :span="8">
            <el-form-item label="担保方2：">
              <el-input v-model="financingInfo.dbrmc2" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="担保协议号：">
              <el-input v-model="financingInfo.dbxyh2" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="征信报告：">
              <BaoGao v-model="financingInfo.dbrmczx2" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="保证金(万元)：">
              <el-input v-model="financingInfo.bzj" type="number" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手续费(万元)：">
              <el-input v-model="financingInfo.sxf" type="number" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="监管账户：">
              <el-input v-model="financingInfo.jianGuanZhangHu" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="监管银行：">
              <el-input v-model="financingInfo.jianGuanYinHang" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="责任人：">
              <ZeRenRen v-model="financingInfo.zrr" style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="责任科室：">
              <KeShi v-model="financingInfo.zrks" style="width:100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注：">
              <el-input type="textarea" :rows="5" v-model="financingInfo.bzcontext">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-divider content-position="left">
        <div style="display:flex;align-items:center">
          <span style="color: #666666;font-weight: 900;font-size: 1.2em">放款金额</span>
          <el-button type="success" icon="el-icon-edit-outline" circle size="mini" style="margin-left:10px"
            @click="()=>{loanAmountDia=true;loanAmountParams={}}" />
        </div>
      </el-divider>
      <el-table :header-cell-style="{background:'#F0FAFF',color:'#787878'}" border stripe
        element-loading-text="加载中，请稍候……" :data="loanData" tooltip-effect="dark" style="width: 100%" v-if="loanData">
        <el-table-column label="放款金额(万元)" :formatter="row=>Number(row.efkjy).toFixed(6)" align="right" />
        <el-table-column label="放款时间" :formatter="row=>String(row.efksj)=='null'?'':String(row.efksj).substring(0,10)"
          align="center" width="100" />
        <el-table-column label="放款利率" :formatter="row=>Number(row.efkll).toFixed(3)+'%'" align="right" />
        <el-table-column label="手续费(万元)" :formatter="row=>Number(row.sxf).toFixed(6)" align="right" />
        <el-table-column label="保证金(万元)" :formatter="row=>Number(row.bzj).toFixed(6)" align="right" />
        <el-table-column label="放款凭证号" prop="fkpz" width="100" align="center" show-overflow-tooltip>
          <template slot-scope="s">
            <el-tooltip class="item" effect="dark" content="添加" placement="bottom" v-if="s.row.fkpz==null">
              <i class="el-icon-plus edit-btn" @click="goAddLVN(s.row.id)" />
            </el-tooltip>
            <span v-if="s.row.fkpz!=null">{{s.row.fkpz}}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog width="30%" title="放款凭证号" :visible.sync="lvnDia" append-to-body>
        <el-form :model="lvnParams" label-width="120px">
          <el-form-item label="放款金额(万元)：">
            <el-input v-model="lvnParams.efkjy" placeholder="放款金额" />
          </el-form-item>
          <el-form-item label="放款凭证号：">
            <el-input v-model="lvnParams.fkpz" placeholder="放款凭证号" />
          </el-form-item>
          <div style="text-align: center;">
            <el-button type="primary" @click="addLVN">确定</el-button>
          </div>
        </el-form>
      </el-dialog>
      <!-- 放款金额详细弹出框 -->
      <el-dialog width="40%" title="放款金额编辑" :visible.sync="loanAmountDia" append-to-body :close-on-click-modal="false">
        <el-form :model="loanAmountParams" label-width="130px" style="margin-bottom:20px" :rules="laRules"
          ref="loanAmountParams">
          <div style="display:flex;justify-content:space-between">
            <ShangChuan
              :url="`${this.$store.state.upload.uploadHost}financing/rongziFangdai/upload?rongziId=${shangChuanId}`"
              @getTable="getFinancingInfo(shangChuanId)" />
            <el-button type="primary" @click="mbxz">模板下载</el-button>
          </div>
          <div style="border:#CCCCCC 1px solid;margin-top:10px">
            <div
              style="height: 35px;line-height: 35px;font-size: 14px;font-weight: bold;padding-left: 15px;color: #5a5a5a;border-bottom: 1px solid #ccc;box-shadow: inset 0 0 0px 1px #FFF;border-radius: 4px 4px 0 0;background:#F8F8F8">
              放款金额编辑</div>
            <div style="padding:10px 20px">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="放款金额(万元)：" prop="efkjy">
                    <el-input placeholder="放款金额" type="Number" v-model="loanAmountParams.efkjy" clearable
                      style="width:100%" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="利率(%)：" prop="efkll">
                    <el-input placeholder="利率" type="number" v-model="loanAmountParams.efkll" clearable
                      style="width:100%" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="放款日期：" prop="efksj">
                    <el-date-picker v-model="loanAmountParams.efksj" type="date" placeholder="选择日期"
                      value-format="yyyy-MM-dd HH:mm:ss" clearable style="width:100%" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="手续费(万元)：">
                    <el-input placeholder="手续费" type="number" v-model="loanAmountParams.sxf" clearable
                      style="width:100%" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="保证金(万元)：">
                    <el-input placeholder="保证金" type="number" v-model="loanAmountParams.bzj" clearable
                      style="width:100%" />
                  </el-form-item>
                </el-col>
              </el-row>
              <div style="text-align:center">
                <el-button type="primary" @click="setLoan">确定</el-button>
              </div>
            </div>
          </div>
        </el-form>
        <el-button type="danger" style="margin:10px 0" @click="delLoan" v-if="loanData.length>1">删除选中</el-button>
        <el-table :header-cell-style="{background:'#F0FAFF',color:'#787878'}" border stripe v-loading="loanLoading"
          element-loading-text="加载中，请稍候……" :data="loanData" tooltip-effect="dark" style="width: 100%"
          @selection-change="loanCountChange" :summary-method="loanCount" show-summary>
          <el-table-column type="selection" width="40" align="center" />
          <el-table-column label="放款金额(万元)" :formatter="row=>Number(row.efkjy).toFixed(6)" align="right" prop="efkjy"
            width="120" />
          <el-table-column label="放款日期" width="100"
            :formatter="row=>String(row.efksj)=='null'?'':String(row.efksj).substring(0,10)" />
          <el-table-column label="利率(%)" prop="efkll" align="right" :formatter="row=>`${Number(row.efkll).toFixed(3)}%`"
            width="80" />
          <el-table-column label="手续费(万元)" :formatter="row=>Number(row.sxf).toFixed(6)" align="right" prop="sxf" />
          <el-table-column label="保证金(万元)" :formatter="row=>Number(row.bzj).toFixed(6)" align="right" prop="bzj" />
          <el-table-column label="日期" width="100"
            :formatter="row=>String(row.addTime)=='null'?'':String(row.addTime).substring(0,10)" />
          <el-table-column label="操作" align="center" width="50">
            <template slot-scope="s">
              <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
                <i class="el-icon-edit-outline edit-btn" @click="loanInfo(s.row.id)" />
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination style="text-align: end;margin-top:10px" background @size-change="loanSizeSelect"
          @current-change="loanPageSelect" :current-page="loanSelectParams.pageIndex" :page-sizes="[10, 20, 50, 100]"
          :page-size="loanSelectParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="loanTotal"
          v-loading="loanLoading" />
      </el-dialog>
      <el-divider content-position="left">
        <div style="display:flex;align-items:center">
          <span style="color: #666666;font-weight: 900;font-size: 1.2em">资金使用情况登记表
            监管账户余额：{{Number(escrowAccountBalance).toFixed(6)}}(万元)</span>
          <el-button type="success" icon="el-icon-edit-outline" circle size="mini" style="margin-left:10px"
            @click="()=>{fundRecordsDia=true;fundRecordsParams={}}" />
        </div>
      </el-divider>
      <el-table :header-cell-style="{background:'#F0FAFF',color:'#787878'}" border stripe
        element-loading-text="加载中，请稍候……" :data="fundRecordsInfo" tooltip-effect="dark" style="width: 100%">
        <el-table-column label="提款金额(万元)" :formatter="row=>Number(row.tiMoney).toFixed(6)" align="right" />
        <el-table-column label="提款银行" prop="tiBlank" />
        <el-table-column label="提款账户" prop="tiAccount" />
        <el-table-column label="日期" :formatter="row=>String(row.tiTime)=='null'?'':String(row.tiTime).substring(0,10)"
          align="center" width="100" />
      </el-table>
      <!-- 资金记录详细弹出框 -->
      <el-dialog width="40%" title="资金使用情况登记表编辑
" :visible.sync="fundRecordsDia" append-to-body :close-on-click-modal="false">
        <el-form :model="fundRecordsParams" label-width="130px" style="margin-bottom:20px">
          <div style="border:#CCCCCC 1px solid;margin-top:10px">
            <div
              style="height: 35px;line-height: 35px;font-size: 14px;font-weight: bold;padding-left: 15px;color: #5a5a5a;border-bottom: 1px solid #ccc;box-shadow: inset 0 0 0px 1px #FFF;border-radius: 4px 4px 0 0;background:#F8F8F8">
              资金使用情况登记表编辑</div>
            <div style="padding:10px 20px">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="提款金额(万元)：">
                    <el-input placeholder="提款金额" type="Number" v-model="fundRecordsParams.tiMoney" clearable
                      style="width:100%" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="提款银行：">
                    <el-input placeholder="提款银行" v-model="fundRecordsParams.tiBlank" clearable style="width:100%" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="提款账户：">
                    <el-input placeholder="提款账户" v-model="fundRecordsParams.tiAccount" clearable style="width:100%" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="日期：">
                    <el-date-picker v-model="fundRecordsParams.tiTime" type="date" placeholder="日期："
                      value-format="yyyy-MM-dd HH:mm:ss" clearable style="width:100%" />
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
        <el-table :header-cell-style="{background:'#F0FAFF',color:'#787878'}" border stripe v-loading="fundRecorLoading"
          element-loading-text="加载中，请稍候……" :data="fundRecordsData" tooltip-effect="dark" style="width: 100%"
          @selection-change="fundRecordsChange" :summary-method="fundRecordsCount" show-summary>
          <el-table-column type="selection" width="40" align="center" />
          <el-table-column label="提款金额(万元)" :formatter="row=>Number(row.tiMoney).toFixed(6)" align="right"
            prop="tiMoney" />
          <el-table-column label="提款银行" prop="tiBlank" />
          <el-table-column label="提款账户" prop="tiAccount" align="right" />
          <el-table-column label="日期" :formatter="row=>String(row.tiTime)=='null'?'':String(row.tiTime).substring(0,10)"
            align="center" width="100" />
          <el-table-column label="操作" align="center" width="50">
            <template slot-scope="s">
              <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
                <i class="el-icon-edit-outline edit-btn" @click="getFundRecordsInfo(s.row.tiid)" />
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination style="text-align: end;margin-top:10px" background @size-change="fundRecordsSizeSelect"
          @current-change="fundRecordsPageSelect" :current-page="fundRecordsSelectParmas.pageIndex"
          :page-sizes="[10, 20, 50, 100]" :page-size="fundRecordsSelectParmas.pageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="fundRecordsTotal" v-loading="loanLoading" />
      </el-dialog>
      <div v-if="financingInfo.dy">
        <el-divider content-position="left">
          <div style="display:flex;align-items:center">
            <span style="color: #666666;font-weight: 900;font-size: 1.2em">抵质押物</span>
          </div>
        </el-divider>
        <el-table :header-cell-style="{background:'#F0FAFF',color:'#787878'}" border stripe :data="rongziDiyawus"
          tooltip-effect="dark" style="width: 100%">
          <el-table-column label="抵质押物类型" prop="zclb" show-overflow-tooltip :formatter="setZclb" width="110" />
          <el-table-column label="证件编号" prop="zjbh" show-overflow-tooltip />
          <el-table-column label="抵质押物名称" prop="zcmc" show-overflow-tooltip />
          <el-table-column label="土地证号" prop="dkh" show-overflow-tooltip />
          <el-table-column label="抵质押日期起" prop="dyrq"
            :formatter="row=>String(row.dyrq)=='null'?'':String(row.dyrq).substring(0,10)" align="center" width="110px"
            show-overflow-tooltip />
          <el-table-column label="抵质押日期止" prop="dyrqz"
            :formatter="row=>String(row.dyrqz)=='null'?'':String(row.dyrqz).substring(0,10)" align="center"
            width="110px" show-overflow-tooltip />
          <el-table-column label="抵质押金额(万元)" prop="dyje" align="right" :formatter="row=>Number(row.dyje).toFixed(6)"
            show-overflow-tooltip />
        </el-table>
      </div>
      <div v-if="financingInfo.kxd">
        <el-divider content-position="left">
          <div style="display:flex;align-items:center">
            <span style="color: #666666;font-weight: 900;font-size: 1.2em">续贷</span>
          </div>
        </el-divider>
        <el-table :header-cell-style="{background:'#F0FAFF',color:'#787878'}" border stripe :data="rongziXudais"
          tooltip-effect="dark" style="width: 100%">
          <el-table-column label="续贷金额(万元)" prop="efkjy" :formatter="row=>Number(row.efkjy).toFixed(6)" align="right" />
          <el-table-column label="续贷开始" prop="efksj"
            :formatter="row=>String(row.efksj)=='null'?'':String(row.efksj).substring(0,10)" width="100"
            align="center" />
          <el-table-column label="续贷结束" prop="ejzsj"
            :formatter="row=>String(row.ejzsj)=='null'?'':String(row.ejzsj).substring(0,10)" width="100"
            align="center" />
        </el-table>
      </div>
    </el-dialog>
    <el-dialog title="结清" :visible.sync="settleDia" width="20%" :close-on-click-modal="false">
      <el-form :model="settleParams">
        <el-form-item label="债务名称：">
          <span>{{settleName}}</span>
        </el-form-item>
        <el-form-item label="结清时间：">
          <el-date-picker v-model="settleParams.settleTime " type="date" placeholder="选择日期" value-format="yyyy-MM-dd"
            :clearable="false" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="settleDia = false">取 消</el-button>
        <el-button type="primary" @click="settleOperating">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import publicMixin from "@/mixin/publicMixin";
import LeiXing from "@/myComponents/LeiXing";
import BiZhong from "@/myComponents/BiZhong";
import GongSi from "@/myComponents/GongSi";
import KeShi from "@/myComponents/KeShi";
import BaoGao from "@/myComponents/BaoGao";
import ShangChuan from "@/myComponents/ShangChuan";
import ZhuTi from "@/myComponents/ZhuTi";
import HuanKuanFangShi from "@/myComponents/HuanKuanFangShi";
import LiXiHuanKuanFangShi from "@/myComponents/LiXiHuanKuanFangShi";
import PinLv from "@/myComponents/PinLv";
import MoShi from "@/myComponents/MoShi";
import ZeRenRen from "@/myComponents/ZeRenRen";
import {
  isNull,
  tableTotal,
  templateDownload,
  exportMethod,
  caidan,
} from "@/utils/utils";
import index from "@/api/index";
import guanLi from "@/api/guanLi";
export default {
  data() {
    return {
      /* 上传附件 */ fujian: "",
      /* 查询参数 */ selectParams: { pageIndex: 1, pageSize: 20 },
      /* mixin参数 */ mixinParams: {
        api: guanLi,
        name: "getFinancing",
      },
      /* 校验 */ rules: {
        pname: [
          { required: true, message: "请输入类型名称", trigger: "blur" },
          { max: 25, message: "长度在最多到 25 个字符", trigger: "blur" },
        ],
      },
      /* 删除参数 */ ids: [],
      /* 是否展示更多搜索框 */ isShow: false,
      /* 查询框时间 */ selectTime: "",
      /* 贷款单详细 */ loanNoteDia: false,
      /* 放款金额对话框 */ loanAmountDia: false,
      /* 融资详细 */ financingInfo: {},
      /* 融资类型第三变量 */ copyRzlxmc: "",
      /* 放款金额表格 */ loanData: [],
      /* 放款金额修改/添加参数 */ loanAmountParams: {},
      /* 放款金额查询参数 */ loanSelectParams: {
        pageIndex: 1,
        pageSize: 20,
        rongziId: "",
      },
      /* 放款金额总条数 */ loanTotal: 0,
      /* 放款金额加载中 */ loanLoading: false,
      /* 放款金额删除id */ loanIds: [],
      /* 监管账户余额 */ escrowAccountBalance: "",
      /* 资金记录表格(详细) */ fundRecordsInfo: {},
      /* 资金记录对话框 */ fundRecordsDia: false,
      /* 资金记录添加/修改参数 */ fundRecordsParams: {},
      /* 资金记录查询参数 */ fundRecordsSelectParmas: {
        pageIndex: 1,
        pageSize: 20,
        rongziId: "",
      },
      /* 资金记录总条数 */ fundRecordsTotal: 0,
      /* 资金记录表格(接口) */ fundRecordsData: [],
      /* 资金记录加载中 */ fundRecorLoading: false,
      /* 资金记录删除ids */ fundRecorIds: [],
      /* 结清对话框 */ settleDia: false,
      /* 抵质押表格 */ rongziDiyawus: [],
      /* 续贷回显 */ rongziXudais: [],
      /* 结清-债务名称 */ settleName: "",
      /* 结清参数 */ settleParams: {},
      /* 放款凭证号对话框 */ lvnDia: false,
      /* 放款凭证号参数 */ lvnParams: {},
      /* 结清参数 */ settleParams: {},
      /* 放款金额非空 */ laRules: {
        efkjy: [{ required: true, message: "请输入放款金额", trigger: "blur" }],
        efkll: [{ required: true, message: "请输入利率(%)", trigger: "blur" }],
        efksj: [
          { required: true, message: "请选择放款日期", trigger: "change" },
        ],
      },
      /* 上传需要用的融资id */ shangChuanId: "",
      /* 用户信息 */ userInfo: {},
      /* 用户菜单 */ userMenu: false,
    };
  },
  methods: {
    /* 获取用户信息 */ getInfo() {
      index.getInfo().then((res) => {
        this.userInfo = res.data;
        index.getCurrentLoginAuthorityMenu().then((ress) => {
          caidan(ress.data, []).forEach((item) => {
            if (item.routeName == "guanLiAll" && item.isHasSys == 1) {
              this.userMenu = true;
            }
          });
        });
      });
    },
    /* 导出融资管理 */ exportEG() {
      let [
        bz,
        endDate,
        jieqing,
        queryContent,
        queryType,
        rzlxmc,
        startDate,
        suoshugs,
        zrks,
      ] = [
        `bz=${this.selectParams.bz || ""}`,
        `endDate=${this.selectParams.endDate || ""}`,
        `jieqing=${this.selectParams.jieqing || ""}`,
        `queryContent=${this.selectParams.queryContent || ""}`,
        `queryType=${this.selectParams.queryType || ""}`,
        `rzlxmc=${this.selectParams.rzlxmc || ""}`,
        `startDate=${this.selectParams.startDate || ""}`,
        `suoshugs=${this.selectParams.suoshugs || ""}`,
        `zrks=${this.selectParams.zrks || ""}`,
      ];
      /* 导出 */ exportMethod({
        url: `${this.$store.state.upload.uploadHost}system/down/rzgl`,
        method: "POST",
        params: `${bz}&${endDate}&${jieqing}&${queryContent}&${queryType}&${rzlxmc}&${startDate}&${suoshugs}&${zrks}`,
        fileName: "融资管理",
      });
    },
    /* 模板下载 */ mbxz() {
      let data = {
        method: "GET",
        url: `${this.$store.state.upload.uploadHost}financing/rongziFangdai/loadTemp`,
        fileName: "放款金额.xls",
      };
      templateDownload(data);
    },
    /* 结清 */ settleOperating() {
      let nian = new Date().getFullYear();
      let yue = new Date().getMonth();
      let ri = new Date().getDate();
      if (yue < 10) yue = `0${yue + 1}`;
      if (ri < 10) ri = `0${ri}`;
      let dqsj = `${nian}-${yue}-${ri}`;
      if (this.settleParams.settleTime < dqsj) {
        this.$confirm(
          `选中的时间(${String(this.settleParams.settleTime).substring(
            0,
            10
          )})小于当前时间(${dqsj}), 确定无误?是否继续?`,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        ).then(() => {
          this.settleParams.settleTime = String(
            this.settleParams.settleTime
          ).substring(0, 10);
          guanLi.settle(this.settleParams).then((res) => {
            this.$message.success("操作成功");
            // guanLi.generateRepaymentPlan(this.settleParams.rongziId);
            this.getTablData();
            this.settleDia = false;
          });
        });
      } else if (
        this.settleParams.settleTime > this.settleParams.loserSettleTime
      ) {
        this.$message.error("结清时间不能大于贷款日期止");
      } else {
        this.$confirm(`确定要结清吗?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.settleParams.settleTime = String(
            this.settleParams.settleTime
          ).substring(0, 10);
          guanLi.settle(this.settleParams).then((res) => {
            this.$message.success("操作成功");
            this.getTablData();
            this.settleDia = false;
          });
        });
      }
    },
    /* 初始化抵质押物类型 */ setZclb(row) {
      let map = new Map([
        [1, "土地"],
        [2, "房产"],
        [3, "股权收益权"],
        [4, "存单质押"],
        [5, "应收账款"],
      ]);
      return map.get(parseInt(row.zclb));
    },
    /* 添加放款凭证 */ addLVN() {
      if (isNull(this.lvnParams.fkpz)) {
        this.$message.error("请认真填写放款凭证号");
        return false;
      }
      guanLi.setLoan(this.lvnParams).then((res) => {
        this.$message.success("添加成功");
        this.lvnDia = false;
        this.getLoan();
      });
    },
    /* 添加放款凭证前置 */ goAddLVN(id) {
      guanLi.loanInfo(id).then((res) => {
        this.lvnParams = res.data;
        this.lvnDia = true;
      });
    },
    /* 表格变色 */ tableRowClassName({ row, rowIndex }) {
      if (row.jieqing == 1) {
        return "success-row";
      } else if (row.jieqing == 2) {
        return "warning-row";
      }
      return "";
    },
    /* 导出初始化数据 */ formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          if (j === "dkrqq" || j === "dkrqz") {
            return String(v[j]) == "null" ? "" : String(v[j]).substring(0, 10);
          }
          if (j === "sxje" || j === "dkje" || j === "balance")
            return Number(v[j]).toFixed(6);
          if (j === "lilv" || j === "ptlv")
            return Number(v[j]).toFixed(2) + "%";
          return v[j];
        })
      );
    },
    /* 导出 */ exportFM() {
      this.selectParams.pageSize = this.total;
      guanLi.getFinancing(this.selectParams).then((res) => {
        import("@/vendor/Export2Excel").then((excel) => {
          const header = [
            "融资主体",
            "金融机构",
            "债务名称",
            "贷款日期",
            "贷款日期止",
            "贷款期限(月)",
            "授信金额(万元)",
            "放款金额(万元)",
            "本期余额(万元)",
            "利率(%)",
            "综合成本(%)",
            "币种",
            "责任人",
            "是否结清",
          ];
          const filterVal = [
            "rzztName",
            "jinRongJiGou",
            "zwmc",
            "dkrqq",
            "dkrqz",
            "qxy",
            "sxje",
            "dkje",
            "balance",
            "lilv",
            "ptlv",
            "bzName",
            "zrrName",
            "jieqingmc",
          ];
          const list = res.data.records;
          const data = this.formatJson(filterVal, list);
          excel.export_json_to_excel({
            header,
            data,
            filename: "融资管理",
            autoWidth: true,
            bookType: "xlsx",
          });
        });
      });
    },
    /* 结清 */ settile(row) {
      this.settleParams = {};
      this.settleName = row.zwmc;
      this.settleDia = true;
      this.settleParams.rongziId = row.id;
      this.$set(this.settleParams, "settleTime", row.dkrqz);
      this.$set(this.settleParams, "loserSettleTime", row.dkrqz);
    },
    /* 判断表格是不是null */ isTableNull(data) {
      if (isNull(data)) return false;
      return true;
    },
    /* 还款计划 */ repaymentPlan(id) {
      this.$router.push({
        path: "/rongZiGuanLi/huanKuanJiHua",
        query: { id },
      });
    },
    /* 资金记录选中 */ fundRecordsChange(val) {
      this.fundRecorIds = [];
      this.fundRecorIds = val.map((v) => v.tiid);
    },
    /* 删除 */ delFundRecords() {
      if (isNull(this.fundRecorIds)) this.$message.error("请至少选择一条数据");
      else
        this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          guanLi.delFundRecords(this.fundRecorIds).then((res) => {
            this.$message.success("删除成功");
            this.getFinancingInfo(this.loanSelectParams.rongziId);
            this.getFundRecords();
          });
        });
    },
    /* 资金记录详细 */ getFundRecordsInfo(id) {
      guanLi.getFundRecordsInfo(id).then((res) => {
        this.fundRecordsParams = res.data;
      });
    },
    /* 添加/修改资金记录 */ setFundRecords() {
      this.fundRecordsParams.rongziId = this.loanSelectParams.rongziId;
      guanLi.setFundRecords(this.fundRecordsParams).then((res) => {
        this.$message.success("操作成功");
        this.fundRecordsParams = {};
        this.getFinancingInfo(this.loanSelectParams.rongziId);
        this.getFundRecords();
      });
    },
    /* 更改资金记录每页展示的数量 */ fundRecordsSizeSelect(size) {
      this.fundRecordsSelectParmas.pageSize = size;
      this.getFundRecords();
    },
    /* 资金记录分页查询 */ fundRecordsPageSelect(page) {
      this.fundRecordsSelectParmas.pageIndex = page;
      this.getFundRecords();
    },
    /* 资金记录合计 */ fundRecordsCount(param) {
      return tableTotal(param, ["提款金额(万元)"]);
    },
    /* 资金记录表格 */ getFundRecords() {
      this.fundRecorLoading = true;
      guanLi.getFundRecords(this.fundRecordsSelectParmas).then((res) => {
        this.fundRecordsData = res.data.records;
        this.fundRecordsTotal = res.data.total;
        this.fundRecorLoading = false;
      });
    },
    /* 放款金额详细 */ loanInfo(id) {
      guanLi.loanInfo(id).then((res) => {
        this.loanAmountParams = res.data;
      });
    },
    /* 添加/修改放款金额 */ setLoan() {
      this.loanAmountParams.rongziId = this.loanSelectParams.rongziId;
      if (this.publicRules("loanAmountParams")) {
        guanLi.setLoan(this.loanAmountParams).then((res) => {
          this.$message.success("操作成功");
          this.loanAmountParams = {};
          this.getFinancingInfo(this.loanSelectParams.rongziId);
          this.getTablData();
        });
      }
    },
    /* 更改放款金额每页展示的数量 */ loanSizeSelect(size) {
      this.loanSelectParams.pageSize = size;
      this.getLoan();
    },
    /* 放款金额分页查询 */ loanPageSelect(page) {
      this.loanSelectParams.pageIndex = page;
      this.getLoan();
    },
    /* 放款选中 */ loanCountChange(val) {
      this.loanIds = [];
      this.loanIds = val.map((v) => v.id);
    },
    /* 删除放款金额 */ delLoan() {
      if (isNull(this.loanIds)) this.$message.error("请至少选择一条数据");
      else
        this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          guanLi.delLoan(this.loanIds).then((res) => {
            this.$message.success("删除成功");
            this.getFinancingInfo(this.loanSelectParams.rongziId);
            this.getTablData();
          });
        });
    },
    /* 放款金额合计 */ loanCount(param) {
      return tableTotal(param, [
        "放款金额(万元)",
        "手续费(万元)",
        "保证金(万元)",
      ]);
    },
    /* 放款金额表格 */ getLoan() {
      this.loanLoading = true;
      guanLi.getLoan(this.loanSelectParams).then((res) => {
        this.loanData = res.data.records;
        this.loanTotal = res.data.total;
        this.loanLoading = false;
      });
    },
    /* 融资第三变量赋值 */ setCopyRzlxmc(val) {
      if (!isNull(val)) this.selectParams.rzlxmc = val.join(",");
      else this.selectParams.rzlxmc = "";
      this.getTablData();
    },
    /* 放款金额详细 */ getFinancingInfo(id) {
      this.shangChuanId = id;
      guanLi.getFinancingInfo(id).then((res) => {
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
        res.data.rongZiEntityInfo.rzlxmc += "";
        if (isNull(res.data.rongZiEntityInfo.rzlxmc))
          res.data.rongZiEntityInfo.rzlxmc = "";
        this.financingInfo = res.data.rongZiEntityInfo;
        this.fundRecordsInfo = res.data.rongziTicords;
        this.loanTable = res.data.rongziFangdais;
        this.escrowAccountBalance = res.data.superviseBalance;
        this.rongziDiyawus = res.data.rongziDiyawus;
        this.rongziXudais = res.data.rongziXudais;
        this.loanSelectParams.rongziId = id;
        this.fundRecordsSelectParmas.rongziId = id;
        /* 放款金额表格 */
        this.getLoan();
        /* 资金记录表格 */
        this.getFundRecords();
        this.loanNoteDia = true;
      });
    },
    /* 表格合计 */ getSummaries(param) {
      return tableTotal(param, [
        "授信金额(万元)",
        "放款金额(万元)",
        "本期余额(万元)",
      ]);
    },
    /* 初始化贷款日期止 */ setDkrqz(row) {
      if (isNull(String(row.dkrqz))) return "";
      else return String(row.dkrqz).substring(0, 10);
    },
    /* 初始化贷款日期 */ setDkrqq(row) {
      if (isNull(String(row.dkrqq))) return "";
      else return String(row.dkrqq).substring(0, 10);
    },
    /* 初始化时间参数 */ setTime(val) {
      if (isNull(val)) {
        this.selectParams.startDate = "";
        this.selectParams.endDate = "";
      } else {
        this.selectParams.startDate = val[0];
        this.selectParams.endDate = val[1];
      }
      this.getTablData();
    },
    /* 删除(多个) */ delS() {
      if (isNull(this.ids)) this.$message.error("请至少选择一条数据");
      else this.publicDel("delFinancing", this.ids);
    },
    /* 修改前置 */ goUpd(id) {
      this.$router.push({
        path: "/rongZiGuanLi/guanLiAdd",
        query: {
          id,
        },
      });
    },
    /* 添加融资主体 */ addLeiXing() {
      if (this.publicRules("addOrUpdateParams"))
        this.publicAdd("addFinancingBody", this.addOrUpdateParams, "");
    },
    /* 选中值 */ handleSelectionChange(val) {
      this.ids = [];
      this.ids = val.map((v) => v.id);
    },
    /* 获取表格数据 */ getTablData() {
      this.selectParams.pageIndex = 1;
      this.publicSelect();
    },
  },
  mounted() {
    /* 获取用户信息 */ this.getInfo();
    /* 获取表格数据 */ this.publicSelect();
  },
  components: {
    LeiXing,
    BiZhong,
    GongSi,
    KeShi,
    ShangChuan,
    BaoGao,
    ZhuTi,
    HuanKuanFangShi,
    LiXiHuanKuanFangShi,
    PinLv,
    MoShi,
    ZeRenRen,
  },
  mixins: [publicMixin],
};
</script>

<style lang="scss">
.el-dialog {
  .el-dialog__header {
    .el-dialog__title {
      margin-left: 0.25rem;
    }
  }
}
.el-table .warning-row {
  background: #aadafd;
}

.el-table .success-row {
  background: #bbffbb;
}
</style>