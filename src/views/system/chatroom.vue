<template>
  <div class="view-container bg-gray">
    <div class="border-card">
      <section class="table-container view-section" style="display:flex">
        <el-table :header-cell-style="{background:'#F0FAFF',color:'#787878'}" border stripe
          element-loading-text="加载中，请稍候……" highlight-current-row :data="filterData" tooltip-effect="dark"
          @cell-click="cellClick">
          <el-table-column label="用户名" prop="account" />
          <el-table-column label="姓名" prop="name" />
        </el-table>
        <div style="width:60%;margin-left:30px">
          <div style="padding-top:10px">
            <span>贺哥</span>
            <el-divider></el-divider>
          </div>
          <div style="display:flex">
            <div style="display:flex;align-items: center;margin-bottom: 30px;margin-right:12px">贺哥</div>
            <div class="message">
              大家好，我是小胡个人主页：hlz.space个人服务网站：www.loveconvert.com大家好，我是小胡个人主页：hlz.space个人服务网站：www.loveconvert.com大家好，我是小胡个人主页：hlz.space个人服务网站：www.loveconvert.com
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import system from "@/api/system";
export default {
  data() {
    return {
      /* 查询参数 */ selectParams: { pageIndex: 1, pageSize: 10 },
      /* 筛选后的用户数据 */ filterData: [],
    };
  },
  methods: {
    /* 单元格被点击 */ cellClick(row) {
      console.log(row, "row0-0-0-0-");
    },
    /* 获取所有用户 */ getAllUser() {
      system.getUserInfo(this.selectParams).then((res) => {
        let onlineId = String(this.$store.state.user.onlineId);
        onlineId = onlineId.split(",");
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
    /* 获取所有用户 */ this.getAllUser();
  },
  watch: {
    $store(store) {
      console.log(store.state.user.onlineId);
    },
  },
};
</script>
<style lang="scss" scoped>
.message {
  margin-bottom: 20px;
  position: relative;
  width: 70%;
  background-color: #b7b7b7;
  border-bottom-color: #b7b7b7;
  color: #000;
  font-size: 12px;
  line-height: 18px;
  padding: 5px 12px 5px 12px;
  box-sizing: border-box;
  border-radius: 6px;
  word-break: break-all;
}
.message::before {
  content: "";
  position: absolute;
  top: 50%;
  left: -5px;
  width: 10px;
  height: 10px;
  margin-top: -10px;
  background: inherit;
  /*自动继承父元素的背景*/
  transform: rotate(45deg);
}
</style>