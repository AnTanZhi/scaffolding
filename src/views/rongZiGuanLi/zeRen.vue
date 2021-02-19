<template>
  <div class="view-container bg-gray">
    <div class="border-card">
      <header class="view-header" style="margin-bottom:0px !important">
        <div class="header-container">
          <el-form :inline="true" :model="selectParams" class="demo-form-inline">
            <div style="display:flex;justify-content: space-between;">
              <div>
                <el-form-item>
                  <el-select v-model="selectParams.startYear" style="width:80px" @change="filterYear">
                    <el-option v-for="item in twoDecades1" :key="item" :value="item" />
                  </el-select>
                  <el-select v-model="selectParams.startMonth" style="width:80px" @change="getResponsibility">
                    <el-option v-for="item in december" :key="item-1" :value="item" />
                  </el-select>
                  --
                  <el-select v-model="selectParams.endYear" style="width:80px" @change="getResponsibility">
                    <el-option v-for="item in twoDecades2" :key="item" :value="item" />
                  </el-select>
                  <el-select v-model="selectParams.endMonth" style="width:80px" @change="getResponsibility">
                    <el-option v-for="item in december" :key="item-1" :value="item" />
                  </el-select>
                </el-form-item>
              </div>
              <div>
                <el-form-item>
                  <el-button type="primary" icon="el-icon-document-checked" @click="exportEG">导出</el-button>
                  <div style="display: inline;margin-left: 10px;">
                    金额单位：万元
                  </div>
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
          <el-table-column
            :label="`${selectParams.startYear}年${selectParams.startMonth} - ${selectParams.endYear}年${selectParams.endMonth}月份还本付息责任表 截止${new Date().getFullYear()}年${new Date().getMonth()+1}月${new Date().getDate()}日数据`"
            align="center">
            <el-table-column prop="time" align="center" width="80" />
            <el-table-column label="还本付息总额" prop="money" align="right" :formatter="row=>Number(row.money).toFixed(6)"
              width="130" />
            <el-table-column label="本金" prop="benjin" align="right" :formatter="row=>Number(row.benjin).toFixed(6)"
              width="130" />
            <el-table-column label="利息" prop="lixi" align="right" :formatter="row=>Number(row.lixi).toFixed(6)"
              width="130" />
            <el-table-column label="低风险业务" prop="lowRiskBusiness" align="right" width="130"
              :formatter="row=>Number(row.lowRiskBusiness).toFixed(6)" />
            <el-table-column label="低风险业务明细">
              <template slot-scope="s">
                <div v-for="(item,index) in s.row.responsibilityDFX" :key="index">
                  {{Number(item.money).toFixed(6)}}:{{item.zwmc}}</div>
              </template>
            </el-table-column>
            <el-table-column label="可续贷" prop="canXudai" width="130" align="right"
              :formatter="row=>Number(row.canXudai).toFixed(6)" />
            <el-table-column label="可续贷明细">
              <template slot-scope="s">
                <div v-for="(item,index) in s.row.responsibilityKXD" :key="index">
                  {{Number(item.money).toFixed(6)}}:{{item.zwmc}}</div>
              </template>
            </el-table-column>
            <el-table-column label="还本付息净额" prop="netDebtService" width="130" align="right"
              :formatter="row=>Number(row.netDebtService).toFixed(6)" />
            <el-table-column label="还本付息明细">
              <template slot-scope="s">
                <div v-for="(item,index) in s.row.responsibilityHBFX" :key="index">
                  {{Number(item.money).toFixed(6)}}:{{item.zwmc}}</div>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </section>
    </div>
  </div>
</template>

<script>
import {
  getYearsSelect,
  tableTotal,
  dateRange,
  isNull,
  exportMethod,
} from "@/utils/utils";
import publicMixin from "@/mixin/publicMixin";
import guanLi from "@/api/guanLi";
export default {
  data() {
    return {
      /* 查询参数 */ selectParams: {
        startYear: new Date().getFullYear(),
        startMonth: "01",
        endYear: new Date().getFullYear(),
        endMonth: 12,
      },
      /* 前后20年 */ twoDecades1: [],
      /* 前后20年 */ twoDecades2: [],
      /* 12月 */ december: [
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        10,
        11,
        12,
      ],
      /* mixin参数 */ mixinParams: {
        name: "getTableDebtServiceLiability",
        api: guanLi,
      },
      /* 备用数组 */ array: [],
    };
  },
  methods: {
    /* 导出还款预警 */ exportEG() {
      let [endMonth, endYear, startMonth, startYear] = [
        `endMonth=${this.selectParams.endMonth || ""}`,
        `endYear=${this.selectParams.endYear || ""}`,
        `startMonth=${this.selectParams.startMonth || ""}`,
        `startYear=${this.selectParams.startYear || ""}`,
      ];
      /* 导出 */ exportMethod({
        url: `${this.$store.state.upload.uploadHost}system/down/hkzr`,
        method: "POST",
        params: `${endMonth}&${endYear}&${startMonth}&${startYear}`,
        fileName: "还本付息责任表",
      });
    },
    /* 导出初始化数据 */ formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          if (j === "sxje") return Number(v[j]).toFixed(6);
          return v[j];
        })
      );
    },
    /* 导出 */ exportXLSX() {
      guanLi[this.mixinParams.name](this.selectParams).then((res) => {
        import("@/vendor/Export2Excel").then((excel) => {
          const multiHeader = [
            [
              `${this.selectParams.startYear}年${
                this.selectParams.startMonth
              }月份-${this.selectParams.endYear}年${
                this.selectParams.endMonth
              }月份还本付息责任表 截止${new Date().getFullYear()}年${
                new Date().getMonth() + 1
              }月${new Date().getDate()}日数据`,
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
          const tHeader = [
            "",
            "还本付息总额",
            "本金",
            "利息",
            "低风险业务",
            "低风险业务明细",
            "可续贷",
            "可续贷明细",
            "还本付息净额",
            "还本付息明细",
          ];
          const merges = ["A1:J1"];
          const filterVal = [
            "time",
            "money",
            "benjin",
            "lixi",
            "lowRiskBusiness",
            "dfx",
            "canXudai",
            "kxd",
            "netDebtService",
            "hbfx",
          ];
          let list = JSON.stringify(this.tableData);
          list = JSON.parse(list);
          list.forEach((item) => {
            this.$set(item, "dfx", []);
            this.$set(item, "kxd", []);
            this.$set(item, "hbfx", []);
            item.responsibilityDFX.forEach((item2) => {
              item.dfx.push(`${Number(item2.money).toFixed(6)}:${item2.zwmc}`);
            });
            item.responsibilityKXD.forEach((item2) => {
              item.kxd.push(`${Number(item2.money).toFixed(6)}:${item2.zwmc}`);
            });
            item.responsibilityHBFX.forEach((item2) => {
              item.hbfx.push(`${Number(item2.money).toFixed(6)}:${item2.zwmc}`);
            });
            item.dfx = item.dfx.join("\n");
            item.kxd = item.kxd.join("\n");
            item.hbfx = item.hbfx.join("\n");
          });
          const data = this.formatJson(filterVal, list);
          excel.export_json_to_excel({
            multiHeader, //第一行表头
            header: tHeader, //第三行表头
            data,
            merges,
            filename: "还本付息责任表",
            autoWidth: true,
            bookType: "xlsx",
          });
        });
      });
    },
    /* 获取责任表 */ getResponsibility() {
      this.array = dateRange(
        this.selectParams.startYear,
        this.selectParams.startMonth,
        this.selectParams.endYear,
        this.selectParams.endMonth
      );
      this.loading = true;
      if (this.selectParams.startYear == this.selectParams.endYear) {
        if (this.selectParams.endMonth < this.selectParams.startMonth) {
          this.$message.error("月份选择有误");
          this.loading = false;
          return false;
        }
      }
      guanLi.getTableDebtServiceLiability(this.selectParams).then((res) => {
        this.tableData = res.data;
        let map = new Map();
        this.tableData.forEach((item) => {
          this.$set(item, "time", `${item.year}.${item.month}`);
          map.set(`${item.year}.${item.month}`, item);
        });
        console.log(this.array, "array");
        this.array.forEach((r, i) => {
          if (map.get(`${r.year}.${r.month}`)) {
            this.array[i] = map.get(`${r.year}.${r.month}`);
            /* 低风险业务 */
            let lowRiskBusiness = 0;
            if (isNull(this.array[i].responsibilityDFX)) {
              this.$set(this.array[i], "lowRiskBusiness", 0);
            } else {
              this.array[i].responsibilityDFX.forEach((item) => {
                lowRiskBusiness += item.money;
              });
              this.$set(this.array[i], "lowRiskBusiness", lowRiskBusiness);
            }
            /* 可续贷 */
            let canXudai = 0;
            if (isNull(this.array[i].responsibilityKXD)) {
              this.$set(this.array[i], "canXudai", 0);
            } else {
              this.array[i].responsibilityKXD.forEach((item) => {
                canXudai += item.money;
              });
              this.$set(this.array[i], "canXudai", canXudai);
            }
            /* 还本付息净额 */
            let netDebtService = 0;
            if (isNull(this.array[i].responsibilityHBFX)) {
              this.$set(this.array[i], "netDebtService", 0);
            } else {
              this.array[i].responsibilityHBFX.forEach((item) => {
                netDebtService += item.money;
                this.$set(this.array[i], "netDebtService", netDebtService);
              });
            }
          } else {
            this.$set(
              this.array[i],
              "time",
              `${this.array[i].year}.${this.array[i].month}`
            );
            this.$set(this.array[i], "money", 0);
            this.$set(this.array[i], "benjin", 0);
            this.$set(this.array[i], "lixi", 0);
            this.$set(this.array[i], "responsibilityDFX", []);
            this.$set(this.array[i], "lowRiskBusiness", 0.0);
            this.$set(this.array[i], "responsibilityKXD", []);
            this.$set(this.array[i], "canXudai", 0.0);
            this.$set(this.array[i], "responsibilityHBFX", []);
            this.$set(this.array[i], "netDebtService", 0.0);
          }
        });
        this.tableData = this.array;
        this.loading = false;
      });
    },
    /* 表格合计 */ getSummaries(param) {
      return tableTotal(param, [
        "还本付息总额",
        "本金",
        "利息",
        "低风险业务",
        "可续贷",
        "还本付息净额",
      ]);
    },
    /* 筛选年份 */ filterYear() {
      this.twoDecades2 = this.twoDecades1;
      this.twoDecades2 = this.twoDecades2.filter(
        (v) => v >= this.selectParams.startYear
      );
      this.selectParams.endYear = this.twoDecades2[this.twoDecades2.length - 1];
      this.getResponsibility();
    },
    /* 前后20年 */ getTwoDecades() {
      this.twoDecades1 = getYearsSelect();
      this.twoDecades2 = getYearsSelect();
    },
  },
  mounted() {
    /* 获取责任表 */ this.getResponsibility();
    /* 获取前后20年 */ this.getTwoDecades();
  },
  mixins: [publicMixin],
};
</script>

<style lang="sass" scoped>
</style>