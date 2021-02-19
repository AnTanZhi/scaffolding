<template>
  <div style="padding:.125rem;background:#F4F9FD">
    <div>
      <div class="kapd">
        <div class="kap">
          <div class="kapa" style="background: #fa6565;">
            <img src="../../icons/cklt.png" alt="" />
          </div>
          <div class="text" @click="()=>$router.push('/rongZiGuanLi/qingKuang')" style="cursor:pointer;">
            融资到账总额：{{Number(indexValueType.received).toFixed(6)}}万元</div>
        </div>
        <div class="kap">
          <div class="kapa" style="background: #F6AB17;">
            <img src="../../icons/tp2.png" alt="" />
          </div>
          <div class="text" @click="()=>$router.push('/rongZiGuanLi/qingKuang')" style="cursor:pointer;">
            融资到账可使用：{{Number(indexValueType.receivedAvailable).toFixed(6)}}万元</div>
        </div>
        <div class="kap">
          <div class="kapa" style="background: #48A1FE;">
            <img src="../../icons/sw.png" alt="" />
          </div>
          <div class="text2">
            <div @click="()=>$router.push('/rongZiGuanLi/mingXi')" style="cursor:pointer;">
              年初本金余额：{{Number(indexValueType.yprincipalBalance).toFixed(6)}}万元</div>
            <div @click="()=>$router.push('/rongZiGuanLi/mingXi')" style="cursor:pointer;">
              年初利息余额：{{Number(indexValueType.yinterestBalance).toFixed(6)}}万元</div>
          </div>
        </div>
      </div>
      <div class="kapd">
        <div class="kap">
          <div class="kapa" style="background: #70C545;">
            <img src="../../icons/tp1.png" alt="" />
          </div>
          <div class="text2">
            <div @click="()=>$router.push('/rongZiGuanLi/huiZong')" style="cursor:pointer;">
              今年已还本金：{{Number(indexValueType.yearRepaidPrincipal).toFixed(6)}}万元</div>
            <div @click="()=>$router.push('/rongZiGuanLi/huiZong')" style="cursor:pointer;">
              今年已还利息：{{Number(indexValueType.yearRepaidInterest).toFixed(6)}}万元</div>
          </div>
        </div>
        <div class="kap">
          <div class="kapa" style="background: #72D0FF;">
            <img src="../../icons/tp3.png" alt="" />
          </div>
          <div class="text2">
            <div @click="()=>$router.push('/rongZiGuanLi/huiZong')" style="cursor:pointer;">
              今年未还本金：{{Number(indexValueType.yearNotPrincipal).toFixed(6)}}万元</div>
            <div @click="()=>$router.push('/rongZiGuanLi/huiZong')" style="cursor:pointer;">
              今年未还利息：{{Number(indexValueType.yearNotInterest).toFixed(6)}}万元</div>
          </div>
        </div>
        <div class="kap">
          <div class="kapa" style="background: #9C89C9;">
            <img src="../../icons/sjx.png" alt="" />
          </div>
          <div class="text2">
            <div @click="()=>$router.push('/rongZiGuanLi/taiZhang')" style="cursor:pointer;">
              全部未还本金：{{Number(indexValueType.wholeNotPrincipal).toFixed(6)}}万元</div>
            <div @click="()=>$router.push('/rongZiGuanLi/taiZhang')" style="cursor:pointer;">
              全部未还利息：{{Number(indexValueType.wholeNotInterest).toFixed(6)}}万元</div>
          </div>
        </div>
      </div>
      <div></div>
    </div>
    <div style="width:10.55rem;text-align: center;">
      <el-select v-model="selectParams.year" style="width:80px;margin-bottom:10px" @change="getEcharts">
        <el-option v-for="(item,index) in year" :key="index" :label="item" :value="item" />
      </el-select>
    </div>
    <div style="display:flex">
      <div id="main" style="width: 844px;height:400px;"></div>
      <div id="main2" style="width: 844px;height:400px;"></div>
    </div>
    <div style="width:10.55rem;text-align: center;">
      <el-select v-model="pieParams.fid" style="margin-bottom:10px" @change="getPie" clearable>
        <el-option v-for="(item,index) in financingType" :key="index" :label="item.label" :value="item.value" />
      </el-select>
    </div>
    <div style="display:flex">
      <div id="main4" style="width: 844px;height:400px;"></div>
      <div id="main3" style="width: 844px;height:400px;"></div>
    </div>
  </div>
</template>

<script>
import LeiXing from "@/myComponents/LeiXing";
import home from "@/api/home";
import { isNull } from "@/utils/utils";
export default {
  data() {
    return {
      /* 数值类型 */ indexValueType: {},
      /* 柱状图1 */ option: {
        color: ["#FA6565", "#F6AB17", "#48A1FE", "#70C545"],
        title: {
          text: "单位 (万元)",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          data: ["计划还款金额", "可续贷展期", "存单质押金额", "实际还款金额"],
        },
        xAxis: {
          data: [
            "1月",
            "2月",
            "3月",
            "4月",
            "5月",
            "6月",
            "7月",
            "8月",
            "9月",
            "10月",
            "11月",
            "12月",
          ],
        },
        yAxis: { type: "value" },
        series: [
          {
            name: "计划还款金额",
            type: "bar",
            data: [],
            stack: "one",
          },
          {
            name: "可续贷展期",
            type: "bar",
            data: [],
            stack: "two",
          },
          {
            name: "存单质押金额",
            type: "bar",
            data: [],
            stack: "two",
          },
          {
            name: "实际还款金额",
            type: "bar",
            data: [],
            stack: "two",
          },
        ],
      },
      /* 查询参数 */ selectParams: { year: new Date().getFullYear() },
      /* 年份 */ year: [
        new Date().getFullYear() - 5,
        new Date().getFullYear() - 4,
        new Date().getFullYear() - 3,
        new Date().getFullYear() - 2,
        new Date().getFullYear() - 1,
        new Date().getFullYear(),
        new Date().getFullYear() + 1,
        new Date().getFullYear() + 2,
        new Date().getFullYear() + 3,
        new Date().getFullYear() + 4,
      ],
      /* 柱状图2 */ option2: {
        color: ["#FA6565", "#F6AB17", "#48A1FE", "#70C545"],
        title: {
          text: "单位 (万元)",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          data: ["计划还款金额", "可续贷展期", "存单质押金额", "实际还款金额"],
        },
        xAxis: {
          data: [
            `${new Date().getFullYear()}年`,
            `${new Date().getFullYear() + 1}年`,
            `${new Date().getFullYear() + 2}年`,
            `${new Date().getFullYear() + 3}年`,
            `${new Date().getFullYear() + 4}年`,
            `${new Date().getFullYear() + 5}年`,
            `${new Date().getFullYear() + 6}年`,
            `${new Date().getFullYear() + 7}年`,
            `${new Date().getFullYear() + 8}年`,
            `${new Date().getFullYear() + 9}年`,
          ],
        },
        yAxis: { type: "value" },
        series: [
          {
            name: "计划还款金额",
            type: "bar",
            data: [],
            stack: "one",
          },
          {
            name: "可续贷展期",
            type: "bar",
            data: [],
            stack: "two",
          },
          {
            name: "存单质押金额",
            type: "bar",
            data: [],
            stack: "two",
          },
          {
            name: "实际还款金额",
            type: "bar",
            data: [],
            stack: "two",
          },
        ],
      },
      /* 饼图 */ pie: {
        color: [
          "#FA6565",
          "#F6AB17",
          "#48A1FE",
          "#70C545",
          "#72D0FF",
          "#9C89C9",
        ],
        tooltip: {
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: "left",
          type: "scroll",
        },
        series: {
          name: "所属大类",
          type: "pie",
          radius: "75%",
          data: [],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      },
      /* 饼图2 */ pie2: {
        color: [
          "#FA6565",
          "#F6AB17",
          "#48A1FE",
          "#70C545",
          "#72D0FF",
          "#9C89C9",
        ],
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: "left",
          type: "scroll",
        },
        series: {
          name: "融资类型",
          type: "pie",
          radius: "75%",
          data: [],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      },
      /* 融资类型(只有父级) */ financingType: "",
      /* 饼图参数 */ pieParams: {},
    };
  },
  methods: {
    /* 融资类型(只有父级) */ getFinancingType() {
      home.getFinancingType().then((res) => {
        this.financingType = res.data;
      });
    },
    /* 初始化饼图 */ getPie() {
      let myChart3 = this.echarts.init(document.getElementById("main3"));
      let myChart4 = this.echarts.init(document.getElementById("main4"));
      home.getPie(this.pieParams).then((res) => {
        this.pie.series.data = [];
        this.pie2.series.data = [];
        res.data.parentParam.forEach((item) => {
          this.pie.series.data.push({
            value: item.typeCount,
            name: item.pname,
          });
        });
        if (!isNull(res.data.childrenParam)) {
          res.data.childrenParam.forEach((item) => {
            this.pie2.series.data.push({
              value: item.typeCount,
              name: item.pname,
            });
          });
        }
        myChart3.setOption(this.pie);
        myChart4.setOption(this.pie2);
      });
    },
    /* 初始化echarts */ getEcharts() {
      let myChart = this.echarts.init(document.getElementById("main"));
      let myChart2 = this.echarts.init(document.getElementById("main2"));
      home.getHistogram(this.selectParams).then((res) => {
        this.option.series[0].data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.option.series[1].data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.option.series[2].data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.option.series[3].data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.option2.series[0].data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.option2.series[1].data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.option2.series[2].data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.option2.series[3].data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        res.data.indexHistogramMonth.forEach((item) => {
          this.option.series[0].data[item.month - 1] = item.jhhkmoney;
          this.option.series[1].data[item.month - 1] = item.kxdmoney;
          this.option.series[2].data[item.month - 1] = item.zymoney;
          this.option.series[3].data[item.month - 1] = item.sjhkmoney;
        });
        res.data.indexHistogramYear.forEach((item) => {
          this.option2.series[0].data[item.year - new Date().getFullYear()] =
            item.jhhkmoney;
          this.option2.series[1].data[item.year - new Date().getFullYear()] =
            item.kxdmoney;
          this.option2.series[2].data[item.year - new Date().getFullYear()] =
            item.zymoney;
          this.option2.series[3].data[item.year - new Date().getFullYear()] =
            item.sjhkmoney;
        });
        myChart.setOption(this.option);
        myChart2.setOption(this.option2);
      });
    },
    /* 数值类型 */ getIndexValueType() {
      home.getIndexValueType().then((res) => {
        this.indexValueType = res.data;
      });
    },
  },
  mounted() {
    /* 融资类型(只有父级) */ this.getFinancingType();
    /* 初始化饼图 */ this.getPie();
    /* 初始化echarts */ this.getEcharts();
    /* 数值类型 */ this.getIndexValueType();
  },
  components: { LeiXing },
};
</script>

<style lang="scss" scoped>
.kapd {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
  .kap {
    width: 6.4rem;
    height: 1.025rem;
    background: #fff;
    padding: 0.188rem;
    display: flex;
    align-items: center;
    .text {
      margin-left: 0.125rem;
      font-size: 0.2rem;
      font-weight: 600;
    }
    .text2 {
      margin-left: 0.125rem;
      font-weight: 600;
      font-size: 0.2rem;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }
    .kapa {
      border-radius: 10%;
      height: 0.625rem;
      width: 0.625rem;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 0.375rem;
        height: 0.375rem;
      }
    }
  }
}
</style>