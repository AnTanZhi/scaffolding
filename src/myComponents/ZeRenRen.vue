<template>
  <el-select v-model="copyDataId" placeholder="责任人" :clearable="cle" @change="getChange">
    <el-option v-for="item in dataInfo" :key="item.userId" :label="item.displayName" :value="String(item.userId)" />
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
    getResponsible() {
      index.getResponsible("融资部").then((res) => {
        this.dataInfo = res.data;
      });
    },
  },
  mounted() {
    this.getResponsible();
  },
};
</script>

<style>
</style>