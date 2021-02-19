<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { setToken } from "@/utils/auth";
export default {
  name: "App",
  data() {
    return {
      parentOrigin: null, // 父平台所在的域(协议+ip+端口)
      platformCode: null, // 平台码（由父平台传过来）
      token: null, // 避免频繁写入Cookies
      isHideHead: false, // 避免频繁写入sessionStorage
      curRouteName: null, // 避免频繁调用router.push
    };
  },
  watch: {
    $route() {
      console.log("融资管理watch-$route", this.$route);
      if (this.parentOrigin && this.$route.name) {
        // 向父平台传参
        window.parent.postMessage(
          {
            platform_params: {
              type: "router",
              routerName: this.$route.name,
              platformCode: this.platformCode,
            },
          },
          this.parentOrigin
        );
      }
    },
  },
  created() {
    window.addEventListener("message", this.handleMessage);
  },
  methods: {
    // 处理父平台传来的参数
    handleMessage(event) {
      if (event.data && event.data.platform_params) {
        console.log("融资管理-监听到message事件：", event.data.platform_params);
        // 隐藏平台头部
        if (!this.isHideHead) {
          this.isHideHead = true;
          console.log("融资管理-隐藏平台头部");
          this.$store.dispatch("app/setShowHead", false);
        }
        const {
          type,
          platformCode,
          origin,
          token,
        } = event.data.platform_params;
        this.platformCode = platformCode;
        this.parentOrigin = origin;
        if (!this.token) {
          this.token = token;
          setToken(token);
        }
        console.log("融资管理-消息类型", type);
        switch (type) {
          case "router":
            const { routerName } = event.data.platform_params;
            if (routerName !== this.curRouteName) {
              this.curRouteName = routerName;
              this.$router.push({
                name: routerName,
              });
            }
            break;
          case "message":
            console.log(
              "融资管理-message类型消息",
              event.data.platform_params.payload
            );
            break;
        }
      }
    },
  },
};
</script>
<style lang="scss">
.el-table_2_column_17 {
  .cell {
    text-align: center;
  }
}
.el-table__body tr.current-row > td {
  background: darkturquoise;
  color: #000;
}
.el-table__body-wrapper {
  z-index: 2;
}
.has-gutter {
  tr {
    th {
      text-align: center;
    }
  }
}
</style>
