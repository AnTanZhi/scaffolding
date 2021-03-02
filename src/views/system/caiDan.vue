<template>
  <div class="view-container bg-gray">
    <div class="border-card">
      <header class="view-header" style="margin-bottom:0px !important">
        <div class="header-container">
          <el-form :inline="true" class="demo-form-inline">
            <div style="text-align: end;">
              <el-form-item>
                <el-button type="primary" icon="el-icon-plus" @click="goAddCD">添加
                </el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </header>
      <section class="table-container view-section">
        <el-table :header-cell-style="{background:'#F0FAFF',color:'#787878'}" border stripe v-loading="loading"
          element-loading-text="加载中，请稍候……" :data="tableData" tooltip-effect="dark" style="width: 100%" row-key="id"
          default-expand-all :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
          <el-table-column type="index" align="center" label="序号" width="50" />
          <el-table-column label="菜单名称" prop="title" />
          <el-table-column label="路由名称" prop="url" />
          <el-table-column label="操作" align="center" width="300">
            <template slot-scope="s">
              <el-button type="primary" icon="el-icon-search" size="mini" @click="goUpdCD(s.row.id)">编辑</el-button>
              <el-button type="danger" icon="el-icon-search" size="mini" @click="delCD(s.row.id)">删除</el-button>
              <el-button icon="el-icon-search" size="mini" @click="goAddZCD(s.row.id)">添加子菜单</el-button>
            </template>
          </el-table-column>
        </el-table>
      </section>
    </div>
    <el-dialog :title="title" :visible.sync="setDig" width="30%">
      <el-form :model="setParams" label-width="80px" ref="setParams" :rules="rules">
        <el-form-item label="路由名称" prop="url">
          <el-input v-model="setParams.url" />
        </el-form-item>
        <el-form-item label="菜单名称" prop="title">
          <el-input v-model="setParams.title" />
        </el-form-item>
        <el-form-item label="是否显示">
          <el-switch v-model="setParams.state" active-color="#13ce66" inactive-color="#ff4949" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setDig = false">取 消</el-button>
        <el-button type="primary" @click="setCD">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import publicMixin from "@/mixin/publicMixin";
import system from "@/api/system";
import { isNull } from "@/utils/utils";
export default {
  data() {
    return {
      /* mixin参数 */ mixinParams: { name: "getCD", api: system },
      /* 操作菜单参数 */ setParams: {},
      /* 非空校验 */ rules: {
        url: [{ required: true, message: "请输入路由名称", trigger: "blur" }],
        title: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
      },
    };
  },
  methods: {
    /* 添加子菜单前置 */ goAddZCD(id) {
      this.setParams = {};
      this.setParams.parentId = id;
      this.setDig = true;
      this.title = "添加菜单";
    },
    /* 删除菜单 */ delCD(id) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        system.delCD(id).then((res) => {
          this.$message.success("删除成功");
          this.getCD();
        });
      });
    },
    /* 修改菜单前置 */ goUpdCD(id) {
      system.getCDInfo(id).then((res) => {
        res.data.state = res.data.state == 0 ? true : false;
        this.setParams = res.data;
        this.setDig = true;
        this.title = "修改菜单";
      });
    },
    /* 操作菜单 */ setCD() {
      if (this.publicRules("setParams")) {
        if (isNull(this.setParams.parentId)) this.setParams.parentId = 0;
        this.setParams.state = this.setParams.state ? 0 : 1;
        system.addCD(this.setParams).then((res) => {
          this.$message.success("操作成功");
          this.btnLoading = false;
          this.setDig = false;
          this.getCD();
        });
      }
    },
    /* 添加菜单前置 */ goAddCD() {
      this.setParams = {};
      this.setDig = true;
      this.title = "添加菜单";
    },
    /* 获取菜单 */ getCD() {
      system.getCD().then((res) => {
        res.data.forEach((item) => {
          item.state = !item.state;
        });
        this.tableData = res.data;
      });
    },
  },
  mounted() {
    /* 获取菜单 */ this.getCD();
  },
  mixins: [publicMixin],
};
</script>

<style lang="scss" scoped>
</style>