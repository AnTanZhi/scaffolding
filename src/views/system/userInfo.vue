<template>
  <div class="view-container bg-gray">
    <div class="border-card">
      <header class="view-header" style="margin-bottom:0px !important">
        <div class="header-container">
          <el-form :inline="true" class="demo-form-inline">
            <div style="display:flex;justify-content: space-between;">
              <div>
                <el-form-item>
                  <!-- <el-select v-model="isnUll" placeholder="">
                    <el-option v-for="itme in buMen" :key=""></el-option>
                  </el-select> -->
                </el-form-item>
              </div>
              <div style="text-align: end;">
                <el-form-item>
                  <el-button type="primary" icon="el-icon-plus" @click="addUser">添加
                  </el-button>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" icon="el-icon-unlock">
                    解锁</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button type="danger" icon="el-icon-lock">
                    锁定</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button type="danger" icon="el-icon-delete">
                    删除选中</el-button>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </div>
      </header>
      <section class="table-container view-section">
        <el-table :header-cell-style="{background:'#F0FAFF',color:'#787878'}" border stripe v-loading="loading"
          element-loading-text="加载中，请稍候……" :data="tableData" tooltip-effect="dark" style="width: 100%">
          <el-table-column type="selection" />
          <el-table-column type="index" label="序号" align="ceter" width="50" />
          <el-table-column label="用户名" prop="account" />
          <el-table-column label="姓名" prop="name" align="center" width="120" />
          <el-table-column label="部门" prop="deptId" :formatter="initBuMen" />
          <el-table-column label="职位" prop="positionId" :formatter="initZhiWei" />
          <el-table-column label="性别" prop="gender" width="50" align="center" :formatter="row=>row.gender==0?'男':'女'" />
          <el-table-column label="角色管理" prop="roleIds" />
          <el-table-column label="最后登录" prop="lastLoginTime" width="160" align="center" />
          <el-table-column label="状态" prop="state" align="center" width="50" :formatter="row=>row.state==0?'正常':'禁用'" />
          <el-table-column label="操作" align="center" width="100">
            <template>
              <el-tooltip class="item" effect="dark" content="向上" placement="bottom">
                <i class="el-icon-top" />
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="向下" placement="bottom">
                <i class="el-icon-bottom" />
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
                <i class="el-icon-edit-outline" />
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </section>
      <el-pagination style="text-align: end;" background @size-change="publicSizeSelect"
        @current-change="publicPageSelect" :current-page="selectParams.pageIndex" :page-sizes="[10, 20, 50, 100]"
        :page-size="selectParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" />
    </div>
  </div>
</template>

<script>
import system from "@/api/system";
import publicMixin from "@/mixin/publicMixin";
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["buMen", "zhiWei"]),
  },
  data() {
    return {
      /* 查询参数 */ selectParams: { userName: "" },
      /* mixin参数 */ mixinParams: { api: system, name: "getUserInfo" },
    };
  },
  methods: {
    /* 初始化职位 */ initZhiWei(res) {
      let name = "";
      this.zhiWei.forEach((r) => {
        if (res.positionId == r.id) {
          name = r.name;
        }
      });
      return name;
    },
    /* 初始化表格部门 */ initBuMen(res) {
      let name = "";
      this.buMen.forEach((r) => {
        if (res.deptId == r.id) {
          name = r.name;
        }
      });
      return name;
    },
    /* 添加用户前置 */ addUser() {
      this.$router.push({
        path: "/system/setUser",
        query: { type: 0 },
      });
    },
    /* 获取用户信息 */ getUserInfo() {
      this.publicSelect();
    },
  },
  mounted() {
    /* 获取用户信息 */ this.getUserInfo();
  },
  mixins: [publicMixin],
};
</script>

<style>
</style>