<template>
  <div class="view-container bg-gray">
    <div class="border-card">
      <header class="view-header" style="margin-bottom:0px !important">
        <div class="header-container">
          <el-form :inline="true" :model="selectParams" class="demo-form-inline">
            <div style="display:flex;justify-content: space-between;">
              <div>
                <el-form-item>
                  <div style="display:flex">
                    <el-select v-model="selectParams.type" clearable style="width:130px">
                      <el-option label="保证合同编号" value="0" />
                      <el-option label="债权机构" value="1" />
                      <el-option label="被担保人" value="2" />
                    </el-select>：
                    <el-input v-model="selectParams.param" placeholder="请输入关键字" style="width:200px" clearable
                      @input="getExternalGuarantee" />
                  </div>
                </el-form-item>
                <el-form-item>
                  <el-date-picker v-model="selectParams.dbstime" type="date" placeholder="开始日期"
                    value-format="yyyy-MM-dd HH:mm:ss" @change="getExternalGuarantee" />
                </el-form-item>
                <el-form-item>
                  <el-date-picker v-model="selectParams.dbetime" type="date" placeholder="结束日期"
                    value-format="yyyy-MM-dd HH:mm:ss" @change="getExternalGuarantee" />
                </el-form-item>
              </div>
              <div style="text-align:end">
                <el-form-item>
                  <ShangChuan @getTable="getExternalGuarantee"
                    :url="`${this.$store.state.upload.uploadHost}financing/ensure/upload`" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" icon="el-icon-download" @click="templateDownload">模板下载</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" icon="el-icon-document-checked" @click="exportEG">导出</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" icon="el-icon-plus"
                    @click="()=>{addOrUpdateParams = {};addOrUpdateDig=true}">添加</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button type="danger" icon="el-icon-delete" @click="delExternalGuarantee">删除选中</el-button>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </div>
      </header>
      <section class="table-container view-section">
        <el-table :header-cell-style="{background:'#F0FAFF',color:'#787878'}" border stripe v-loading="loading"
          element-loading-text="加载中，请稍候……" :data="tableData" tooltip-effect="dark" style="width: 100%"
          @selection-change="handleSelectionChange" :summary-method="getSummaries" show-summary>
          <el-table-column type="selection" width="40" align="center" />
          <el-table-column label="序号" type="index" width="50" align="center" />
          <el-table-column label="保证合同编号" prop="bh" show-overflow-tooltip="" />
          <el-table-column label="被担保人" prop="bdbr" show-overflow-tooltip />
          <el-table-column label="债权机构" prop="dbr" show-overflow-tooltip="" />
          <el-table-column label="还款责任金额" prop="zrje" align="right" :formatter="row=>Number(row.zrje).toFixed(6)"
            width="130" show-overflow-tooltip />
          <el-table-column label="借款金额" prop="dbje" align="right" :formatter="row=>Number(row.dbje).toFixed(6)"
            width="130" show-overflow-tooltip />
          <el-table-column label="担保余额" prop="dbye" align="right" :formatter="row=>Number(row.dbye).toFixed(6)"
            width="130" show-overflow-tooltip />
          <el-table-column label="起始日期" width="100"
            :formatter="row=>String(row.dbstime)=='null'?'':String(row.dbstime).substring(0,10)" align="center" />
          <el-table-column label="到期日期" width="100"
            :formatter="row=>String(row.dbetime)=='null'?'':String(row.dbetime).substring(0,10)" align="center" />
          <el-table-column label="备注" prop="beizhu" show-overflow-tooltip />
          <el-table-column label="操作" align="center" width="80">
            <template slot-scope="s">
              <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
                <i class="el-icon-edit-outline edit-btn" @click="externalGuaranteeInfo(s.row.id)" />
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
                <i class="el-icon-delete edit-btn" @click="publicDel('delExternalGuarantee',[s.row.id])" />
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </section>
      <el-pagination style="text-align: end;" background @size-change="publicSizeSelect"
        @current-change="publicPageSelect" :current-page="selectParams.pageIndex" :page-sizes="[10, 20, 50, 100]"
        :page-size="selectParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" />
    </div>
    <el-dialog title="对外担保信息" :visible.sync="addOrUpdateDig" :close-on-click-modal="false">
      <el-form :model="addOrUpdateParams" label-position="right" label-width="170px" :rules="rules"
        ref="addOrUpdateParams">
        <el-form-item label="保证合同编号：" prop="bh">
          <el-input v-model="addOrUpdateParams.bh" clearable style="width:80%" />
        </el-form-item>
        <el-form-item label="债权机构：" prop="dbr">
          <el-input v-model="addOrUpdateParams.dbr" clearable style="width:80%" />
        </el-form-item>
        <el-form-item label="被担保人：" prop="bdbr">
          <el-input v-model="addOrUpdateParams.bdbr" clearable style="width:80%" />
        </el-form-item>
        <el-form-item label="还款责任金额：" prop="zrje">
          <el-input v-model="addOrUpdateParams.zrje" clearable type="number" style="width:80%" />
        </el-form-item>
        <el-form-item label="借款金额：" prop="dbje">
          <el-input v-model="addOrUpdateParams.dbje" clearable type="number" style="width:80%" />
        </el-form-item>
        <el-form-item label="担保余额：" prop="dbye">
          <el-input v-model="addOrUpdateParams.dbye" clearable type="number" style="width:80%" />
        </el-form-item>
        <el-form-item label="起始日期：" prop="dbstime">
          <el-date-picker v-model="addOrUpdateParams.dbstime" type="date" value-format="yyyy-MM-dd HH:mm:ss" clearable
            style="width:80%" />
        </el-form-item>
        <el-form-item label="到期日期：" prop="dbetime">
          <el-date-picker v-model="addOrUpdateParams.dbetime" type="date" value-format="yyyy-MM-dd HH:mm:ss" clearable
            style="width:80%" />
        </el-form-item>
        <el-form-item label="备注：">
          <el-input type="textarea" :autosize="{ minRows: 4}" v-model="addOrUpdateParams.beizhu" style="width:80%" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addOrUpdateDig = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdate" v-loading="btnLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import publicMixin from "@/mixin/publicMixin";
import ShangChuan from "@/myComponents/ShangChuan";
import {
  isNull,
  tableTotal,
  exportMethod,
  templateDownload,
} from "@/utils/utils";
import danBao from "@/api/danBao";
import axios from "axios";
export default {
  data() {
    return {
      /* 查询参数 */ selectParams: { pageIndex: 1, pageSize: 20 },
      /* 总条数 */ total: 0,
      /* 非空验证 */ rules: {
        bh: [
          { required: true, message: "请输入保证合同编号", trigger: "blur" },
        ],
        dbr: [{ required: true, message: "请输入债权机构", trigger: "blur" }],
        bdbr: [{ required: true, message: "请输入被担保人", trigger: "blur" }],
        zrje: [
          { required: true, message: "请输入还款责任金额", trigger: "blur" },
          {
            pattern: /^(([1-9]{1}\d*)|(0{9}))(\.\d{1,2})?$/g,
            message: "责任金额为正数且小数点后2位",
            trigger: "blur",
          },
        ],
        dbje: [
          { required: true, message: "请输入借款金额", trigger: "blur" },
          {
            pattern: /^(([1-9]{1}\d*)|(0{9}))(\.\d{1,2})?$/g,
            message: "借款金额为正数且小数点后只有2位",
            trigger: "blur",
          },
        ],
        dbye: [
          { required: true, message: "请输入担保余额", trigger: "blur" },
          {
            pattern: /^(([1-9]{1}\d*)|(0{9}))(\.\d{1,2})?$/g,
            message: "担保余额为正数且小数点后只有2位",
            trigger: "blur",
          },
        ],
        dbstime: [
          {
            required: true,
            message: "请选择起始日期",
            trigger: "change",
          },
        ],
        dbetime: [
          {
            required: true,
            message: "请选择到期日期",
            trigger: "change",
          },
        ],
      },
      /* 对外担保 */ externalGuarantee: [],
      /* mixin参数 */ mixinParams: {
        api: danBao,
        name: "getExternalGuarantee",
      },
      /* 多选删除参数 */ delIds: [],
      /* 添加/修改参数 */ addOrUpdateParams: {},
    };
  },
  methods: {
    /* 导出初始化数据 */ formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          if (j == "zrje" || j == "dbje" || j == "dbye")
            return Number(v[j]).toFixed(6);
          if (j == "dbstime" || j == "dbetime")
            return String(v[j]) == "null" ? "" : String(v[j]).substring(0, 10);
          return v[j];
        })
      );
    },
    /* 导出 */ exportXLSX() {
      this.selectParams.pageSize = this.total;
      danBao[this.mixinParams.name](this.selectParams).then((res) => {
        import("@/vendor/Export2Excel").then((excel) => {
          const tHeader = [
            "保证合同编号",
            "被担保人",
            "债权机构",
            "还款责任金额",
            "借款金额",
            "担保余额",
            "起始日期",
            "到期日期",
            "备注",
          ];
          const filterVal = [
            "bh",
            "bdbr",
            "dbr",
            "zrje",
            "dbje",
            "dbye",
            "dbstime",
            "dbetime",
            "beizhu",
          ];
          const list = Object.freeze(res.data.records);
          const data = this.formatJson(filterVal, list);
          excel.export_json_to_excel({
            header: tHeader, //第三行表头
            data,
            filename: "对外担保管理",
            autoWidth: true,
            bookType: "xlsx",
          });
        });
      });
    },
    /* 导出对外担保 */ exportEG() {
      let [bdbr, bh, dbetime, dbr, dbstime, param, type] = [
        `bdbr=${this.selectParams.bdbr || ""}`,
        `bh=${this.selectParams.bh || ""}`,
        `dbetime=${this.selectParams.dbetime || ""}`,
        `dbr=${this.selectParams.dbr || ""}`,
        `dbstime=${this.selectParams.dbstime || ""}`,
        `param=${this.selectParams.param || ""}`,
        `type=${this.selectParams.type || ""}`,
      ];
      /* 导出 */ exportMethod({
        url: `${this.$store.state.upload.uploadHost}financing/ensure/download`,
        method: "GET",
        params: `${bdbr}&${bh}&${dbetime}&${dbr}&${dbstime}&${param}&${type}`,
        fileName: "对外担保管理",
      });
    },
    /* 模板下载 */ templateDownload() {
      let data = {
        method: "GET",
        url: `${this.$store.state.upload.uploadHost}financing/ensure/loadTemp`,
        fileName: "对外担保.xls",
      };
      templateDownload(data);
    },
    /* 修改对外担保 */ updExternalGuarantee() {
      this.publicAdd("updExternalGuarantee", this.addOrUpdateParams, "");
    },
    /* 添加/修改对外担保 */ addOrUpdate() {
      if (this.addOrUpdateParams.id) this.updExternalGuarantee();
      else this.addExternalGuarantee();
    },
    /* 对外担保详细 */ externalGuaranteeInfo(id) {
      danBao.externalGuaranteeInfo(id).then((res) => {
        this.addOrUpdateParams = res.data;
        this.addOrUpdateDig = true;
      });
    },
    /* 添加对外担保 */ addExternalGuarantee() {
      if (this.publicRules("addOrUpdateParams"))
        this.publicAdd("addExternalGuarantee", this.addOrUpdateParams, "");
    },
    /* 多个删除 */ delExternalGuarantee() {
      if (!isNull(this.delIds))
        this.publicDel("delExternalGuarantee", this.delIds);
      else this.$message.error("请至少选中一条数据");
    },
    /* 获取对外担保 */ getExternalGuarantee() {
      this.publicSelect();
    },
    /* 表格合计 */ getSummaries(param) {
      return tableTotal(param, ["还款责任金额", "借款金额", "担保余额"]);
    },
    /* 选中值 */ handleSelectionChange(val) {
      this.delIds = [];
      this.delIds = val.map((v) => v.id);
    },
  },
  mounted() {
    /* 对外担保 */ this.getExternalGuarantee();
  },
  components: { ShangChuan },
  mixins: [publicMixin],
};
</script>

<style lang="scss" scoped>
</style>