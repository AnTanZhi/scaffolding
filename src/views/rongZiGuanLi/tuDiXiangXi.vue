<template>
  <el-form label-position="right" label-width="200px" style="margin-top: 20px">
    <el-row>
      <el-col :span="12">
        <el-form-item label="土地编号：">
          <el-input clearable style="width:240px" v-model="landInfo.landNumber" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="地块名称：">
          <el-input clearable style="width:240px" v-model="landInfo.landName" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="档案号：">
          <el-input clearable style="width:240px" v-model="landInfo.archivesNo" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="面积：">
          <el-input clearable style="width:240px;margin-right:10px" v-model="landInfo.measureArea" />㎡
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="产权坐落位置：">
          <el-input clearable style="width:73%" v-model="landInfo.propertyPosition" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="使用权类型：">
          <el-input clearable style="width:240px" v-model="landInfo.useType" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="土地证（或不动产证）编号：">
          <el-input clearable style="width:240px" v-model="landInfo.landSn" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="占地面积：">
          <el-input clearable style="width:240px;margin-right:10px" v-model="landInfo.areaSpace" />亩
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="土地证存放地点：">
          <el-input clearable style="width:240px" v-model="landInfo.landStoragePoint" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="他项权证号：">
          <el-input clearable style="width:240px" v-model="landInfo.otherNumber" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="土地出让金额：">
          <el-input clearable style="width:240px;margin-right:10px" v-model="landInfo.sellAmount" />万元
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="价值（万元/亩）：">
          <el-input clearable style="width:240px;margin-right:10px" v-model="landInfo.landValue" />万元
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="土地出让年限：">
          <el-input clearable style="width:240px" v-model="landInfo.years" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="土地用途（地类）：">
          <el-input clearable style="width:240px" v-model="landInfo.purpose" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="归属公司：">
          <GongSi v-model="landInfo.ownershipCompany" style="width:240px" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="抵押用于融资项目名称：">
          <el-input clearable style="width:73%" v-model="landInfo.mortgageProjectName" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="抵押金融机构：">
          <el-input clearable style="width:73%" v-model="landInfo.mortgageFinanceMechanism" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="抵押期限：">
          <el-date-picker type="daterange" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss" style="width:240px" v-model="landInfo.mortgageTerm" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="抵押价值：">
          <el-input clearable type="numbe" style="width:240px" v-model="landInfo.mortgagePrice" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="状态：">
          <TuDiZhuangTai v-model="landInfo.state" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="备注：">
          <el-input type="textarea" :autosize="{ minRows: 4}" style="width:73%" v-model="landInfo.remark" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="相关附件：">
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import publicMixin from "@/mixin/publicMixin";
import GongSi from "@/myComponents/GongSi";
import TuDiZhuangTai from "@/myComponents/TuDiZhuangTai";
import tuDi from "@/api/tuDi";
import { getMonthDay } from "@/utils/utils";
export default {
  data() {
    return {
      /* 土地详细 */ landInfo: {},
    };
  },
  mounted() {
    /* 获取土地详细 */ this.getLandInfo();
  },
  methods: {
    /* 获取土地详细 */ getLandInfo() {
      tuDi.getLandInfo(this.$route.query.id).then((res) => {
        this.landInfo = res.data;
        let state = this.landInfo.state;
        let oc = this.landInfo.ownershipCompany;
        this.landInfo.state = state + "" == "null" ? "" : state + "";
        this.landInfo.ownershipCompany = oc + "" == "null" ? "" : oc + "";
        this.$set(this.landInfo, "mortgageTerm", [
          this.landInfo.mortgageStartTime,
          this.landInfo.mortgageEndTime,
        ]);
      });
    },
  },
  components: { GongSi, TuDiZhuangTai },
  mixins: [publicMixin],
};
</script>

<style>
</style>