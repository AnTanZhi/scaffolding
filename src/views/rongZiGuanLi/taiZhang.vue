<template>
  <div class="view-container bg-gray">
    <div class="border-card">
      <header class="view-header" style="margin-bottom:0px !important">
        <div class="header-container">
          <el-form :inline="true" class="demo-form-inline">
            <div style="display:flex;justify-content: space-between;">
              <div>
                <el-form-item>
                  <LeiXing style="width:220px" v-model="selectParams.loserRzlxmc" @change="setLoser" />
                </el-form-item>
                <el-form-item>
                  <el-select clearable style="width:110px" v-model="selectParams.queryType">
                    <el-option value="金融机构" label="金融机构" />
                    <el-option value="融资主体" label="融资主体" />
                  </el-select>
                  <span>：</span>
                </el-form-item>
                <el-form-item>
                  <el-input placeholder="内容" v-model="selectParams.queryContent" @input="getFinancingLedger" />
                </el-form-item>
                <el-form-item>
                  <el-select v-model="selectParams.year" style="width:80px" placeholder="年限"
                    @change="getFinancingLedger">
                    <el-option v-for="item in tenYears" :key="item" :label="item" :value="item" />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <BiZhong v-model="selectParams.bz" style="width:90px" @change="getFinancingLedger" />
                </el-form-item>
                <el-form-item>
                  <GongSi v-model="selectParams.suoshugs" style="width:110px" @change="getFinancingLedger" />
                </el-form-item>
                <el-form-item>
                  <KeShi v-model="selectParams.zrks" style="width:110px" @change="getFinancingLedger" />
                </el-form-item>
                <el-form-item>
                  <el-date-picker v-model="selectParams.timeParam" type="daterange" range-separator="~"
                    start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss"
                    style="width:240px" @change="setTimeParam">
                  </el-date-picker>
                </el-form-item>
              </div>
              <div style="text-align: end;">
                <el-form-item>
                  <el-button type="primary" icon="el-icon-document-checked" @click="exportEG">导出</el-button>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </div>
      </header>
      <section class="table-container view-section">
        <div style="text-align:center;background: rgb(240, 250, 255);line-height:48px;font-weight: 600;">
          融资台账 (金额单位：万元)</div>
        <el-table :header-cell-style="{background:'#F0FAFF',color:'#787878'}" border stripe v-loading="loading"
          element-loading-text="加载中，请稍候……" :data="tableData" tooltip-effect="dark" style="width: 100%"
          :summary-method="getSummaries" show-summary>
          <el-table-column label="序号" type="index" width="50" align="center" fixed="left" />
          <el-table-column label="合同编号" prop="dkdbhs" show-overflow-tooltip fixed="left" />
          <el-table-column label="融资主体" prop="ztName" show-overflow-tooltip fixed="left" />
          <el-table-column label="金融机构" prop="jinRongJiGou" fixed="left" show-overflow-tooltip />
          <el-table-column label="融资类型" prop="lxName" width="140" fixed="left" />
          <el-table-column label="期限" width="180" fixed="left" prop="theTerm" align="center" />
          <el-table-column label="年利率" width="70" align="right" fixed="left"
            :formatter="row=>Number(row.lilv).toFixed(3)+'%'" show-overflow-tooltip />
          <el-table-column label="融资金额(万元)" prop="sxje" width="130" align="right" fixed="left"
            :formatter="row=>Number(row.sxje).toFixed(6)" />
          <el-table-column label="本期余额(万元)" prop="bqye" width="130" align="right" fixed="left"
            :formatter="row=>Number(row.bqye).toFixed(6)" />
          <el-table-column label="币种" prop="bz" width="70" fixed="left" align="center" />
          <el-table-column v-for="item in any" :key="item" :label="String(item)">
            <el-table-column label="还本" :prop="`benjin${item}`" align="right" width="120"
              :formatter="row=> Number(row[`benjin${item}`]).toFixed(6)" />
            <el-table-column label="付息" :prop="`lixi${item}`" align="right" width="120"
              :formatter="row=>Number(row[`lixi${item}`]).toFixed(6)" />
          </el-table-column>
          <el-table-column label="合计">
            <el-table-column label="还本" prop="totalPrincipal" align="right" width="120"
              :formatter="row=>Number(row.totalPrincipal).toFixed(6)" />
            <el-table-column label="付息" prop="totalInterest" align="right" width="120"
              :formatter="row=>Number(row.totalInterest).toFixed(6)" />
          </el-table-column>
        </el-table>
      </section>
      <el-pagination style="text-align: end;" background @size-change="sizeSelect" @current-change="pageSelect"
        :current-page="selectParams.pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="selectParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="total" />
    </div>
  </div>
</template>

<script>
import LeiXing from "@/myComponents/LeiXing";
import BiZhong from "@/myComponents/BiZhong";
import GongSi from "@/myComponents/GongSi";
import KeShi from "@/myComponents/KeShi";
import guanLi from "@/api/guanLi";
import publicMixin from "@/mixin/publicMixin";
import {
  getYearsSelectTen,
  tableTotal,
  isNull,
  exportMethod,
} from "@/utils/utils";
export default {
  data() {
    return {
      isYesNull: "",
      /* 查询参数 */ selectParams: {
        pageIndex: 1,
        pageSize: 20,
        queryType: "金融机构",
        year: new Date().getFullYear(),
      },
      /* mixin参数 */ mixinParams: { name: "getFinancingLedger", api: guanLi },
      /* 前后十年 */ tenYears: [],
      /* 没用的类型参数 */ loserRzlxmc: "",
      /* 日期参数 */ timeParam: "",
      /* 后十年 */ any: [],
    };
  },
  methods: {
    /* 导出融资管理 */ exportEG() {
      let [
        bz,
        endDate,
        queryContent,
        queryType,
        rzlxmc,
        startDate,
        suoshugs,
        year,
        zrks,
      ] = [
        `bz=${this.selectParams.bz || ""}`,
        `endDate=${this.selectParams.endDate || ""}`,
        `queryContent=${this.selectParams.queryContent || ""}`,
        `queryType=${this.selectParams.queryType || ""}`,
        `rzlxmc=${this.selectParams.rzlxmc || ""}`,
        `startDate=${this.selectParams.startDate || ""}`,
        `suoshugs=${this.selectParams.suoshugs || ""}`,
        `year=${this.selectParams.year || ""}`,
        `zrks=${this.selectParams.zrks || ""}`,
      ];
      /* 导出 */ exportMethod({
        url: `${this.$store.state.upload.uploadHost}system/down/rztz`,
        method: "POST",
        params: `${bz}&${endDate}&${queryContent}&${queryType}&${rzlxmc}&${startDate}&${suoshugs}&${year}&${zrks}`,
        fileName: "融资台账",
      });
    },
    /* 更改每页展示的数量 */ sizeSelect(size) {
      this.selectParams.pageSize = size;
      this.getFinancingLedger();
    },
    /* 分页查询 */ pageSelect(page) {
      this.selectParams.pageIndex = page;
      this.getFinancingLedger();
    },
    /* 导出初始化数据 */ formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          if (
            j === "sxje" ||
            j === "bqye" ||
            j === `benjin${this.selectParams.year}` ||
            j === `lixi${this.selectParams.year}` ||
            j === `benjin${this.selectParams.year + 1}` ||
            j === `lixi${this.selectParams.year + 1}` ||
            j === `benjin${this.selectParams.year + 2}` ||
            j === `lixi${this.selectParams.year + 2}` ||
            j === `benjin${this.selectParams.year + 3}` ||
            j === `lixi${this.selectParams.year + 3}` ||
            j === `benjin${this.selectParams.year + 4}` ||
            j === `lixi${this.selectParams.year + 4}` ||
            j === `benjin${this.selectParams.year + 5}` ||
            j === `lixi${this.selectParams.year + 5}` ||
            j === `benjin${this.selectParams.year + 6}` ||
            j === `lixi${this.selectParams.year + 6}` ||
            j === `benjin${this.selectParams.year + 7}` ||
            j === `lixi${this.selectParams.year + 7}` ||
            j === `benjin${this.selectParams.year + 8}` ||
            j === `lixi${this.selectParams.year + 8}` ||
            j === `benjin${this.selectParams.year + 9}` ||
            j === `lixi${this.selectParams.year + 9}` ||
            j === "totalPrincipal" ||
            j === "totalInterest"
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
              "融资台账  (金额单位：万元)",
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
              "融资类型",
              "期限",
              "年利率",
              "融资金额(万元)",
              "本期余额(万元)",
              "币种",
              `${this.selectParams.year}`,
              "",
              `${this.selectParams.year + 1}`,
              "",
              `${this.selectParams.year + 2}`,
              "",
              `${this.selectParams.year + 3}`,
              "",
              `${this.selectParams.year + 4}`,
              "",
              `${this.selectParams.year + 5}`,
              "",
              `${this.selectParams.year + 6}`,
              "",
              `${this.selectParams.year + 7}`,
              "",
              `${this.selectParams.year + 8}`,
              "",
              `${this.selectParams.year + 9}`,
              "",
              "合计",
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
            "还本",
            "利息",
            "还本",
            "利息",
            "还本",
            "利息",
            "还本",
            "利息",
            "还本",
            "利息",
            "还本",
            "利息",
            "还本",
            "利息",
            "还本",
            "利息",
            "还本",
            "利息",
            "还本",
            "利息",
            "还本",
            "利息",
          ];
          const merges = [
            "A1:AE1",
            "A2:A3",
            "B2:B3",
            "C2:C3",
            "D2:D3",
            "E2:E3",
            "F2:F3",
            "G2:G3",
            "H2:H3",
            "I2:I3",
            "J2:K2",
            "L2:M2",
            "N2:O2",
            "P2:Q2",
            "R2:S2",
            "T2:U2",
            "V2:W2",
            "X2:Y2",
            "Z2:AA2",
            "AB2:AC2",
            "AD2:AE2",
          ];
          const filterVal = [
            "dkdbhs",
            "ztName",
            "jinRongJiGou",
            "lxName",
            "theTerm",
            "lilv",
            "sxje",
            "bqye",
            "bz",
            `benjin${this.selectParams.year}`,
            `lixi${this.selectParams.year}`,
            `benjin${this.selectParams.year + 1}`,
            `lixi${this.selectParams.year + 1}`,
            `benjin${this.selectParams.year + 2}`,
            `lixi${this.selectParams.year + 2}`,
            `benjin${this.selectParams.year + 3}`,
            `lixi${this.selectParams.year + 3}`,
            `benjin${this.selectParams.year + 4}`,
            `lixi${this.selectParams.year + 4}`,
            `benjin${this.selectParams.year + 5}`,
            `lixi${this.selectParams.year + 5}`,
            `benjin${this.selectParams.year + 6}`,
            `lixi${this.selectParams.year + 6}`,
            `benjin${this.selectParams.year + 7}`,
            `lixi${this.selectParams.year + 7}`,
            `benjin${this.selectParams.year + 8}`,
            `lixi${this.selectParams.year + 8}`,
            `benjin${this.selectParams.year + 9}`,
            `lixi${this.selectParams.year + 9}`,
            "totalPrincipal",
            "totalInterest",
          ];
          Object.freeze(res.data.records).forEach((itemS) => {
            this.$set(
              itemS,
              "theTerm",
              `${String(itemS.dkrqq).substring(0, 10)}~${String(
                itemS.dkrqz
              ).substring(0, 10)}`
            );
            this.any.forEach((itemSS) => {
              if (!isNull(itemS.huankuan)) {
                itemS.huankuan.forEach((itemSSS) => {
                  if (itemSS == itemSSS.year) {
                    this.$set(itemS, `benjin${itemSS}`, itemSSS.benjin);
                    this.$set(itemS, `lixi${itemSS}`, itemSSS.lixi);
                  } else {
                    this.$set(itemS, `benjin${itemSS}`, 0);
                    this.$set(itemS, `lixi${itemSS}`, 0);
                  }
                });
              } else {
                this.$set(itemS, `benjin${itemSS}`, 0);
                this.$set(itemS, `lixi${itemSS}`, 0);
              }
            });
          });
          Object.freeze(res.data.records).forEach((itemS) => {
            let totalPrincipal = 0;
            let totalInterest = 0;
            this.any.forEach((itemSS) => {
              totalPrincipal += itemS[`benjin${itemSS}`];
              totalInterest += itemS[`lixi${itemSS}`];
            });
            this.$set(itemS, "totalPrincipal", totalPrincipal);
            this.$set(itemS, "totalInterest", totalInterest);
          });
          const list = Object.freeze(res.data.records);
          const data = this.formatJson(filterVal, list);
          excel.export_json_to_excel({
            multiHeader, //第一行表头
            multiHeader2, //第二行表头
            header: tHeader, //第三行表头
            data,
            merges,
            filename: "融资台账",
            autoWidth: true,
            bookType: "xlsx",
          });
        });
      });
    },
    /* 初始化日期参数 */ setTimeParam(val) {
      if (isNull(val)) {
        this.selectParams.startDate = "";
        this.selectParams.endDate = "";
      } else {
        this.selectParams.startDate = val[0];
        this.selectParams.endDate = val[1];
      }
    },
    /* 初始化类型参数 */ setLoser(val) {
      if (!isNull(val)) this.selectParams.rzlxmc = val.join(",");
      else this.selectParams.rzlxmc = "";
      this.getFinancingLedger();
    },
    /* 获取融资台账 */ getFinancingLedger() {
      /* 后十年 */ this.setAny();
      guanLi.getFinancingLedger(this.selectParams).then((res) => {
        this.tableData = res.data.records;
        this.total = res.data.total;
        this.tableData.forEach((itemS) => {
          this.$set(
            itemS,
            "theTerm",
            `${String(itemS.dkrqq).substring(0, 10)}~${String(
              itemS.dkrqz
            ).substring(0, 10)}`
          );
          this.any.forEach((itemSS) => {
            if (!isNull(itemS.huankuan)) {
              itemS.huankuan.forEach((itemSSS) => {
                if (itemSS == itemSSS.year) {
                  this.$set(itemS, `benjin${itemSS}`, itemSSS.benjin);
                  this.$set(itemS, `lixi${itemSS}`, itemSSS.lixi);
                } else {
                  this.$set(itemS, `benjin${itemSS}`, 0);
                  this.$set(itemS, `lixi${itemSS}`, 0);
                }
              });
            } else {
              this.$set(itemS, `benjin${itemSS}`, 0);
              this.$set(itemS, `lixi${itemSS}`, 0);
            }
          });
        });
        this.tableData.forEach((itemS) => {
          let totalPrincipal = 0;
          let totalInterest = 0;
          this.any.forEach((itemSS) => {
            totalPrincipal += itemS[`benjin${itemSS}`];
            totalInterest += itemS[`lixi${itemSS}`];
          });
          this.$set(itemS, "totalPrincipal", totalPrincipal);
          this.$set(itemS, "totalInterest", totalInterest);
        });
      });
    },
    /* 表格合计 */ getSummaries(param) {
      return tableTotal(param, [
        "融资金额(万元)",
        "本期余额(万元)",
        "还本",
        "付息",
      ]);
    },
    /* 前五年后四年 */ getYearsSelectTen() {
      this.tenYears = getYearsSelectTen();
    },
    /* 后十年 */ setAny() {
      this.any = [
        this.selectParams.year,
        this.selectParams.year + 1,
        this.selectParams.year + 2,
        this.selectParams.year + 3,
        this.selectParams.year + 4,
        this.selectParams.year + 5,
        this.selectParams.year + 6,
        this.selectParams.year + 7,
        this.selectParams.year + 8,
        this.selectParams.year + 9,
      ];
    },
  },
  mounted() {
    /* 获取融资台账 */ this.getFinancingLedger();
    /* 前五年后四年 */ this.getYearsSelectTen();
  },
  components: { LeiXing, BiZhong, GongSi, KeShi },
  mixins: [publicMixin],
};
</script>

<style lang="scss">
.el-table__body-wrapper {
  z-index: 2;
}
</style>