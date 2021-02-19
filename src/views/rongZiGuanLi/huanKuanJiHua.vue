<template>
  <div class="view-container bg-gray">
    <div class="border-card">
      <header class="view-header" style="margin-bottom:0px !important">
        <div class="header-container">
          <el-form :inline="true" :model="selectParams" class="demo-form-inline">
            <div style="display:flex;justify-content: space-between;">
              <div>
                <el-form-item>
                  <el-date-picker v-model="timeParams" type="daterange" range-separator="~" start-placeholder="开始日期"
                    end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" style="width:240px"
                    @change="setTimeParams" />
                </el-form-item>
              </div>
              <div style="text-align: end;">
                <el-form-item>
                  <ShangChuan @getTable="initPlan"
                    :url="`${this.$store.state.upload.uploadHost}financing/rongziHuankuan/upload?rongziId=${this.$route.query.id}`" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" icon="el-icon-document-checked" @click="exportEG">导出</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" icon="el-icon-download" @click="templateDownload">模板下载</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" icon="el-icon-money" @click="addOrUpdPrincipalManagement">本金管理</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" icon="el-icon-s-operation" @click="goAddOrUpdIr">利率调整</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button type="danger" icon="el-icon-delete" @click="delRepaymentPlan">删除选中</el-button>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </div>
      </header>
      <el-button v-for="item in pageNumberLength" :key="item" type="success" icon="el-icon-postcard"
        @click="setSheet(item)" style="margin-bottom:10px">Sheet{{item}}</el-button>
      <section class="table-container view-section" style="text-align: center">
        <el-link type="primary" style="margin:10px 0" @click="generateRepaymentPlan" v-if="!pageNumberLength>0">计算时间
          {{computingTime}} 点击重新计算
        </el-link>
        <el-table :header-cell-style="{background:'#F0FAFF',color:'#787878'}" border stripe v-loading="loading"
          element-loading-text="加载中，请稍候……" :data="tableData" tooltip-effect="dark" style="width: 100%"
          @selection-change="handleSelectionChange" :summary-method="getSummaries" show-summary>
          <el-table-column align="center"
            :label="`${financingInfo.zwmc} 还款计划 ${financingInfo.bzcontext==null?'':`(注：${financingInfo.bzcontext})`}`">
            <el-table-column type="selection" width="40" align="center" />
            <el-table-column label="计划还款日期" prop="jhhkrq"
              :formatter="row=>row.jhhkrq+''=='null'?'':String(row.jhhkrq).substring(0,10)" width="110"
              align="center" />
            <el-table-column label="贷款总额(万元)" show-overflow-tooltip :formatter="row=>Number(row.dkzy).toFixed(6)"
              align="right" />
            <el-table-column label="利率(%)" show-overflow-tooltip :formatter="row=>Number(row.lilv).toFixed(3)+'%'"
              width="80" align="center" />
            <el-table-column label="天数" show-overflow-tooltip prop="tianshu" width="50" align="center" />
            <el-table-column label="预估本金(万元)" show-overflow-tooltip prop="benjin"
              :formatter="row=>Number(row.benjin).toFixed(6)" align="right" />
            <el-table-column label="预估利息(万元)" show-overflow-tooltip prop="ykls"
              :formatter="row=>Number(row.ykls).toFixed(6)" align="right" />
            <el-table-column label="预估其他(万元)" show-overflow-tooltip prop="qita"
              :formatter="row=>Number(row.qita).toFixed(6)" align="right" />
            <el-table-column label="预估合计(万元)" show-overflow-tooltip prop="estimateSum"
              :formatter="row=>Number(row.estimateSum).toFixed(6)" align="right" />
            <el-table-column label="实还日期" :formatter="row=>row.shrq+''=='null'?'':String(row.shrq).substring(0,10)"
              width="100" align="center" />
            <el-table-column label="实还本金(万元)" show-overflow-tooltip prop="hkbj"
              :formatter="row=>row.shrq==null?'':Number(row.hkbj).toFixed(6)" align="right" />
            <el-table-column label="实还利息(万元)" show-overflow-tooltip prop="sjhkls"
              :formatter="row=>row.shrq==null?'':Number(row.sjhkls).toFixed(6)" align="right" />
            <el-table-column label="实还合计(万元)" show-overflow-tooltip prop="realSum"
              :formatter="row=>row.shrq==null?'':Number(row.realSum).toFixed(6)" align="right" />
            <el-table-column width="50" label="操作" align="center" fixed="right">
              <template slot-scope="s">
                <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
                  <i class="el-icon-edit-outline edit-btn" @click="goUpd(s.row.id)" />
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </section>
      <el-pagination style="text-align: end;" background @size-change="publicSizeSelect"
        @current-change="publicPageSelect" :current-page="selectParams.pageIndex" :page-sizes="[10, 20, 50, 100]"
        :page-size="selectParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" />
    </div>
    <!-- 本金管理对话框 -->
    <el-dialog title="本金管理" :visible.sync="principalDia" :close-on-click-modal="false">
      <div style="margin-bottom:20px">
        <el-form :model="principalManagementParams" label-position="right" label-width="120px" :rules="pmRules"
          ref="principalManagementParams">
          <el-row>
            <el-col :span="12">
              <el-form-item label="放款金额(万元)" prop="fkeFkjy">
                <el-select v-model="principalManagementParams.fangdaiId" style="width:220px" clearable>
                  <el-option v-for="item in pmSelectData" :key="item.id" :value="item.id"
                    :label="Number(item.efkjy).toFixed(6)" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="还款日期" prop="efksj">
                <el-date-picker v-model="principalManagementParams.efksj" type="date" placeholder="还款日期"
                  value-format="yyyy-MM-dd HH:mm:ss" clearable>
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="本金金额(万元)" prop="efkjy">
                <el-input v-model="principalManagementParams.efkjy" placeholder="本金金额" clearable style="width:220px" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="利率(%)">
                <el-input v-model="principalManagementParams.efkll" placeholder="利率" clearable style="width:220px" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align:center">
          <el-button type="primary" @click="addPrincipalManagement">添加</el-button>
        </div>
      </div>
      <div style="text-align:end;margin-bottom:10px">
        <el-button type="danger" @click="delPrincipalManagement">删除选中</el-button>
      </div>
      <el-table :header-cell-style="{background:'#F0FAFF',color:'#787878'}" border stripe v-loading="loading"
        element-loading-text="加载中，请稍候……" :data="principalManagement" tooltip-effect="dark" style="width: 100%"
        @selection-change="selectPM" :summary-method="pmSummaries" show-summary>
        <el-table-column type="selection" align="center" />
        <el-table-column label="放款金额(万元)" :formatter="row=>Number(row.fkeFkjy).toFixed(6)" align="right" />
        <el-table-column label="还款日期" :formatter="row=>String(row.efksj)=='null'?'':String(row.efksj).substring(0,10)"
          align="center" width="100" />
        <el-table-column label="本金金额(万元)" prop="efkjy" :formatter="row=>Number(row.efkjy).toFixed(6)" align="right" />
        <el-table-column label="利率(%)" width="80" align="center" :formatter="row=>Number(row.efkll).toFixed(3)+'%'" />
        <el-table-column label="日期" :formatter="row=>String(row.addTime)=='null'?'':String(row.addTime).substring(0,10)"
          align="center" width="100" />
        <el-table-column label="操作" width="50" align="center">
          <template slot-scope="s">
            <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
              <i class="el-icon-edit-outline edit-btn" @click="getPMInfo(s.row.id)" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination style="text-align: end;margin-top:20px" background @size-change="pmSelectSize"
        @current-change="pmSelectIndex" :current-page="pmSelectParams.pageIndex" :page-sizes="[10, 20, 50, 100]"
        :page-size="pmSelectParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pmTotal" />
    </el-dialog>
    <!-- 利率调整 -->
    <el-dialog title="利率调整" :visible.sync="interestRateDia" :close-on-click-modal="false">
      <div style="margin-bottom:20px">
        <el-form :model="setIrPrams" label-position="right" label-width="120px" :rules="irRules" ref="setIrPrams">
          <el-row>
            <el-col :span="24">
              <el-form-item label="放款金额(万元)" prop="fkeFkjy">
                <el-select v-model="setIrPrams.fkeFkjy" style="width:220px" clearable>
                  <el-option v-for="item in pmSelectData" :key="item.id" :value="item.id"
                    :label="Number(item.efkjy).toFixed(6)" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="调整日期：" prop="efksj">
                <el-date-picker v-model="setIrPrams.efksj" type="date" placeholder="调整日期"
                  value-format="yyyy-MM-dd HH:mm:ss" clearable style="width:220px">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="调整利率(%)：" prop="efkll">
                <el-input v-model="setIrPrams.efkll" placeholder="利率" clearable style="width:220px" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align:center">
          <el-button type="primary" @click="setIr">添加</el-button>
        </div>
      </div>
      <div style="text-align:end;margin-bottom:10px">
        <el-button type="danger" @click="delIr">删除选中</el-button>
      </div>
      <el-table :header-cell-style="{background:'#F0FAFF',color:'#787878'}" border stripe v-loading="loading"
        element-loading-text="加载中，请稍候……" :data="irData" tooltip-effect="dark" style="width: 100%"
        @selection-change="selectIR">
        <el-table-column type="selection" align="center" />
        <el-table-column label="放款金额(万元)" :formatter="row=>Number(row.fkeFkjy).toFixed(6)" align="right" />
        <el-table-column label="调整日期" :formatter="row=>String(row.efksj)=='null'?'':String(row.efksj).substring(0,10)"
          align="center" width="100" />
        <el-table-column label="调整利率(%)" :formatter="row=>Number(row.efkll).toFixed(3)+'%'" align="center"
          width="100" />
        <el-table-column label="日期" :formatter="row=>String(row.addTime)=='null'?'':String(row.addTime).substring(0,10)"
          width="100" align="center" />
        <el-table-column label="操作" width="50" align="center">
          <template slot-scope="s">
            <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
              <i class="el-icon-edit-outline edit-btn" @click="getIRInfo(s.row.id)" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination style="text-align: end;margin-top:20px" background @size-change="publicSizeSelect"
        @current-change="publicPageSelect" :current-page="selectParams.pageIndex" :page-sizes="[10, 20, 50, 100]"
        :page-size="selectParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-dialog>
    <!-- 还款计划修改 -->
    <el-dialog title="还款计划修改" :visible.sync="updRepaymentPlan" :close-on-click-modal="false">
      <div style="margin-bottom:20px">
        <el-form :model="repaymentPlanParams" label-position="right" label-width="120px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="计划还款日期：">
                <span>{{repaymentPlanParams.jhhkrq}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="贷款总额(万元)：">
                <span>{{repaymentPlanParams.dkzy}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="天数：">
                <el-input type="number" clearable style="width:220px" v-model="repaymentPlanParams.tianshu" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="调整利率(%)：">
                <el-input type="number" clearable style="width:220px" v-model="repaymentPlanParams.lilv" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="预估本金(万元)：">
                <el-input type="number" clearable style="width:220px" v-model="repaymentPlanParams.benjin" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="预估利息(万元)：">
                <el-input type="number" clearable style="width:220px" v-model="repaymentPlanParams.ykls" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="预估其他(万元)：">
                <el-input type="number" clearable style="width:220px" v-model="repaymentPlanParams.qita" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="实还日期：">
                <el-date-picker v-model="repaymentPlanParams.shrq" type="date" placeholder="选择日期" clearable
                  value-format="yyyy-MM-dd HH:mm:ss" style="width:220px" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="实还本金(万元)：">
                <el-input type="number" clearable style="width:220px" v-model="repaymentPlanParams.hkbj" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="实还利息(万元)：">
                <el-input type="number" clearable style="width:220px" v-model="repaymentPlanParams.sjhkls" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align:center">
          <el-button type="primary" @click="setRepaymentPlan">修改</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ShangChuan from "@/myComponents/ShangChuan";
import publicMixin from "@/mixin/publicMixin";
import guanLi from "@/api/guanLi";
import {
  tableTotal,
  isNull,
  templateDownload,
  exportMethod,
} from "@/utils/utils";
export default {
  data() {
    return {
      /* 本金管理对话框 */ principalDia: false,
      /* 利率调整对话框 */ interestRateDia: false,
      /* 修改还款计划对话框 */ updRepaymentPlan: false,
      /* 查询参数 */ selectParams: {
        pageIndex: 1,
        pageSize: 20,
        rongziId: this.$route.query.id,
        sheet: 0,
      },
      /* mixin参数 */ mixinParams: { api: guanLi, name: "getRepaymentPlan" },
      /* 融资详细 */ financingInfo: {},
      /* 日期参数 */ timeParams: "",
      /* 修改还款计划参数 */ repaymentPlanParams: {},
      /* 还款计划删除ids */ repaymentPlanIds: [],
      /* 本金管理参数 */ principalManagementParams: {},
      /* 本金管理 */ principalManagement: [],
      /* 本金管理查询参数 */ pmSelectParams: {
        pageIndex: 1,
        pageSize: 20,
        rongziId: this.$route.query.id,
      },
      /* 本金管理总条数 */ pmTotal: 0,
      /* 本金管理删除参数 */ pmIds: [],
      /* 本金放款下拉框 */ pmSelectData: [],
      /* 添加本金校验 */ pmRules: {
        fangdaiId: [
          { required: true, message: "请选择放款金额", trigger: "change" },
        ],
        efksj: [
          {
            required: true,
            message: "请选择还款日期",
            trigger: "change",
          },
        ],
        efkjy: [{ required: true, message: "请选择本金金额", trigger: "blur" }],
      },
      /* 利率查询参数 */ irParams: { pageIndex: 1, pageSize: 20 },
      /* 利率 */ irData: [],
      /* 添加/修改利率参数 */ setIrPrams: {},
      /* 利率校验 */ irRules: {
        fangdaiId: [
          { required: true, message: "请选择放款金额", trigger: "change" },
        ],
        efksj: [
          { required: true, message: "请选择调整日期", trigger: "change" },
        ],
        efkll: [
          { required: true, message: "请选择调整利率", trigger: "change" },
        ],
      },
      /* 删除利率参数 */ irIds: [],
      /* 计算时间 */ computingTime: "",
      /* 页码长度 */ pageNumberLength: 0,
      /* 备用查询参数 */ loserParams: {
        pageIndex: 1,
        pageSize: 20,
        sheet: 0,
        rongziId: this.$route.query.id,
      },
    };
  },
  methods: {
    /* 导出融资类型统计表 */ exportEG() {
      let [endDate, rongziId, sheet, startDate] = [
        `endDate=${this.selectParams.endDate || ""}`,
        `rongziId=${this.$route.query.id}`,
        `sheet=${this.selectParams.sheet}`,
        `startDate=${this.selectParams.startDate || ""}`,
      ];
      /* 导出 */ exportMethod({
        url: `${this.$store.state.upload.uploadHost}system/down/hkjh`,
        method: "POST",
        params: `${endDate}&${rongziId}&${sheet}&${startDate}`,
        fileName: "还款计划",
      });
    },
    /* 还款表 */ initPlan() {
      this.selectParams.sheet = 1;
      guanLi.getRepaymentPlan(this.selectParams).then((a) => {
        this.tableData = JSON.parse(JSON.stringify(a.data.records));
        this.total = a.data.total;
        if (
          this.selectParams.pageIndex ==
          Math.ceil(this.total / this.selectParams.pageSize)
        ) {
          this.tableData[a.data.records.length - 2] =
            a.data.records[a.data.records.length - 1];
          this.tableData[a.data.records.length - 1] =
            a.data.records[a.data.records.length - 2];
        }
        this.loading = false;
        this.getPageNumberLength();
      });
    },
    /* xlsx页码 */ setSheet(index) {
      this.selectParams.sheet = index;
      guanLi.getRepaymentPlan(this.selectParams).then((a) => {
        this.total = a.data.total;
        this.tableData = JSON.parse(JSON.stringify(a.data.records));
        if (
          this.selectParams.pageIndex ==
          Math.ceil(this.total / this.selectParams.pageSize)
        ) {
          this.tableData[a.data.records.length - 2] =
            a.data.records[a.data.records.length - 1];
          this.tableData[a.data.records.length - 1] =
            a.data.records[a.data.records.length - 2];
        }
        this.loading = false;
      });
    },
    /* 分页查询 */ publicPageSelect(page) {
      this.selectParams.pageIndex = page;
      this.getRepaymentPlan();
    },
    /* 更改页码 */ publicSizeSelect(size) {
      this.selectParams.pageSize = size;
      this.getRepaymentPlan();
    },
    /* 还款计划列表 */ getRepaymentPlan() {
      this.loading = true;
      guanLi.getRepaymentPlan(this.selectParams).then((a) => {
        this.total = a.data.total;
        this.tableData = JSON.parse(JSON.stringify(a.data.records));
        if (
          this.selectParams.pageIndex ==
          Math.ceil(this.total / this.selectParams.pageSize)
        ) {
          this.tableData[a.data.records.length - 2] =
            a.data.records[a.data.records.length - 1];
          this.tableData[a.data.records.length - 1] =
            a.data.records[a.data.records.length - 2];
        }
        this.loading = false;
        if (isNull(this.tableData)) {
          this.selectParams.sheet = 1;
          guanLi.getRepaymentPlan(this.selectParams).then((b) => {
            if (isNull(b.data.records)) {
              guanLi.generateRepaymentPlan(this.$route.query.id).then((c) => {
                this.selectParams.sheet = 0;
                guanLi.getRepaymentPlan(this.selectParams).then((d) => {
                  this.total = d.data.total;
                  this.tableData = JSON.parse(JSON.stringify(d.data.records));
                  if (
                    this.selectParams.pageIndex ==
                    Math.ceil(this.total / this.selectParams.pageSize)
                  ) {
                    this.tableData[d.data.records.length - 2] =
                      d.data.records[d.data.records.length - 1];
                    this.tableData[d.data.records.length - 1] =
                      d.data.records[d.data.records.length - 2];
                  }
                  this.loading = false;
                  this.computingTime = d.data.records[0].addTime;
                });
              });
            } else {
              this.selectParams.sheet = 1;
              guanLi.getRepaymentPlan(this.selectParams).then((e) => {
                this.total = e.data.total;
                tthis.tableData = JSON.parse(JSON.stringify(e.data.records));
                if (
                  this.selectParams.pageIndex ==
                  Math.ceil(this.total / this.selectParams.pageSize)
                ) {
                  this.tableData[e.data.records.length - 2] =
                    e.data.records[e.data.records.length - 1];
                  this.tableData[e.data.records.length - 1] =
                    e.data.records[e.data.records.length - 2];
                }
                this.loading = false;
                this.computingTime = e.data.records[0].addTime;
              });
            }
          });
        } else {
          this.computingTime = this.tableData[0].addTime;
        }
      });
    },
    async demo() {
      return new Promise((r) => {
        guanLi.getRepaymentPlan(this.loserParams).then((res) => {
          if (isNull(res.data.records)) r(true);
          r(false);
        });
      });
    },
    /* 获取页码长度 */ async getPageNumberLength() {
      for (let i = 0; i <= 999999; i++) {
        this.loserParams.sheet = i + 1;
        this.pageNumberLength = i + 1;
        if (await this.demo()) {
          this.loserParams.sheet -= 1;
          this.pageNumberLength -= 1;
          return false;
        }
      }
    },
    /* 模板下载 */ templateDownload() {
      let data = {
        method: "GET",
        url: `${this.$store.state.upload.uploadHost}financing/rongziHuankuan/loadTemp`,
        fileName: "还款计划.xls",
      };
      templateDownload(data);
    },
    /* 导出初始化数据 */ formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          if (j === "jhhkrq" || j === "shrq") {
            return String(v[j]) == "null" ? "" : String(v[j]).substring(0, 10);
          }
          if (
            j === "dkzy" ||
            j === "benjin" ||
            j === "ykls" ||
            j === "qita" ||
            j === "estimateSum" ||
            j === "hkbj" ||
            j === "sjhkls" ||
            j === "realSum"
          )
            return Number(v[j]).toFixed(6);
          if (j === "lilv") return Number(v[j]).toFixed(2) + "%";
          return v[j];
        })
      );
    },
    /* 导出 */ exportFM() {
      this.selectParams.pageSize = this.total;
      guanLi.getRepaymentPlan(this.selectParams).then((res) => {
        import("@/vendor/Export2Excel").then((excel) => {
          const header = [
            "计划还款日期",
            "贷款总额(万元)",
            "利率(%)",
            "天数",
            "预估本金(万元)",
            "预估利息(万元)",
            "预估其他(万元)",
            "预估合计(万元)",
            "实还日期",
            "实还本金(万元)",
            "实还利息(万元)",
            "实还合计(万元)",
          ];
          const filterVal = [
            "jhhkrq",
            "dkzy",
            "lilv",
            "tianshu",
            "benjin",
            "ykls",
            "qita",
            "estimateSum",
            "shrq",
            "hkbj",
            "sjhkls",
            "realSum",
          ];
          const list = res.data.records;
          const data = this.formatJson(filterVal, list);
          excel.export_json_to_excel({
            header,
            data,
            filename: "还款计划",
            autoWidth: true,
            bookType: "xlsx",
          });
        });
      });
    },
    /* 利率详细 */ getIRInfo(id) {
      guanLi.getInterestRateInfo(id).then((res) => {
        this.setIrPrams = res.data;
        this.interestRateDia = true;
      });
    },
    /* 本金详细 */ getPMInfo(id) {
      guanLi.getPrincipalManagementInfo(id).then((res) => {
        this.principalManagementParams = res.data;
        this.principalDia = true;
      });
    },
    /* 利率选中 */ selectIR(val) {
      this.irIds = [];
      this.irIds = val.map((v) => v.id);
    },
    /* 删除利率 */ delIr() {
      if (isNull(this.irIds)) this.$message.error("请至少选择一条数据");
      else
        this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          guanLi.delInterestRate(this.irIds).then((res) => {
            this.$message.success("删除成功");
            this.getInterestRate();
          });
        });
    },
    /* 添加/修改利率 */ setIr() {
      this.setIrPrams.rongziId = this.$route.query.id;
      if (this.publicRules("setIrPrams"))
        guanLi.addInterestRate(this.setIrPrams).then((res) => {
          this.$message.success("添加成功");
          this.getInterestRate();
          this.setIrPrams = {};
          // this.interestRateDia = false;
        });
    },
    /* 添加/修改利率前置 */ goAddOrUpdIr() {
      this.setIrPrams = {};
      this.interestRateDia = true;
      this.getInterestRate();
    },
    /* 获取利率 */ getInterestRate() {
      this.irParams.rongziId = this.$route.query.id;
      guanLi.getInterestRate(this.irParams).then((res) => {
        this.irData = res.data.records;
      });
    },
    /* 本金合计 */ pmSummaries(param) {
      return tableTotal(param, ["本金金额(万元)"]);
    },
    /* 添加本金管理 */ addPrincipalManagement() {
      this.principalManagementParams.rongziId = this.$route.query.id;
      if (this.publicRules("principalManagementParams"))
        guanLi
          .addPrincipalManagement(this.principalManagementParams)
          .then((res) => {
            this.$message.success("添加成功");
            this.principalManagementParams = {};
            this.getPrincipalManagement();
            // this.principalDia = false;
          });
    },
    /* 获取本金放款 */ getLoan() {
      guanLi
        .getLoan({
          pageIndex: 1,
          pageSize: 999999,
          rongziId: this.$route.query.id,
        })
        .then((res) => {
          this.pmSelectData = res.data.records;
        });
    },
    /* 本金选中 */ selectPM(val) {
      this.pmIds = [];
      this.pmIds = val.map((v) => v.id);
    },
    /* 删除本金管理 */ delPrincipalManagement() {
      if (isNull(this.pmIds)) this.$message.error("请至少选择一条数据");
      else
        this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          guanLi.delPrincipalManagement(this.pmIds).then((res) => {
            this.$message.success("删除成功");
            this.getPrincipalManagement();
          });
        });
    },
    /* 本金管理分页查询 */ pmSelectIndex(index) {
      this.pmSelectParams.pageIndex = index;
      this.getPrincipalManagement();
    },
    /* 本金管理更改展示数量 */ pmSelectSize(size) {
      this.pmSelectParams.pageSize = size;
      this.getPrincipalManagement();
    },
    /* 本金管理表格 */ getPrincipalManagement() {
      guanLi.getPrincipalManagement(this.pmSelectParams).then((res) => {
        this.principalManagement = res.data.records;
        this.pmTotal = res.data.total;
      });
    },
    /* 添加/修改本金管理 */ addOrUpdPrincipalManagement() {
      this.principalDia = true;
      this.principalManagementParams = {};
      this.getPrincipalManagement();
    },
    /* 生成还款计划 */ generateRepaymentPlan() {
      this.$confirm("确定要重新计算?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.loading = true;
        guanLi.generateRepaymentPlan(this.$route.query.id).then(() => {
          this.$message.success("生成成功");
          guanLi.getRepaymentPlan(this.selectParams).then((r) => {
            this.tableData = r.data.records || r.data;
            this.loading = false;
            this.total = r.data.total;
            this.computingTime = this.tableData[0].addTime;
          });
        });
      });
    },
    /* 还款计划删除 */ delRepaymentPlan() {
      if (this.repaymentPlanIds == "")
        this.$message.error("请至少选择一条数据");
      else this.publicDel("delRepaymentPlan", this.repaymentPlanIds);
    },
    /* 多选赋值 */ handleSelectionChange(val) {
      this.repaymentPlanIds = [];
      this.repaymentPlanIds = val.map((v) => v.id);
    },
    /* 还款计划修改 */ setRepaymentPlan() {
      guanLi.setRepaymentPlan(this.repaymentPlanParams).then((res) => {
        this.$message.success("修改成功");
        this.publicSelect();
        this.repaymentPlanParams = {};
        this.updRepaymentPlan = false;
      });
    },
    /* 还款计划修改前置 */ goUpd(id) {
      guanLi.getRepaymentPlanInfo(id).then((res) => {
        this.repaymentPlanParams = res.data;
        this.repaymentPlanParams.id = id;
        this.updRepaymentPlan = true;
      });
    },
    /* 初始化查询时间参数 */ setTimeParams(val) {
      if (isNull(val)) {
        this.selectParams.startDate = "";
        this.selectParams.endDate = "";
      } else {
        this.selectParams.startDate = val[0];
        this.selectParams.endDate = val[1];
      }
      this.publicSelect();
    },
    /* 合计 */ getSummaries(param) {
      return tableTotal(param, [
        "预估本金(万元)",
        "预估利息(万元)",
        "预估其他(万元)",
        "预估合计(万元)",
        "实还本金(万元)",
        "实还利息(万元)",
        "实还合计(万元)",
      ]);
    },
    /* 融资表详细 */ getFinancingInfo() {
      guanLi.getFinancingInfo(this.$route.query.id).then((res) => {
        this.financingInfo = res.data.rongZiEntityInfo;
        this.getRepaymentPlan();
      });
    },
  },
  mounted() {
    /* 获取页码长度 */ this.getPageNumberLength();
    /* 本金表放款金额下拉框 */ this.getLoan();
    /* 融资表详细(回调表格数据) */ this.getFinancingInfo();
  },
  components: { ShangChuan },
  mixins: [publicMixin],
};
</script>

<style lang="scss" scoped>
</style>