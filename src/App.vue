<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import system from "./api/system";
export default {
  name: "App",
  data() {
    return {};
  },
};
</script>
<style lang="scss">
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
