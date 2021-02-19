<template>
  <el-select v-model="copyDepartId" placeholder="部门" :clearable="cle" @change="getChange">
    <el-option v-for="item in departmentData" :key="item.departId" :label="item.departName"
      :value="String(item.departId)" />
  </el-select>
</template>

<script>
import index from "@/api/index";
import { recursion } from "@/utils/utils";
export default {
  watch: {
    departId() {
      this.copyDepartId = this.departId;
    },
  },
  model: { prop: "departId", event: "change" },
  props: {
    departId: {
      type: [String, Number],
      default: "",
      required: false,
    },
    cle: {
      default: true,
      type: [Boolean],
    },
  },
  data() {
    return {
      /* 部门 */
      departmentData: [],
      copyDepartId: this.departId,
    };
  },
  methods: {
    getChange(val) {
      this.$emit("change", val);
    },
    getDepartment() {
      index.getDepartment().then((res) => {
        this.departmentData = recursion(res.data, []);
      });
    },
  },
  mounted() {
    /* 获取部门 */
    this.getDepartment();
  },
};
</script>

<style>
</style>