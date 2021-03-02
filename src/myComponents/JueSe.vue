<template>
  <el-select v-model="copyDataId" placeholder="角色" :clearable="cle" @change="getChange">
    <el-option v-for="item in dataInfo" :key="item.id" :label="item.title" :value="String(item.id)" />
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
      system.getJSAll().then((res) => {
        this.dataInfo = res.data;
        console.log(res.data);
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