<template>
  <div
    class="center"
    id="user-save"
  >
    <el-form
      ref="addOrUpdParams"
      :model="addOrUpdParams"
      label-width="90px"
      :rules="rules"
    >
      <div class="form_top">
        <div class="top_title">{{ textTitle }}</div>
        <div class="top-section">
          <div class="left">
            <div class="top_input">
              <el-form-item
                label="用户名"
                style="width: 60%"
                prop="userLogin"
              >
                <el-input
                  v-model="addOrUpdParams.userLogin"
                  placeholder="请输入用户名"
                  :disabled="userNameInput"
                />
              </el-form-item>
              <el-form-item
                label="新密码"
                style="width: 60%"
                prop="newPassword"
              >
                <el-input
                  v-model="addOrUpdParams.newPassword"
                  placeholder="请输入新密码(长度6-16)"
                  type="password"
                />
              </el-form-item>
              <el-form-item
                label="确认密码"
                style="width: 60%"
                prop="password"
              >
                <el-input
                  v-model="addOrUpdParams.password"
                  placeholder="输入确认密码"
                  type="password"
                />
              </el-form-item>
              <el-form-item
                label="状态"
                class="zt"
              >
                <el-switch
                  v-model="addOrUpdParams.userState"
                  style="display: block"
                  active-color="#ff4949"
                  inactive-color="#13ce66"
                  active-text="锁定"
                  inactive-text="正常"
                  active-value="0"
                  inactive-value="1"
                />
              </el-form-item>
            </div>
          </div>
          <div class="right">
            <el-form-item label="用户头像">
              <UserLogo
                api="system/file/upload?fileType=UserHeadImage"
                v-model="addOrUpdParams.headPhotoId"
                ref="userLogo"
              />
            </el-form-item>
          </div>
        </div>
      </div>
      <div class="form_body">
        <div class="top_title">扩展信息</div>
        <div
          class="top_input"
          style="display: flex; flex-wrap: wrap"
        >
          <div style="width: 50%">
            <el-form-item
              label="部门"
              prop="departId"
            >
              <BuMen v-model="addOrUpdParams.departId" />
            </el-form-item>
          </div>
          <div style="width: 50%">
            <el-form-item
              label="角色管理"
              prop="roleIds"
            >
              <Juese v-model="addOrUpdParams.roleIds" />
            </el-form-item>
          </div>
          <div style="width: 50%">
            <el-form-item
              label="职位"
              prop="posId"
            >
              <ZhiWei v-model="addOrUpdParams.posId" />
            </el-form-item>
          </div>
        </div>
      </div>
      <div class="form_bottom">
        <div class="top_title">个人信息</div>
        <div
          class="top_input"
          style="display: flex; flex-wrap: wrap"
        >
          <div style="width: 50%">
            <el-form-item
              label="姓名"
              style="width: 60%"
              prop="displayName"
            >
              <el-input
                v-model="addOrUpdParams.displayName"
                placeholder="请输入姓名"
                type="text"
              />
            </el-form-item>
          </div>
          <div style="width: 50%">
            <el-form-item label="性别">
              <el-radio
                v-model="addOrUpdParams.userSex"
                :label="1"
              >男
              </el-radio>
              <el-radio
                v-model="addOrUpdParams.userSex"
                :label="0"
              >女
              </el-radio>
            </el-form-item>
          </div>
          <div style="width: 50%">
            <el-form-item
              label="邮箱"
              style="width: 60%"
            >
              <el-input
                v-model="addOrUpdParams.email"
                placeholder="请输入邮箱"
                type="text"
              />
            </el-form-item>
          </div>
          <div style="width: 50%">
            <el-form-item
              label="手机"
              style="width: 60%"
              prop="mobilePhone"
            >
              <el-input
                v-model="addOrUpdParams.mobilePhone"
                placeholder="请输入手机"
                type="number"
              />
            </el-form-item>
          </div>
          <div style="width: 50%">
            <el-form-item
              label="虚拟网短号"
              style="width: 60%"
            >
              <el-input
                v-model="addOrUpdParams.mobilePhoneVirtual"
                placeholder="请输入虚拟网短号"
                type="number"
              />
            </el-form-item>
          </div>
          <div style="width: 50%">
            <el-form-item
              label="电话"
              style="width: 60%"
            >
              <el-input
                v-model="addOrUpdParams.telePhone"
                placeholder="请输入电话"
                type="number"
              />
            </el-form-item>
          </div>
          <div style="width: 50%">
            <el-form-item
              label="内线电话"
              style="width: 60%"
            >
              <el-input
                v-model="addOrUpdParams.telePhoneInternal"
                placeholder="请输入内线电话"
                type="number"
              />
            </el-form-item>
          </div>
          <div style="width: 50%">
            <el-form-item
              label="个人签章"
              style="width: 60%"
            >
              <UserLogo
                api="system/file/upload?fileType=UserHeadImage"
                v-model="addOrUpdParams.signPhotoId"
                ref="userLogo2"
              />
            </el-form-item>
          </div>
        </div>
      </div>
    </el-form>
    <div class="da">
      <el-button
        type="primary"
        @click="addOrUpdUser"
        v-loading="btnLoading"
      >确定
      </el-button>
      <el-button
        @click="$router.back()"
        v-loading="btnLoading"
      >返回</el-button>
    </div>
  </div>
</template>
<script>
import UserLogo from "@/myComponents/UserLogo";
import BuMen from "@/myComponents/BuMen";
import Juese from "@/myComponents/JueSe";
import ZhiWei from "@/myComponents/ZhiWei";
import publicMixin from "@/mixin/publicMixin";
import xiTong from "@/api/xiTong";
export default {
  data() {
    /* 自定义校验 */
    let newPassword = (rule, value, callback) => {
      console.log(rule, value, callback);
    };
    return {
      /* 添加/修改参数 */
      addOrUpdParams: {},
      /* 校验 */
      rules: {
        userLogin: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        newPassword: [
          { required: true, trigger: "blur", validator: newPassword },
        ],
        password: [{ required: true, message: "请确认密码", trigger: "blur" }],
        departId: [
          { required: true, message: "请选择部门", trigger: "change" },
        ],
        roleIds: [{ required: true, message: "请选择角色", trigger: "change" }],
        posId: [{ required: true, message: "请选择职位", trigger: "change" }],
        displayName: [
          { required: true, message: "请输入姓名", trigger: "blur" },
        ],
        mobilePhone: [
          { required: true, message: "请输入手机", trigger: "blur" },
        ],
      },
      /* 标题 */
      textTitle: "",
      /* 按钮加载 */
      btnLoading: false,
      /* 修改禁用 */
      userNameInput: false,
      /* mixin参数 */
      mixinParams: {
        api: xiTong,
        name: "getUser",
      },
    };
  },
  methods: {
    /* 用户详细信息 */
    userInfo() {
      this.rules.newPassword[0].required = false;
      this.rules.password[0].required = false;
      xiTong.userInfo(this.$route.query.id).then((res) => {
        this.addOrUpdParams = res.data;
        this.addOrUpdParams.newPassword = "";
        this.addOrUpdParams.password = "";
        this.userNameInput = true;
        /* 手动调用图片回显 */
        this.$refs.userLogo.manuallyCallPictureEcho(res.data.headPhotoId);
        this.addOrUpdParams.departId = res.data.departId;
        this.addOrUpdParams.roleIds = res.data.roleIds;
        this.addOrUpdParams.posId = res.data.posId;
        /* 手动调用图片回显 */
        this.$refs.userLogo2.manuallyCallPictureEcho(res.data.signPhotoId);
      });
    },
    /* 添加/修改用户 */
    addOrUpdUser() {
      if (this.$route.query.id) {
        console.log("修改");
      } else {
        if (this.publicRules("addOrUpdParams")) {
          let url = {
            path: "/xiTongSheZhi/yongHuQuanXian",
            query: {
              activeName: this.$route.query.activeName,
            },
          };
          console.log(this.addOrUpdParams);
          this.publicAdd("addUser", this.addOrUpdParams, url, false);
        }
      }
    },
  },
  mounted() {
    if (this.$route.query.id) {
      this.userInfo();
    } else {
      this.addOrUpdParams = {
        userSex: 1,
        userState: "1",
      };
    }
  },
  mixins: [publicMixin],
  components: { UserLogo, BuMen, Juese, ZhiWei },
};
</script>

<style lang="scss">
#user-save {
  $height: 128px;

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
    width: $height;
    height: $height;
    line-height: $height;
    text-align: center;
  }

  .avatar {
    width: $height;
    height: $height;
    display: block;
  }
}
</style>
<style lang="scss" scoped>
.top_title {
  height: 42px;
  line-height: 42px;
  padding: 0 15px;
  border-left: 5px solid #009688;
  border-bottom: 1px solid #f6f6f6;
  color: #333;
  border-radius: 2px 2px 0 0;
  font-size: 16px;
  font-weight: bold;
}

.form_top {
  margin: 15px;
  background: #fff;
  padding-bottom: 10px;
}

.form_body {
  margin: 15px;
  background: #fff;
  padding-bottom: 10px;
}

.form_bottom {
  height: 374px;
  margin: 15px;
  background: #fff;
  padding-bottom: 10px;
}

.center {
  background-color: #f2f2f2;
  padding-top: 15px;
}

.top_input {
  padding-left: 1.75rem;
  margin-top: 20px;
  width: 100%;
}

.xiao {
  justify-content: center;
  position: fixed;
  bottom: 0;
  z-index: 2;
  border-top: 1px solid #f3f3f3;
  text-align: center;
  width: 88%;
  padding-top: 10px;
  padding-bottom: 10px;
  background: #fff;
}

.da {
  justify-content: center;
  border-top: 1px solid #f3f3f3;
  text-align: center;
  width: 100%;
  padding-top: 10px;
  padding-bottom: 10px;
  background: #fff;
}

.zt .el-form-item__content {
  padding-top: 7px;
}

.top-section {
  display: flex;
  justify-content: space-between;
  .left,
  .right {
    width: 100%;
  }
  .right {
    padding-left: 1.75rem;
    margin-top: 20px;
  }
}
</style>
