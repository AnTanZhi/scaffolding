<template>
  <div class="bo">
    <div style="color:#fff" class="logo">
      <span style="margin-right:20px"><img src="../../icons/下载.png" alt="" /></span>
      <span style="font-size:30px;letter-spacing: 5px;">远颂科技有限公司</span>
    </div>
    <div class="box">
      <div class="login">
        <div>
          <el-input placeholder="用户名" v-model="loginForm.username" ref="username" name="username" type="text"
            tabindex="1" clearable autocomplete="on">
            <i slot="prefix" class="el-input__icon el-icon-user" />
          </el-input>
          <el-input :key="passwordType" ref="password" v-model="loginForm.password" :type="passwordType"
            placeholder="密码" clearable name="password" tabindex="2" autocomplete="on" @keyup.native="checkCapslock"
            @blur="capsTooltip = false" @keyup.enter.native="handleLogin">
            <i slot="prefix" class="el-input__icon el-icon-lock" />
          </el-input>
        </div>
        <div style="display:flex;align-items: center;margin-bottom:20px;justify-content: space-between;">
          <el-input v-model="yzm" placeholder="验证码" class="input" clearable style="width:50%" />
          <div @click="refreshCode" style="height:36px">
            <index :identifyCode="identifyCode" />
          </div>
        </div>
        <el-button :loading="loading" type="primary" @click.native.prevent="handleLogin"
          style="width:100%;border-radius: 10px;">登 录
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { validUsername } from "@/utils/validate";
import SocialSign from "./components/SocialSignin";
import system from "@/api/system";
import index from "./components/index";
import { isNull } from "@/utils/utils";

export default {
  name: "Login",
  components: { SocialSign, index },
  data() {
    return {
      yzm: "",
      /* 验证码 */ identifyCodes: "1234567890",
      identifyCode: "",
      loginForm: {
        username: "",
        password: "",
      },
      loginRules: {
        userLogin: [
          { required: true, trigger: "blur", message: "请输入用户名" },
        ],
        password: [{ required: true, trigger: "blur", message: "请输入密码" }],
      },
      passwordType: "password",
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true,
    },
  },
  mounted() {
    this.identifyCode = "";
    this.makeCode(this.identifyCodes, 4);
    if (this.loginForm.username === "") {
      this.$refs.username.focus();
    } else if (this.loginForm.password === "") {
      this.$refs.password.focus();
    }
  },
  methods: {
    // 刷新验证码
    refreshCode() {
      this.identifyCode = "";
      this.makeCode(this.identifyCodes, 4);
    },
    // 验证码处理
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },
    makeCode(o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[
          this.randomNum(0, this.identifyCodes.length)
        ];
      }
      console.log(this.identifyCode);
    },
    isCle() {
      this.loginForm = { username: "", password: "" };
    },
    checkCapslock(e) {
      const { key } = e;
      this.capsTooltip = key && key.length === 1 && key >= "A" && key <= "Z";
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {
      if (isNull(this.loginForm.username)) {
        this.$message.error("用户名不能为空");
        return false;
      }
      if (isNull(this.loginForm.password)) {
        this.$message.error("密码不能为空");
        return false;
      }
      this.loading = true;
      if (this.yzm == this.identifyCode) {
        this.$store.dispatch("user/login", this.loginForm).then((res) => {
          if (res.code == 1) {
            this.$message.error(res.msg);
            this.loading = false;
            return false;
          }
          system.getCurrLoginMenu().then((res) => {
            sessionStorage.setItem("caiDan", JSON.stringify(res.data));
          });
          this.$router.push({
            path: this.redirect || "/",
            query: this.otherQuery,
          });
          this.loading = false;
        });
      } else {
        this.$message.error(`验证码不正确`);
        this.refreshCode();
        this.loading = false;
      }
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    },
  },
};
</script>

<style lang="scss">
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
.bo {
  background: url("../../icons/bj2.png") no-repeat;
  background-size: 100% 100%;
  height: 100%;
  padding-top: 2.5rem;
  .logo {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 20%;
  }
}
.box {
  display: flex;
  justify-content: center;
  align-items: center;
  .login {
    box-shadow: -15px 15px 15px rgba(6, 17, 47, 0.7);
    height: 300px;
    width: 350px;
    background: rgba($color: rgb(0, 0, 0), $alpha: 0.4);
    padding: 40px;
    border-radius: 10px;
    .el-input {
      margin-bottom: 25px;
    }
    .input {
      margin: 0;
    }
  }
}
</style>
