<template>
  <div class="view-container bg-gray">
    <div class="border-card">
      <header class="view-header" style="margin-bottom:0px !important">
        <div class="header-container">
          <el-form :inline="true" class="demo-form-inline">
            <div style="display:flex;justify-content: space-between;">
              <div>
                <el-form-item>
                  <el-input v-model="selectParams.positionName" placeholder="菜单名称" clearable />
                </el-form-item>
              </div>
              <div style="text-align: end;">
                <el-form-item>
                  <el-button type="primary" icon="el-icon-plus" @click="goAddZhiWei">添加
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
          <el-table-column label="菜单名称" prop="title" />
          <el-table-column label="路由名称" prop="url" />
          <el-table-column label="隐藏菜单">
            <template slot-scope="s">
              <el-switch v-model="value" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="100">
            <template slot-scope="s">
            </template>
          </el-table-column>
        </el-table>
      </section>
    </div>
  </div>
</template>

<script>
import publicMixin from "@/mixin/publicMixin";
import system from "@/api/system";
export default {
  data() {
    return {
      /* 查询参数 */ selectParams: {},
      /* mixin参数 */ mixinParams: { name: "getCD", api: system },
    };
  },
  methods: {
    /* 获取菜单 */ getCD() {
      this.publicSelect();
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