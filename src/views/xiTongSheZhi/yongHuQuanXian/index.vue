<template>
  <div class="view-container bg-gray">
    <el-tabs
      type="border-card"
      v-model="activeName"
    >
      <el-tab-pane
        label="用户管理"
        name="yongHu"
      >
        <YongHuGuanLi :activeName="activeName" />
      </el-tab-pane>
      <el-tab-pane
        label="部门管理"
        name="buMen"
      >部门管理</el-tab-pane>
      <el-tab-pane
        label="职位管理"
        name="Zhiwei"
      >职位管理</el-tab-pane>
      <el-tab-pane
        label="角色管理"
        name="jueSe"
      >角色管理</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import YongHuGuanLi from "./YongHuGuanLi";
export default {
  data() {
    return {
      activeName: "yongHu",
    };
  },
  methods: {
    /* 是否有回显的选项卡名字 */
    isActiveName() {
      if (this.$route.query.activeName) {
        this.activeName = this.$route.query.activeName;
      } else {
        this.activeName = "yongHu";
      }
    },
  },
  mounted() {
    this.isActiveName();
  },
  components: { YongHuGuanLi },
};
</script>

<style>
</style>