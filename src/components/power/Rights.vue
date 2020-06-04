<template>
  <div >
    <h3>权限列表组件页面</h3>
     <brea :data="['权限管理','权限列表']"></brea>
    <!-- 面包屑导航区域 -->

    <!-- 卡片视图 -->
    <el-card>
      <el-table :data="rightsList" border>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template v-slot="scope">
            <el-tag v-if="scope.row.level==='0'" >一级</el-tag>
            <el-tag v-else-if="scope.row.level==='1'" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
    </el-card>
  </div>
</template>

<script>

export default {

  data() {
    // 这里存放数据
    return {
      // 权限列表
      rightsList: []
    }
  },
  methods: {
    async getRightsList() {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败')
      }
      this.rightsList = res.data
      console.log(res)

      console.log(this.rightsList)
    }
  },
  created() {
    this.getRightsList()
  }
}
</script>
