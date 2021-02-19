<template>
  <div class="view-container bg-gray">
    <div class="border-card">
      <header class="view-header">
        <div class="header-container">
          <el-row>
            <el-col :span="20">
              <el-row :gutter="10">
                <el-col :span="5">
                  <el-input v-model="selectParams.responsibilityName" placeholder="科室名称" @input="getResponsibility"
                    clearable />
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="4" class="handle-btn">
              <el-button type="primary" icon="el-icon-plus" @click="goAdd">添加</el-button>
              <el-button type="danger" icon="el-icon-delete" @click="delS">删除选中</el-button>
            </el-col>
          </el-row>
        </div>
      </header>
      <section class="table-container view-section">
        <el-table :header-cell-style="{background:'#F0FAFF',color:'#787878'}" border stripe v-loading="loading"
          element-loading-text="加载中，请稍候……" :data="tableData" tooltip-effect="dark" style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" align="center" />
          <el-table-column label="序号" type="index" align="center" width="50" />
          <el-table-column label="责任科室" prop="pname" />
          <el-table-column width="100" label="操作" align="center">
            <template slot-scope="s">
              <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
                <i class="el-icon-edit-outline edit-btn" @click="goUpd(s.row.pid)"></i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
                <i class="el-icon-delete edit-btn" @click="publicDel('delRepaymentFrequency', [s.row.pid])"></i>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </section>
      <el-pagination style="text-align: end;" background @size-change="publicSizeSelect"
        @current-change="publicPageSelect" :current-page="selectParams.pageIndex" :page-sizes="[10, 20, 50, 100]"
        :page-size="selectParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" />
    </div>
    <el-dialog title="责任科室" :visible.sync="addOrUpdateDig" width="20%">
      <el-form :model="addOrUpdateParams">
        <el-form-item label="科室名称" prop="pname">
          <el-input v-model="addOrUpdateParams.pname" style="width:70%" />
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
import canShu from "@/api/canShu";
import publicMixin from "@/mixin/publicMixin";
import { isNull } from "@/utils/utils";
export default {
  data() {
    return {
      /* 查询参数 */ selectParams: { pageIndex: 1, pageSize: 20 },
      /* mixin参数 */ mixinParams: { name: "getResponsibility", api: canShu },
      /* 添加/修改参数 */ addOrUpdateParams: {},
      /* 非空校验 */ rules: {
        pname: [{ required: true, message: "请输入科室名称", trigger: "blur" }],
      },
      /* 删除参数 */ ids: [],
    };
  },
  methods: {
    /* 多选删除 */ delS() {
      if (isNull(this.ids)) this.$message.error("请至少选择一条数据");
      else this.publicDel("delRepaymentFrequency", this.ids);
    },
    /* 修改前置 */ goUpd(id) {
      canShu.infoFinancingType(id).then((res) => {
        this.addOrUpdateParams = res.data;
        this.addOrUpdateDig = true;
      });
    },
    /* 添加/修改责任科室 */ addOrUpdate() {
      if (isNull(this.addOrUpdateParams.pname)) {
        this.$message.error("科室名称不能为空");
        return false;
      }
      this.publicAdd("setResponsibility", this.addOrUpdateParams, "");
    },
    /* 添加前置 */ goAdd() {
      this.addOrUpdateParams = {};
      this.addOrUpdateDig = true;
    },
    /* 选中值 */ handleSelectionChange(val) {
      this.ids = [];
      this.ids = val.map((v) => v.pid);
    },
    /* 获取责任科室 */ getResponsibility() {
      this.publicSelect();
    },
  },
  mounted() {
    /* 获取责任科室 */ this.getResponsibility();
  },
  mixins: [publicMixin],
};
</script>
<style lang="scss">
.el-dialog__title {
  margin-left: 0 !important;
}
</style>