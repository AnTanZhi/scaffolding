<template>
  <el-select v-model="copyCategoriesId" :multiple="isMultiple" placeholder="融资类型" clearable collapse-tags
    @change="getChange">
    <el-option v-for="item in categoriesData" :key="item.pid" :label="item.pname" :value="String(item.pid)">
    </el-option>
  </el-select>
</template>

<script>
import index from "@/api/index";
export default {
  watch: {
    categoriesId() {
      this.copyCategoriesId = this.categoriesId;
    },
  },
  model: { prop: "categoriesId", event: "change" },
  props: {
    categoriesId: {
      type: [String, Number, Array],
      default: "",
      required: false,
    },
    isMultiple: {
      type: Boolean,
      default: true,
      required: false,
    },
  },
  data() {
    return {
      /* 角色 */
      categoriesData: [],
      /* model */
      copyCategoriesId: this.categoriesId,
    };
  },
  methods: {
    getChange(val) {
      this.$emit("change", val);
    },
    /* 获取融资类型 */
    getFinancingType() {
      index.getFinancingType().then((res) => {
        this.categoriesData = this.financingTypeRecursion(res.data, [], "");
      });
    },
    /* 类型递归 */
    financingTypeRecursion(data, array, index) {
      data.forEach((item, i) => {
        array.push({
          pname: index + item.pname,
          pid: item.pid,
        });
        if (item.childrens != "") {
          index += "-";
          this.financingTypeRecursion(item.childrens, array, index);
          index = "";
        }
      });
      return array;
    },
  },
  mounted() {
    this.getFinancingType();
  },
};
</script>

<style>
</style>