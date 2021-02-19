<template>
  <el-select v-model="copyPosId" placeholder="职位" :clearable="cle" @change="getChange">
    <el-option v-for="item in postData" :key="item.positionsId" :label="item.postName"
      :value="String(item.positionsId)">
    </el-option>
  </el-select>
</template>
<script>
import index from "@/api/index";
export default {
  watch: {
    posId() {
      this.copyPosId = this.posId;
    },
  },
  model: { prop: "posId", event: "change" },
  props: {
    posId: {
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
      postData: [],
      copyPosId: this.posId,
    };
  },
  methods: {
    getChange(val) {
      this.$emit("change", val);
    },
    getPost() {
      index.getPost().then((res) => {
        this.postData = res.data.records;
      });
    },
  },
  mounted() {
    this.getPost();
  },
};
</script>

<style>
</style>