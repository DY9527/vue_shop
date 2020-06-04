<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>

      <el-breadcrumb-item  v-for="it in data" :key="it">{{it}}</el-breadcrumb-item>

  </el-breadcrumb>
</template>

<script>
export default {
  props: ['data']
}
</script>
