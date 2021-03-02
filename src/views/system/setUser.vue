<template>
  <div class="center" id="user-save">
    <el-form ref="setParams" :model="setParams" label-width="90px" :rules="rules">
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
                <el-input v-model="ruleForm.pass" placeholder="输入确认密码" type="password" />
              </el-form-item>
              <el-form-item label="状态" class="zt">
                <el-switch v-model="setParams.state	" style="display: block;width:21%" active-color="#ff4949"
                  inactive-color="#13ce66" active-text="锁定" inactive-text="正常" active-value="0" inactive-value="1" />
              </el-form-item>
            </div>
          </div>
          <div class="right">
            <el-form-item label="用户头像">
              <TouXiang @getImg="getImg" :imgInfo="imgInfo" />
            </el-form-item>
          </div>
        </div>
      </div>
      <div class=" form_body">
        <div class="top_title">扩展信息</div>
        <div class="top_input" style="display: flex; flex-wrap: wrap">
          <div style="width: 50%">
            <el-form-item label="部门" prop="deptId">
              <BuMen v-model="setParams.deptId" :cle="true" />
            </el-form-item>
          </div>
          <div style="width: 50%">
            <el-form-item label="角色管理" prop="roleIds">
              <el-select v-model="setParams.roleIds" multiple collapse-tags clearable style="width:230px">
                <el-option v-for="item in JSSels" :key="String(item.id)" :value="String(item.id)" :label="item.title" />
              </el-select>
            </el-form-item>
          </div>
          <div style="width: 50%">
            <el-form-item label="职位" prop="positionId">
              <ZhiWei v-model="setParams.positionId" :cle="true" />
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
          <el-button type="primary" @click="setYH">确定</el-button>
          <el-button @click="$router.back()">返回</el-button>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import BuMen from "@/myComponents/BuMen";
import ZhiWei from "@/myComponents/ZhiWei";
import TouXiang from "@/myComponents/TouXiang";
import publicMixin from "@/mixin/publicMixin";
import system from "@/api/system";
import { mapGetters } from "vuex";
import { isNull } from "@/utils/utils";
export default {
  computed: {
    ...mapGetters(["uploadHost"]),
  },
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (this.ruleForm.pass === "" && !this.$route.query.id)
        callback(new Error("请输入密码"));
      else if (this.setParams.password !== this.ruleForm.pass)
        callback(new Error("两次输入密码不一致!"));
      else callback();
    };
    var validatePass = (rule, value, callback) => {
      if (isNull(this.setParams.password) && !this.$route.query.id)
        callback(new Error("请输入密码"));
      else if (!this.$route.query.id && this.setParams.password.length < 6)
        callback(new Error("密码长度6位以上"));
      else callback();
    };
    return {
      /* 自定义校验 */ ruleForm: { pass: "" },
      /* 用户参数 */ setParams: { gender: 0, password: "", roleIds: [] },
      /* 校验 */ rules: {
        account: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        isPassword: [{ validator: validatePass2, trigger: "blur" }],
        password: [{ validator: validatePass, trigger: "blur" }],
        phone: [{ required: true, message: "请输入手机号", trigger: "blur" }],
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        deptId: [{ required: true, message: "请选择部门", trigger: "change" }],
        roleIds: [{ required: true, message: "请选择角色", trigger: "change" }],
        positionId: [
          { required: true, message: "请选择职位", trigger: "change" },
        ],
      },
      /* 表单标题 */ title: "",
      /* 用户名是否禁用 */ isName: false,
      /* mixin参数 */ mixinParams: { name: "", api: system },
      /* 角色多选框 */ JSSels: [],
      /* 图片地址 */ imgInfo: "",
    };
  },
  methods: {
    /* 获取用户信息 */ getYHInfo() {
      system.getYHInfo(this.$route.query.id).then((res) => {
        this.setParams = res.data;
        this.setParams.password = "";
        this.ruleForm.pass = "";
        this.setParams.state = this.setParams.state == 1 ? 0 : 1;
        this.setParams.deptId += "";
        this.setParams.positionId += "";
        this.setParams.roleIds = String(this.setParams.roleIds).split(",");
        if (!isNull(this.setParams.headCode)) {
          system.getFile(this.setParams.headCode).then((b) => {
            let url = String(this.uploadHost).split("").reverse().join("");
            url = url.substring(5);
            url = url.split("").reverse().join("");
            this.imgInfo = `${url}${b.data.path}`;
          });
        }
      });
    },
    /* 操作用户 */ setYH() {
      if (this.publicRules("setParams")) {
        this.setParams.state = this.setParams.state == 1 ? 0 : 1;
        this.setParams.roleIds = this.setParams.roleIds.join(",");
        this.btnLoading = true;
        system.addYH(this.setParams).then((res) => {
          this.$message.success("操作成功");
          this.btnLoading = false;
          system.getFile(res.data.headCode).then((r) => {
            let url = String(this.uploadHost).split("").reverse().join("");
            url = url.substring(5);
            url = url.split("").reverse().join("");
            console.log(`${url}${r.data.path}`);
            this.$store.dispatch("const/getUserImg", `${url}${r.data.path}`, {
              root: true,
            });
          });
          this.$router.push({
            path: "/system/userInfo",
          });
        });
      }
    },
    /* 获取头像 */ getImg(val) {
      this.setParams.headCode = val.code;
    },
    /* 获取角色多选框 */ getJS() {
      system.getJSAll().then((res) => {
        this.JSSels = res.data;
      });
    },
    /* 表单标题赋值 */ setTitle() {
      this.title = this.$route.query.id ? "修改用户" : "添加用户";
      this.isName = this.$route.query.id ? true : false;
    },
  },
  mounted() {
    /* 修改获取回显 */ if (this.$route.query.id) this.getYHInfo();
    /* 获取角色多选框 */ this.getJS();
    /* 表单标题赋值 */ this.setTitle();
  },
  mixins: [publicMixin],
  components: { BuMen, ZhiWei, TouXiang },
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