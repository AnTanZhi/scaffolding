<template>
  <el-select v-model="copyRoleIds" multiple collapse-tags placeholder="角色" @change="getChange">
    <el-option v-for="item in roleData" :key="item.roleId" :label="item.roleName" :value="String(item.roleId)" />
  </el-select>
</template>

<script>
import index from "@/api/index";
export default {
  watch: {
    roleIds() {
      this.copyRoleIds = this.roleIds;
    },
  },
  model: { prop: "roleIds", event: "change" },
  props: {
    roleIds: {
      type: [String, Number, Array],
      default: "",
      required: false,
    },
  },
  data() {
    return {
      /* 角色 */
      roleData: [],
      /* model */
      copyRoleIds: this.roleIds,
    };
  },
  methods: {
    getChange(val) {
      this.$emit("change", val);
    },
    /* 获取角色 */
    getRole() {
      index.getRole().then((res) => {
        this.roleData = res.data.records;
      });
    },
  },
  mounted() {
    this.getRole();
  },
};
</script>

<style>
</style>