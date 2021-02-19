<template>
  <el-upload class="avatar-uploader" :action="uploadHost+api" :show-file-list="false" :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload">
    <img v-if="imageUrl" :src="imageUrl" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
</template>

<script>
import { mapGetters } from "vuex";
import index from "@/api/index";
export default {
  model: {
    prop: "headPhotoId",
    event: "change",
  },
  props: {
    api: {
      required: false,
      type: String,
      default: "",
    },
    headPhotoId: {
      type: String,
    },
  },
  data() {
    return {
      imageUrl: "",
      /* 附件id */
      copyHeadPhotoId: this.headPhotoId,
    };
  },
  methods: {
    /* 手动调用图片回显 */
    manuallyCallPictureEcho(id) {
      index.getAnnexURL(id).then((res) => {
        this.imageUrl = res.data.webFilePath;
      });
    },
    handleAvatarSuccess(res, file) {
      this.copyHeadPhotoId = file.response.fileId;
      this.$emit("change", this.copyHeadPhotoId);
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG/PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
  },
  computed: {
    ...mapGetters(["uploadHost"]),
    uploadUrl() {
      return this.uploadHost + "system/file/upload?fileType=UserHeadImage";
    },
  },
};
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
