<template>
  <div class="view-container bg-gray">
    <div class="border-card">
      <header class="view-header" style="margin-bottom:0px !important">
        <div class="header-container">
          <el-form :inline="true" class="demo-form-inline">
            <div style="display:flex;justify-content: space-between;">
              <div>
                <el-form-item>
                  <el-date-picker v-model="selectParams.yearMonth" type="month" placeholder="选择月" value-format="yyyy-MM"
                    @change="getMonthlyWorkPlan" :clearable="false" />
                </el-form-item>
              </div>
              <div style="text-align: end;">
                <el-form-item>
                  <el-button type="primary" icon="el-icon-document-checked" @click="exportEG">导出</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" icon="el-icon-plus" @click="()=>{addOrUpdateDig=true;addOrUpdParams={}}">
                    添加计划</el-button>
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
          <el-table-column :label="`${selectParams.yearMonth.substring(5,7)}月份拟放款项目`" align="center">
            <el-table-column label="序号" type="index" width="50" align="center" />
            <el-table-column label="金融机构" prop="jinRongName" />
            <el-table-column label="资金品种" prop="moneyType" />
            <el-table-column label="额度(万元)" prop="xianYeDu" align="right" width="130" show-overflow-tooltip
              :formatter="row=>Number(row.xianYeDu).toFixed(6)" />
            <el-table-column label="期限" prop="quXian" width="80" align="center" show-overflow-tooltip />
            <el-table-column label="进展情况" prop="qingKuan" show-overflow-tooltip />
            <el-table-column label="预计到账时间" prop="daoZhangTime" width="110" align="center"
              :formatter="row=>String(row.daoZhangTime)=='null'?'':String(row.daoZhangTime).substring(0,10)" />
            <el-table-column label="实际到账金额(万元)" align="right" prop="sdaoZhangMoney"
              :formatter="row=>Number(row.sdaoZhangMoney).toFixed(6)" />
            <el-table-column label="实际到账时间" prop="sdaoZhangTime" width="110" align="center"
              :formatter="row=>String(row.sdaoZhangTime)=='null'?'':String(row.sdaoZhangTime).substring(0,10)" />
            <el-table-column label="负责人" prop="creatorName" width="90" align="center" />
            <el-table-column label="备注" prop="remarks" show-overflow-tooltip />
            <el-table-column label="操作" width="80" align="center">
              <template slot-scope="s">
                <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
                  <i class="el-icon-edit-outline edit-btn" @click="monthlyWorkPlanInfo(s.row.wrzId)" />
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
                  <i class="el-icon-delete edit-btn" @click="publicDel('delMonthlyWorkPlan',s.row.wrzId)" />
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
    <el-dialog title="添加月计划" :visible.sync="addOrUpdateDig" :close-on-click-modal="false" width="23%">
      <el-form :model="addOrUpdParams" label-position="right" label-width="110px" :rules="rules" ref="addOrUpdParams">
        <el-form-item label="年月：" prop="monthTime">
          <el-date-picker v-model="addOrUpdParams.monthTime" type="month" placeholder="选择年月" clearable
            value-format="yyyy-MM-dd HH:mm:ss" />
        </el-form-item>
        <el-form-item label="金融机构：" prop="jinRongName">
          <el-input clearable style="width:220px" v-model="addOrUpdParams.jinRongName" />
        </el-form-item>
        <el-form-item label="资金品种：" prop="moneyType">
          <el-input clearable style="width:220px" v-model="addOrUpdParams.moneyType" />
        </el-form-item>
        <el-form-item label="额度：">
          <el-input clearable type="number" style="width:220px;margin-right:10px" v-model="addOrUpdParams.xianYeDu" />
          万元
        </el-form-item>
        <el-form-item label="期限：">
          <el-input clearable style="width:220px" v-model="addOrUpdParams.quXian" />
        </el-form-item>
        <el-form-item label="进展情况：">
          <el-input type="textarea" :autosize="{ minRows: 4}" placeholder="请输入内容" style="width:220px"
            v-model="addOrUpdParams.qingKuan" />
        </el-form-item>
        <el-form-item label="预计到账时间：">
          <el-date-picker type="date" placeholder="选择日期" clearable v-model="addOrUpdParams.daoZhangTime"
            value-format="yyyy-MM-dd HH:mm:ss" />
        </el-form-item>
        <el-form-item label="实际到账金额：">
          <el-input clearable type="number" style="width:220px;margin-right:10px"
            v-model="addOrUpdParams.sdaoZhangMoney" />万元
        </el-form-item>
        <el-form-item label="实际到账时间：">
          <el-date-picker type="date" placeholder="选择日期" clearable value-format="yyyy-MM-dd HH:mm:ss"
            v-model="addOrUpdParams.sdaoZhangTime" />
        </el-form-item>
        <el-form-item label="备注：">
          <el-input type="textarea" :autosize="{ minRows: 4}" placeholder="请输入内容" style="width:220px"
            v-model="addOrUpdParams.remarks" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addOrUpdateDig = false">取 消</el-button>
        <el-button type="primary" @click="setMonthlyWorkPlan">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import publicMixin from "@/mixin/publicMixin";
import { tableTotal, exportMethod } from "@/utils/utils";
import guanLi from "@/api/guanLi";
export default {
  data() {
    return {
      /* 查询参数 */ selectParams: {
        pageIndex: 1,
        pageSize: 20,
        yearMonth: "",
      },
      /* mixin参数 */ mixinParams: { name: "getMonthlyWorkPlan", api: guanLi },
      /* 添加/修改参数 */ addOrUpdParams: {},
      /* 添加/修改校验 */ rules: {
        monthTime: [
          { required: true, message: "请选择年月", trigger: "change" },
        ],
        jinRongName: [
          { required: true, message: "请输入金融机构", trigger: "blur" },
        ],
        moneyType: [
          { required: true, message: "请输入资金品种", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    /* 导出融资类型统计表 */ exportEG() {
      let [yearMonth] = [`yearMonth=${this.selectParams.yearMonth || ""}`];
      /* 导出 */ exportMethod({
        url: `${this.$store.state.upload.uploadHost}system/down/ygzjh`,
        method: "POST",
        params: `${yearMonth}`,
        fileName: "月工作计划",
      });
    },
    /* 修改前置 */ monthlyWorkPlanInfo(id) {
      guanLi.monthlyWorkPlanInfo(id).then((res) => {
        this.addOrUpdParams = res.data;
        this.addOrUpdateDig = true;
      });
    },
    /* 添加/修改月工作计划 */ setMonthlyWorkPlan() {
      if (this.publicRules("addOrUpdParams")) {
        this.publicAdd("setMonthlyWorkPlan", this.addOrUpdParams, "");
      }
    },
    /* 导出初始化数据 */ formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          if (j === "sdaoZhangTime" || j === "daoZhangTime")
            return String(v[j]) == "null" ? "" : String(v[j]).substring(0, 10);
          if (j === "xianYeDu" || j === "sdaoZhangMoney")
            return Number(v[j]).toFixed(6);
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
              `${this.selectParams.yearMonth.substring(5, 6)}月份拟放款项目`,
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
            "资金品种",
            "额度(万元)",
            "期限",
            "进展情况",
            "预计到账时间",
            "实际到账金额(万元)",
            "实际到账时间",
            "负责人",
            "备注",
          ];
          const filterVal = [
            "jinRongName",
            "moneyType",
            "xianYeDu",
            "quXian",
            "qingKuan",
            "daoZhangTime",
            "sdaoZhangMoney",
            "sdaoZhangTime",
            "creatorName",
            "remarks",
          ];
          const list = res.data.records;
          const data = this.formatJson(filterVal, list);
          const merges = ["A1:J1"];
          excel.export_json_to_excel({
            multiHeader, //第一行表头
            header: tHeader, //第二行表头
            data,
            merges,
            filename: "月工作计划",
            autoWidth: true,
            bookType: "xlsx",
          });
        });
      });
    },
    /* 表格合计 */ getSummaries(param) {
      return tableTotal(param, ["额度(万元)"]);
    },
    /* 获取月工作计划 */ getMonthlyWorkPlan() {
      this.publicSelect();
    },
    /* 初始化月份 */ setYearMonth() {
      let yue = new Date().getMonth() + 1;
      if (yue < 10) {
        yue = `0${yue}`;
      }
      return `${new Date().getFullYear()}-${yue}`;
    },
  },
  mounted() {
    /* 初始化月份 */ this.selectParams.yearMonth = this.setYearMonth();
    /* 获取月工作计划 */ this.getMonthlyWorkPlan();
  },
  components: {},
  mixins: [publicMixin],
};
</script>

<style lang="scss" scoped>
</style>