<template>
  <div class="view-container bg-gray">
    <div class="border-card">
      <header class="view-header" style="margin-bottom:0px !important">
        <div class="header-container">
          <el-form :inline="true" :model="selectParams" class="demo-form-inline">
            <div style="display:flex;justify-content: space-between;">
              <div>
                <el-form-item>
                  <el-select v-model="loserPids" placeholder="融资类型" @change="getInitialFinancingType" clearable
                    style="width:220px" multiple collapse-tags>
                    <el-option v-for="item in fto" :key="item.value" :value="item.value" :label="item.label" />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-select v-model="selectParams.year" @change="getFinancingTypeStatistics">
                    <el-option :value="item" :key="item" :label="item" v-for="item in years" />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <KeShi v-model="selectParams.zrks" @change="getFinancingTypeStatistics" />
                </el-form-item>
              </div>
              <div style="text-align: end;">
                <el-form-item>
                  <el-button type="primary" icon="el-icon-document-checked" @click="exportEG">导出</el-button>
                </el-form-item>
                <el-form-item>
                  <span>金额单位：万元</span>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </div>
      </header>
      <section class="table-container view-section">
        <el-table :header-cell-style="{background:'#F0FAFF',color:'#787878'}" border stripe v-loading="loading"
          element-loading-text="加载中，请稍候……" :data="tableData" tooltip-effect="dark" style="width: 100%"
          :summary-method="getSummaries" show-summary height="700px">
          <el-table-column label="融资类型统计表" align="center">
            <el-table-column label="序号" prop="parg" width="60" align="center" />
            <el-table-column label="所属大类" prop="ascription" />
            <el-table-column label="融资类型" prop="lxName" show-overflow-tooltip />
            <el-table-column label="融资到账金额" prop="received" width="130" align="right"
              :formatter="row=>Number(row.received).toFixed(6)" />
            <el-table-column label="融资到账可使用金额" prop="receivedAvailable" width="150" align="right"
              :formatter="row=>Number(row.receivedAvailable).toFixed(6)" />
            <el-table-column label="年初本金余额" prop="yprincipalBalance" width="120" align="right"
              :formatter="row=>Number(row.yprincipalBalance).toFixed(6)" />
            <el-table-column label="年初利息余额" prop="yinterestBalance" width="120" align="right"
              :formatter="row=>Number(row.yinterestBalance).toFixed(6)" />
            <el-table-column label="今年已还本金" prop="yearRepaidPrincipal" width="120" align="right"
              :formatter="row=>Number(row.yearRepaidPrincipal).toFixed(6)" />
            <el-table-column label="今年已还利息" width="120" align="right"
              :formatter="row=>Number(row.yearRepaidInterest).toFixed(6)" />
            <el-table-column label="今年未还本金" prop="yearNotPrincipal" width="120" align="right"
              :formatter="row=>Number(row.yearNotPrincipal).toFixed(6)" />
            <el-table-column label="今年未还利息" prop="yearNotInterest" width="120" align="right"
              :formatter="row=>Number(row.yearNotInterest).toFixed(6)" />
            <el-table-column label="全部未还本金" prop="wholeNotPrincipal" width="120" align="right"
              :formatter="row=>Number(row.wholeNotPrincipal).toFixed(6)" />
            <el-table-column label="全部未还利息" prop="wholeNotInterest" width="120" align="right"
              :formatter="row=>Number(row.wholeNotInterest).toFixed(6)" />
          </el-table-column>
        </el-table>
      </section>
    </div>
  </div>
</template>

<script>
import publicMixin from "@/mixin/publicMixin";
import KeShi from "@/myComponents/KeShi";
import LeiXing from "@/myComponents/LeiXing";
import {
  tableTotal,
  isNull,
  getYearsSelect,
  exportMethod,
} from "@/utils/utils";
import guanLi from "@/api/guanLi";
import index from "@/api/index";
export default {
  data() {
    return {
      isYesNull: "",
      /* mixin参数 */ mixinParams: {
        name: "getFinancingTypeStatistics",
        api: guanLi,
      },
      /* 查询参数 */ selectParams: {
        pageIndex: 1,
        pageSize: 20,
        year: new Date().getFullYear(),
      },
      /* 年限 */ years: "",
      /* 备用融资类型 */ loserPids: "",
      /* 融资类型(一级) */ fto: "",
    };
  },
  methods: {
    /* 导出融资类型统计表 */ exportEG() {
      let [pids, year, zrks] = [
        `pids=${this.selectParams.pids || ""}`,
        `year=${this.selectParams.year || ""}`,
        `zrks=${this.selectParams.zrks || ""}`,
      ];
      /* 导出 */ exportMethod({
        url: `${this.$store.state.upload.uploadHost}system/down/rzlx`,
        method: "POST",
        params: `${pids}&${year}&${zrks}`,
        fileName: "融资类型统计表",
      });
    },
    /* 获取融资类型 */ getFinancingTypeOne() {
      index.getFinancingTypeOne().then((res) => {
        this.fto = res.data;
      });
    },
    /* 初始化融资类型 */ getInitialFinancingType(val) {
      if (!isNull(val)) this.selectParams.pids = val.join(",");
      else this.selectParams.pids = "";
      this.getFinancingTypeStatistics();
    },
    /* 获取年限 */ getYears() {
      this.years = getYearsSelect();
    },
    /* 导出初始化数据 */ formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          if (
            j === "received" ||
            j === "receivedAvailable" ||
            j === "yprincipalBalance" ||
            j === "yinterestBalance" ||
            j === "yearRepaidPrincipal" ||
            j === "yearRepaidInterest" ||
            j === "yearNotPrincipal" ||
            j === "yearNotInterest" ||
            j === "wholeNotPrincipal" ||
            j === "wholeNotInterest"
          )
            return Number(v[j]).toFixed(6);
          return v[j];
        })
      );
    },
    /* 导出 */ exportFM() {
      this.selectParams.pageSize = this.total;
      guanLi[this.mixinParams.name](this.selectParams).then((res) => {
        import("@/vendor/Export2Excel").then((excel) => {
          const multiHeader = [
            ["融资类型统计表", "", "", "", "", "", "", "", "", "", "", ""],
          ];
          const tHeader = [
            "所属大类",
            "融资类型",
            "融资到账金额",
            "融资到账可使用金额",
            "年初本金余额",
            "年初利息余额",
            "今年已还本金",
            "今年已还利息",
            "今年未还本金",
            "今年未还利息",
            "全部未还本金",
            "全部未还利息",
          ];
          const filterVal = [
            "ascription",
            "lxName",
            "received",
            "receivedAvailable",
            "yprincipalBalance",
            "yinterestBalance",
            "yearRepaidPrincipal",
            "yearRepaidInterest",
            "yearNotPrincipal",
            "yearNotInterest",
            "wholeNotPrincipal",
            "wholeNotInterest",
          ];
          const merges = ["A1:L1"];
          const list = res.data;
          const data = this.formatJson(filterVal, list);
          excel.export_json_to_excel({
            merges,
            multiHeader,
            header: tHeader,
            data,
            filename: "融资类型统计表",
            autoWidth: true,
            bookType: "xlsx",
          });
        });
      });
    },
    /* 融资类型统计表 */ getFinancingTypeStatistics() {
      this.publicSelect(false);
    },
    /* 表格统计 */ getSummaries(param) {
      return tableTotal(param, [
        "融资到账金额",
        "融资到账可使用金额",
        "年初本金余额",
        "年初利息余额",
        "今年已还本金",
        "今年未还本金",
        "今年未还利息",
        "全部未还本金",
        "全部未还利息",
      ]);
    },
  },
  mounted() {
    /* 获取融资类型 */ this.getFinancingTypeOne();
    /* 获取资金到账情况表 */ this.getFinancingTypeStatistics();
    /* 获取年限 */ this.getYears();
  },
  components: { KeShi, LeiXing },
  mixins: [publicMixin],
};
</script>

<style lang="scss" scoped>
</style>