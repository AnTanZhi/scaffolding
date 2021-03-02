<template>
  <el-select v-model="copyDataId" placeholder="职位" :clearable="cle" @change="getChange">
    <el-option v-for="item in dataInfo" :key="item.id" :label="item.name" :value="String(item.id)" />
  </el-select>
</template>
<script>
import system from "@/api/system";
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
      dataInfo: [],
      copyDataId: this.dataId,
    };
  },
  methods: {
    getChange(val) {
      this.$emit("change", val);
    },
    getRepaymentMode() {
      system.getZhiWeiSel().then((res) => {
        this.dataInfo = res.data;
        this.$emit("initMS", this.dataInfo);
      });
    },
  },
  mounted() {
    this.getRepaymentMode();
  },
};
</script>

<style>
</style>