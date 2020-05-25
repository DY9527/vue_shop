<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->

      <el-row :gutter="20">
        <el-col :span="8">
          <el-input @clear="getOrderList" clearable placeholder="请输入内容" v-model="queryInfo.query">
            <el-button slot="append" @click="getOrderList()" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column prop="pay_status" label="是否付款">
          <template v-slot="scope">

            <el-tag type="success" v-if="scope.row.pay_status==='1'">已付款</el-tag>
            <el-tag type="danger"  v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column width="140px" prop="add_time" label="下单时间">
          <template v-slot="scope">{{scope.row.create_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column label="操作" width="180px">
          <template v-slot="scope">
            <!-- 修改 -->
            <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
              <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
            </el-tooltip>
            <!-- 删除 -->
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button :value="scope.row" type="danger" size="mini" icon="el-icon-delete"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 5, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      queryInfo: {
        query: '',
        // 当前页数
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      orderList: []
    }
  },
  computed: {},

  methods: {
    async getOrderList(pagenum) {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表失败')
      }
      console.log(res)

      this.orderList = res.data.goods
      this.total = res.data.total
      this.queryInfo.pagenum = pagenum
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.queryInfo.pagesize = val
      this.getOrderList(1)
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.queryInfo.pagenum = val
      this.getOrderList(val)
    }
  },

  created() {
    this.getOrderList(1)
  }
}
</script>
<style lang='less' scoped>
</style>
