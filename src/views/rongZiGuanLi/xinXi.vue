<template>
  <div class="view-container bg-gray">
    <div class="border-card">
      <header class="view-header" style="margin-bottom:0px !important">
        <div class="header-container">
          <el-form :inline="true" :model="selectParams" class="demo-form-inline">
            <el-form-item>
              <el-select v-model="selectParams.searchType" clearable>
                <el-option label="地号" value="地号" />
                <el-option label="地块名称" value="地块名称" />
                <el-option label="土地证名称" value="土地证名称" />
                <el-option label="面积" value="面积" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model="selectParams.searchContent" placeholder="请输入关键字" clearable @input="getLand" />
            </el-form-item>
            <el-form-item>
              <Gongsi v-model="selectParams.ownershipCompany" @change="getLand" />
            </el-form-item>
            <el-form-item>
              <TuDiZhuangTai v-model="selectParams.state" @change="getLand" />
            </el-form-item>
          </el-form>
        </div>
      </header>
      <section class="table-container view-section">
        <el-table :header-cell-style="{background:'#F0FAFF',color:'#787878'}" border stripe v-loading="loading"
          element-loading-text="加载中，请稍候……" :data="tableData" tooltip-effect="dark" style="width: 100%">
          <el-table-column label="档案号" prop="archivesNo" width="70" align="center" show-overflow-tooltip />
          <el-table-column label="地号" prop="landNumber" width="100" align="center" show-overflow-tooltip />
          <el-table-column label="地块名称" prop="landName" show-overflow-tooltip />
          <el-table-column label="产权坐落位置" prop="propertyPosition" show-overflow-tooltip />
          <el-table-column label="土地证(或不动产证编号)" prop="landSn" width="200" show-overflow-tooltip />
          <el-table-column label="面积㎡" prop="measureArea" align="right" width="70" show-overflow-tooltip />
          <el-table-column label="土地出让金额(万元)" width="150" align="right"
            :formatter="row=>Number(row.sellAmount).toFixed(6)" show-overflow-tooltip />
          <el-table-column label="土地用途(地类)" prop="purpose" show-overflow-tooltip />
          <el-table-column label="抵押用于融资项目名称" prop="mortgageProjectName" width="170" show-overflow-tooltip />
          <el-table-column label="抵押金融机构" prop="mortgageFinanceMechanism" show-overflow-tooltip />
          <el-table-column label="抵押期限(月)" :formatter="setArchivesNo" align="right" width="110" show-overflow-tooltip />
          <el-table-column label="归属公司" prop="pname" width="80" show-overflow-tooltip />
          <el-table-column label="操作" align="center" width="50">
            <template slot-scope="s">
              <el-tooltip class="item" effect="dark" content="详细" placement="bottom">
                <i class="el-icon-reading edit-btn" @click="landInfo(s.row.assetsLandId)" />
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination style="text-align: end;margin-top:10px" background @size-change="publicSizeSelect"
          @current-change="publicPageSelect" :current-page="selectParams.pageIndex" :page-sizes="[10, 20, 50, 100]"
          :page-size="selectParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" />
      </section>
    </div>
  </div>
</template>
<script>
import publicMixin from "@/mixin/publicMixin";
import Gongsi from "@/myComponents/GongSi";
import tuDi from "@/api/tuDi";
import { getMonthDay } from "@/utils/utils";
import TuDiZhuangTai from "@/myComponents/TuDiZhuangTai";
export default {
  data() {
    return {
      /* 土地查询参数 */ selectParams: { pageIndex: 1, pageSzie: 10 },
      /* mixin参数 */ mixinParams: {
        api: tuDi,
        name: "getLand",
      },
    };
  },
  methods: {
    /* 土地详细 */ landInfo(id) {
      this.$router.push({
        path: "/rongZiGuanLi/tuDiXiangXi",
        query: {
          pageIndex: this.selectParams.pageIndex,
          pageSzie: this.selectParams.pageSzie,
          id,
        },
      });
    },
    /* 初始化抵押期限(月) */ setArchivesNo(row) {
      let data = { end: row.mortgageEndTime, start: row.mortgageStartTime };
      return getMonthDay(data).dataYue;
    },
    /* 获取土地 */ getLand() {
      this.publicSelect();
    },
  },
  mounted() {
    /* 获取土地 */ this.getLand();
  },
  components: { Gongsi, TuDiZhuangTai },
  mixins: [publicMixin],
};
</script>

<style lang="scss" scoped>
</style>