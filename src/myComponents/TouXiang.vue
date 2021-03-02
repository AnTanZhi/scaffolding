<template>
  <el-upload class="avatar-uploader" :action="`${uploadHost}file/uploadFile`" :show-file-list="false"
    :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :headers="{token:toKenInfo}">
    <img v-if="imageUrl" :src="imageUrl" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
</template>

<script>
import { getToken } from "@/utils/auth";
import { mapGetters } from "vuex";
export default {
  props: {
    imgInfo: {
      default: "",
      type: [String],
    },
  },
  data() {
    return {
      imageUrl: "",
      /* token */ toKenInfo: "",
    };
  },
  computed: {
    ...mapGetters(["uploadHost"]),
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.$emit("getImg", res.data);
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || "image/png type";
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
  watch: {
    imgInfo() {
      this.imageUrl = this.imgInfo;
    },
  },
  mounted() {
    /* 获取token */ this.toKenInfo = getToken();
  },
};
</script>

<style>
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