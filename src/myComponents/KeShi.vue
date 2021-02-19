<template>
  <el-select v-model="copyDataId" placeholder="责任科室" :clearable="cle" @change="getChange">
    <el-option v-for="(item,index) in dataInfo" :key="index" :label="item.label" :value="item.value" />
  </el-select>
</template>
<script>
import index from "@/api/index";
export default {
  watch: {
    dataId() {
      this.copyDataId = this.dataId;
    },
  },
  model: { prop: "dataId", event: "change" },
  props: {
    dataId: {
      type: [String, Number],
      default: "",
      required: false,
    },
    cle: {
      type: Boolean,
      default: true,
      required: false,
    },
  },
  data() {
    return {
      /* 职位 */
      dataInfo: [],
      copyDataId: this.dataId,
    };
  },
  methods: {
    getChange(val) {
      this.$emit("change", val);
    },
    getResponsibilityDepartment() {
      index.getResponsibilityDepartment().then((res) => {
        this.dataInfo = res.data;
        this.$emit("initKS", this.dataInfo);
      });
    },
  },
  mounted() {
    this.getResponsibilityDepartment();
  },
};
</script>

<style>
</style>