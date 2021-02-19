<template>
  <el-select v-model="copyDataId" placeholder="融资主体" :clearable="cle" @change="getChange">
    <el-option v-for="item in dataInfo" :key="item.value" :label="item.label" :value="String(item.value)" />
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
    getFinancingBody() {
      index.getFinancingBody().then((res) => {
        this.dataInfo = res.data;
      });
    },
  },
  mounted() {
    this.getFinancingBody();
  },
};
</script>

<style>
</style>