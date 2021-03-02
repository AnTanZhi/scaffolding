<template>
  <div class="view-container bg-gray">
    <div class="border-card">
      <header class="view-header" style="margin-bottom:0px !important">
        <div class="header-container">
          <el-form :inline="true" class="demo-form-inline">
            <div style="display:flex;justify-content: space-between;">
              <div>
                <el-form-item>
                  <BuMen v-model="selectParams.deptId" @change="getUserInfo" />
                </el-form-item>
                <el-form-item>
                  <ZhiWei v-model="selectParams.posId" @change="getUserInfo" />
                </el-form-item>
                <el-form-item>
                  <el-input v-model="selectParams.userName" placeholder="姓名" clearable @input="getUserInfo" />
                </el-form-item>
              </div>
              <div style="text-align: end;">
                <el-form-item>
                  <el-button type="primary" icon="el-icon-plus" @click="addUser">添加
                  </el-button>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" icon="el-icon-unlock" @click="jsjys(0)">
                    解锁</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button type="danger" icon="el-icon-lock" @click="jsjys(1)">
                    锁定</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button type="danger" icon="el-icon-delete" @click="dels">
                    删除选中</el-button>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </div>
      </header>
      <section class="table-container view-section">
        <el-table :header-cell-style="{background:'#F0FAFF',color:'#787878'}" border stripe v-loading="loading"
          element-loading-text="加载中，请稍候……" :data="tableData" tooltip-effect="dark" style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" align="center" />
          <el-table-column type="index" label="序号" align="center" width="50" />
          <el-table-column label="用户名" prop="account" width="100" />
          <el-table-column label="姓名" prop="name" align="center" width="100" />
          <el-table-column label="部门" prop="deptId" :formatter="(row)=>bmMap.get(Number(row.deptId))" />
          <el-table-column label="职位" prop="positionId" :formatter="(row)=>zwMap.get(Number(row.positionId))" />
          <el-table-column label="性别" prop="gender" width="50" align="center" :formatter="row=>row.gender==0?'男':'女'" />
          <el-table-column label="角色管理" prop="roleNames" show-overflow-tooltip />
          <el-table-column label="最后登录" prop="lastLoginTime" width="160" align="center" />
          <el-table-column label="状态" prop="state" align="center" width="50" :formatter="row=>row.state==0?'正常':'禁用'" />
          <el-table-column label="操作" align="center" width="100">
            <template slot-scope="s">
              <el-tooltip class="item" effect="dark" content="向上" placement="bottom">
                <i class="el-icon-top" @click="publicMove('userPX',{id:s.row.id,type:0})" />
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="向下" placement="bottom">
                <i class="el-icon-bottom" @click="publicMove('userPX',{id:s.row.id,type:1})" />
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
                <i class="el-icon-edit-outline" @click="goUpdYH(s.row.id)" />
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
import BuMen from "@/myComponents/BuMen";
import ZhiWei from "@/myComponents/ZhiWei";
import { getBmAwait, getZwAwait, isNull } from "@/utils/utils";
export default {
  data() {
    return {
      /* 查询参数 */ selectParams: { userName: "" },
      /* mixin参数 */ mixinParams: { api: system, name: "getUserInfo" },
      /* 部门map */ bmMap: "",
      /* 职位map */ zwMap: "",
      /* 修改参数 */ setParams: {},
      /* 删除ids */ delIds: "",
    };
  },
  methods: {
    /* 批量解锁/锁定 */ jsjys(state) {
      if (isNull(this.delIds)) {
        this.$message.error("请至少选择一条数据");
        return;
      }
      system.jsjys(this.delIds, state).then((res) => {
        this.getUserInfo();
      });
    },
    /* 批量删除 */ dels() {
      if (isNull(this.delIds)) {
        this.$message.error("请至少选择一条数据");
        return;
      }
      this.publicDel("delsUser", this.delIds);
    },
    /* 获取选中值 */ handleSelectionChange(val) {
      this.delIds = val.map((v) => v.id);
      this.delIds = this.delIds.join(",");
    },
    /* 初始化职位 */ async getZwMap() {
      this.zwMap = await getZwAwait();
    },
    /* 初始化部门 */ async getBmMap() {
      this.bmMap = await getBmAwait();
    },
    /* 修改用户前置 */ goUpdYH(id) {
      this.$router.push({
        query: { id },
        path: "/system/setUser",
      });
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
    /* 初始化部门 */ this.getZwMap();
    /* 初始化部门 */ this.getBmMap();
    /* 获取用户信息 */ this.getUserInfo();
  },
  components: { BuMen, ZhiWei },
  mixins: [publicMixin],
};
</script>

<style>
</style>