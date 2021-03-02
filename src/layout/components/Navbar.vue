<template>
  <div class="navbar">
    <div class="logo">
      <img class="logo-img" :src="require('@/assets/image/logo.png')" alt="">
      <span class="company-name">融资管理系统</span>
    </div>
    <div class="right-menu">
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper" style="display:flex">
          <img :src="userImg" class="user-avatar">
          <div style="color: white;font-size: 13px;">{{userInfo.name}}</div>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>首页</el-dropdown-item>
          </router-link>
          <router-link :to="`/system/setUser?id=${userInfo.id}`">
            <el-dropdown-item>个人信息</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-drawer title="个人信息" :visible.sync="drawer" direction="rtl">
      <span>我来啦!</span>
    </el-drawer>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import ErrorLog from "@/components/ErrorLog";
import Screenfull from "@/components/Screenfull";
import SizeSelect from "@/components/SizeSelect";
import Search from "@/components/HeaderSearch";
import { removeToken } from "@/utils/auth";
import { logout } from "@/api/user";

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    Search,
  },
  data() {
    return {
      imgInfo: "",
      drawer: false,
    };
  },
  computed: {
    ...mapGetters([
      "sidebar",
      "avatar",
      "device",
      "uploadHost",
      "userInfo",
      "userImg",
    ]),
  },
  mounted() {
    console.log(this.userImg);
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    logout() {
      this.$confirm("确定要退出登录吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$store.dispatch("const/getIsLog", true, { root: true });
        let userId = this.userInfo.id;
        logout(userId).then(() => {
          this.$router.push("/login");
          this.$message.success("退出成功");
        });
      });
      removeToken();
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2000;
  background: #545c64;
  display: flex;
  justify-content: space-between;

  .logo {
    height: 50px;
    line-height: 50px;
    padding-left: 10px;
    width: 20%;
    .company-name {
      font-size: 16px;
      color: white;
      font-weight: bold;
    }
    .logo-img {
      vertical-align: middle;
      width: 30px;
      height: 30px;
      margin-right: 7px;
      margin-top: -5px;
    }
  }

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          border: 1px solid #fff;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          overflow: hidden;
          padding: 2px;
          margin-top: 10px;
          margin-right: 10px;
          line-height: 30px;
          cursor: pointer;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
