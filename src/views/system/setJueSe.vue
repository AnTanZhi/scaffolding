<template>
  <div style="padding:15px">
    <div style=" margin-bottom:20px">
      <el-button type="primary" @click="setCD">保存</el-button>
      <el-button @click="$router.back()">返回</el-button>
    </div>
    <div style="display:flex;flex-wrap:wrap">
      <el-card class="box-card" v-for="item in forData" :key="item.id" style="margin-right:10px;margin-bottom:10px">
        <el-tree :props="props" show-checkbox :data="item" highlight-current default-expand-all check-on-click-node
          :ref="`tree`" node-key="id" :default-checked-keys='defaultKey' />
      </el-card>
    </div>
  </div>
</template>

<script>
import system from "@/api/system";
export default {
  data() {
    return {
      /* 树形菜单配置 */ props: {
        label: "title",
        children: "children",
      },
      /* 树形菜单数据 */ treeData: [],
      /* 循环的菜单数据 */ forData: [],
      /* 绑定菜单权限 */ setParmas: {},
      /* 默认选中的节点 */ defaultKey: [],
    };
  },
  methods: {
    /* 菜单回显 */ getCDInfo() {
      system.getMenu(this.$route.query.id).then((res) => {
        this.defaultKey = res.data.map((v) => v.id);
      });
    },
    /* 绑定菜单 */ setCD() {
      this.$set(this.setParmas, "roleFunctionsList", []);
      for (let i in this.forData) {
        this.$refs["tree"][i].getCheckedNodes().map((v) => {
          if (v.parentId != 0)
            this.setParmas.roleFunctionsList.push(v.parentId);
          this.setParmas.roleFunctionsList.push(v.id);
        });
      }
      this.setParmas.roleFunctionsList = [
        ...new Set(this.setParmas.roleFunctionsList),
      ];
      this.setParmas.roleId = this.$route.query.id;
      console.log(this.setParmas);
      system.bingMenu(this.setParmas).then((res) => {
        this.$message.success("绑定成功");
        this.$router.back();
      });
    },
    /* 获取菜单 */ getCD() {
      system.getCD().then((res) => {
        this.treeData = res.data;
        this.treeData.forEach((item) => {
          this.forData.push([item]);
        });
      });
    },
  },
  mounted() {
    /* 菜单回显 */ this.getCDInfo();
    /* 获取菜单 */ this.getCD();
  },
};
</script>

<style lang="scss" scoped>
.box-card {
  width: 2.5rem;
  height: 4.25rem;
}
</style>