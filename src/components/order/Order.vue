<template>
  <div>
    <!-- 面包屑导航区域 -->
    <brea :data="['订单管理','订单列表']"></brea>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->

      <el-row :gutter="20">
        <el-col :span="8">
          <el-input @clear="getOrderList" clearable placeholder="请输入内容" v-model="queryInfo.query">
            <el-button slot="append" @click="getOrderList()" icon="el-icon-search"></el-button>
          </el-input>
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
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column width="180px" prop="add_time" label="下单时间">
          <template v-slot="scope">{{scope.row.create_time | dateFormat}}</template>
        </el-table-column>

        <el-table-column label="操作" width="180px">
          <template v-slot="scope">
            <!-- 修改 -->
            <el-tooltip effect="dark" content="修改地址" placement="top" :enterable="false">
              <el-button
                type="primary"
                @click="addDialogVisible=true"
                size="mini"
                icon="el-icon-edit"
              ></el-button>
            </el-tooltip>
            <!-- 物流 -->
            <el-tooltip effect="dark" content="物流进度" placement="top" :enterable="false">
              <el-button
                :value="scope.row"
                @click="getProgress"
                type="success"
                size="mini"
                icon="el-icon-location"
              ></el-button>
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
    <!-- 修改地址 对话框 -->
    <el-dialog title="修改地址" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容主题区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="cityData" v-model="addForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="物流进度"
      :visible.sync="progressDialogVisible"
      width="50%"
      @close="progressDialogClosed"
    >
      <el-timeline>
        <el-timeline-item
          v-for="(activity,index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
      <span slot="footer" class="dialog-footer">
        <el-button @click="progressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="progressDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata.js'

export default {

  data() {
    return {
      queryInfo: {
        query: '',
        // 当前页数
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      orderList: [],
      addDialogVisible: false,
      addForm: {
        address1: [],
        address2: ''
      },
      addFormRules: {
        address1: [
          { required: true, message: '请输入省市区/县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      cityData,
      progressDialogVisible: false,
      progressInfo: [],
      orderNumber: '804909574412544580'
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
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    progressDialogClosed() {
      this.orderNumber = ''
    },
    async getProgress() {
      const { data: res } = await this.$http.get('/kuaidi/4602992279077')
      if (res.meta.status !== 200) {
        return this.$message.error('获取物流信息失败！')
      }
      this.$message.success('获取成功')
      this.progressInfo = res.data
      this.progressDialogVisible = true
      console.log(this.progressInfo)
    }
  },

  created() {
    this.getOrderList(1)
  }
}
</script>
<style lang='less' scoped>
.el-cascader {
  width: 100%;
}
</style>
