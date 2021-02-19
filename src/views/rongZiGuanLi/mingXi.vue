<template>
  <div class="view-container bg-gray">
    <div class="border-card">
      <header class="view-header" style="margin-bottom:0px !important">
        <div class="header-container">
          <el-form :inline="true" class="demo-form-inline">
            <div style="display:flex;justify-content: space-between;">
              <div>
                <el-form-item>
                  <LeiXing v-model="loserFTparams" style="width:230px" @change="setFinancingType" />
                </el-form-item>
                <el-form-item>
                  <div style="display:flex">
                    <el-select v-model="selectParams.queryType" style="width:105px">
                      <el-option label="金融机构" value="金融机构" />
                      <el-option label="融资主体" value="融资主体" />
                    </el-select>：
                    <el-input v-model="selectParams.queryContent" clearable style="width:200px"
                      @input="getDebtServiceDetails" />
                  </div>
                </el-form-item>
                <el-form-item>
                  <el-select v-model="selectParams.year" style="width:100px" @change="getDebtServiceDetails">
                    <el-option v-for="item in tenYears" :key="item" :label="item" :value="item" />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <BiZhong v-model="selectParams.bz" style="width:100px" @change="getDebtServiceDetails" />
                </el-form-item>
                <el-form-item>
                  <GongSi v-model="selectParams.suoshugs" style="width:110px" @change="getDebtServiceDetails" />
                </el-form-item>
                <el-form-item>
                  <KeShi v-model="selectParams.zrks" style="width:110px" @change="getDebtServiceDetails" />
                </el-form-item>
                <el-form-item>
                  <el-date-picker v-model="timeParams" type="daterange" range-separator="~" start-placeholder="贷款日期"
                    end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" style="width:240px"
                    @change="setTimeParams">
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
          还本付息明细 (金额单位：万元)</div>
        <el-table :header-cell-style="{background:'#F0FAFF',color:'#787878'}" border stripe v-loading="loading"
          element-loading-text="加载中，请稍候……" :data="tableData" tooltip-effect="dark" style="width: 100%"
          :summary-method="getSummaries" show-summary>
          <el-table-column label="序号" type="index" width="50" align="center" fixed="left" />
          <el-table-column label="债务名称" prop="zwmc" show-overflow-tooltip fixed="left" />
          <el-table-column label="融资主体" prop="ztName" show-overflow-tooltip fixed="left" />
          <el-table-column label="金融机构" prop="jinRongJiGou" show-overflow-tooltip fixed="left" />
          <el-table-column label="融资类型" prop="lxName" show-overflow-tooltip fixed="left" />
          <el-table-column label="总金额(万元)" prop="efkjy" align="right" width="130" fixed="left"
            :formatter="row=>Number(row.efkjy).toFixed(6)" />
          <el-table-column label="年初余额(万元)" prop="benjin" align="right" width="130" fixed="left"
            :formatter="row=>Number(row.benjin).toFixed(6)" />
          <el-table-column label="借款起始日期" align="center" width="110" fixed="left"
            :formatter="row=>String(row.dkrqq)==''?'':String(row.dkrqq).substring(0,10)" />
          <el-table-column label="借款截止日期" align="center" width="110" fixed="left"
            :formatter="row=>String(row.dkrqz)==''?'':String(row.dkrqz).substring(0,10)" />
          <el-table-column label="利率" align="right" width="100" fixed="left"
            :formatter="row=>Number(row.lilv).toFixed(3)+'%'" />
          <el-table-column label="币种" prop="bz" width="70" align="center" fixed="left" />
          <el-table-column v-for="item in month" :key="item" :label="`${item}月`">
            <el-table-column label="本金" :prop="`bj${item}`" width="120" align="right"
              :formatter="row=>Number(row[`bj${item}`]).toFixed(6)" />
            <el-table-column label="利息" :prop="`lx${item}`" width="120" align="right"
              :formatter="row=>Number(row[`lx${item}`]).toFixed(6)" />
          </el-table-column>
          <el-table-column label="合计">
            <el-table-column label="本金" prop="bjm" width="120" align="right"
              :formatter="row=>Number(row.bjm).toFixed(6)" />
            <el-table-column label="利息" prop="lxm" width="120" align="right"
              :formatter="row=>Number(row.lxm).toFixed(6)" />
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
      isNull: "",
      /* 查询参数 */ selectParams: {
        pageIndex: 1,
        pageSize: 20,
        year: new Date().getFullYear(),
      },
      /* 备用融资类型参数 */ loserFTparams: "",
      /* mixin参数 */ mixinParams: {
        name: "getDebtServiceDetails",
        api: guanLi,
      },
      /* 年份 */ tenYears: "",
      /* 日期参数 */ timeParams: "",
      /* 月份 */ month: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
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
        url: `${this.$store.state.upload.uploadHost}system/down/hkmx`,
        method: "POST",
        params: `${bz}&${endDate}&${queryContent}&${queryType}&${rzlxmc}&${startDate}&${suoshugs}&${year}&${zrks}`,
        fileName: "还本付息明细",
      });
    },
    /* 导出初始化数据 */ formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          if (
            j == "efkjy" ||
            j == "benjin" ||
            j == "bj1" ||
            j == "lx1" ||
            j == "bj2" ||
            j == "lx2" ||
            j == "bj3" ||
            j == "lx3" ||
            j == "bj4" ||
            j == "lx4" ||
            j == "bj5" ||
            j == "lx5" ||
            j == "bj6" ||
            j == "lx6" ||
            j == "bj7" ||
            j == "lx7" ||
            j == "bj8" ||
            j == "lx8" ||
            j == "bj9" ||
            j == "lx9" ||
            j == "bj10" ||
            j == "lx10" ||
            j == "bj11" ||
            j == "lx11" ||
            j == "bj12" ||
            j == "lx12" ||
            j == "bjm" ||
            j == "lxm"
          )
            return Number(v[j]).toFixed(6);
          if (j == "dkrqq" || j == "dkrqz")
            return String(v[j]) == "" ? "" : String(v[j]).substring(0, 10);
          if (j == "lilv") return Number(v[j]).toFixed(2);
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
              "还本付息明细  (金额单位：万元)",
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
              "",
              "",
              "",
              "",
              "",
            ],
          ];
          const multiHeader2 = [
            [
              "债务名称",
              "融资主体",
              "金融机构",
              "融资类型",
              "总金额(万元)",
              "年初余额(万元)",
              "借款起始日期",
              "借款截止日期",
              "利率",
              "币种",
              "1月",
              "",
              "2月",
              "",
              "3月",
              "",
              "4月",
              "",
              "5月",
              "",
              "6月",
              "",
              "7月",
              "",
              "8月",
              "",
              "9月",
              "",
              "10月",
              "",
              "11月",
              "",
              "12月",
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
            "",
            "本金",
            "利息",
            "本金",
            "利息",
            "本金",
            "利息",
            "本金",
            "利息",
            "本金",
            "利息",
            "本金",
            "利息",
            "本金",
            "利息",
            "本金",
            "利息",
            "本金",
            "利息",
            "本金",
            "利息",
            "本金",
            "利息",
            "本金",
            "利息",
            "本金",
            "利息",
          ];
          const merges = [
            "A1:AJ1",
            "A2:A3",
            "B2:B3",
            "C2:C3",
            "D2:D3",
            "E2:E3",
            "F2:F3",
            "G2:G3",
            "H2:H3",
            "I2:I3",
            "J2:J3",
            "K2:L2",
            "M2:N2",
            "O2:P2",
            "Q2:R2",
            "S2:T2",
            "U2:V2",
            "W2:X2",
            "Y2:Z2",
            "AA2:AB2",
            "AC2:AD2",
            "AE2:AF2",
            "AG2:AH2",
            "AI2:AJ2",
          ];
          const filterVal = [
            "zwmc",
            "ztName",
            "jinRongJiGou",
            "lxName",
            "efkjy",
            "benjin",
            "dkrqq",
            "dkrqz",
            "lilv",
            "bz",
            "bj1",
            "lx1",
            "bj2",
            "lx2",
            "bj3",
            "lx3",
            "bj4",
            "lx4",
            "bj5",
            "lx5",
            "bj6",
            "lx6",
            "bj7",
            "lx7",
            "bj8",
            "lx8",
            "bj9",
            "lx9",
            "bj10",
            "lx10",
            "bj11",
            "lx11",
            "bj12",
            "lx12",
            "bjm",
            "lxm",
          ];
          Object.freeze(res.data.records).forEach((itemS) => {
            this.month.forEach((itemSS) => {
              if (isNull(itemS.huankuan)) {
                this.$set(itemS, "bj1", 0);
                this.$set(itemS, "lx1", 0);
                this.$set(itemS, "bj2", 0);
                this.$set(itemS, "lx2", 0);
                this.$set(itemS, "bj3", 0);
                this.$set(itemS, "lx3", 0);
                this.$set(itemS, "bj4", 0);
                this.$set(itemS, "lx4", 0);
                this.$set(itemS, "bj5", 0);
                this.$set(itemS, "lx5", 0);
                this.$set(itemS, "bj6", 0);
                this.$set(itemS, "lx6", 0);
                this.$set(itemS, "bj7", 0);
                this.$set(itemS, "lx7", 0);
                this.$set(itemS, "bj8", 0);
                this.$set(itemS, "lx8", 0);
                this.$set(itemS, "bj9", 0);
                this.$set(itemS, "lx9", 0);
                this.$set(itemS, "bj10", 0);
                this.$set(itemS, "lx10", 0);
                this.$set(itemS, "bj11", 0);
                this.$set(itemS, "lx11", 0);
                this.$set(itemS, "bj12", 0);
                this.$set(itemS, "lx12", 0);
              } else {
                itemS.huankuan.forEach((itemSSS) => {
                  if (itemSS == itemSSS.month) {
                    this.$set(itemS, `bj${itemSS}`, itemSSS.benjin);
                    this.$set(itemS, `lx${itemSS}`, itemSSS.lixi);
                  } else {
                    this.$set(itemS, `bj${itemSS}`, 0);
                    this.$set(itemS, `lx${itemSS}`, 0);
                  }
                });
              }
            });
          });
          Object.freeze(res.data.records).forEach((itemS) => {
            let bjm = 0;
            let lxm = 0;
            this.month.forEach((itemSS) => {
              bjm += itemS[`bj${itemSS}`];
              lxm += itemS[`lx${itemSS}`];
            });
            this.$set(itemS, "bjm", bjm);
            this.$set(itemS, "lxm", lxm);
          });
          const list = Object.freeze(res.data.records);
          const data = this.formatJson(filterVal, list);
          excel.export_json_to_excel({
            multiHeader, //第一行表头
            multiHeader2, //第二行表头
            header: tHeader, //第三行表头
            data,
            merges,
            filename: "还本付息明细",
            autoWidth: true,
            bookType: "xlsx",
          });
        });
      });
    },
    /* 分页查询 */ pageSelect(page) {
      this.selectParams.pageIndex = page;
      this.getDebtServiceDetails();
    },
    /* 更改每页展示的数据 */ sizeSelect(size) {
      this.selectParams.pageSize = size;
      this.getDebtServiceDetails();
    },
    /* 表格合计 */ getSummaries(param) {
      return tableTotal(param, [
        "总金额(万元)",
        "年初余额(万元)",
        "本金",
        "利息",
      ]);
    },
    /* 初始化日期参数 */ setTimeParams(val) {
      if (isNull(val)) {
        this.selectParams.startDate = "";
        this.selectParams.endDate = "";
      } else {
        this.selectParams.startDate = val[0];
        this.selectParams.endDate = val[1];
      }
      this.getDebtServiceDetails();
    },
    /* 获取还本付息明细 */ getDebtServiceDetails() {
      guanLi.getDebtServiceDetails(this.selectParams).then((res) => {
        this.total = res.data.total;
        this.tableData = res.data.records;
        this.tableData.forEach((itemS) => {
          this.month.forEach((itemSS) => {
            if (isNull(itemS.huankuan)) {
              this.$set(itemS, "bj1", 0);
              this.$set(itemS, "lx1", 0);
              this.$set(itemS, "bj2", 0);
              this.$set(itemS, "lx2", 0);
              this.$set(itemS, "bj3", 0);
              this.$set(itemS, "lx3", 0);
              this.$set(itemS, "bj4", 0);
              this.$set(itemS, "lx4", 0);
              this.$set(itemS, "bj5", 0);
              this.$set(itemS, "lx5", 0);
              this.$set(itemS, "bj6", 0);
              this.$set(itemS, "lx6", 0);
              this.$set(itemS, "bj7", 0);
              this.$set(itemS, "lx7", 0);
              this.$set(itemS, "bj8", 0);
              this.$set(itemS, "lx8", 0);
              this.$set(itemS, "bj9", 0);
              this.$set(itemS, "lx9", 0);
              this.$set(itemS, "bj10", 0);
              this.$set(itemS, "lx10", 0);
              this.$set(itemS, "bj11", 0);
              this.$set(itemS, "lx11", 0);
              this.$set(itemS, "bj12", 0);
              this.$set(itemS, "lx12", 0);
            } else {
              itemS.huankuan.forEach((itemSSS) => {
                if (itemSS == itemSSS.month) {
                  this.$set(itemS, `bj${itemSS}`, itemSSS.benjin);
                  this.$set(itemS, `lx${itemSS}`, itemSSS.lixi);
                } else {
                  this.$set(itemS, `bj${itemSS}`, 0);
                  this.$set(itemS, `lx${itemSS}`, 0);
                }
              });
            }
          });
        });
        this.tableData.forEach((itemS) => {
          let bjm = 0;
          let lxm = 0;
          this.month.forEach((itemSS) => {
            bjm += itemS[`bj${itemSS}`];
            lxm += itemS[`lx${itemSS}`];
          });
          this.$set(itemS, "bjm", bjm);
          this.$set(itemS, "lxm", lxm);
        });
      });
    },
    /* 初始化融资类型 */ setFinancingType(val) {
      if (!isNull(val)) this.selectParams.rzlxmc = val.join(",");
      else this.selectParams.rzlxmc = "";
      this.getDebtServiceDetails();
    },
    /* 前五年后四年 */ getYearsSelectTen() {
      this.tenYears = getYearsSelectTen();
    },
  },
  mounted() {
    /* 获取还本付息 */ this.getDebtServiceDetails();
    /* 前五年后四年 */ this.getYearsSelectTen();
  },
  components: { LeiXing, BiZhong, GongSi, KeShi },
  mixins: [publicMixin],
};
</script>

<style lang="scss" scoped>
</style>