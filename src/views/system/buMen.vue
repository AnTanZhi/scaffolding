<template>
  <div class="view-container bg-gray">
    <div class="border-card">
      <header class="view-header" style="margin-bottom:0px !important">
        <div class="header-container">
          <el-form :inline="true" class="demo-form-inline">
            <div style="display:flex;justify-content: space-between;">
              <div>
                <el-form-item>
                  <el-input placeholder="部门名称" clearable v-model="selectParams.deptName" @input="getBuMenShu" />
                </el-form-item>
              </div>
              <div style="text-align: end;">
                <el-form-item>
                  <el-button type="primary" icon="el-icon-plus" @click="goAddBuMen">添加
                  </el-button>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </div>
      </header>
      <section class="table-container view-section">
        <el-table :header-cell-style="{background:'#F0FAFF',color:'#787878'}" border stripe v-loading="loading"
          element-loading-text="加载中，请稍候……" :data="tableData" tooltip-effect="dark" style="width: 100%" row-key="id"
          :tree-props="{children: 'childs'}" default-expand-all>
          <el-table-column label="名称" prop="name" />
          <el-table-column label="备注" prop="remark" />
          <el-table-column label="操作" width="80" align="center">
            <template slot-scope="s">
              <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
                <i class="el-icon-edit-outline" @click="goUpdBuMen(s.row.id)" />
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
                <i class="el-icon-delete" @click="()=>{publicDel('delBuMen',s.row.id);getDieBuMen()}" />
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </section>
    </div>
    <el-dialog :title="title" :visible.sync="setDig" width="30%">
      <el-form :model="setParams" label-width="100px" :rules="rules" ref="setParams">
        <el-form-item label="所属父级部门">
          <el-select v-model="setParams.parentId" clearable>
            <el-option v-for="item in dieBuMen" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="setParams.name" clearable />
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" :autosize="{ minRows: 2}" v-model="setParams.remark" clearable>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setDig = false">取 消</el-button>
        <el-button type="primary" @click="setBuMen" v-loading="btnLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import publicMixin from "@/mixin/publicMixin";
import system from "@/api/system";
export default {
  data() {
    return {
      /* 查询参数 */ selectParams: {},
      /* mixin参数 */ mixinParams: { api: system, name: "getBuMenShu" },
      /* 添加/修改参数 */ setParams: {},
      /* 父级部门集合 */ dieBuMen: {},
      /* 非空校验 */ rules: {
        name: [{ required: true, message: "请输入部门名称", trigger: "blur" }],
      },
    };
  },
  methods: {
    /* 修改部门前置 */ goUpdBuMen(id) {
      system.getBuMenInfo(id).then((res) => {
        res.data.parentId = res.data.parentId == 0 ? "" : res.data.parentId;
        this.setParams = res.data;
        this.title = "编辑部门";
        this.setDig = true;
      });
    },
    /* 操作部门 */ setBuMen() {
      if (this.title == "添加部门")
        if (this.publicRules("setParams"))
          this.publicAdd("addBuMen", this.setParams, "");
      if (this.title == "编辑部门")
        if (this.publicRules("setParams"))
          this.publicAdd("updBuMen", this.setParams, "");
    },
    /* 获取所有父级部门 */ getDieBuMen() {
      system.getBuMen({ parentId: 0 }).then((res) => {
        this.dieBuMen = res.data.records;
      });
    },
    /* 添加部门前置 */ goAddBuMen() {
      this.setParams = {};
      this.title = "添加部门";
      this.setDig = true;
    },
    /* 获取部门 */ getBuMenShu() {
      this.publicSelect(false);
    },
  },
  watch: {
    tableData() {
      this.getDieBuMen();
    },
  },
  mounted() {
    /* 获取所有父级部门 */ this.getDieBuMen();
    /* 获取部门 */ this.getBuMenShu();
  },
  mixins: [publicMixin],
};
</script>

<style lang="scss" scoped>
</style>