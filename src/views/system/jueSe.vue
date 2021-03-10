<template>
  <div class="view-container bg-gray">
    <div class="border-card">
      <header class="view-header" style="margin-bottom:0px !important">
        <div class="header-container">
          <el-form :inline="true" class="demo-form-inline">
            <div style="display:flex;justify-content: space-between;">
              <div>
                <el-form-item>
                  <el-input v-model="selectParams.roleName" placeholder="角色名称" clearable @input="getJS" />
                </el-form-item>
              </div>
              <div style="text-align: end;">
                <el-form-item>
                  <el-button type="primary" icon="el-icon-plus" @click="goAddJS">添加
                  </el-button>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </div>
      </header>
      <section class="table-container view-section">
        <el-table :header-cell-style="{background:'#F0FAFF',color:'#787878'}" border stripe v-loading="loading"
          element-loading-text="加载中，请稍候……" :data="tableData" tooltip-effect="dark" style="width: 100%">
          <el-table-column type="index" label="序号" align="center" width="50" />
          <el-table-column label="角色名称" prop="title" />
          <el-table-column label="角色权限" align="center" width="120">
            <el-button slot-scope="s" @click="goCD(s.row.id)">绑定菜单</el-button>
          </el-table-column>
          <el-table-column label="操作" align="center" width="130">
            <template slot-scope="s">
              <el-tooltip class="item" effect="dark" content="上移" placement="bottom">
                <i class="el-icon-top" @click="publicMove('sortJS',{id:s.row.id,type:0})" />
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="下移" placement="bottom">
                <i class="el-icon-bottom" @click="publicMove('sortJS',{id:s.row.id,type:1})" />
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
                <i class="el-icon-edit-outline" @click="goUpdJS(s.row.id)" />
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
                <i class="el-icon-delete" @click="del(s.row.id)" />
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </section>
    </div>
    <el-dialog :title="title" :visible.sync="setDig" width="30%">
      <el-form :model="setParams" ref="setParams" :rules="rules" label-width="80px">
        <el-form-item label="角色名称" prop="title">
          <el-input clearable v-model="setParams.title" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setDig = false">取 消</el-button>
        <el-button type="primary" @click="setJS">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import system from "@/api/system";
import publicMixin from "@/mixin/publicMixin";
import { isNull } from "@/utils/utils";
export default {
  data() {
    return {
      /* 查询参数 */ selectParams: { pageIndex: 1, pageSize: 10 },
      /* mixin参数 */ mixinParams: { name: "getJS", api: system },
      /* 操作参数 */ setParams: {},
      /* 表单校验 */ rules: {
        title: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
      },
    };
  },
  methods: {
    /* 删除 */ del(id) {
      system.delJSCheck(id).then((res) => {
        if (!res.success) {
          this.$message.error(res.msg);
          return;
        } else {
          this.publicDel("delJS", id);
        }
      });
    },
    /* 绑定菜单前置 */ goCD(id) {
      let cd = JSON.parse(sessionStorage.getItem("caiDan"));
      let setJueSe = "";
      if (!isNull(cd))
        cd.forEach((item) => {
          if (item.url == "system") {
            item.children.forEach((itemm) => {
              if (itemm.url == "setRole") {
                setJueSe = itemm;
              }
            });
          }
        });
      if (setJueSe.isHasSys == 1)
        this.$router.push({
          path: "/system/setRole",
          query: { id },
        });
      else this.$message.error("您没有对角色操作的权限");
    },
    /* 修改角色前置 */ goUpdJS(id) {
      system.getJSInfo(id).then((res) => {
        this.setParams = res.data;
        this.setDig = true;
        this.title = "修改角色";
      });
    },
    /* 操作角色 */ setJS() {
      if (this.publicRules("setParams"))
        this.publicAdd("addJS", this.setParams, "");
    },
    /* 添加角色前置 */ goAddJS() {
      this.setParams = {};
      this.setDig = true;
      this.title = "添加角色";
    },
    /* 获取角色 */ getJS() {
      this.publicSelect();
    },
  },
  mounted() {
    /* 获取角色 */ this.getJS();
  },
  mixins: [publicMixin],
};
</script>

<style lang="scss" scoped>
</style>