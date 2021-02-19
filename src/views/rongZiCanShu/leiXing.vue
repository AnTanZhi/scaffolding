<template>
  <div class="view-container bg-gray">
    <div class="border-card">
      <header class="view-header">
        <div class="header-container">
          <el-row>
            <el-col :span="20">
              <el-row :gutter="10">
                <el-col :span="5">
                  <el-input v-model="selectParams.typeName" placeholder="名称" @input="getTablData" clearable />
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
          <el-table-column type="selection" width="40" align="center" />
          <el-table-column label="类型名称" prop="pname" align="left" />
          <el-table-column label="编码" prop="parg" align="left" />
          <el-table-column label="所属大类" prop="fpName" align="left" />
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
        :page-size="selectParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog :title="title" :visible.sync="addOrUpdateDig" :close-on-click-modal="false">
      <el-form :rules="rules" :model="addOrUpdateParams" label-width="120px" ref="addOrUpdateParams">
        <el-form-item label="类型名称" prop="pname">
          <el-input v-model="addOrUpdateParams.pname" />
        </el-form-item>
        <el-form-item label="编码" prop="parg">
          <el-input v-model="addOrUpdateParams.parg" type="number" />
        </el-form-item>
        <el-form-item label="所属大类">
          <DaLei v-model="addOrUpdateParams.fid" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addOrUpdateDig = false">取 消</el-button>
        <el-button type="primary" @click="addLeiXing" v-loading="btnLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import publicMixin from "@/mixin/publicMixin";
import canShu from "@/api/canShu";
import DaLei from "@/myComponents/DaLei";
import { isNull } from "@/utils/utils";
export default {
  data() {
    return {
      /* 查询参数 */ selectParams: { pageIndex: 1, pageSize: 20 },
      /* mixin参数 */ mixinParams: { api: canShu, name: "getFinancingType" },
      /* 添加/修改参数 */ addOrUpdateParams: {},
      /* 校验 */ rules: {
        pname: [{ required: true, message: "请输入类型名称", trigger: "blur" }],
        parg: [{ required: true, message: "请输入编码", trigger: "blur" }],
      },
      /* 删除参数 */ ids: [],
    };
  },
  methods: {
    /* 删除(多个) */ delS() {
      if (isNull(this.ids)) this.$message.error("请至少选择一条数据");
      else this.publicDel("delRepaymentFrequency", this.ids);
    },
    /* 修改前置 */ goUpd(id) {
      this.addOrUpdateParams = {};
      canShu.infoFinancingType(id).then((res) => {
        this.addOrUpdateParams = res.data;
        this.addOrUpdateParams.fid = res.data.fid + "";
        this.title = "参数编辑";
        this.addOrUpdateDig = true;
      });
    },
    /* 添加类型 */ addLeiXing() {
      if (this.publicRules("addOrUpdateParams"))
        this.publicAdd("addFinancingType", this.addOrUpdateParams, "");
    },
    /* 添加前置 */ goAdd() {
      this.addOrUpdateParams = {};
      this.title = "参数添加";
      this.addOrUpdateDig = true;
    },
    /* 选中值 */ handleSelectionChange(val) {
      this.ids = [];
      this.ids = val.map((v) => v.pid);
    },
    /* 获取表格数据 */ getTablData() {
      this.publicSelect();
    },
  },
  mounted() {
    /* 获取表格数据 */ this.publicSelect();
  },
  components: { DaLei },
  mixins: [publicMixin],
};
</script>

<style lang="scss" scoped>
</style>