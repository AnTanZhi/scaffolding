<template>
  <header class="view-header">
    <div class="header-container">
      <el-row>
        <el-col :span="20">
          <el-row :gutter="10">
            <el-col :span="5">
              <el-input v-model="selectParams.frequencyName" placeholder="名称" @input="selectData" clearable />
            </el-col>
          </el-row>
        </el-col>
        <!-- <el-col
          :span="4"
          class="handle-btn"
        >
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="addData"
          >添加</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click="delData"
          >删除选中</el-button>
        </el-col> -->
      </el-row>
    </div>
  </header>
</template>

<script>
export default {
  props: {
    selectParams: {
      type: [Object],
      default: "",
    },
  },
  methods: {
    delData() {
      this.$emit("delS");
    },
    addData() {
      this.$emit("goAdd");
    },
    selectData() {
      this.$emit("getTablData");
    },
  },
  mounted() {},
};
</script>

<style>
</style>