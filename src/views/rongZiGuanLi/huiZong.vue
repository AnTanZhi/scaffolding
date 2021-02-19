<template>
  <div class="view-container bg-gray">
    <div class="border-card">
      <header class="view-header" style="margin-bottom:0px !important">
        <div class="header-container">
          <el-form :inline="true" :model="selectParams" class="demo-form-inline">
            <div style="display:flex;justify-content: space-between;">
              <div>
                <el-form-item>
                  <LeiXing v-model="loserRzlxmc" @change="setRzlxmc" style="width:220px" />
                </el-form-item>
                <el-form-item>
                  <el-date-picker v-model="timeParams" type="daterange" range-separator="~" start-placeholder="检索日期"
                    end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" @change="setTimeParams"
                    style="width:240px" :clearable="false" />
                </el-form-item>
                <el-form-item>
                  <KeShi v-model="selectParams.zrks" style="width:110px" @change="getFinancingSummary" />
                </el-form-item>
                <el-form-item>
                  <GongSi v-model="selectParams.suoshugs" style="width:110px" @change="getFinancingSummary" />
                </el-form-item>
                <el-form-item>
                  <el-checkbox v-model="isJoin" @change="setSODRPP">存单质押参与汇总</el-checkbox>
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
        <div style="text-align:center;background: rgb(240, 250, 255);line-height:48px;font-weight: 600;">
          融资汇总</div>
        <el-table :header-cell-style="{background:'#F0FAFF',color:'#787878'}" border stripe v-loading="loading"
          element-loading-text="加载中，请稍候……" :data="tableData" tooltip-effect="dark" style="width: 100%"
          :summary-method="getSummaries" show-summary>
          <el-table-column label="合同编号" prop="dkdbhs" show-overflow-tooltip fixed />
          <el-table-column label="融资主体" prop="ztName" show-overflow-tooltip fixed />
          <el-table-column label="金融机构" prop="jinRongJiGou" show-overflow-tooltip fixed />
          <el-table-column label="日期" prop="dkrqq" width="100" align="center"
            :formatter="row=>String(row.dkrqq)=='null'?'':String(row.dkrqq).substring(0,10)" fixed />
          <el-table-column label="融资类型" prop="lxName" show-overflow-tooltip fixed />
          <el-table-column label="授信额度" prop="sxje" align="right" width="120"
            :formatter="row=>Number(row.sxje).toFixed(6)" fixed />
          <el-table-column label="融资成本(或利率%)" prop="lilv" width="150" align="right"
            :formatter="row=>Number(row.lilv).toFixed(3)+'%'" fixed />
          <el-table-column label="期限(天)" prop="qx" width="80" align="center" fixed />
          <el-table-column label="提款金额" prop="tiMoney" align="right" width="120"
            :formatter="row=>Number(row.tiMoney).toFixed(6)" fixed />
          <el-table-column label="质押金额" prop="dyje" align="right" width="120"
            :formatter="row=>Number(row.dyje).toFixed(6)" fixed />
          <el-table-column label="保证金" prop="bzj" align="right" width="120" :formatter="row=>Number(row.bzj).toFixed(6)"
            fixed />
          <el-table-column label="已还贷款">
            <el-table-column label="本金" prop="yhBenjin" align="right" width="120"
              :formatter="row=>Number(row.yhBenjin).toFixed(6)" />
            <el-table-column label="利息" prop="yhLixi" align="right" width="120"
              :formatter="row=>Number(row.yhLixi).toFixed(6)" />
          </el-table-column>
          <el-table-column label="尚欠贷款">
            <el-table-column label="小计" prop="whMoneySum" align="right" width="120"
              :formatter="row=>Number(row.whMoneySum).toFixed(6)" />
            <el-table-column label="本金" prop="whBenjin" align="right" width="120"
              :formatter="row=>Number(row.whBenjin).toFixed(6)" />
            <el-table-column label="利息" prop="whLixi" align="right" width="120"
              :formatter="row=>Number(row.whLixi).toFixed(6)" />
          </el-table-column>
          <el-table-column label="还款计划">
            <el-table-column
              :label="`${String(selectParams.endDate).substring(0,4)}年${String(selectParams.endDate).substring(5,7)}月`">
              <el-table-column label="本金" prop="monthBenjinSum" align="right" width="120"
                :formatter="row=>Number(row.monthBenjinSum).toFixed(6)" />
              <el-table-column label="利息" prop="monthLixiSum" align="right" width="120"
                :formatter="row=>Number(row.monthLixiSum).toFixed(6)" />
            </el-table-column>
            <el-table-column :label="`${String(selectParams.endDate).substring(0,4)}年`">
              <el-table-column label="本金" prop="yearBenjinSum" align="right" width="120"
                :formatter="row=>Number(row.yearBenjinSum).toFixed(6)" />
              <el-table-column label="利息" prop="yearLixiSum" align="right" width="120"
                :formatter="row=>Number(row.yearLixiSum).toFixed(6)" />
            </el-table-column>
          </el-table-column>
        </el-table>
      </section>
      <el-pagination style="text-align: end;" background @size-change="publicSizeSelect"
        @current-change="publicPageSelect" :current-page="selectParams.pageIndex" :page-sizes="[10, 20, 50, 100]"
        :page-size="selectParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" />
    </div>
  </div>
</template>

<script>
import publicMixin from "@/mixin/publicMixin";
import LeiXing from "@/myComponents/LeiXing";
import KeShi from "@/myComponents/KeShi";
import GongSi from "@/myComponents/GongSi";
import guanLi from "@/api/guanLi";
import { isNull, tableTotal, exportMethod } from "@/utils/utils";
export default {
  data() {
    return {
      /* 查询参数 */ selectParams: { pageIndex: 1, pageSize: 20 },
      /* mixin参数 */ mixinParams: { name: "getFinancingSummary", api: guanLi },
      /* 当前题 */ tmIndex: 1,
      /* 题目集合 */ timuList: {},
      /* 备用融资类型 */ loserRzlxmc: "",
      /* 时间参数 */ timeParams: [
        new Date(new Date().getFullYear() - 5, 0, 2),
        new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate() + 1
        ),
      ],
      /* 存单质押参与汇总 */ isJoin: "",
    };
  },
  methods: {
    /* 导出融资汇总 */ exportEG() {
      let [endDate, isJoin, rzlxmc, startDate, suoshugs, zrks] = [
        `endDate=${this.selectParams.endDate || ""}`,
        `isJoin=${this.selectParams.isJoin || ""}`,
        `rzlxmc=${this.selectParams.rzlxmc || ""}`,
        `startDate=${this.selectParams.startDate || ""}`,
        `suoshugs=${this.selectParams.suoshugs || ""}`,
        `zrks=${this.selectParams.zrks || ""}`,
      ];
      /* 导出 */ exportMethod({
        url: `${this.$store.state.upload.uploadHost}system/down/rzhz`,
        method: "POST",
        params: `${endDate}&${isJoin}&${rzlxmc}&${startDate}&${suoshugs}&${zrks}`,
        fileName: "融资汇总",
      });
    },
    /* 导出初始化数据 */ formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          if (j === "dkrqq") {
            return String(v[j]) == "null" ? "" : String(v[j]).substring(0, 10);
          }
          if (
            j === "sxje" ||
            j === "tiMoney" ||
            j === "dyje" ||
            j === "bzj" ||
            j === "tiMoney" ||
            j === "yhBenjin" ||
            j === "yhLixi" ||
            j === "whMoneySum" ||
            j === "whBenjin" ||
            j === "whLixi" ||
            j === "monthBenjinSum" ||
            j === "monthLixiSum" ||
            j === "yearBenjinSum" ||
            j === "yearLixiSum"
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
          const multiHeader = [
            [
              "融资汇总",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
            ],
          ];
          const multiHeader2 = [
            [
              "合同编号",
              "融资主体",
              "金融机构",
              "日期",
              "融资类型",
              "授信额度",
              "融资成本(或利率)%",
              "期限(天)",
              "提款金额",
              "质押金额",
              "保证金",
              "已还贷款",
              "",
              "尚欠贷款",
              "",
              "",
              "还款计划",
              "",
              "",
              "",
            ],
          ];
          const multiHeader3 = [
            [
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "本金",
              "利息",
              "小计",
              "本金",
              "利息",
              `${String(this.selectParams.endDate).substring(0, 4)}年${String(
                this.selectParams.endDate
              ).substring(5, 7)}月`,
              "",
              `${String(this.selectParams.endDate).substring(0, 4)}年`,
              "",
            ],
          ];
          const tHeader = [
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "本金",
            "利息",
            "本金",
            "利息",
          ];
          const filterVal = [
            "dkdbhs",
            "ztName",
            "jinRongJiGou",
            "dkrqq",
            "lxName",
            "sxje",
            "lilv",
            "qx",
            "tiMoney",
            "dyje",
            "bzj",
            "yhBenjin",
            "yhLixi",
            "whMoneySum",
            "whBenjin",
            "whLixi",
            "monthBenjinSum",
            "monthLixiSum",
            "yearBenjinSum",
            "yearLixiSum",
          ];
          const list = res.data.records;
          const data = this.formatJson(filterVal, list);
          const merges = [
            "A1:T1",
            "A2:A4",
            "B2:B4",
            "C2:C4",
            "D2:D4",
            "E2:E4",
            "F2:F4",
            "G2:G4",
            "H2:H4",
            "I2:I4",
            "J2:J4",
            "K2:K4",
            "L2:M2",
            "L3:L4",
            "M3:M4",
            "N2:P2",
            "N3:N4",
            "O3:O4",
            "P3:P4",
            "Q2:T2",
            "Q3:R3",
            "S3:T3",
          ];
          excel.export_json_to_excel({
            multiHeader, //第一行表头
            multiHeader2, //第二行表头
            multiHeader3, //第三行表头
            header: tHeader, //第四行表头
            data,
            merges,
            filename: "融资汇总",
            autoWidth: true,
            bookType: "xlsx",
          });
        });
      });
    },
    /* 初始化存单质押参与汇总 */ setSODRPP(val) {
      this.selectParams.isJoin = this.isJoin ? 1 : 0;
      this.getFinancingSummary();
    },
    /* 初始化时间参数 */ setTimeParams(val) {
      if (isNull(val)) {
        this.selectParams.startDate = "";
        this.selectParams.endDate = "";
      } else {
        this.selectParams.startDate = val[0];
        this.selectParams.endDate = val[1];
      }
      this.getFinancingSummary();
    },
    /* 初始化融资类型 */ setRzlxmc(val) {
      if (!isNull(val)) this.selectParams.rzlxmc = val.join(",");
      else this.selectParams.rzlxmc = "";
      this.getFinancingSummary();
    },
    /* 表格统计 */ getSummaries(param) {
      return tableTotal(param, [
        "授信额度",
        "提款金额",
        "保证金",
        "本金",
        "利息",
        "小计",
      ]);
    },
    /* 获取融资汇总 */ getFinancingSummary() {
      if (isNull(this.selectParams.startDate)) {
        let startNian = new Date().getFullYear(this.timeParams[0]);
        let startYue = new Date().getMonth(this.timeParams[0]) + 1;
        let startRi = new Date().getDate(this.timeParams[0]);
        if (startYue < 10) {
          startYue = `0${startYue}`;
        }
        if (startRi < 10) {
          startRi = `0${startRi}`;
        }
        this.selectParams.startDate = `${startNian - 5}-01-01`;
        this.selectParams.endDate = `${startNian}-${startYue}-${startRi}`;
      }
      this.publicSelect();
    },
  },
  mounted() {
    /* 获取融资汇总 */ this.getFinancingSummary();
  },
  components: { LeiXing, KeShi, GongSi },
  mixins: [publicMixin],
};
</script>

<style lang="scss">
.el-table__body-wrapper {
  z-index: 2;
}
</style>