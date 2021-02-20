<template>
  <div class="view-container bg-gray">
    <div class="border-card">
      <header class="view-header" style="margin-bottom:0px !important">
        <div class="header-container">
          <el-form :inline="true" class="demo-form-inline">
            <div style="display:flex;justify-content: space-between;">
              <div>
                <el-form-item>
                  <el-input v-model="selectParams.positionName" placeholder="职位名称" clearable @input="getZhiWei" />
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
          <el-table-column type="index" label="序号" align="ceter" width="50" />
          <el-table-column label="名称" prop="name" />
          <el-table-column label="操作" align="center" width="100">
            <template slot-scope="s">
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
      <el-pagination style="text-align: end;" background @size-change="publicSizeSelect"
        @current-change="publicPageSelect" :current-page="selectParams.pageIndex" :page-sizes="[10, 20, 50, 100]"
        :page-size="selectParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" />
    </div>
    <el-dialog :title="title" :visible.sync="setDig" width="20%">
      <el-form :model="setParams" :rules="rules" ref="setParams" label-width="80px">
        <el-form-item label="职位名称" prop="name">
          <el-input v-model="setParams.name" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setDig = false">取 消</el-button>
        <el-button type="primary" @click="addZhiWei" v-loading="btnLoading">确 定</el-button>
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
      /* 查询参数 */ selectParams: { pageIndex: 1, pageSize: 10 },
      /* mixin参数 */ mixinParams: { api: system, name: "getZhiWei" },
      /* 操作职位参数 */ setParams: {},
      /* 非空校验 */ rules: {
        name: [{ required: true, message: "请输入职位名称", trigger: "blur" }],
      },
    };
  },
  methods: {
    /* 修改职位前置 */ goUpdZhiWei(id) {
      system.getZhiWeiInfo(id).then((res) => {
        this.setParams = res.data;
        this.title = "编辑职位";
        this.setDig = true;
      });
    },
    /* 操作职位 */ addZhiWei() {
      if (this.title == "添加职位")
        if (this.publicRules("setParams"))
          this.publicAdd("addZhiWei", this.setParams, "");
      if (this.title == "编辑职位")
        if (this.publicRules("setParams"))
          this.publicAdd("updZhiWei", this.setParams, "");
    },
    /* 添加职位前置 */ goAddZhiWei() {
      this.setParams = {};
      this.title = "添加职位";
      this.setDig = true;
    },
    /* 获取职位 */ getZhiWei() {
      this.publicSelect();
    },
  },
  mounted() {
    /* 获取职位 */ this.getZhiWei();
  },
  mixins: [publicMixin],
};
</script>

<style lang="scss" scoped>
</style>