<template>
  <div class="view-container bg-gray">
    <div class="border-card">
      <header class="view-header" style="margin-bottom:0px !important">
        <div class="header-container">
          <el-form :inline="true" class="demo-form-inline">
            <div style="display:flex;justify-content: space-between;">
              <div>
                <el-form-item>
                  <el-input v-model="selectParams.roleName" placeholder="角色名称" clearable />
                </el-form-item>
              </div>
              <div style="text-align: end;">
                <el-form-item>
                  <el-button type="primary" icon="el-icon-plus">添加
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
          <el-table-column type="selection" />
          <el-table-column type="index" label="序号" align="ceter" width="50" />
          <el-table-column label="角色名称" prop="title" />
          <el-table-column label="操作" align="center" width="130">
            <template slot-scope="s">
              <el-tooltip class="item" effect="dark" content="上移" placement="bottom">
                <i class="el-icon-top" @click="goUpdZhiWei(s.row.id)" />
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="下移" placement="bottom">
                <i class="el-icon-bottom" @click="goUpdZhiWei(s.row.id)" />
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
                <i class="el-icon-edit-outline" @click="goUpdZhiWei(s.row.id)" />
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
                <i class="el-icon-delete" @click="publicDel('delZhiWei',s.row.id)" />
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </section>
    </div>
  </div>
</template>

<script>
import system from "@/api/system";
import publicMixin from "@/mixin/publicMixin";
export default {
  data() {
    return {
      /* 查询参数 */ selectParams: { pageIndex: 1, pageSize: 10 },
      /* mixin参数 */ mixinParams: { name: "getJS", api: system },
    };
  },
  methods: {
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