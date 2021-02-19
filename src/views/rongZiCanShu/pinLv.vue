<template>
  <div class="view-container bg-gray">
    <div class="border-card">

      <Head :selectParams="selectParams" @getTablData="getTablData" />
      <!--       
        @goAdd="goAdd"
        @delS="delS" -->
      <section class="table-container view-section">
        <el-table :header-cell-style="{background:'#F0FAFF',color:'#787878'}" border stripe v-loading="loading"
          element-loading-text="加载中，请稍候……" :data="tableData" tooltip-effect="dark" style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="40" align="center" />
          <el-table-column label="频率名称" prop="pname" align="left" />
          <el-table-column label="月数" prop="parg" align="left" />
          <el-table-column label="参数类型" prop="ptype" align="left" />
          <!-- <el-table-column
            width="100"
            label="操作"
            align="center"
          >
            <template slot-scope="s">
              <el-tooltip
                class="item"
                effect="dark"
                content="编辑"
                placement="bottom"
              >
                <i
                  class="el-icon-edit-outline edit-btn"
                  @click="goUpd(s.row.pid)"
                ></i>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="删除"
                placement="bottom"
              >
                <i
                  class="el-icon-delete edit-btn"
                  @click="publicDel('delRepaymentFrequency', [s.row.pid])"
                ></i>
              </el-tooltip>
            </template>
          </el-table-column> -->
        </el-table>
      </section>
      <el-pagination style="text-align: end;" background @size-change="publicSizeSelect"
        @current-change="publicPageSelect" :current-page="selectParams.pageIndex" :page-sizes="[10, 20, 50, 100]"
        :page-size="selectParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog :title="title" :visible.sync="addOrUpdateDig" :close-on-click-modal="false">
      <el-form :rules="rules" :model="addOrUpdateParams" label-width="120px" ref="addOrUpdateParams">
        <el-form-item label="频率名称" prop="pname">
          <el-input v-model="addOrUpdateParams.pname" />
        </el-form-item>
        <el-form-item label="月数" prop="parg">
          <el-input v-model="addOrUpdateParams.parg" type="number" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addOrUpdateDig = false">取 消</el-button>
        <el-button type="primary" @click="addCanShu" v-loading="btnLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Head from "./head";
import publicMixin from "@/mixin/publicMixin";
import canShu from "@/api/canShu";
import { isNull } from "@/utils/utils";
export default {
  data() {
    return {
      /* 查询参数 */ selectParams: { pageIndex: 1, pageSize: 20 },
      /* mixin参数 */ mixinParams: {
        api: canShu,
        name: "getRepaymentFrequency",
      },
      /* 添加/修改参数 */ addOrUpdateParams: {},
      /* 校验 */ rules: {
        pname: [{ required: true, message: "请输入频率名称", trigger: "blur" }],
        parg: [{ required: true, message: "请输入月数", trigger: "blur" }],
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
      canShu.infoRepaymentFrequency(id).then((res) => {
        this.addOrUpdateParams = res.data;
        this.title = "参数编辑";
        this.addOrUpdateDig = true;
      });
    },
    /* 添加参数 */ addCanShu() {
      if (this.publicRules("addOrUpdateParams"))
        this.publicAdd("addRepaymentFrequency", this.addOrUpdateParams, "");
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
  components: { Head },
  mixins: [publicMixin],
};
</script>

<style lang="scss" scoped>
</style>