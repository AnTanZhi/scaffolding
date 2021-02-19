<template>
  <div>
    <header class="view-header">
      <div class="header-container">
        <el-row>
          <el-col :span="16">
            <el-row :gutter="16">
              <el-col :span="5">
                <BuMen
                  v-model="selectParams.departId"
                  @change="publicSelect"
                />
              </el-col>
              <el-col :span="5">
                <ZhiWei
                  v-model="selectParams.posId"
                  @change="publicSelect"
                />
              </el-col>
              <el-col :span="6">
                <el-input
                  v-model="selectParams.userName"
                  placeholder="用户名、姓名"
                  clearable
                  @input="publicSelect"
                />
              </el-col>
            </el-row>
          </el-col>
          <el-col
            :span="8"
            class="handle-btn"
          >
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="goAdd"
            >添加</el-button>
            <el-button
              type="primary"
              icon="el-icon-unlock"
              @click="unlockUser"
            >解锁</el-button>
            <el-button
              type="danger"
              icon="el-icon-lock"
              @click="LockedUser"
            >锁定</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="userDels"
            >删除选中</el-button>
          </el-col>
        </el-row>
      </div>
    </header>
    <section class="table-container view-section">
      <el-table
        :header-cell-style="{background:'#F0FAFF',color:'#787878'}"
        border
        stripe
        v-loading="loading"
        element-loading-text="加载中，请稍候……"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="40"
          align="center"
        />
        <el-table-column
          width="150"
          label="用户名"
          prop="userLogin"
          align="center"
        />
        <el-table-column
          width="100"
          label="姓名"
          prop="displayName"
          align="center"
        />
        <el-table-column
          width="100"
          label="部门"
          prop="posName"
          align="center"
        />
        <el-table-column
          width="100"
          label="职位"
          prop="departName"
          align="center"
        />
        <el-table-column
          width="50"
          label="性别"
          :formatter="row=>row.userSex==0?'女':'男'"
          align="center"
        />
        <el-table-column
          label="角色管理"
          prop="roleNames"
        />
        <el-table-column
          width="180"
          label="最后登录"
          prop="lastLogin"
          align="center"
        />
        <el-table-column
          width="50"
          label="状态"
          prop="userState"
          :formatter="row=>row.userState==0?'禁用':'启用'"
          align="center"
        />
        <el-table-column
          width="100"
          label="操作"
          align="center"
        >
          <template slot-scope="s">
            <el-tooltip
              class="item"
              effect="dark"
              content="上移"
              placement="bottom"
            >
              <i
                class="el-icon-top edit-btn"
                @click="publicMove('userMove',{userId :s.row.userId,type:0})"
              ></i>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="下移"
              placement="bottom"
            >
              <i
                class="el-icon-bottom edit-btn"
                @click="publicMove('userMove',{userId :s.row.userId,type:1})"
              ></i>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑"
              placement="bottom"
            >
              <i
                class="el-icon-edit-outline edit-btn"
                @click="goUpd(s.row.userId)"
              ></i>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <el-pagination
      style="text-align: end;"
      background
      @size-change="publicSizeSelect"
      @current-change="publicPageSelect"
      :current-page="selectParams.pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="selectParams.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
import BuMen from "@/myComponents/BuMen";
import ZhiWei from "@/myComponents/ZhiWei";
import publicMixin from "@/mixin/publicMixin";
import xiTong from "@/api/xiTong";
import { mapActions } from "vuex";
export default {
  props: {
    activeName: String,
  },
  data() {
    return {
      /* 查询参数 */
      selectParams: {
        pageIndex: 1,
        pageSize: 20,
      },
      /* mixin参数 */
      mixinParams: {
        api: xiTong,
        name: "getUser",
      },
      /* 解锁/锁定/删除参数 */
      batchParams: {},
    };
  },
  methods: {
    /* 修改前置 */
    goUpd(id) {
      this.$router.push({
        path: "/xiTongSheZhi/yongHuTianJia",
        query: {
          activeName: this.activeName,
          id: id,
        },
      });
    },
    /* 批量删除 */
    userDels() {
      if (this.batchParams.ids == "") {
        this.$message.error("请至少选择一条数据");
      } else {
        let ids = this.batchParams.ids.map((v) => v.userId);
        this.publicDel("delUser", ids);
      }
    },
    /* 锁定用户 */
    LockedUser() {
      if (this.batchParams.ids == "") {
        this.$message.error("请至少选择一条数据");
      } else {
        let ids = this.batchParams.ids;
        ids.forEach((item, index) => {
          this.batchParams.ids[index] = item.userId;
        });
        this.publicLocked("LockedUser", this.batchParams);
      }
    },
    /* 解锁用户 */
    unlockUser() {
      if (this.batchParams.ids == "") {
        this.$message.error("请至少选择一条数据");
      } else {
        let ids = this.batchParams.ids;
        ids.forEach((item, index) => {
          this.batchParams.ids[index] = item.userId;
        });
        this.publicUnlock("unlockUser", this.batchParams);
      }
    },
    /* 添加前置 */
    goAdd() {
      this.$router.push({
        path: "/xiTongSheZhi/yongHuTianJia",
        query: {
          activeName: this.activeName,
        },
      });
    },
    /* 多选框 */
    handleSelectionChange(val) {
      this.batchParams = {};
      this.batchParams.ids = val;
    },
  },
  mounted() {
    this.publicSelect();
  },
  mixins: [publicMixin],
  components: { BuMen, ZhiWei },
};
</script>

<style>
</style>