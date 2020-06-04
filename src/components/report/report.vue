<template>
  <div>
    <!-- 面包屑导航区域 -->
     <brea :data="['订单管理','订单列表']"></brea>
    <!-- <el-brea separator-class="el-icon-arrow-right">
      <el-brea-item :to="{ path: '/home' }">首页</el-brea-item>
      <el-brea-item>数据统计</el-brea-item>
      <el-brea-item>数据量表</el-brea-item>
    </el-brea> -->
    <el-card class="box-card">
      <div style="width:600px;height:400px" id="main"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
import _ from 'lodash'

export default {

  data() {
    return {
      option: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  methods: {
    async getOption() {
      const { data: res } = await this.$http.get('reports/type/1')
      if (res.meta.status !== 200) {
        return this.$message.error('获取折线图数据失败')
      }
      var myChart = echarts.init(document.getElementById('main'))
      console.log(res.data)

      const result = _.merge(res.data, this.option)
      myChart.setOption(result)
    }
  },
  created() {
    this.getOption()
  },
  mounted() {}
}
</script>
<style lang="less" scoped>
</style>
