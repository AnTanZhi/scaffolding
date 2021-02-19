<template>
  <div class="view-container bg-gray">
    <div class="border-card">
      <header class="view-header" style="margin-bottom:0px !important">
        <div class="header-container">
          <el-form :inline="true" :model="selectParams" class="demo-form-inline">
            <div style="display:flex;justify-content: space-between;">
              <div>
                <el-form-item>
                  <LeiXing v-model="loserRzlxmc" style="width:230px" @change="setRzlxmc" />
                </el-form-item>
                <el-form-item>
                  <el-select v-model="selectParams.isRepayment" clearable placeholder="是否实还" style="width:110px"
                    @change="getWR">
                    <el-option label="是" value="1" />
                    <el-option label="否" value="0" />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <KeShi v-model="selectParams.zrks" style="width:110px" @change="getWR" />
                </el-form-item>
                <el-form-item>
                  <div style="display:flex;">
                    <el-select v-model="selectParams.queryType" clearable style="width:120px">
                      <el-option value="金融机构" label="金融机构" />
                      <el-option value="融资主体" label="融资主体" />
                      <el-option value="债务名称" label="债务名称" />
                      <el-option value="合同编码" label="合同编码" />
                      <el-option value="还款银行" label="还款银行" />
                    </el-select>
                    <span v-text="`:`" style="font-size:.2rem;margin-left:.125rem;margin-right:.125rem" />
                    <el-input v-model="selectParams.queryContent" clearable style="width:150px" placeholder="查询内容"
                      @input="getWR" />
                  </div>
                </el-form-item>
                <el-form-item>
                  <el-select v-model="isTime" placeholder="时间检索">
                    <el-option label="日期" value="日期" />
                    <el-option label="月份" value="月份" />
                    <el-option label="预警天数" value="预警天数" />
                  </el-select>
                </el-form-item>
                <el-form-item v-if="isTime=='日期'">
                  <el-date-picker v-model="timeParams" type="daterange" range-separator="~" start-placeholder="开始日期"
                    end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" style="width:240px" clearable
                    @change="setTimeParams" />
                </el-form-item>
                <el-form-item v-if="isTime=='月份'">
                  <el-select v-model="selectParams.month" clearable placeholder="月份" style="width:80px"
                    @change="setMonth">
                    <el-option label="1" value="1" />
                    <el-option label="2" value="2" />
                    <el-option label="3" value="3" />
                    <el-option label="4" value="4" />
                    <el-option label="5" value="5" />
                    <el-option label="6" value="6" />
                    <el-option label="7" value="7" />
                    <el-option label="8" value="8" />
                    <el-option label="9" value="9" />
                    <el-option label="10" value="10" />
                    <el-option label="11" value="11" />
                    <el-option label="12" value="12" />
                  </el-select>
                </el-form-item>
                <el-form-item v-if="isTime=='预警天数'">
                  <el-input v-model="selectParams.days" placeholder="预警天数" style="width:110px" clearable
                    @input="setDays" type="number" />
                </el-form-item>
              </div>
              <div>
                <el-form-item>
                  <el-button type="primary" icon="el-icon-document-checked" @click="exportEG">导出</el-button>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </div>
      </header>
      <section class="table-container view-section">
        <el-table :header-cell-style="{background:'#F0FAFF',color:'#787878'}" border stripe v-loading="loading"
          element-loading-text="加载中，请稍候……" :data="tableData" tooltip-effect="dark" style="width: 100%"
          :summary-method="getSummaries" show-summary>
          <el-table-column label="合同编号" prop="dkdbhs" show-overflow-tooltip />
          <el-table-column label="融资主体" prop="ztName" show-overflow-tooltip />
          <el-table-column label="金融机构" prop="jinRongJiGou" show-overflow-tooltip />
          <el-table-column label="债务名称" prop="zwmc" show-overflow-tooltip />
          <el-table-column label="责任科室" prop="zrksName" show-overflow-tooltip align="center" width="80" />
          <el-table-column label="计划还款日期" width="110"
            :formatter="row=>String(row.jhhkrq)=='null'?'':String(row.jhhkrq).substring(0,10)" align="center" />
          <el-table-column label="贷款总额(万元)" prop="dkzy" width="120" align="right"
            :formatter="row=>Number(row.dkzy).toFixed(6)" />
          <el-table-column label="利率(%)" width="80" align="center" :formatter="row=>Number(row.lilv).toFixed(3)+'%'" />
          <el-table-column label="本金(万元)" prop="benjin" align="right" :formatter="row=>Number(row.benjin).toFixed(6)"
            show-overflow-tooltip width="120" />
          <el-table-column label="预估利息(万元)" prop="ykls" align="right" width="120"
            :formatter="row=>Number(row.ykls).toFixed(6)" />
          <el-table-column label="还款合计" prop="total" align="right" :formatter="row=>Number(row.total).toFixed(6)"
            width="120" show-overflow-tooltip />
          <el-table-column label="滞纳金(万元)" prop="znj" width="110" align="right"
            :formatter="row=>Number(row.znj).toFixed(6)" />
          <el-table-column label="还款银行" prop="hkyh" show-overflow-tooltip />
          <el-table-column label="还款账号" prop="hkzh" show-overflow-tooltip />
          <el-table-column label="是否实还" prop="isok" width="80" align="center" />
          <el-table-column label="实际还款" prop="repayment" width="120" align="right"
            :formatter="row=>Number(row.repayment).toFixed(6)" show-overflow-tooltip />
          <el-table-column label="还款凭证号" prop="hkpz" show-overflow-tooltip width="100" />
          <el-table-column label="操作" align="center" width="50" fixed="right">
            <template slot-scope="s">
              <el-tooltip class="item" effect="dark" content="还款" placement="bottom">
                <i class="el-icon-money edit-btn" @click="goR(s.row.hkId)" />
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </section>
      <el-pagination style="text-align: end;" background @size-change="publicSizeSelect"
        @current-change="publicPageSelect" :current-page="selectParams.pageIndex" :page-sizes="[10, 20, 50, 100]"
        :page-size="selectParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
      <!-- 预警还款 -->
      <el-dialog title="还款预警" :visible.sync="addOrUpdateDig" :close-on-click-modal="false" width="20%">
        <el-form label-position="right" label-width="110px" :model="repaymentParams" :rules="rules"
          ref="repaymentParams">
          <el-form-item label="债务名称：">
            <span>{{rInfo.zwmc}}</span>
          </el-form-item>
          <el-form-item label="计划还款日期：">
            <span>{{rInfo.jhhkrq}}</span>
          </el-form-item>
          <el-form-item label="利率(%)：">
            <span>{{rInfo.lilv}}%</span>
          </el-form-item>
          <el-form-item label="应还总额：">
            <span>{{Number(rInfo.ykls+rInfo.benjin).toFixed(6)}}</span>
          </el-form-item>
          <el-form-item label="实还总额：" prop="realMoney">
            <el-input type="number" clearable style="width:220px" v-model="repaymentParams.realMoney" />
          </el-form-item>
          <el-form-item label="实还日期：" prop="shrq">
            <el-date-picker type="date" value-format="yyyy-MM-dd HH:mm:ss" clearable v-model="repaymentParams.shrq">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="还款凭证号：">
            <el-input clearable style="width:220px" v-model="repaymentParams.hkpz" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addOrUpdateDig = false">取 消</el-button>
          <el-button type="primary" @click="repaymentOperation" v-loading="btnLoading">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import publicMixin from "@/mixin/publicMixin";
import LeiXing from "@/myComponents/LeiXing";
import KeShi from "@/myComponents/KeShi";
import ShangChuan from "@/myComponents/ShangChuan";
import guanLi from "@/api/guanLi";
import { tableTotal, isNull, exportMethod } from "@/utils/utils";
export default {
  data() {
    return {
      /* 查询参数 */ selectParams: { pageIndex: 1, pageSize: 20, days: "30" },
      /* mixin参数 */ mixinParams: { api: guanLi, name: "getRepaymentWarning" },
      /* 日期查询参数 */ timeParams: "",
      /* 时间检索类型 */ isTime: "预警天数",
      /* 用不到的融资类型 */ loserRzlxmc: "",
      /* 还款参数 */ repaymentParams: {},
      /* 还款非空验证 */ rules: {
        realMoney: [
          { required: true, message: "请输入实还总额", trigger: "blur" },
        ],
        shrq: [{ required: true, message: "请输入实还日期", trigger: "blur" }],
      },
      /* 还款详细 */ rInfo: {},
    };
  },
  methods: {
    /* 导出还款预警 */ exportEG() {
      let [
        days,
        endDate,
        isRepayment,
        jieqing,
        month,
        queryContent,
        queryType,
        rzlxmc,
        startDate,
        zrks,
      ] = [
        `days=${this.selectParams.days || ""}`,
        `endDate=${this.selectParams.endDate || ""}`,
        `isRepayment=${this.selectParams.isRepayment || ""}`,
        `jieqing=${this.selectParams.jieqing || ""}`,
        `month=${this.selectParams.month || ""}`,
        `queryContent=${this.selectParams.queryContent || ""}`,
        `queryType=${this.selectParams.queryType || ""}`,
        `rzlxmc=${this.selectParams.rzlxmc || ""}`,
        `startDate=${this.selectParams.startDate || ""}`,
        `zrks=${this.selectParams.zrks || ""}`,
      ];
      /* 导出 */ exportMethod({
        url: `${this.$store.state.upload.uploadHost}system/down/hkyj`,
        method: "POST",
        params: `${days}&${endDate}&${isRepayment}&${jieqing}&${month}&${queryContent}&${queryType}&${rzlxmc}&${startDate}&${zrks}`,
        fileName: "还款预警",
      });
    },
    /* 导出初始化数据 */ formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          if (j === "jhhkrq") {
            return String(v[j]) == "null" ? "" : String(v[j]).substring(0, 10);
          }
          if (
            j === "dkzy" ||
            j === "benjin" ||
            j === "ykls" ||
            j === "znj" ||
            j === "total" ||
            j === "repayment"
          )
            return Number(v[j]).toFixed(6);
          if (j === "lilv") return Number(v[j]).toFixed(2) + "%";
          return v[j];
        })
      );
    },
    /* 导出 */ exportXLSX() {
      this.selectParams.pageSize = this.total;
      guanLi[this.mixinParams.name](this.selectParams).then((res) => {
        import("@/vendor/Export2Excel").then((excel) => {
          const header = [
            "合同编号",
            "融资主体",
            "金融机构",
            "债务名称",
            "责任科室",
            "计划还款日期",
            "贷款总额(万元)",
            "利率(%)",
            "本金(万元)",
            "预估利息(万元)",
            "还款合计",
            "滞纳金(万元)",
            "还款银行",
            "还款账号",
            "是否实还",
            "实际还款",
            "还款凭证号",
          ];
          const filterVal = [
            "dkdbhs",
            "ztName",
            "jinRongJiGou",
            "zwmc",
            "zrksName",
            "jhhkrq",
            "dkzy",
            "lilv",
            "benjin",
            "ykls",
            "total",
            "znj",
            "hkyh",
            "hkzh",
            "isok",
            "repayment",
            "hkpz",
          ];
          const list = res.data.records;
          const data = this.formatJson(filterVal, list);
          excel.export_json_to_excel({
            header,
            data,
            filename: "还款预警",
            autoWidth: true,
            bookType: "xlsx",
          });
        });
      });
    },
    /* 还款 */ repaymentOperation() {
      if (this.publicRules("repaymentParams"))
        this.publicAdd("repaymentOperation", this.repaymentParams, "");
    },
    /* 还款前置 */ goR(id) {
      this.repaymentParams = {};
      guanLi.getRepaymentPlanInfo(id).then((res) => {
        this.rInfo = res.data;
        this.repaymentParams.id = id;
        this.addOrUpdateDig = true;
      });
    },
    /* 初始化融资类型查询 */ setRzlxmc(val) {
      if (!isNull(val)) this.selectParams.rzlxmc = val.join(",");
      else this.selectParams.rzlxmc = "";
      this.getWR();
    },
    /* 预警天数查询 */ setDays(val) {
      this.selectParams.month = "";
      this.selectParams.startDate = "";
      this.selectParams.endDate = "";
      this.getWR();
    },
    /* 初始化月份查询 */ setMonth(val) {
      this.selectParams.days = "";
      this.selectParams.startDate = "";
      this.selectParams.endDate = "";
      this.getWR();
    },
    /* 初始化时间查询 */ setTimeParams(val) {
      this.selectParams.month = "";
      this.selectParams.days = "";
      if (isNull(val)) {
        this.selectParams.startDate = "";
        this.selectParams.endDate = "";
      } else {
        this.selectParams.startDate = val[0];
        this.selectParams.endDate = val[1];
      }
      this.getWR();
    },
    /* 还款计划合计 */ getSummaries(param) {
      return tableTotal(param, [
        "贷款总额(万元)",
        "本金(万元)",
        "预估利息(万元)",
        "还款合计",
        "滞纳金(万元)",
        "实际还款",
      ]);
    },
    /* 获取还款计划 */ getWR() {
      this.publicSelect();
    },
  },
  mounted() {
    /* 获取还款计划 */ this.getWR();
  },
  components: { LeiXing, KeShi },
  mixins: [publicMixin],
};
</script>

<style lang="scss" scoped>
</style>