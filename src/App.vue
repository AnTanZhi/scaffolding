<template>
  <div id="app">
    <div class="box">
      <div class="information" v-if="$router.history.current.fullPath!='/login'">
        <el-badge :value="12" class="itemxx">
          <img src="./icons/xinxi.png" @click="tableDia=!tableDia">
        </el-badge>
      </div>
      <el-dialog title="在线用户" :visible.sync="tableDia">
        <el-table :data="filterData" border @row-click="sendMessageFront">
          <el-table-column label="用户名" prop="account" />
          <el-table-column label="姓名" prop="name" />
        </el-table>
        <el-dialog width="30%" title="发送信息" :visible.sync="sendDia" append-to-body>
          <el-form :model="infoParams">
            <el-form-item>
              <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="infoParams.msg">
              </el-input>
            </el-form-item>
            <el-form-item style="text-align:end">
              <el-button type="primary" @click="sendMessage">确 定</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </el-dialog>
      <router-view />
    </div>
  </div>
</template>

<script>
import system from "./api/system";
export default {
  name: "App",
  data() {
    return {
      /* 信息参数 */ infoParams: {},
      /* 对话框 */ setDia: false,
      /* 在线用户 */ filterData: [],
      /* 表格对话框 */ tableDia: false,
      /* 发送对话框 */ sendDia: false,
    };
  },
  methods: {
    /* 发送信息 */ sendMessage() {
      system.sendMessage(this.infoParams).then((res) => {
        this.$message.success("发送成功");
        this.sendDia = false;
      });
    },
    /* 发送信息前置 */ sendMessageFront(row, column, event) {
      this.infoParams = {};
      this.infoParams.id = row.id;
      this.sendDia = true;
    },
    /* 获取所有用户 */ getAllUser() {
      system.getUserInfo(this.selectParams).then((res) => {
        let onlineId = String(this.$store.state.user.onlineId);
        onlineId = onlineId.split(",");
        console.log(onlineId, "onlineId");
        onlineId.forEach((item) => {
          res.data.records.forEach((item2) => {
            if (item == item2.id) {
              this.filterData.push(item2);
            }
          });
        });
      });
    },
  },
  mounted() {
    setTimeout(() => this.getAllUser(), 300);
  },
  watch: {
    $store() {
      this.getAllUser();
    },
  },
};
</script>
<style lang="scss" scoped>
.box {
  position: relative;
  overflow: hidden;
  .information {
    position: absolute;
    z-index: 200;
    top: 40%;
    right: -21px;
    img {
      width: 50px;
    }
  }
  .information:hover {
    transition: all 0.5s;
    right: 0;
  }
}
</style>
<style lang="scss">
.itemxx {
  .is-fixed {
    right: 58px !important;
  }
}
.el-dialog__title {
  margin-left: 10px !important;
}
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
