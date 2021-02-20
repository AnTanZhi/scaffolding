<template>
  <div class="center" id="user-save">
    <el-form ref="form" :model="setParams" label-width="90px" :rules="rules">
      <div class="form_top">
        <div class="top_title">{{ title }}</div>
        <div class="top-section">
          <div class="left">
            <div class="top_input">
              <el-form-item label="用户名" style="width: 60%" prop="account">
                <el-input v-model="setParams.account" placeholder="请输入用户名" :disabled="isName" />
              </el-form-item>
              <el-form-item label="新密码" style="width: 60%" prop="password">
                <el-input v-model="setParams.password" placeholder="请输入新密码(长度6-16)" type="password" />
              </el-form-item>
              <el-form-item label="确认密码" style="width: 60%" prop="isPassword">
                <el-input v-model="setParams.isPassword" placeholder="输入确认密码" type="password" />
              </el-form-item>
              <el-form-item label="状态" class="zt">
                <el-switch v-model="setParams.state	" style="display: block" active-color="#ff4949"
                  inactive-color="#13ce66" active-text="锁定" inactive-text="正常" active-value="0" inactive-value="1" />
              </el-form-item>
            </div>
          </div>
          <div class="right">
            <el-form-item label="用户头像">
            </el-form-item>
          </div>
        </div>
      </div>
      <div class="form_body">
        <div class="top_title">扩展信息</div>
        <div class="top_input" style="display: flex; flex-wrap: wrap">
          <div style="width: 50%">
            <el-form-item label="部门">
              <el-select v-model="setParams.deptId">
                <el-option v-for="item in buMen" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </div>
          <div style="width: 50%">
            <el-form-item label="角色管理" prop="roleIds">
            </el-form-item>
          </div>
          <div style="width: 50%">
            <el-form-item label="职位">
              <el-select v-model="setParams.positionId">
                <el-option v-for="item in zhiWei" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </div>
        </div>
      </div>
      <div class="form_bottom">
        <div class="top_title">个人信息</div>
        <div class="top_input" style="display: flex; flex-wrap: wrap">
          <div style="width: 50%">
            <el-form-item label="姓名" style="width: 60%" prop="name">
              <el-input v-model="setParams.name" placeholder="请输入姓名" type="text" />
            </el-form-item>
          </div>
          <div style="width: 50%">
            <el-form-item label="性别">
              <el-radio v-model="setParams.gender" :label="0">男
              </el-radio>
              <el-radio v-model="setParams.gender" :label="1">女
              </el-radio>
            </el-form-item>
          </div>
          <div style="width: 50%">
            <el-form-item label="手机" style="width: 60%" prop="mobile">
              <el-input v-model="setParams.mobile" placeholder="请输入手机" type="number" />
            </el-form-item>
          </div>
          <div style="width: 50%">
            <el-form-item label="电话" style="width: 60%">
              <el-input v-model="setParams.phone" placeholder="请输入电话" type="number" />
            </el-form-item>
          </div>
        </div>
        <div style="text-align: center;">
          <el-button type="primary">确定</el-button>
          <el-button @click="$router.back()">返回</el-button>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      /* 自定义校验 */ ruleForm: { pass: "" },
      /* 用户参数 */ setParams: {},
      /* 校验 */ rules: {
        account: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        isPassword: [{ validator: validatePass2, trigger: "blur" }],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "长度在 6 到 16 个字符",
            trigger: "blur",
          },
        ],
        phone: [{ required: true, message: "请输入手机号", trigger: "blur" }],
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
      },
      /* 表单标题 */ title: "",
      /* 用户名是否禁用 */ isName: false,
    };
  },
  methods: {
    /* 部门/职位/角色默认值 */ initMRZ() {
      setTimeout(() => {
        this.setParams.positionId = this.zhiWei[0].id;
        this.setParams.deptId = this.buMen[0].id;
      }, 500);
    },
    /* 表单标题赋值 */ setTitle() {
      this.title = this.$route.query.type == 1 ? "修改用户" : "添加用户";
      this.isName = this.$route.query.type == 1 ? true : false;
    },
  },
  mounted() {
    /* 部门/职位/角色默认值 */ this.initMRZ();
    /* 表单标题赋值 */ this.setTitle();
  },
  computed: {
    ...mapGetters(["buMen", "zhiWei"]),
  },
  components: {},
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
  position: fixed;
  bottom: 0;
  z-index: 2;
  border-top: 1px solid #f3f3f3;
  text-align: center;
  width: 96%;
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