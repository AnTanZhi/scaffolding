<template>
  <el-upload style="display:flex" class="upload-demo" id="shangChuan" ref="upload" :action="url"
    :on-remove="handleRemove" :file-list="fileList" :auto-upload="false" :limit="1" :on-change="updIsShow"
    :on-success='uploadFailed'>
    <el-button v-show="!is.shangChuan" slot="trigger" type="primary" icon="el-icon-document-add">导入数据
    </el-button>
    <el-button v-if="is.shangChuan" style="margin-right:10px" type="success" icon="el-icon-upload2"
      @click="submitUpload">开始导入
    </el-button>
  </el-upload>
</template>

<script>
export default {
  props: {
    url: {
      type: [String],
      default: "",
      required: false,
    },
  },
  data() {
    return {
      fileList: [],
      is: { shangChuan: false },
    };
  },
  methods: {
    uploadFailed(res, file, fileList) {
      this.fileList = [];
      this.$message.success(
        `成功${res.successCount}条数据,失败${res.errorCount}条数据,总${res.total}条数据`
      );
      this.$emit("getTable");
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    updIsShow(file, fileList) {
      file.name =
        file.name.length > 10 ? file.name.substring(0, 7) + "..." : file.name;
      let isShangChuan = !this.is.shangChuan;
      this.$set(this.is, "shangChuan", isShangChuan);
    },
    handleRemove(file, fileList) {
      let isShangChuan = !this.is.shangChuan;
      this.$set(this.is, "shangChuan", isShangChuan);
    },
  },
};
</script>

<style>
</style>