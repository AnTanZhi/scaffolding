<template>
  <div class="view-container bg-gray">
    <div class="border-card">
      <header class="view-header" style="margin-bottom:0px !important">
        <div class="header-container">
          <el-form :inline="true" :model="selectParams" class="demo-form-inline">
            <div style="display:flex;justify-content: space-between;">
              <div>
                <el-form-item>
                  <LeiXing v-model="loser" @change="setLoser" style="width:220px" />
                </el-form-item>
                <el-form-item>
                  <el-select v-model="selectParams.year" style="width:80px" placeholder="年份" @change="getFundsArrive">
                    <el-option v-for="item in years" :key="item" :value="item" />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-select v-model="selectParams.month" @change="getFundsArrive" clearable style="width:80px"
                    placeholder="月份">
                    <el-option value="1" label="1" />
                    <el-option value="2" label="2" />
                    <el-option value="3" label="3" />
                    <el-option value="4" label="4" />
                    <el-option value="5" label="5" />
                    <el-option value="6" label="6" />
                    <el-option value="7" label="7" />
                    <el-option value="8" label="8" />
                    <el-option value="9" label="9" />
                    <el-option value="10" label="10" />
                    <el-option value="11" label="11" />
                    <el-option value="12" label="12" />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <KeShi v-model="selectParams.zrks" style="width:120px" @change="getFundsArrive" />
                </el-form-item>
                <el-form-item>
                  <el-input v-model="selectParams.jinRongJiGou" placeholder="金融机构" @input="getFundsArrive" clearable />
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
          :summary-method="getSummaries" show-summary>
          <el-table-column :label="`城投公司${selectParams.year}年到账资金情况表`" align="center">
            <el-table-column label="序号" type="index" align="center" width="50" />
            <el-table-column label="金融机构" prop="jinRongJiGou" show-overflow-tooltip />
            <el-table-column label="融资主体" prop="ztName" show-overflow-tooltip />
            <el-table-column label="融资类型" prop="lxName" />
            <el-table-column label="贷款期限(月)" prop="qxy" width="110" align="center" />
            <el-table-column label="金额(万元)" prop="efkjy" width="120" align="right"
              :formatter="row=>Number(row.efkjy).toFixed(6)" />
            <el-table-column label="放款凭证号" prop="fkpz" />
            <el-table-column label="手续费(万元)" prop="sxf" width="120" align="right"
              :formatter="row=>Number(row.sxf).toFixed(6)" />
            <el-table-column label="保证金(万元)" prop="bzj" width="120" align="right"
              :formatter="row=>Number(row.bzj).toFixed(6)" />
            <el-table-column label="实际可使用金额(万元)" prop="available" align="right" width="160"
              :formatter="row=>Number(row.available).toFixed(6)" />
            <el-table-column label="项目责任科室" prop="zrksName" width="110" align="center" />
            <el-table-column label="到账日期"
              :formatter="row=>String(row.efksj)=='null'?'':String(row.efksj).substring(0,10)" align="center"
              width="100" />
            <el-table-column label="合同利率" width="80" align="right" :formatter="row=>Number(row.lilv).toFixed(3)+'%'"
              show-overflow-tooltip />
            <el-table-column label="综合利率" width="80" align="right" :formatter="row=>Number(row.ptlv).toFixed(3)+'%'" />
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
import {
  tableTotal,
  isNull,
  getYearsSelect,
  exportMethod,
} from "@/utils/utils";
import guanLi from "@/api/guanLi";
export default {
  data() {
    return {
      /* 查询参数 */ selectParams: {
        pageIndex: 1,
        pageSize: 20,
        year: new Date().getFullYear(),
      },
      /* 年限 */ years: [],
      /* mixin参数 */ mixinParams: { api: guanLi, name: "getFundsArrive" },
      /* 没用的类型参数 */ loser: "",
    };
  },
  methods: {
    /* 导出还款预警 */ exportEG() {
      let [jinRongJiGou, month, rzlxmc, year, zrks] = [
        `jinRongJiGou=${this.selectParams.jinRongJiGou || ""}`,
        `month=${this.selectParams.month || ""}`,
        `rzlxmc=${this.selectParams.rzlxmc || ""}`,
        `year=${this.selectParams.year || ""}`,
        `zrks=${this.selectParams.zrks || ""}`,
      ];
      /* 导出 */ exportMethod({
        url: `${this.$store.state.upload.uploadHost}system/down/zjdz`,
        method: "POST",
        params: `${jinRongJiGou}&${month}&${rzlxmc}&${year}&${zrks}`,
        fileName: "资金到账情况表",
      });
    },
    /* 导出初始化数据 */ formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          if (j === "efksj") {
            return String(v[j]) == "null" ? "" : String(v[j]).substring(0, 10);
          }
          if (j === "efkjy" || j === "sxf" || j === "bzj" || j === "available")
            return Number(v[j]).toFixed(6);
          if (j === "lilv" || j === "ptlv")
            return Number(v[j]).toFixed(2) + "%";
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
              "城投公司2021年到账资金情况表",
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
          const tHeader = [
            "金融机构",
            "融资主体",
            "融资类型",
            "贷款期限(月)",
            "金额(万元)",
            "放款凭证号",
            "手续费(万元)",
            "保证金(万元)",
            "实际可使用金额(万元)",
            "项目责任科室",
            "到账日期",
            "合同利率",
            "综合利率",
          ];
          const filterVal = [
            "jinRongJiGou",
            "ztName",
            "lxName",
            "qxy",
            "efkjy",
            "fkpz",
            "sxf",
            "bzj",
            "available",
            "zrksName",
            "efksj",
            "lilv",
            "ptlv",
          ];
          const list = res.data.records;
          const data = this.formatJson(filterVal, list);
          const merges = ["A1:M1"];
          excel.export_json_to_excel({
            multiHeader, //这里是第一行的表头
            header: tHeader, //这里应该是算第三行的表头
            data,
            merges,
            filename: "资金到账情况表",
            autoWidth: true,
            bookType: "xlsx",
          });
        });
      });
    },
    /* 初始化类型参数 */ setLoser(val) {
      if (!isNull(val)) this.selectParams.rzlxmc = val.join(",");
      else this.selectParams.rzlxmc = "";
      this.getFundsArrive();
    },
    /* 获取表格 */ getFundsArrive() {
      this.publicSelect();
    },
    /* 表格合计 */ getSummaries(param) {
      return tableTotal(param, [
        "金额(万元)",
        "手续费(万元)",
        "保证金(万元)",
        "实际可使用金额(万元)",
      ]);
    },
    /* 获取年限 */ getYears() {
      this.years = getYearsSelect();
    },
  },
  mounted() {
    /* 获取表格 */ this.getFundsArrive();
    /* 获取年限 */ this.getYears();
  },
  components: { LeiXing, KeShi },
  mixins: [publicMixin],
};
</script>

<style lang="scss" scoped>
</style>