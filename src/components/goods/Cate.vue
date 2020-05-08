<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col >
          <el-button type="primary">添加</el-button>
        </el-col>
      </el-row>
      <el-table></el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      catelist: [],
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.catelist = res.data.result
      this.total = res.data.total
      this.queryInfo.pagenum = 1
    }
  }
}
</script>

<style lang=less scoped>
</style>
