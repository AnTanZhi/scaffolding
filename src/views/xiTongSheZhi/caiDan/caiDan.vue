<template>
  <div class="view-container bg-gray">
    <div class="border-card">
      <header class="view-header">
        <div class="header-container">
          <el-row>
            <el-col :span="22">
              <el-row :gutter="10">
                <el-col :span="5">
                  <el-input
                    v-model="selectParams.name"
                    placeholder="菜单名称"
                  />
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
      </header>
    </div>
  </div>
</template>

<script>
import publicMixin from "@/mixin/publicMixin";
import xiTong from "@/api/xiTong";
export default {
  mixins: [publicMixin],
  data() {
    return {
      /* mixin参数 */
      mixinParams: {
        api: xiTong,
      },
    };
  },
  methods: {},
  mounted() {
    this.selectData("getMenu");
  },
  components: {},
};
</script>

<style lang="scss" scoped>
</style>