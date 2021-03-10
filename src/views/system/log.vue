<template>
  <div class="view-container bg-gray">
    <div class="border-card">
      <section class="table-container view-section">
        <el-table :header-cell-style="{background:'#F0FAFF',color:'#787878'}" border stripe v-loading="loading"
          element-loading-text="加载中，请稍候……" :data="tableData" tooltip-effect="dark" style="width: 100%">
          <el-table-column label="用户" prop="userName" width="190" align="left" />
          <el-table-column label="IP" prop="ip" width="120" align="center" />
          <el-table-column label="日志类型" prop="modul" width="130" />
          <el-table-column label="标题" prop="title" width="130" />
          <el-table-column label="状态" prop="state" width="50" align="center" :formatter="row=>row.state==0?'成功':'失败'" />
          <el-table-column label="消息" prop="content" />
          <el-table-column label="操作时间" prop="createTime" width="160" align="center" />
        </el-table>
      </section>
      <el-pagination style="text-align: end;" background @size-change="publicSizeSelect"
        @current-change="publicPageSelect" :current-page="selectParams.pageIndex" :page-sizes="[10, 20, 50, 100]"
        :page-size="selectParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" />
    </div>
  </div>
</template>

<script>
import publicMixin from "@/mixin/publicMixin";
import system from "@/api/system";
export default {
  data() {
    return {
      /* 查询参数 */ selectParams: { pageIndex: 1, pageSize: 10 },
      /* mixin参数 */ mixinParams: { name: "getLog", api: system },
    };
  },
  methods: {
    /* 系统日志 */ getLog() {
      this.publicSelect();
    },
  },
  mounted() {
    this.getLog();
  },
  mixins: [publicMixin],
};
</script>

<style lang="scss" scoped>
</style>